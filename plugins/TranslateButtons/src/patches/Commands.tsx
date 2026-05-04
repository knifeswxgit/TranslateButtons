import { logger } from "@vendetta"
import { registerCommand } from "@vendetta/commands"
import { ApplicationCommandInputType, ApplicationCommandType, ApplicationCommandOptionType } from "ApplicationCommandTypes"
import { showToast } from "@vendetta/ui/toasts"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { Codeblock } from "@vendetta/ui/components"
import { showConfirmationAlert } from "@vendetta/ui/alerts"
import { findByProps } from "@vendetta/metro"

import { GTranslate } from "../api"

const ClydeUtils = findByProps("sendBotMessage")

export default () => registerCommand({
    name: "tswx",
    displayName: "tswx",
    description: "Translate text to English",
    displayDescription: "Translate text to English",
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
        }
    ],
    async execute(args, ctx) {
        const text = args[0]
        try {
            const content = await GTranslate.translate(text.value, undefined, "en", false)
            return await new Promise((resolve): void => showConfirmationAlert({
                title: "Translated to English",
                content: (
                    <Codeblock>
                        {content.text}
                    </Codeblock>
                ),
                confirmText: "Send",
                onConfirm: () => resolve({ content: content.text }),
                cancelText: "Cancel"
            }))
        } catch (e) {
            logger.error(e)
            return ClydeUtils.sendBotMessage(ctx.channel.id, "Failed to translate.")
        }
    }
})