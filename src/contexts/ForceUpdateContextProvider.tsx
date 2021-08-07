import React, { useEffect, createContext, useContext, useState } from 'react';
import { Linking } from 'react-native';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAlert } from 'contexts/AlertContext';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import VersionCheck from 'react-native-version-check';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AlertState {
    onForceUpdate: () => void;
    onGracefulUpdate: () => void;
}

export const ForceUpdateContext = createContext<AlertState>({
    onForceUpdate: () => {},
    onGracefulUpdate: () => {},
});

export const ForceUpdateContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { Alert, dismiss } = useAlert();
    const { strings } = useLocalization();
    const { appConfig } = useAppPreferencesState();
    const [isUpdatable, setIsUpdatable] = useState(false);
    const [isTriggerToStoreUrl, setIsTriggerToStoreUrl] = useState(false);

    const GRACEFUL_UPDATE_VERSION_KEY = 'gracefullUpdateVersionKey';

    useEffect(() => {
        handleAppUpdate();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appConfig, isTriggerToStoreUrl]);

    const handleAppUpdate = async () => {
        if (!appConfig) {
            return;
        }

        setIsTriggerToStoreUrl(false);
        const currentVersion = parseFloat(VersionCheck.getCurrentVersion());
        // check gracefull update attempt so that use wont see the update screen if already skip it.
        const gracefullUpdateVersionKey = (await AsyncStorage.getItem(GRACEFUL_UPDATE_VERSION_KEY)) || '';

        VersionCheck.getLatestVersion().then(ver => {
            if (appConfig.minSupportedVersion) {
                // minSupportedVersion key will have value like "1.1_40". 1.1 is the version number and 40 is build number.
                const latestVersion = parseFloat(ver);
                const minSupportedVersionArr = appConfig.minSupportedVersion.split('_');
                const minSupportedVersion = parseFloat(minSupportedVersionArr[0]);

                // if Current version is less then minimum support should trigger forcefull update popup
                if (currentVersion < minSupportedVersion) {
                    setIsUpdatable(true);
                    onForceUpdate();
                } else if (
                    currentVersion >= minSupportedVersion &&
                    currentVersion < latestVersion &&
                    gracefullUpdateVersionKey !== currentVersion.toString()
                ) {
                    AsyncStorage.setItem(GRACEFUL_UPDATE_VERSION_KEY, currentVersion.toString());
                    setIsUpdatable(true);
                    onGracefulUpdate();
                }
            }
        });
    };

    const onForceUpdate = () => {
        Alert.alert(strings['force_update.title'], strings['force_update.err_msg'], [
            {
                text: strings['force_update.update_btn_label'],
                onPress: () => handleOpenUrl(),
            },
        ]);
    };

    const handleOpenUrl = () => {
        setIsTriggerToStoreUrl(true);
        VersionCheck.getStoreUrl()
            .then(storeUrl => {
                Linking.openURL(storeUrl);
            })
            .catch(() => {
                Linking.openURL('itms-apps://itunes.apple.com/us/app/apple-store');
            });
    };

    const onGracefulUpdate = () => {
        Alert.alert(strings['force_update.title'], strings['force_update.err_msg'], [
            {
                text: strings['force_update.update_btn_label'],
                onPress: () => handleOpenUrl(),
            },
            {
                text: strings['force_update.cancel'],
                onPress: () => {
                    dismiss();
                    setIsUpdatable(false);
                },
                style: 'cancel',
            },
        ]);
    };

    return (
        <ForceUpdateContext.Provider
            value={{
                onForceUpdate,
                onGracefulUpdate,
            }}>
            {isUpdatable ? <BackgroundGradient /> : children}
        </ForceUpdateContext.Provider>
    );
};

export const useForceUpdate = () => {
    const context = useContext(ForceUpdateContext);
    if (context === undefined) {
        throw new Error('useForceUpdate must be used within a ForceUpdateContext');
    }
    return context;
};
