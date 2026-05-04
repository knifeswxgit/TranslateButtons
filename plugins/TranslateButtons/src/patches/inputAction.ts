import { before } from "@vendetta/patcher";
import { findByProps } from "@vendetta/metro";
import { React, ReactNative, stylesheet } from "@vendetta/metro/common";
import { semanticColors } from "@vendetta/ui";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";
import { logger } from "@vendetta";
import { TranslateAPI } from "../api";

const styles = stylesheet.createThemedStyleSheet({
  button: {
    position: "absolute",
    right: 60,
    bottom: 12,
    padding: 8,
    backgroundColor: semanticColors.BACKGROUND_MOBILE_PRIMARY,
    borderRadius: 20,
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: semanticColors.INTERACTIVE_ACTIVE,
  },
});

export default function patchInputAction() {
  const ChatInputModule = findByProps("ChatInput", "ChannelTextArea");
  if (!ChatInputModule) {
    logger.warn("TranslateButtons: ChatInputModule not found");
    return () => {};
  }
  logger.info("TranslateButtons: ChatInputModule found");

  let textInputRef: any = null;
  let button: any = null;

  const patch = before("render", ChatInputModule.ChatInput || ChatInputModule.default, (_, args) => {
    const props = args[0];
    if (!props) return;

    const originalRef = props.textInputRef;
    props.textInputRef = (ref: any) => {
      if (originalRef) originalRef(ref);
      textInputRef = ref;
    };

    const originalChildren = props.children;
    props.children = () => {
      const childrenResult = originalChildren ? originalChildren() : null;
      if (button) return childrenResult;

      button = React.createElement(
        ReactNative.TouchableOpacity,
        {
          style: styles.button,
          onPress: async () => {
            if (!textInputRef) return;
            const currentText = textInputRef.getText?.() || textInputRef.value || "";
            if (!currentText.trim()) return;

            try {
              const translated = await TranslateAPI.translate(currentText, "auto", "en", false);
              if (textInputRef.setText) textInputRef.setText(translated.text);
              else if (textInputRef.value !== undefined) textInputRef.value = translated.text;
              showToast("Translated to English", getAssetIDByName("Check"));
            } catch (e) {
              showToast("Translation failed", getAssetIDByName("Small"));
              logger.error(e);
            }
          },
        },
        React.createElement(ReactNative.Image, {
          style: styles.icon,
          source: getAssetIDByName("LanguageIcon"),
          resizeMode: "cover",
        })
      );

      return React.createElement(ReactNative.View, { style: { position: "relative" } }, childrenResult, button);
    };
  });

  return () => {
    patch();
  };
}