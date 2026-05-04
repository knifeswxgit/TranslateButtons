import { getAssetIDByName } from "@vendetta/ui/assets"
import { React, ReactNative, stylesheet, constants, manifest } from "@vendetta/metro/common"
import { semanticColors } from "@vendetta/ui"
import { Forms } from "@vendetta/ui/components"
import { useProxy } from "@vendetta/storage"

import { settings } from ".."

const { ScrollView, Text } = ReactNative
const { FormRow, FormSwitchRow } = Forms

const styles = stylesheet.createThemedStyleSheet({
    subheaderText: {
        color: semanticColors.HEADER_SECONDARY,
        textAlign: 'center',
        margin: 10,
        marginBottom: 50,
        letterSpacing: 0.25,
        fontFamily: constants.Fonts.PRIMARY_BOLD,
        fontSize: 14
    }
})

export default () => {
    useProxy(settings)

    return (
        <ScrollView>
            <FormSwitchRow
                label={"Immersive Translation"}
                subLabel={"Display both original and translation"}
                leading={<FormRow.Icon source={getAssetIDByName("ic_chat_bubble_filled_24px")} />}
                value={settings.immersive_enabled ?? true}
                onValueChange={(v) => {
                    settings.immersive_enabled = v
                }}
            />
            <Text style={styles.subheaderText}>
                Translate to English via /tswx
            </Text>
        </ScrollView>
    )
}