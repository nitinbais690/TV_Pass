import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import LocalizedStrings from 'react-native-localization';
import * as RNLocalize from 'react-native-localize';
import { useAppPreferencesState } from '../utils/AppPreferencesContext';
import en from '../localization/en.json';
import te from '../localization/te.json';
import ta from '../localization/ta.json';
import { getAppLanguage } from 'utils/UserPreferenceUtils';
import { getLocalizedKey } from 'features/language-selection/utils';

const DEFAULT_LANGUAGE = 'en';
const SUBSTITUION_KEY = '%';
const SERVER_LOCALIZATION_CACHE_PREFIX = 'localization.override.';

const strings = new LocalizedStrings({ en, te, ta });

type StringKeys = { [key: string]: string };

export const LocalizationContext = createContext({
    strings: strings,
    setAppLanguage: (_: string) => {},
    appLanguage: DEFAULT_LANGUAGE,
});

/**
 * LocalizationProvider manages localization/i18n strings for the app. It allows switching the app language
 * on the fly and allows overriding the localized strings via server configuration.
 */
export const LocalizationProvider = ({ children }: { children: React.ReactNode }) => {
    const { appConfig } = useAppPreferencesState();
    const [appLanguage, setAppLanguage] = useState(DEFAULT_LANGUAGE);
    const serverCacheKey = (language: string) => {
        return `${SERVER_LOCALIZATION_CACHE_PREFIX}_${language}`;
    };

    const setStringLanguage = useCallback(() => {
        strings.setLanguage(appLanguage);
    }, [appLanguage]);
    setStringLanguage();

    const setLanguage = (language: string) => {
        setAppLanguage(language);
    };

    /**
     * Updates the localization strings with the given server strings
     * @param language The localization language
     * @param serverStrings The key-value strings configured on the server
     */
    const updateLocalizationStrings = (language: string, serverStrings: StringKeys) => {
        const oldContent = (strings as any).getContent();
        const content = Object.assign({}, oldContent, {
            [language]: Object.assign(oldContent[language], serverStrings),
        });
        strings.setContent(content);
    };

    /**
     * Run the side-effect on initial load only
     */
    useEffect(() => {
        console.debug('[LocalizationContext] Setup app lang');

        const initAppLanguage = async () => {
            let currentLanguage = await getAppLanguage();
            currentLanguage = getLocalizedKey(currentLanguage);
            if (!currentLanguage) {
                let localeCode = DEFAULT_LANGUAGE;
                const supportedLocaleCodes = strings.getAvailableLanguages();
                const phoneLocaleCodes = RNLocalize.getLocales().map(locale => locale.languageCode);
                const hasLocaleCode = phoneLocaleCodes.some(code => {
                    if (supportedLocaleCodes.includes(code)) {
                        localeCode = code;
                        return true;
                    }
                });
                if (hasLocaleCode) {
                    setLanguage(localeCode);
                }
            } else {
                setLanguage(currentLanguage);
            }
        };

        /**
         * Fetches any cached localization strings
         * @param language The localization language
         */
        const loadCachedStrings = async (language: string) => {
            const key = serverCacheKey(language);
            const serverLocalizationStrings = await AsyncStorage.getItem(key);
            if (serverLocalizationStrings) {
                try {
                    const serverStrings = JSON.parse(serverLocalizationStrings);
                    updateLocalizationStrings(language, serverStrings);
                } catch (e) {
                    console.error('[LocalizationContext] Error parsing strings', e);
                }
            }
        };

        // Determines and sets up the language to use
        initAppLanguage();

        // Loads server configured overrides, if any available
        loadCachedStrings(appLanguage);
    }, [appLanguage]);

    /**
     * Run the side-effect every time all language changes
     */
    useEffect(() => {
        console.debug('[LocalizationContext] Fetch server config for ', { appLanguage });

        /**
         * Fetches the server configured localization override file
         * @param language The language for which to fetch server override keys
         */
        const fetchServerLocalizationStrings = async (language: string) => {
            if (!appConfig || !appConfig.localizationURL) {
                return undefined;
            }

            const url = appConfig.localizationURL.replace(SUBSTITUION_KEY, language);
            if (!url) {
                return undefined;
            }

            try {
                // Note: We will rely on standard HTTP cache-control mechanism
                // to avoid refetching the config on each app launch
                const response = await fetch(url);
                const payload = (await response.json()) as StringKeys;
                return payload;
            } catch (e) {
                console.error(
                    `[LocalizationContext] Error fetching localization for lang: ${language}, url: ${url}`,
                    e,
                );
            }
            return undefined;
        };

        /**
         * Caches the server localization strings locally
         *
         * @param language The localization language
         * @param serverStrings The server configured localizaion overrides
         */
        const saveServerLocalizationStrings = async (language: string, serverStrings: StringKeys) => {
            const key = serverCacheKey(language);
            try {
                const jsonString = JSON.stringify(serverStrings);
                await AsyncStorage.setItem(key, jsonString);
            } catch (e) {
                console.error('[LocalizationContext] Error caching strings', e);
            }
        };

        /**
         * Fetches server localization file, caches it and then applies the changes
         */
        const checkServerOverride = async (lang: string) => {
            console.debug(`[LocalizationContext] Fetch server config for lang: ${lang}`);

            const serverStrings = await fetchServerLocalizationStrings(lang);
            if (serverStrings) {
                await saveServerLocalizationStrings(lang, serverStrings);
                updateLocalizationStrings(lang, serverStrings);
            }
        };

        // Checks the server config for localization overrides,
        // caches and applies the overrides, if available

        /// TODO: Need to uncomment the below line once server key issues solved. (below line will bring keys from server config)
        checkServerOverride(appLanguage);
    }, [appConfig, appLanguage]);

    return (
        <LocalizationContext.Provider
            value={{
                strings,
                setAppLanguage: setLanguage,
                appLanguage,
            }}>
            {children}
        </LocalizationContext.Provider>
    );
};

export const useLocalization = () => {
    const context = useContext(LocalizationContext);
    if (context === undefined) {
        throw new Error('useLocalization must be used within a LocalizationContext');
    }
    return context;
};
