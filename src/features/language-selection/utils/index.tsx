import React from 'react';
import { APP_LANGUAGE_CONSTANTS } from 'features/language-selection/utils/app-language-constants';
import { appLanguageTemplateStyle } from '../presentation/components/template/LanguageSelectionTemplate/styles';
import FastImage from 'react-native-fast-image';

// loading default actor image for language card based on language
export function getDefaultImage(selectedContentLanguage: string, lang: string, imageHeight: number) {
    const style = appLanguageTemplateStyle(imageHeight);

    return getActorImage();

    function getActorImagePath() {
        var actorImage;
        if (lang === APP_LANGUAGE_CONSTANTS.TAMIL) {
            actorImage = require('assets/images/tamil-actor.png');
        } else if (lang === APP_LANGUAGE_CONSTANTS.TELUGU) {
            actorImage = require('assets/images/telugu-actor.png');
        } else if (lang === APP_LANGUAGE_CONSTANTS.ENGLISH) {
            if (selectedContentLanguage) {
                if (selectedContentLanguage === APP_LANGUAGE_CONSTANTS.TAMIL) {
                    actorImage = require('assets/images/tamil-actor.png');
                } else if (selectedContentLanguage === APP_LANGUAGE_CONSTANTS.TELUGU) {
                    actorImage = require('assets/images/telugu-actor.png');
                }
            } else {
                actorImage = require('assets/images/telugu-actor.png');
            }
        }
        return actorImage;
    }

    function getActorImage() {
        return (
            <FastImage
                style={[style.actorImageStyle]}
                resizeMode={FastImage.resizeMode.contain}
                source={getActorImagePath()}
            />
        );
    }
}

//To get description for the respective languages
export function getLanguageDesc(screenType: string, language: string) {
    if (screenType === APP_LANGUAGE_CONSTANTS.CONTENT_LANGUAGE_SCREEN) {
        return language === APP_LANGUAGE_CONSTANTS.TAMIL
            ? APP_LANGUAGE_CONSTANTS.CONTENT_LANGUAGE_TAMIL
            : APP_LANGUAGE_CONSTANTS.CONTENT_LANGUAGE_TELUGU;
    } else {
        if (language === APP_LANGUAGE_CONSTANTS.TAMIL) {
            return APP_LANGUAGE_CONSTANTS.APP_LANGUAGE_TAMIL_REGIONAL_DESC;
        } else if (language === APP_LANGUAGE_CONSTANTS.TELUGU) {
            return APP_LANGUAGE_CONSTANTS.APP_LANGUAGE_TELUGU_REGIONAL_DESC;
        } else if (language === APP_LANGUAGE_CONSTANTS.ENGLISH) {
            return APP_LANGUAGE_CONSTANTS.APP_LANGUAGE_ENGLISH_DESC;
        }
    }
}

//To get title for the respective languages
export const getTitleForLanguage = (strings: any, language: string): string => {
    switch (language) {
        case APP_LANGUAGE_CONSTANTS.TAMIL:
            return APP_LANGUAGE_CONSTANTS.APP_LANGUAGE_TAMIL_TITLE;
        case APP_LANGUAGE_CONSTANTS.TELUGU:
            return APP_LANGUAGE_CONSTANTS.APP_LANGUAGE_TELUGU_TITLE;
        case APP_LANGUAGE_CONSTANTS.ENGLISH:
            return strings['app_language.english_title'];
        default:
            return strings['app_language.english_title'];
    }
};

//To get highlightable text in the titles
export const getHighLightableWordForLanguage = (strings: any, language: string): string[] => {
    switch (language) {
        case APP_LANGUAGE_CONSTANTS.TAMIL:
            return [APP_LANGUAGE_CONSTANTS.APP_LANGUAGE_TAMIL_HIGHLIGHT_TEXT1];
        case APP_LANGUAGE_CONSTANTS.TELUGU:
            return [APP_LANGUAGE_CONSTANTS.APP_LANGUAGE_TELUGU_HIGHLIGHT_TEXT1];
        case APP_LANGUAGE_CONSTANTS.ENGLISH:
            return [strings.content];
        default:
            return [strings.content];
    }
};

export function formAppLanguageList(selectedContentLanguage: string) {
    const appLanguageList = [];
    appLanguageList.push(APP_LANGUAGE_CONSTANTS.ENGLISH);
    appLanguageList.push(selectedContentLanguage);
    return appLanguageList;
}

export const getLocalizedKey = (language: string) => {
    switch (language) {
        case APP_LANGUAGE_CONSTANTS.TAMIL:
            return APP_LANGUAGE_CONSTANTS.TAMIL_LOCALIZATION_KEY;
        case APP_LANGUAGE_CONSTANTS.TELUGU:
            return APP_LANGUAGE_CONSTANTS.TELUGU_LOCALIZATION_KEY;
        case APP_LANGUAGE_CONSTANTS.ENGLISH:
            return APP_LANGUAGE_CONSTANTS.ENGLISH_LOCALIZATION_KEY;
        default:
            return APP_LANGUAGE_CONSTANTS.ENGLISH_LOCALIZATION_KEY;
    }
};
