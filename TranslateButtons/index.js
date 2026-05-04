var TranslateButtons = (function (exports, plugin, metro, common, patcher, ui, assets, components, utils, storage, toasts) {
    'use strict';

    const translate = async (text, source_lang = "auto", target_lang, original = false) => {
      try {
        if (original) return { source_lang, text };
        const API_URL = "https://translate.googleapis.com/translate_a/single?" + new URLSearchParams({
          client: "gtx",
          sl: source_lang,
          tl: target_lang,
          dt: "t",
          dj: "1",
          source: "input",
          q: text
        });
        const data = await (await fetch(API_URL)).json();
        return {
          source_lang,
          text: data.sentences.map((s) => s.trans).join("")
        };
      } catch (e) {
        throw Error(`Failed to fetch from Google Translate: ${e}`);
      }
    };
    var GTranslate = { translate };

    console.log("TranslateButtons: ActionSheet patch initializing");
    const LazyActionSheet = metro.findByProps("openLazy", "hideActionSheet");
    if (!LazyActionSheet) {
      console.log("TranslateButtons: ERROR - LazyActionSheet not found");
    }
    const ActionSheetRow = metro.findByProps("ActionSheetRow")?.ActionSheetRow ?? components.Forms.FormRow;
    const MessageStore = metro.findByStoreName("MessageStore");
    const ChannelStore = metro.findByStoreName("ChannelStore");
    const separator = "\n";
    const targetLang = "en";
    const styles$1 = common.stylesheet.createThemedStyleSheet({
      iconComponent: {
        width: 24,
        height: 24,
        tintColor: ui.semanticColors.INTERACTIVE_NORMAL
      }
    });
    const cachedData = [];
    function patchActionSheet() {
      console.log("TranslateButtons: Patching ActionSheet");
      return patcher.before("openLazy", LazyActionSheet, function([component, key, msg]) {
        const message = msg?.message;
        if (key !== "MessageLongPressActionSheet" || !message) return;
        console.log("TranslateButtons: MessageLongPressActionSheet detected");
        component.then((instance) => {
          const unpatch = patcher.after("default", instance, (_, component2) => {
            common.React.useEffect(() => () => {
              unpatch();
            }, []);
            const buttons = utils.findInReactTree(component2, (x) => x?.[0]?.type?.name === "ActionSheetRow");
            if (!buttons) {
              console.log("TranslateButtons: No buttons found");
              return;
            }
            const position = Math.max(buttons.findIndex((x) => x.props.message === common.i18n.Messages.MARK_UNREAD), 0);
            const originalMessage = MessageStore.getMessage(message.channel_id, message.id);
            if (!originalMessage?.content && !message.content) return;
            const messageId = originalMessage?.id ?? message.id;
            const messageContent = originalMessage?.content ?? message.content;
            const existingCached = cachedData.find((o) => Object.keys(o)[0] === messageId);
            const translateType = existingCached ? "Revert" : "Translate";
            const icon = translateType === "Translate" ? assets.getAssetIDByName("LanguageIcon") : assets.getAssetIDByName("ic_highlight");
            const doTranslate = async () => {
              LazyActionSheet.hideActionSheet();
              try {
                console.log("TranslateButtons: Translating message...");
                const isTranslated = translateType === "Translate";
                const isImmersive = settings.immersive_enabled;
                if (!originalMessage) return;
                const result = await GTranslate.translate(messageContent, "auto", targetLang, !isTranslated);
                const finalContent = isTranslated ? isImmersive ? `${messageContent}${separator}${result.text.trim()} \`[en]\`` : `${result.text.trim()} \`[en]\`` : existingCached[messageId];
                common.FluxDispatcher.dispatch({
                  type: "MESSAGE_UPDATE",
                  message: {
                    id: messageId,
                    channel_id: originalMessage.channel_id,
                    guild_id: ChannelStore.getChannel(originalMessage.channel_id)?.guild_id,
                    content: finalContent
                  },
                  log_edit: false,
                  otherPluginBypass: true
                });
                if (isTranslated) {
                  cachedData.unshift({ [messageId]: messageContent });
                } else {
                  const idx = cachedData.findIndex((e) => e !== existingCached);
                  if (idx > -1) cachedData.splice(idx, 1);
                }
                console.log("TranslateButtons: Translation done");
              } catch (e) {
                console.log("TranslateButtons: Translation error:", e?.message || e);
                toasts.showToast("Translation failed", assets.getAssetIDByName("Small"));
              }
            };
            const translateButton = common.React.createElement(ActionSheetRow, {
              label: `${translateType} Message`,
              icon: common.React.createElement(ActionSheetRow.Icon, {
                source: icon,
                IconComponent: () => common.React.createElement(common.ReactNative.Image, {
                  resizeMode: "cover",
                  style: styles$1.iconComponent,
                  source: icon
                })
              }),
              onPress: doTranslate
            });
            buttons.splice(position, 0, translateButton);
          });
        });
      });
    }

    const { ScrollView, Text } = common.ReactNative;
    const { FormRow, FormSwitchRow } = components.Forms;
    const styles = common.stylesheet.createThemedStyleSheet({
      subheaderText: {
        color: ui.semanticColors.HEADER_SECONDARY,
        textAlign: "center",
        margin: 10,
        marginBottom: 50,
        letterSpacing: 0.25,
        fontFamily: common.constants.Fonts.PRIMARY_BOLD,
        fontSize: 14
      }
    });
    var Settings = () => {
      storage.useProxy(settings);
      return /* @__PURE__ */ common.React.createElement(ScrollView, null, /* @__PURE__ */ common.React.createElement(
        FormSwitchRow,
        {
          label: "Immersive Translation",
          subLabel: "Display both original and translation",
          leading: /* @__PURE__ */ common.React.createElement(FormRow.Icon, { source: assets.getAssetIDByName("ic_chat_bubble_filled_24px") }),
          value: settings.immersive_enabled ?? true,
          onValueChange: (v) => {
            settings.immersive_enabled = v;
          }
        }
      ), /* @__PURE__ */ common.React.createElement(Text, { style: styles.subheaderText }, "Translate to English via /tswx"));
    };

    const settings = plugin.storage;
    if (settings.immersive_enabled === void 0) {
      settings.immersive_enabled = true;
    }
    let unpatchActionSheet = null;
    var index = {
      onLoad: () => {
        console.log("TranslateButtons: Loading...");
        try {
          unpatchActionSheet = patchActionSheet();
          console.log("TranslateButtons: Loaded OK");
        } catch (e) {
          console.log("TranslateButtons: Error loading patch:", e?.message || e);
        }
      },
      onUnload: () => {
        console.log("TranslateButtons: Unloading...");
        if (unpatchActionSheet) unpatchActionSheet();
      },
      settings: Settings
    };

    exports.default = index;
    exports.settings = settings;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, vendetta.plugin, vendetta.metro, vendetta.metro.common, vendetta.patcher, vendetta.ui, vendetta.ui.assets, vendetta.ui.components, vendetta.utils, vendetta.storage, vendetta.ui.toasts);
