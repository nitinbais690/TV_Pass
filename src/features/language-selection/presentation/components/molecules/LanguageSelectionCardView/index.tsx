import React, { useState } from 'react';
import { View, Text, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TamilLangBg from 'assets/images/tamil_lang_bg.svg';
import TeluguLangBg from 'assets/images/telugu_lang_bg.svg';
import EnglishLangBg from 'assets/images/english_lang_bg.svg';
import { LanguageSelectionTextRow } from 'features/language-selection/presentation/components/atoms/LanguageSelectionTextRow';
import { LanguageSelectionCardViewStyles, languageBackgroundSize } from './style';
import { APP_LANGUAGE_CONSTANTS } from 'features/language-selection/utils/app-language-constants';
import FastImage from 'react-native-fast-image';
import { getDefaultImage } from 'features/language-selection/utils';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { useProfiles } from 'contexts/ProfilesContextProvider';

export function LanguageSelectionCardView(props: LanguageSelectionCardViewProps) {
    const appColors = useAppColors();
    const [parentViewheight, setParentViewheight] = useState(0);
    const styles = LanguageSelectionCardViewStyles(appColors, props.isCardSelected, parentViewheight);

    const { preferredContentLang } = useProfiles();

    return (
        <View
            style={[styles.mainContainer, Platform.isTV && getFocusStyle(props.isCardFocussed)]}
            onLayout={event => {
                var height = event.nativeEvent.layout.height;
                setParentViewheight(height);
            }}>
            <LinearGradient
                style={[styles.gradientCommonStyle, Platform.isTV ? styles.gradientStyleTV : styles.gradientStyleMobile]}
                colors={getGradientColors()}
                locations={Platform.isTV && props.isCardSelected ? [4, 54] : [0, 0]}
                useAngle={true}
                angle={props.isCardSelected ? 130 : 180}>
                <View style={styles.cardContainer}>
                    <View style={styles.topTextStyle}>
                        <LanguageSelectionTextRow
                            displayLanguage={getLanguageTitle()}
                            selectedLanguage={props.selectedLanguage}
                            isCardSelected={props.isCardSelected}
                        />

                        <Text
                            style={[
                                styles.descTextStyle,
                                props.selectedLanguage === APP_LANGUAGE_CONSTANTS.TELUGU && styles.teluguStyle,
                            ]}>
                            {props.languageDesc}
                        </Text>
                    </View>

                    <View style={styles.cardBackgroundStyle}>
                        {props.selectedLanguage === APP_LANGUAGE_CONSTANTS.TAMIL && (
                            <TamilLangBg width={languageBackgroundSize} height={languageBackgroundSize} />
                        )}
                        {props.selectedLanguage === APP_LANGUAGE_CONSTANTS.TELUGU && (
                            <TeluguLangBg width={languageBackgroundSize} height={languageBackgroundSize} />
                        )}
                        {props.selectedLanguage === APP_LANGUAGE_CONSTANTS.ENGLISH && (
                            <EnglishLangBg width={languageBackgroundSize} height={languageBackgroundSize} />
                        )}

                        {
                            <View style={[styles.backgroundImageStyle]}>
                                {props.actorImageUrl !== undefined && props.actorImageUrl !== '' && (
                                    <FastImage
                                        style={[styles.actorImageStyle]}
                                        resizeMode={FastImage.resizeMode.contain}
                                        source={{ uri: props.actorImageUrl }}
                                    />
                                )}
                                {getDefaultImage(preferredContentLang, props.selectedLanguage, parentViewheight)}
                            </View>
                        }
                    </View>
                </View>
            </LinearGradient>
        </View>
    );

    function getLanguageTitle() {
        if (props.screenType === APP_LANGUAGE_CONSTANTS.APP_LANGUAGE_SCREEN) {
            var languageTitle;
            if (props.selectedLanguage === APP_LANGUAGE_CONSTANTS.TAMIL) {
                languageTitle = APP_LANGUAGE_CONSTANTS.TAMIL_REGIONAL;
            } else if (props.selectedLanguage === APP_LANGUAGE_CONSTANTS.TELUGU) {
                languageTitle = APP_LANGUAGE_CONSTANTS.TELUGU_REGIONAL;
            } else {
                languageTitle = props.selectedLanguage;
            }

            return languageTitle;
        } else {
            return props.selectedLanguage;
        }
    }

    function getGradientColors() {
        var gradientColor;
        if (Platform.isTV) {
            if (props.isCardSelected) {
                gradientColor = [appColors.languageCardTVSelectedGradientStart, appColors.white];
            } else {
                gradientColor = [
                    appColors.languageCardTVUnselectedGradient,
                    appColors.languageCardTVUnselectedGradient,
                ];
            }
        } else {
            if (props.isCardSelected) {
                gradientColor = [
                    appColors.languageCardSelectedGradientStart,
                    appColors.languageCardSelectedGradientEnd,
                ];
            } else {
                gradientColor = [appColors.primaryVariant3, appColors.primaryVariant1];
            }
        }
        return gradientColor;
    }
    
    function getFocusStyle(isCardFocussed: boolean) {
        return isCardFocussed ?  styles.cardFocussedStyle : styles.cardUnfocussedStyle;
    }
}
interface LanguageSelectionCardViewProps {
    isCardSelected: boolean;
    isCardFocussed: boolean;
    selectedLanguage: string;
    actorImageUrl: string;
    languageDesc: string;
    screenType: string;
}
