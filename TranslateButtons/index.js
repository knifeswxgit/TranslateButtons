(function () {
    'use strict';

    (() => {
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var import_plugin = require("@vendetta/plugin");
      var import_ActionSheet = __toESM(require("./patches/ActionSheet"));
      var import_settings = __toESM(require("./settings"));
      const settings = import_plugin.storage;
      if (settings.immersive_enabled === void 0) {
        settings.immersive_enabled = true;
      }
      let unpatchActionSheet = null;
      ({
        onLoad: () => {
          console.log("TranslateButtons: Loading...");
          try {
            unpatchActionSheet = (0, import_ActionSheet.default)();
            console.log("TranslateButtons: Loaded OK");
          } catch (e) {
            console.log("TranslateButtons: Error loading patch:", e?.message || e);
          }
        },
        onUnload: () => {
          console.log("TranslateButtons: Unloading...");
          if (unpatchActionSheet) unpatchActionSheet();
        },
        settings: import_settings.default
      });
    })();

})();
