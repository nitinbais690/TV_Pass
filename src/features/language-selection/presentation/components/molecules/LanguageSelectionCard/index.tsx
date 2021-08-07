import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { appLanguageTemplateStyle, contentLanguageTemplateStyle } from './styles';
import { APP_LANGUAGE_CONSTANTS } from 'features/language-selection/utils/app-language-constants';
import HighlightableText from '../../atoms/ContentLanguageScreenTitle';
import {
    getHighLightableWordForLanguage,
    getLanguageDesc,
    getTitleForLanguage,
} from 'features/language-selection/utils';
import { AUTOMATION_TEST_ID } from 'features/language-selection/presentation/automation-ids';
import { LanguageSelectionCardView } from '../LanguageSelectionCardView';
import { useLocalization } from 'contexts/LocalizationContext';


const LanguageSelectionCard = ({
        language,
        imageUrl,
        isSelected,
        index,
        onPress,
        screenType
    }: {
        language: string;
        imageUrl: string;
        isSelected: boolean;
        index: number;
        onPress: () => {};
        screenType: string;
    }) => {

    const { strings, setAppLanguage } = useLocalization();
    const [isCardFocussed, setCardFocussed] = useState(false);
    const style = appLanguageTemplateStyle();

    return(<View style={contentLanguageTemplateStyle.item}>
            {screenType === APP_LANGUAGE_CONSTANTS.APP_LANGUAGE_SCREEN && (
                <HighlightableText
                    otherLanguageStyle={
                        language !== APP_LANGUAGE_CONSTANTS.ENGLISH ? contentLanguageTemplateStyle.otherLanguage : {}
                    }
                    style={index == 0 ? style.languageFirstTitleStyle : style.languageTitleStyle}
                    text={getTitleForLanguage(strings, language)}
                    highlightedText={getHighLightableWordForLanguage(strings, language)}
                />
            )}
            <TouchableOpacity
                activeOpacity={1}
                onPress={onPress}
                onFocus={() => setCardFocussed(true)}
                onBlur={() => setCardFocussed(false)}
                testID={AUTOMATION_TEST_ID.LANGUAGE + language}
                accessibilityLabel={AUTOMATION_TEST_ID.LANGUAGE + language}>
                <LanguageSelectionCardView
                    isCardFocussed={isCardFocussed}
                    isCardSelected={isSelected}
                    selectedLanguage={language}
                    actorImageUrl={imageUrl}
                    languageDesc={getLanguageDesc(screenType, language)}
                    screenType={screenType}
                />
            </TouchableOpacity>
        </View>);
}

export default LanguageSelectionCard;
