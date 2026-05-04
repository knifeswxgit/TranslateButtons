import { storage } from "@vendetta/plugin";
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
    patches = [patchMessageAction(), patchInputAction()];
  },
  onUnload: () => {
    for (const unpatch of patches) unpatch();
  },
  settings: Settings,
};