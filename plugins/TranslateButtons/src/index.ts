import { storage } from "@vendetta/plugin"
import patchActionSheet from "./patches/ActionSheet"
import Settings from "./settings"

export const settings: {
    immersive_enabled?: boolean
} = storage

settings.immersive_enabled ??= true

let patches: any[] = []

export default {
    onLoad: () => {
        patches = [patchActionSheet()]
    },
    onUnload: () => { 
        for (const unpatch of patches) {
            if (unpatch) unpatch()
        }
    },
    settings: Settings
}