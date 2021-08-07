import React, { useRef } from 'react';
import { AccessibilityProps, TextInput, View } from 'react-native';

import { searchBoxStyles } from './styles';
import { useLocalization } from 'contexts/LocalizationContext';

import { TouchableHighlight } from 'react-native-gesture-handler';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { TextinputBox } from '../TextinputBox';
import CloseIcon from 'assets/images/close_icon.svg';
import MicIcon from 'assets/images/mic_icon.svg';

import { appIconStyles } from 'core/styles/AppStyles';
export interface SearchBoxProps extends AccessibilityProps {
    onChangeText?: (text: string) => void;
    searchWord: string;
}

export const SearchBox = (props: SearchBoxProps): JSX.Element => {
    const { onChangeText, searchWord } = props;

    const { strings } = useLocalization();
    const appColors = useAppColors();

    const styles = searchBoxStyles(appColors);
    const _textInputRef = useRef<TextInput>(null);

    const handleOnClear = () => {
        if (_textInputRef !== null && _textInputRef.current !== null) {
            _textInputRef.current.clear();
            onChangeText && onChangeText('');
        }
    };

    const voiceSearch = () => {};

    return (
        <View style={styles.searchContainer}>
            <TextinputBox
                editable={true}
                ref={_textInputRef}
                style={styles.input}
                placeholder={strings['search.placeholder']}
                underlineColorAndroid="transparent"
                placeholderTextColor={appColors.caption}
                onChangeText={onChangeText}
                clearButtonMode="never"
                value={searchWord}
                maxLength={50}
                spellCheck={true}
            />
            <View style={styles.iconSection}>
                {searchWord.length > 0 && (
                    <TouchableHighlight
                        underlayColor={'transparent'}
                        style={styles.iconButton}
                        onPress={() => {
                            handleOnClear();
                        }}>
                        <CloseIcon height={appIconStyles.height} width={appIconStyles.width} />
                    </TouchableHighlight>
                )}
                {searchWord.length === 0 && (
                    <TouchableHighlight
                        underlayColor={'transparent'}
                        style={styles.iconButton}
                        onPress={() => {
                            voiceSearch();
                        }}>
                        <MicIcon height={appIconStyles.height} width={appIconStyles.width} />
                    </TouchableHighlight>
                )}
            </View>
        </View>
    );
};
