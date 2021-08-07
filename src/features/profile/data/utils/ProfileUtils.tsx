import { APP_LANGUAGE_CONSTANTS } from 'features/language-selection/utils/app-language-constants';
import { Profile } from 'features/profile/domain/entities/profile';

export const MAX_PROFILE_COUNT = 5;
/*
 * Getting default profile log based on profile type
 */
export function getDefaultProfileLogo(profileType?: string) {
    var profileLogo;
    switch (profileType) {
        case PROFILE_TYPES.FAMILY:
            profileLogo = require('assets/images/family_profile_logo.png');
            break;
        case PROFILE_TYPES.KIDS:
            profileLogo = require('assets/images/kids_profile_logo.png');
            break;
        default:
            profileLogo = require('assets/images/general_profile_logo.png');
            break;
    }

    return profileLogo;
}

const PROFILE_TYPES = {
    FAMILY: 'Family',
    KIDS: 'Kids',
    PROFILE: 'Profile',
};

const LOCALES = {
    [APP_LANGUAGE_CONSTANTS.ENGLISH]: 'en_US',
    [APP_LANGUAGE_CONSTANTS.TAMIL]: 'ta_IN',
    [APP_LANGUAGE_CONSTANTS.TELUGU]: 'tel_IN',
};

export function getLocaleFromLanguage(language: string) {
    return LOCALES[language];
}

export function updateActiveProfileInProfileList(profileList: Profile[], activeProfileId: string) {
    if (!profileList || profileList.length === 0) {
        return [];
    }
    let activeProfile = null;
    for (let index in profileList) {
        if (profileList[index].contactID === activeProfileId) {
            profileList[index].isSelectedProfile = true;
            activeProfile = profileList[index];
        } else {
            profileList[index].isSelectedProfile = false;
        }
    }
    return [profileList, activeProfile];
}

export const getReginolLanguage = (language: string) => {
    if (language === APP_LANGUAGE_CONSTANTS.TELUGU) {
        return APP_LANGUAGE_CONSTANTS.TELUGU_REGIONAL;
    } else if (language === APP_LANGUAGE_CONSTANTS.TAMIL) {
        return APP_LANGUAGE_CONSTANTS.TAMIL_REGIONAL;
    }
    return language;
};

export const getEnglishForReginolLanguage = (language: string) => {
    if (language === APP_LANGUAGE_CONSTANTS.TELUGU_REGIONAL) {
        return APP_LANGUAGE_CONSTANTS.TELUGU;
    } else if (language === APP_LANGUAGE_CONSTANTS.TAMIL_REGIONAL) {
        return APP_LANGUAGE_CONSTANTS.TAMIL;
    }
    return APP_LANGUAGE_CONSTANTS.ENGLISH;
};
