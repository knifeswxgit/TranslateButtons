import { storage } from "@vendetta/plugin"
import { logger } from "@vendetta"
import patchActionSheet from "./patches/ActionSheet"
import patchCommands from "./patches/Commands"
import Settings from "./settings"

export const settings: {
    immersive_enabled?: boolean
} = storage

settings.immersive_enabled ??= true

let patches: any[] = []

export default {
    onLoad: () => {
        logger.info("TranslateButtons: Loading...")
        try {
            patches = [
                patchActionSheet(),
                patchCommands()
            ]
            logger.info("TranslateButtons: Loaded successfully, patches: " + patches.length)
        } catch (e) {
            logger.error("TranslateButtons: Error loading", e)
        }
    },
    onUnload: () => { 
        for (const unpatch of patches) {
            if (unpatch) unpatch()
        }
        logger.info("TranslateButtons: Unloaded")
    },
    settings: Settings
}