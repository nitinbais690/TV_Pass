import React, { useRef } from 'react';
import { AccessibilityProps, StyleSheet, TextInput, View, Text } from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { appFonts } from '../../../AppStyles';
import { TouchableHighlight } from 'react-native-gesture-handler';

export interface SearchBoxProps extends AccessibilityProps {
    onChangeText?: (text: string) => void;
    searchWord: string;
}

export const SearchBox = (props: SearchBoxProps): JSX.Element => {
    const { onChangeText, searchWord } = props;

    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    let { appColors } = prefs.appTheme!(prefs);

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
                    color: appColors.secondary,
                    fontFamily: appFonts.primary,
                    fontSize: appFonts.xlg,
                },
                clearButtonContainer: {
                    flex: 1,
                    justifyContent: 'center',
                    marginRight: 10,
                },
                clearButtonText: {
                    color: appColors.caption,
                    fontSize: appFonts.xs,
                    fontFamily: appFonts.light,
                },
            }),
        [appColors.caption, appColors.secondary],
    );
    const _textInputRef = useRef<TextInput>(null);

    const handleOnClear = () => {
        if (_textInputRef !== null && _textInputRef.current !== null) {
            _textInputRef.current.clear();
            {
                onChangeText && onChangeText('');
            }
        }
    };

    return (
        <View style={styles.searchContainer}>
            <TextInput
                editable={true}
                ref={_textInputRef}
                style={styles.input}
                placeholder={strings['search.placeholder']}
                underlineColorAndroid="transparent"
                placeholderTextColor={appColors.caption}
                onChangeText={onChangeText}
                clearButtonMode="never"
                value={searchWord}
                maxLength={250}
                spellCheck={true}
            />
            {searchWord.length > 0 && (
                <TouchableHighlight
                    underlayColor={'transparent'}
                    style={styles.clearButtonContainer}
                    onPress={() => {
                        handleOnClear();
                    }}>
                    <Text style={styles.clearButtonText}>{strings['search.clear']}</Text>
                </TouchableHighlight>
            )}
        </View>
    );
};
