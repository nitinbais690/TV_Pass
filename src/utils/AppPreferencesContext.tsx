import React, { useState, useContext, useMemo } from 'react';
import Config from 'react-native-config';
import { selectDeviceType } from 'qp-common-ui';
import {
    useFetchAppConfig,
    FetchOptions,
    GetServiceConfigs,
    AppConfigKeys,
    ServiceConfig,
    KeyValuePair,
} from 'core/config';
import { ConfigProvider } from 'qp-discovery-ui';
import diContainer from 'di/di-config';
import { CORE_DI_TYPES } from 'core/di/core-di-types';
import { AppTheme } from 'core/styles/AppStyles';
import { useOnBoardingStatus } from 'features/onboarding/presentation/hooks/use-onboarding-status';

type AppPreferenceProviderProps = { children: React.ReactNode };

export type AppConfig = { [key in AppConfigKeys]: any };

export interface AppPreferences {
    environment?: 'Production' | 'Staging';
    statusBarStyle: 'default' | 'light-content' | 'dark-content';
    catalogCardsPreview: number;
    useDefaultStyle: boolean;
    onBoardingStatus: boolean;
    loading: boolean;
    error?: Error;
    appConfig?: AppConfig;
    retry: () => {};
}

export interface AppPreferencesContextProps extends AppPreferences {
    toggleTheme(): void;
    appTheme(appPreferences: Partial<AppPreferencesContextProps>): any;
}

/**
 * Tweak these Preference to get desired effect on the app
 */
const appPreferences: AppPreferencesContextProps = {
    useDefaultStyle: false, // change this to toggle between app/default styles
    statusBarStyle: 'light-content',
    catalogCardsPreview: selectDeviceType<number>({ Tv: 5.2, Tablet: 4.2 }, 2.5),
    loading: true,
    onBoardingStatus: false,
    retry: async () => {},
    toggleTheme: () => {},
    appTheme: () => {},
};

if (!appPreferences.useDefaultStyle) {
    appPreferences.statusBarStyle = 'light-content';
}

const AppPreferencesContext = React.createContext<AppPreferencesContextProps>(appPreferences);

/**
 * AppPreferencesProvider loads the app config on app start and sets up
 * `ConfigProvider` so all the child components can use react-fetching-libraries for API fetching.
 */
export const AppPreferencesProvider = ({ children }: AppPreferenceProviderProps) => {
    const [prefs, updatePreferences] = useState<AppPreferences>(appPreferences);

    console.log('>>>>> URL', Config.CONFIG_API_ENDPOINT);

    const endPoint: string = useMemo(() => {
        return Config.CONFIG_API_ENDPOINT;
    }, []);

    const fetchOptions: FetchOptions = useMemo(() => {
        return { queryParams: { device: 'ahamobile' } };
    }, []);

    appPreferences.onBoardingStatus = useOnBoardingStatus();

    const { loading, configData, error, retry } = useFetchAppConfig(endPoint, fetchOptions);

    const toggleTheme = () => {
        appPreferences.useDefaultStyle = !prefs.useDefaultStyle;
        updatePreferences({ ...prefs, useDefaultStyle: !prefs.useDefaultStyle });
    };

    return (
        <AppPreferencesContext.Provider
            value={{
                ...appPreferences,
                toggleTheme: toggleTheme,
                appTheme: AppTheme,
                loading,
                retry,
                error,
                appConfig: configData,
            }}>
            {configData ? (
                <ConfigProvider config={configData} serviceConfig={getServiceConfig(configData).apiConfigs}>
                    {children}
                </ConfigProvider>
            ) : (
                children
            )}
        </AppPreferencesContext.Provider>
    );
};

function getServiceConfig(configData: KeyValuePair): ServiceConfig {
    let getConfigsInstance = diContainer.get<GetServiceConfigs>(CORE_DI_TYPES.GetServiceConfigs);
    return getConfigsInstance.execute(configData);
}

export const useAppPreferencesState = () => {
    const context = useContext(AppPreferencesContext);
    if (context === undefined) {
        throw new Error('useAppPreferencesState must be used within a AppPreferencesProvider');
    }
    return context;
};
