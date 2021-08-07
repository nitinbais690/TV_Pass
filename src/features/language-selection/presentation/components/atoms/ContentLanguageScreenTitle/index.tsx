import useAppColors from 'core/presentation/hooks/use-app-colors';
import { appFontStyle } from 'core/styles/AppStyles';
import React from 'react';
import { Text } from 'react-native';
import { languageSelectionTitleTextStyle } from './styles';

/*
 *  Renders Title of Content language selection
 **/
export default function HighlightableText(props: ContentLanguageScreenTitleProps) {
    const appColors = useAppColors();
    const styles = languageSelectionTitleTextStyle(appColors);
    const splittedText = props.text.split(' ');

    return (
        <Text style={[props.style, appFontStyle.body1, props.otherLanguageStyle, styles.textStyle]}>
            {splittedText.map((word: string) => {
                return props.highlightedText && props.highlightedText.includes(word) ? (
                    <Text
                        key={word}
                        style={[appFontStyle.body1, props.otherLanguageStyle, styles.highLightedtextStyle]}>
                        {word.concat(' ')}
                    </Text>
                ) : (
                    word.concat(' ') //To add space between words
                );
            })}
        </Text>
    );
}

interface ContentLanguageScreenTitleProps {
    text: string;
    highlightedText?: string[];
    style?: {};
    otherLanguageStyle?: {};
}
