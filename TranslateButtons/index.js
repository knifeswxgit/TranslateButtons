var TranslateButtons = (function (exports, transformNullishCoalescing_js, transformOptionalChaining_js, plugin, metro, common, patcher, ui, assets, components, utils, storage, toasts) {
    'use strict';

    function asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, key, arg) {
      try {
        var info = gen[key](arg);
        var value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        Promise.resolve(value).then(_next, _throw);
      }
    }
    function _asyncToGenerator$1(fn) {
      return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
          var gen = fn.apply(self, args);
          function _next(value) {
            asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "next", value);
          }
          function _throw(err) {
            asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "throw", err);
          }
          _next(void 0);
        });
      };
    }
    var __generator$1 = function(thisArg, body) {
      var f, y, t, g, _ = {
        label: 0,
        sent: function() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      };
      return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
      }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([
            n,
            v
          ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [
            op[0] & 2,
            t.value
          ];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return {
                value: op[1],
                done: false
              };
            case 5:
              _.label++;
              y = op[1];
              op = [
                0
              ];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [
            6,
            e
          ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    var translate = (function() {
      var _ref = _asyncToGenerator$1(function(text) {
        var source_lang, target_lang, original, _tmp, API_URL, _tmp1, data, _tmp2, e;
        var _arguments = arguments;
        return __generator$1(this, function(_state) {
          switch (_state.label) {
            case 0:
              source_lang = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : "auto", target_lang = _arguments.length > 2 ? _arguments[2] : void 0, original = _arguments.length > 3 && _arguments[3] !== void 0 ? _arguments[3] : false;
              _state.label = 1;
            case 1:
              _state.trys.push([
                1,
                4,
                ,
                5
              ]);
              _tmp = {};
              if (original) return [
                2,
                (_tmp.source_lang = source_lang, _tmp.text = text, _tmp)
              ];
              _tmp1 = {};
              API_URL = "https://translate.googleapis.com/translate_a/single?" + new URLSearchParams((_tmp1.client = "gtx", _tmp1.sl = source_lang, _tmp1.tl = target_lang, _tmp1.dt = "t", _tmp1.dj = "1", _tmp1.source = "input", _tmp1.q = text, _tmp1));
              return [
                4,
                fetch(API_URL)
              ];
            case 2:
              return [
                4,
                _state.sent().json()
              ];
            case 3:
              data = _state.sent();
              _tmp2 = {};
              return [
                2,
                (_tmp2.source_lang = source_lang, _tmp2.text = data.sentences.map(function(s) {
                  return s.trans;
                }).join(""), _tmp2)
              ];
            case 4:
              e = _state.sent();
              throw Error("Failed to fetch from Google Translate: ".concat(e));
            case 5:
              return [
                2
              ];
          }
        });
      });
      return function translate2(text) {
        return _ref.apply(this, arguments);
      };
    })();
    var GTranslate = {
      translate: translate
    };

    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
      return arr2;
    }
    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }
    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
      try {
        var info = gen[key](arg);
        var value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve(value);
      } else {
        Promise.resolve(value).then(_next, _throw);
      }
    }
    function _asyncToGenerator(fn) {
      return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
          var gen = fn.apply(self, args);
          function _next(value) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
          }
          function _throw(err) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
          }
          _next(void 0);
        });
      };
    }
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _iterableToArrayLimit(arr, i) {
      var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
      if (_i == null) return;
      var _arr = [];
      var _n = true;
      var _d = false;
      var _s, _e;
      try {
        for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);
          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(n);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    var __generator = function(thisArg, body) {
      var f, y, t, g, _ = {
        label: 0,
        sent: function() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      };
      return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
      }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([
            n,
            v
          ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [
            op[0] & 2,
            t.value
          ];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return {
                value: op[1],
                done: false
              };
            case 5:
              _.label++;
              y = op[1];
              op = [
                0
              ];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [
            6,
            e
          ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    var ref;
    console.log("TranslateButtons: ActionSheet patch initializing");
    var LazyActionSheet = metro.findByProps("openLazy", "hideActionSheet");
    if (!LazyActionSheet) {
      console.log("TranslateButtons: ERROR - LazyActionSheet not found");
    }
    var ref1;
    var ActionSheetRow = (ref1 = (ref = metro.findByProps("ActionSheetRow")) === null || ref === void 0 ? void 0 : ref.ActionSheetRow) !== null && ref1 !== void 0 ? ref1 : components.Forms.FormRow;
    var MessageStore = metro.findByStoreName("MessageStore");
    var ChannelStore = metro.findByStoreName("ChannelStore");
    var separator = "\n";
    var targetLang = "en";
    var styles$1 = common.stylesheet.createThemedStyleSheet({
      iconComponent: {
        width: 24,
        height: 24,
        tintColor: ui.semanticColors.INTERACTIVE_NORMAL
      }
    });
    var cachedData = [];
    function patchActionSheet() {
      console.log("TranslateButtons: Patching ActionSheet");
      return patcher.before("openLazy", LazyActionSheet, function(param) {
        var _param = _slicedToArray(param, 3), component = _param[0], key = _param[1], msg = _param[2];
        var message = msg === null || msg === void 0 ? void 0 : msg.message;
        if (key !== "MessageLongPressActionSheet" || !message) return;
        console.log("TranslateButtons: MessageLongPressActionSheet detected");
        component.then(function(instance) {
          var unpatch = patcher.after("default", instance, function(_, component2) {
            common.React.useEffect(function() {
              return function() {
                unpatch();
              };
            }, []);
            var buttons = utils.findInReactTree(component2, function(x) {
              var ref3, ref13;
              return (x === null || x === void 0 ? void 0 : (ref3 = x[0]) === null || ref3 === void 0 ? void 0 : (ref13 = ref3.type) === null || ref13 === void 0 ? void 0 : ref13.name) === "ActionSheetRow";
            });
            if (!buttons) {
              console.log("TranslateButtons: No buttons found");
              return;
            }
            var position = Math.max(buttons.findIndex(function(x) {
              return x.props.message === common.i18n.Messages.MARK_UNREAD;
            }), 0);
            var originalMessage = MessageStore.getMessage(message.channel_id, message.id);
            if (!(originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.content) && !message.content) return;
            var ref2;
            var messageId = (ref2 = originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.id) !== null && ref2 !== void 0 ? ref2 : message.id;
            var ref12;
            var messageContent = (ref12 = originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.content) !== null && ref12 !== void 0 ? ref12 : message.content;
            var existingCached = cachedData.find(function(o) {
              return Object.keys(o)[0] === messageId;
            });
            var translateType = existingCached ? "Revert" : "Translate";
            var icon = translateType === "Translate" ? assets.getAssetIDByName("LanguageIcon") : assets.getAssetIDByName("ic_highlight");
            var doTranslate = (function() {
              var _ref = _asyncToGenerator(function() {
                var ref3, isTranslated, isImmersive, result, finalContent, _tmp, _tmp1, idx, e;
                return __generator(this, function(_state) {
                  switch (_state.label) {
                    case 0:
                      LazyActionSheet.hideActionSheet();
                      _state.label = 1;
                    case 1:
                      _state.trys.push([
                        1,
                        3,
                        ,
                        4
                      ]);
                      console.log("TranslateButtons: Translating message...");
                      isTranslated = translateType === "Translate";
                      isImmersive = settings.immersive_enabled;
                      if (!originalMessage) return [
                        2
                      ];
                      return [
                        4,
                        GTranslate.translate(messageContent, "auto", targetLang, !isTranslated)
                      ];
                    case 2:
                      result = _state.sent();
                      finalContent = isTranslated ? isImmersive ? "".concat(messageContent).concat(separator).concat(result.text.trim(), " `[en]`") : "".concat(result.text.trim(), " `[en]`") : existingCached[messageId];
                      _tmp = {};
                      common.FluxDispatcher.dispatch((_tmp.type = "MESSAGE_UPDATE", _tmp.message = {
                        id: messageId,
                        channel_id: originalMessage.channel_id,
                        guild_id: (ref3 = ChannelStore.getChannel(originalMessage.channel_id)) === null || ref3 === void 0 ? void 0 : ref3.guild_id,
                        content: finalContent
                      }, _tmp.log_edit = false, _tmp.otherPluginBypass = true, _tmp));
                      _tmp1 = {};
                      if (isTranslated) {
                        cachedData.unshift(_defineProperty(_tmp1, messageId, messageContent));
                      } else {
                        idx = cachedData.findIndex(function(e2) {
                          return e2 !== existingCached;
                        });
                        if (idx > -1) cachedData.splice(idx, 1);
                      }
                      console.log("TranslateButtons: Translation done");
                      return [
                        3,
                        4
                      ];
                    case 3:
                      e = _state.sent();
                      console.log("TranslateButtons: Translation error:", (e === null || e === void 0 ? void 0 : e.message) || e);
                      toasts.showToast("Translation failed", assets.getAssetIDByName("Small"));
                      return [
                        3,
                        4
                      ];
                    case 4:
                      return [
                        2
                      ];
                  }
                });
              });
              return function doTranslate2() {
                return _ref.apply(this, arguments);
              };
            })();
            var translateButton = common.React.createElement(ActionSheetRow, {
              label: "".concat(translateType, " Message"),
              icon: common.React.createElement(ActionSheetRow.Icon, {
                source: icon,
                IconComponent: function() {
                  return common.React.createElement(common.ReactNative.Image, {
                    resizeMode: "cover",
                    style: styles$1.iconComponent,
                    source: icon
                  });
                }
              }),
              onPress: doTranslate
            });
            buttons.splice(position, 0, translateButton);
          });
        });
      });
    }

    var ScrollView = common.ReactNative.ScrollView, Text = common.ReactNative.Text;
    var FormRow = components.Forms.FormRow, FormSwitchRow = components.Forms.FormSwitchRow;
    var styles = common.stylesheet.createThemedStyleSheet({
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
    function Settings() {
      storage.useProxy(settings);
      var _immersive_enabled;
      return /* @__PURE__ */ common.React.createElement(ScrollView, null, /* @__PURE__ */ common.React.createElement(FormSwitchRow, {
        label: "Immersive Translation",
        subLabel: "Display both original and translation",
        leading: /* @__PURE__ */ common.React.createElement(FormRow.Icon, {
          source: assets.getAssetIDByName("ic_chat_bubble_filled_24px")
        }),
        value: (_immersive_enabled = settings.immersive_enabled) !== null && _immersive_enabled !== void 0 ? _immersive_enabled : true,
        onValueChange: function(v) {
          settings.immersive_enabled = v;
        }
      }), /* @__PURE__ */ common.React.createElement(Text, {
        style: styles.subheaderText
      }, "Translate to English via /tswx"));
    }

    var settings = plugin.storage;
    if (settings.immersive_enabled === void 0) {
      settings.immersive_enabled = true;
    }
    var unpatchActionSheet = null;
    var index = {
      onLoad: function() {
        console.log("TranslateButtons: Loading...");
        try {
          unpatchActionSheet = patchActionSheet();
          console.log("TranslateButtons: Loaded OK");
        } catch (e) {
          console.log("TranslateButtons: Error loading patch:", (e === null || e === void 0 ? void 0 : e.message) || e);
        }
      },
      onUnload: function() {
        console.log("TranslateButtons: Unloading...");
        if (unpatchActionSheet) unpatchActionSheet();
      },
      settings: Settings
    };

    exports.default = index;
    exports.settings = settings;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, core-js/modules/transform-nullish-coalescing.js, core-js/modules/transform-optional-chaining.js, vendetta.plugin, vendetta.metro, vendetta.metro.common, vendetta.patcher, vendetta.ui, vendetta.ui.assets, vendetta.ui.components, vendetta.utils, vendetta.storage, vendetta.ui.toasts);
