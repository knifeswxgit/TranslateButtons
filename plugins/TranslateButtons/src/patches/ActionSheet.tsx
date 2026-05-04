import { findByProps, findByStoreName } from "@vendetta/metro"
import { FluxDispatcher, React, ReactNative, i18n, stylesheet } from "@vendetta/metro/common"
import { before, after } from "@vendetta/patcher"
import { semanticColors } from "@vendetta/ui"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { Forms } from "@vendetta/ui/components"
import { findInReactTree } from "@vendetta/utils"
import { settings } from ".."
import { GTranslate } from "../api"
import { showToast } from "@vendetta/ui/toasts"

console.log("TranslateButtons: ActionSheet patch initializing")

const LazyActionSheet = findByProps("openLazy", "hideActionSheet")
if (!LazyActionSheet) {
    console.log("TranslateButtons: ERROR - LazyActionSheet not found")
}

const ActionSheetRow = findByProps("ActionSheetRow")?.ActionSheetRow ?? Forms.FormRow
const MessageStore = findByStoreName("MessageStore")
const ChannelStore = findByStoreName("ChannelStore")

const separator = "\n"
const targetLang = "en"

const styles = stylesheet.createThemedStyleSheet({
    iconComponent: {
        width: 24,
        height: 24,
        tintColor: semanticColors.INTERACTIVE_NORMAL
    }
})

const cachedData: any[] = []

export default function patchActionSheet() {
    console.log("TranslateButtons: Patching ActionSheet")
    
    return before("openLazy", LazyActionSheet, function([component, key, msg]) {
        const message = msg?.message
        if (key !== "MessageLongPressActionSheet" || !message) return
        
        console.log("TranslateButtons: MessageLongPressActionSheet detected")
        
        component.then((instance: any) => {
            const unpatch = after("default", instance, (_, component) => {
                React.useEffect(() => () => { unpatch() }, [])

                const buttons = findInReactTree(component, (x: any) => x?.[0]?.type?.name === "ActionSheetRow")
                if (!buttons) {
                    console.log("TranslateButtons: No buttons found")
                    return
                }

                const position = Math.max(buttons.findIndex((x: any) => x.props.message === i18n.Messages.MARK_UNREAD), 0)

                const originalMessage = MessageStore.getMessage(message.channel_id, message.id)
                if (!originalMessage?.content && !message.content) return

                const messageId = originalMessage?.id ?? message.id
                const messageContent = originalMessage?.content ?? message.content
                
                const existingCached = cachedData.find((o: any) => Object.keys(o)[0] === messageId)
                const translateType = existingCached ? "Revert" : "Translate"
                const icon = translateType === "Translate" 
                    ? getAssetIDByName("LanguageIcon") 
                    : getAssetIDByName("ic_highlight")

                const doTranslate = async () => {
                    LazyActionSheet.hideActionSheet()
                    
                    try {
                        console.log("TranslateButtons: Translating message...")
                        const isTranslated = translateType === "Translate"
                        const isImmersive = settings.immersive_enabled
                        
                        if (!originalMessage) return

                        const result = await GTranslate.translate(messageContent, "auto", targetLang, !isTranslated)
                        
                        const finalContent = isTranslated
                            ? (isImmersive
                                ? `${messageContent}${separator}${result.text.trim()} \`[en]\``
                                : `${result.text.trim()} \`[en]\``)
                            : (existingCached as any)[messageId]

                        FluxDispatcher.dispatch({
                            type: "MESSAGE_UPDATE",
                            message: {
                                id: messageId,
                                channel_id: originalMessage.channel_id,
                                guild_id: ChannelStore.getChannel(originalMessage.channel_id)?.guild_id,
                                content: finalContent,
                            },
                            log_edit: false,
                            otherPluginBypass: true
                        })

                        if (isTranslated) {
                            cachedData.unshift({ [messageId]: messageContent })
                        } else {
                            const idx = cachedData.findIndex((e: any) => e !== existingCached)
                            if (idx > -1) cachedData.splice(idx, 1)
                        }
                        
                        console.log("TranslateButtons: Translation done")
                    } catch (e) {
                        console.log("TranslateButtons: Translation error:", e?.message || e)
                        showToast("Translation failed", getAssetIDByName("Small"))
                    }
                }

                const translateButton = React.createElement(ActionSheetRow, {
                    label: `${translateType} Message`,
                    icon: React.createElement(ActionSheetRow.Icon, {
                        source: icon,
                        IconComponent: () => React.createElement(ReactNative.Image, {
                            resizeMode: "cover",
                            style: styles.iconComponent,
                            source: icon
                        })
                    }),
                    onPress: doTranslate
                })

                buttons.splice(position, 0, translateButton)
            })
        })
    })
}