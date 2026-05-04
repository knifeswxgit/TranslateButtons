import { storage } from "@vendetta/plugin";
import { logger } from "@vendetta";
import patchMessageAction from "./patches/messageAction";
import patchInputAction from "./patches/inputAction";
import Settings from "./settings";

export const settings: {
  target_lang?: string;
} = storage;

settings.target_lang ??= "en";

let patches: (() => void)[] = [];

export default {
  onLoad: () => {
    logger.info("TranslateButtons: Loading...");
    try {
      patches = [patchMessageAction(), patchInputAction()];
      logger.info("TranslateButtons: Patches loaded successfully");
    } catch (e) {
      logger.error("TranslateButtons: Error loading patches", e);
    }
  },
  onUnload: () => {
    for (const unpatch of patches) unpatch();
    logger.info("TranslateButtons: Unloaded");
  },
  settings: Settings,
};