// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DEFAULT_STREAM_QUALITY = 'Auto';
export const DEFAULT_DOWNLOAD_QUALITY = 'SD';
const DEFAULT_STREAM_OVER_CELULLAR = false;
const DEFAULT_DOWNLOAD_OVER_CELULLAR = false;
const DEFAULT_PUSH_NOTIFICATIONS = true;

const STREAM_HIGH_QUALITY_KEY = 'PREF_KEY_STREAM_HIGH_QUALITY';
const DOWNLOAD_QUALITY_KEY = 'PREF_KEY_DOWNLOAD_QUALITY_KEY';
const STREAM_OVER_CELLULAR_KEY = 'PREF_KEY_STREAM_OVER_CELLULAR';
const DOWNLOAD_OVER_CELLULAR_KEY = 'PREF_KEY_DOWNLOAD_OVER_CELLULAR';
const ENABLE_PUSH_NOTIFICATIONS_KEY = 'PREF_KEY_ENABLE_PUSH_NOTIFICATIONS';

export type StreamQuality = 'Auto' | 'Low' | 'Medium' | 'High';
export type DownloadQuality = 'HD' | 'SD';

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
    return (await getItem(DOWNLOAD_QUALITY_KEY, DEFAULT_DOWNLOAD_QUALITY)) as DownloadQuality;
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
