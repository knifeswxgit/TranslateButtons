import { logger } from "@vendetta"
import { registerCommand } from "@vendetta/commands"
import { ApplicationCommandInputType, ApplicationCommandType, ApplicationCommandOptionType } from "ApplicationCommandTypes"
import { showToast } from "@vendetta/ui/toasts"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { Codeblock } from "@vendetta/ui/components"
import { showConfirmationAlert } from "@vendetta/ui/alerts"
import { findByProps } from "@vendetta/metro"
import { settings } from ".."

import { DeepLLangs } from "../lang"
import { DeepL, GTranslate } from "../api"

const ClydeUtils = findByProps("sendBotMessage")
const langOptions = Object.entries(DeepLLangs).map(([key, value]) => ({
    name: key,
    displayName: key,
    value: value
}))

export default () => registerCommand({
    name: "translate",
    displayName: "translate",
    description: "Translate text to selected language",
    displayDescription: "Translate text to selected language",
    applicationId: "-1",
    type: ApplicationCommandType.CHAT as number,
    inputType: ApplicationCommandInputType.BUILT_IN_TEXT as number,
    options: [
        {
            name: "text",
            displayName: "text",
            description: "Text to translate",
            displayDescription: "Text to translate",
            type: ApplicationCommandOptionType.STRING as number,
            required: true
        },
        {
            name: "language",
            displayName: "language",
            description: "Target language",
            displayDescription: "Target language",
            type: ApplicationCommandOptionType.STRING as number,
            choices: [...langOptions],
            required: true
        }
    ],
    async execute(args, ctx) {
        const [text, lang] = args
        try {
            var content
            switch(settings.translator) {
                case 0:
                    content = await DeepL.translate(text.value, undefined, lang.value)
                    break
                case 1:
                    content = await GTranslate.translate(text.value, undefined, lang.value)
                    break
            }
            return await new Promise((resolve): void => showConfirmationAlert({
                title: "Translate",
                content: (
                    <Codeblock>
                        {content.text}
                    </Codeblock>
                ),
                confirmText: "Copy",
                onConfirm: () => {
                    // Copy to clipboard would go here
                    showToast("Translated!", getAssetIDByName("Check"))
                    resolve({ content: content.text })
                },
                cancelText: "Cancel"
            }))
        } catch (e) {
            logger.error(e)
            return ClydeUtils.sendBotMessage(ctx.channel.id, "Failed to translate.")
        }
    }
})