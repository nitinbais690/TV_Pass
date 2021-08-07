import AsyncStorage from '@react-native-community/async-storage';
import { Profile } from 'features/profile/domain/entities/profile';

export const DEFAULT_STREAM_QUALITY = 'Auto';
export const DEFAULT_DOWNLOAD_QUALITY = 'HD';
const DEFAULT_STREAM_OVER_CELULLAR = true;
const DEFAULT_DOWNLOAD_OVER_CELULLAR = false;
const DEFAULT_PUSH_NOTIFICATIONS = true;
export const DEFAULT_CONTENT_LANGUAGE = '';

const STREAM_HIGH_QUALITY_KEY = 'PREF_KEY_STREAM_HIGH_QUALITY';
const DOWNLOAD_QUALITY_KEY = 'PREF_KEY_DOWNLOAD_QUALITY_KEY';
const STREAM_OVER_CELLULAR_KEY = 'PREF_KEY_STREAM_OVER_CELLULAR';
const DOWNLOAD_OVER_CELLULAR_KEY = 'PREF_KEY_DOWNLOAD_OVER_CELLULAR';
const ENABLE_PUSH_NOTIFICATIONS_KEY = 'PREF_KEY_ENABLE_PUSH_NOTIFICATIONS';
const CONTENT_LANGUAGE = 'CONTENT_LANGUAGE';
const APP_LANGUAGE = 'APP_LANGUAGE';
const ACTIVE_PROFILE = 'ACTIVE_PROFILE';

const ONBOARD_COMPLETE_STATUS = 'ONBOARD_COMPLETE_STATUS';

export type StreamQuality = 'Auto' | 'Low' | 'Medium' | 'High';
export type DownloadQuality = 'Low' | 'Medium' | 'High';

export async function setPushNotification(key: string, data: string) {
    await AsyncStorage.setItem(`${key}`, data);
}

export const getStreamQuality = async () => {
    return (await getItem(STREAM_HIGH_QUALITY_KEY, DEFAULT_STREAM_QUALITY)) as StreamQuality;
};

export const setStreamQuality = async (value: StreamQuality) => {
    await setItem(STREAM_HIGH_QUALITY_KEY, value);
};

export const getDownloadQuality = async () => {
    return (await getItem(DOWNLOAD_QUALITY_KEY, undefined)) as DownloadQuality;
};

export const setDownloadQuality = async (value: DownloadQuality) => {
    await setItem(DOWNLOAD_QUALITY_KEY, value);
};

export const canStreamOverCellular = async () => {
    return await getValue(STREAM_OVER_CELLULAR_KEY, DEFAULT_STREAM_OVER_CELULLAR);
};

export const setStreamOverCellular = async (value: boolean) => {
    await setValue(STREAM_OVER_CELLULAR_KEY, value);
};

export const canDownloadOverCellular = async () => {
    return await getValue(DOWNLOAD_OVER_CELLULAR_KEY, DEFAULT_DOWNLOAD_OVER_CELULLAR);
};

export const setDownloadOverCellular = async (value: boolean) => {
    await setValue(DOWNLOAD_OVER_CELLULAR_KEY, value);
};

export const canSendPushNotifications = async () => {
    return await getValue(ENABLE_PUSH_NOTIFICATIONS_KEY, DEFAULT_PUSH_NOTIFICATIONS);
};

export const setSendPushNotifications = async (value: boolean) => {
    await setValue(ENABLE_PUSH_NOTIFICATIONS_KEY, value);
};

export const setItem = async (key: string, value: any) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        console.error(e);
    }
};

export const getItem = async (key: string, defaultValue: any) => {
    let output = defaultValue;
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            output = value;
        }
    } catch (e) {
        console.error(e);
    }

    return output;
};

export const removeItem = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console.error(e);
    }
};

const getValue = async (key: string, defaultValue: boolean) => {
    const data = await AsyncStorage.getItem(key);
    if (data) {
        return data === 'true' ? true : false;
    }
    return defaultValue;
};

const setValue = async (key: string, value: boolean) => {
    const data = value ? 'true' : 'false';
    await AsyncStorage.setItem(key, data);
};

export const getOnBoardCompleteStatus = async () => {
    return await getItem(ONBOARD_COMPLETE_STATUS, false);
};

export const setOnBoardCompleteStatus = async (statue: boolean) => {
    await setValue(ONBOARD_COMPLETE_STATUS, statue);
};

export const getContentLanguage = async () => {
    return (await getItem(CONTENT_LANGUAGE, DEFAULT_CONTENT_LANGUAGE)) as string;
};

export const setContentLanguage = async (value: string) => {
    await setItem(CONTENT_LANGUAGE, value);
};

export const getAppLanguage = async () => {
    return (await getItem(APP_LANGUAGE, '')) as string;
};

export const setAppDisplayLanguage = async (value: string) => {
    await setItem(APP_LANGUAGE, value);
};

export const getActiveProfileId = async () => {
    return (await getItem(ACTIVE_PROFILE, '')) as string;
};

export const setActiveProfile = async (profile: Profile) => {
    /// TODO: Need to remove profile.language once API implemented
    await setAppDisplayLanguage(profile.language);
    await setContentLanguage(profile.contentLanguage);
    await setItem(ACTIVE_PROFILE, profile.contactID);
};

export const removeActiveProfile = async () => {
    return await removeItem(ACTIVE_PROFILE);
};
