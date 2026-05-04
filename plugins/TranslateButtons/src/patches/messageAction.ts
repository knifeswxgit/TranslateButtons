import { after } from "@vendetta/patcher";
import { findByStoreName, findByProps } from "@vendetta/metro";
import { React, ReactNative, stylesheet } from "@vendetta/metro/common";
import { semanticColors } from "@vendetta/ui";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { findInReactTree } from "@vendetta/utils";
import { showToast } from "@vendetta/ui/toasts";
import { logger } from "@vendetta";
import { settings } from "..";
import { TranslateAPI } from "../api";

const MessageStore = findByStoreName("MessageStore");
const ChannelStore = findByStoreName("ChannelStore");

const originalTexts = new Map<string, string>();

const styles = stylesheet.createThemedStyleSheet({
  button: {
    marginLeft: 8,
    padding: 6,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: semanticColors.INTERACTIVE_NORMAL,
  },
});

export default function patchMessageAction() {
  const MessageModule = findByProps("MessageContent", "Message", "default");
  if (!MessageModule) {
    logger.warn("TranslateButtons: MessageModule not found");
    return () => {};
  }
  logger.info("TranslateButtons: MessageModule found");

  let unpatch: any = null;

  const findAndPatch = () => {
    const MessageComponent = MessageModule.default || MessageModule.Message;
    if (!MessageComponent) return;

    unpatch = after("render", MessageComponent, (_, ret) => {
      const actionRow = findInReactTree(ret, (x) => x?.props?.children?.some?.(c => c?.type?.name === "MessageActions"));
      if (!actionRow) return;

      let messageId = ret?.props?.message?.id;
      if (!messageId) {
        const messageNode = findInReactTree(ret, (x) => x?.props?.message?.id);
        if (messageNode) messageId = messageNode.props.message.id;
      }
      if (!messageId) return;

      const channelId = ret?.props?.message?.channel_id || ret?.props?.channel?.id;
      if (!channelId) return;

      const originalMsg = MessageStore.getMessage(channelId, messageId);
      const content = originalMsg?.content || ret?.props?.message?.content || "";
      if (!content) return;

      const isTranslated = originalTexts.has(messageId);
      const icon = isTranslated ? getAssetIDByName("ic_highlight") : getAssetIDByName("LanguageIcon");

      const handlePress = async () => {
        try {
          const targetLang = settings.target_lang || "en";
          if (isTranslated) {
            const original = originalTexts.get(messageId)!;
            await updateMessage(messageId, channelId, original);
            originalTexts.delete(messageId);
          } else {
            const translated = await TranslateAPI.translate(content, "auto", targetLang, false);
            const finalContent = `**${translated.text}**\n\`[${targetLang}]\``;
            originalTexts.set(messageId, content);
            await updateMessage(messageId, channelId, finalContent);
          }
        } catch (e) {
          showToast("Translation failed", getAssetIDByName("Small"));
          logger.error(e);
        }
      };

      const translateButton = React.createElement(
        ReactNative.TouchableOpacity,
        {
          style: styles.button,
          onPress: handlePress,
        },
        React.createElement(ReactNative.Image, {
          style: styles.icon,
          source: icon,
          resizeMode: "cover",
        })
      );

      if (actionRow.props.children && Array.isArray(actionRow.props.children)) {
        actionRow.props.children.push(translateButton);
      } else if (actionRow.props.children) {
        actionRow.props.children = [actionRow.props.children, translateButton];
      }
    });
  };

  findAndPatch();

  return () => {
    if (unpatch) unpatch();
  };
}

async function updateMessage(id: string, channelId: string, content: string) {
  const { FluxDispatcher } = await import("@vendetta/metro/common");
  const guildId = ChannelStore.getChannel(channelId)?.guild_id;
  FluxDispatcher.dispatch({
    type: "MESSAGE_UPDATE",
    message: {
      id,
      channel_id: channelId,
      guild_id: guildId,
      content,
    },
    log_edit: false,
    otherPluginBypass: true,
  });
}