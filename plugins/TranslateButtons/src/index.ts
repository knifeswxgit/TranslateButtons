import { storage } from "@vendetta/plugin"
import patchActionSheet from "./patches/ActionSheet"
import Settings from "./settings"

export const settings: {
    immersive_enabled?: boolean
} = storage

if (settings.immersive_enabled === undefined) {
    settings.immersive_enabled = true
}

let unpatchActionSheet: any = null

export default {
    onLoad: () => {
        console.log("TranslateButtons: Loading...")
        try {
            unpatchActionSheet = patchActionSheet()
            console.log("TranslateButtons: Loaded OK")
        } catch (e) {
            console.log("TranslateButtons: Error loading patch:", e?.message || e)
        }
    },
    onUnload: () => { 
        console.log("TranslateButtons: Unloading...")
        if (unpatchActionSheet) unpatchActionSheet()
    },
    settings: Settings
}