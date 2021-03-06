import { useNavigation } from '@react-navigation/native';
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { useAppPreferencesState } from '../utils/AppPreferencesContext';
import * as RootNavigation from 'utils/RootNavigation';

const DEFAULT_AUTO_POP_INTERVAL_MS = 60 * 1000; // 60s

export const AppPreviewContext = createContext({
    isModalVisible: false,
    toggleModal: () => {},
});

/**
 * AppPreviewContextProvider manages localization/i18n strings for the app. It allows switching the app language
 * on the fly and allows overriding the localized strings via server configuration.
 */
export const AppPreviewContextProvider = ({ children }: { children: React.ReactNode }) => {
    const navigation = useNavigation();
    const { appConfig } = useAppPreferencesState();
    const [isModalVisible, setModalVisible] = useState(false);
    const routeRef = useRef<string | undefined>('');
    const autoPopIntervalInMillis = (appConfig && appConfig.previewAutoPopIntervalMs) || DEFAULT_AUTO_POP_INTERVAL_MS;
    routeRef.current =
        (RootNavigation.navigationRef.current && RootNavigation.navigationRef.current.getCurrentRoute().name) || '';
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        navigation.navigate(NAVIGATION_TYPE.AUTH_HOME, {
            screen: NAVIGATION_TYPE.PLAN_INFO,
        });
    };

    /**
     * Custom hook that automatically pops up subscribe modal when user is browsing in Preview mode
     *
     * @param refreshTimeInterval The time interval to auto-refresh the credits
     */
    const useAutoPopSubscribeModal = (refreshTimeInterval: number) => {
        useEffect(() => {
            let refreshInterval = setInterval(() => {
                if (routeRef.current === 'BrowseStackScreen') {
                    toggleModal();
                }
            }, refreshTimeInterval);

            const clearInterval = () => {
                if (refreshInterval) {
                    clearTimeout(refreshInterval);
                }
            };

            if (isModalVisible) {
                clearInterval();
            }

            return () => clearInterval();
        }, [refreshTimeInterval]);
    };

    useAutoPopSubscribeModal(autoPopIntervalInMillis);

    return (
        <AppPreviewContext.Provider
            value={{
                isModalVisible,
                toggleModal,
            }}>
            {children}
        </AppPreviewContext.Provider>
    );
};

export const useAppPreview = () => {
    const context = useContext(AppPreviewContext);
    if (context === undefined) {
        throw new Error('useAppPreview must be used within a AppPreviewContext');
    }
    return context;
};
