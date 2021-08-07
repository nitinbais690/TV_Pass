import React, { useRef } from 'react';
import { AccessibilityProps, StyleSheet, TextInput, View } from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { appFonts } from '../../../AppStyles';

export interface SearchBoxProps extends AccessibilityProps {
    onChangeText?: (text: string) => void;
    searchWord: string;
}

export const SearchBox = (props: SearchBoxProps): JSX.Element => {
    const { onChangeText, searchWord } = props;

    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                searchContainer: {
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                },
                input: {
                    flex: 1,
                    color: appColors.caption,
                    fontFamily: appFonts.bold_tv,
                    fontWeight: 'bold',
                    fontSize: appFonts.xxxxlg,
                },
            }),
        [appColors.caption],
    );
    const _textInputRef = useRef<TextInput>(null);

    return (
        <View style={styles.searchContainer}>
            <TextInput
                editable={true}
                ref={_textInputRef}
                style={styles.input}
                placeholder={strings['search.title']}
                underlineColorAndroid="transparent"
                placeholderTextColor={appColors.caption}
                onChangeText={onChangeText}
                clearButtonMode="never"
                value={searchWord}
                maxLength={250}
                spellCheck={true}
                showSoftInputOnFocus={false}
                // onFocus={() => onfocusInput}
                // onBlur={() => onblurInput}
                // autoFocus={isFocus}
            />
        </View>
    );
};
