import { React, ReactNative } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { settings } from ".";
import { GTranslateLangs } from "./types";

const { FormRow, FormRadio, FormSection } = Forms;

export default function Settings() {
  const langList = Object.entries(GTranslateLangs).map(([name, code]) => ({ name, code }));

  return (
    <ReactNative.ScrollView style={{ padding: 16 }}>
      <FormSection title="Target Language">
        {langList.map(lang => (
          <FormRadio
            key={lang.code}
            label={lang.name}
            selected={settings.target_lang === lang.code}
            onPress={() => { settings.target_lang = lang.code; }}
          />
        ))}
      </FormSection>
    </ReactNative.ScrollView>
  );
}