if(__DEV__) {
    import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

import React, { useEffect } from 'react';
// Importing here to fix race condition bug;
// see details here: https://github.com/kmagiera/react-native-gesture-handler/issues/320#issuecomment-443815828
import 'react-native-gesture-handler';
import DeviceInfo from 'react-native-device-info';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
import { enableScreens } from 'react-native-screens';
import { AppPreferencesProvider } from 'utils/AppPreferencesContext';
import { AppContextProvider } from 'utils/AppContextProvider';
import { AnalyticsContextProvider } from 'utils/AnalyticsReporterContext';
import { IAPContextProvider } from 'utils/IAPContextProvider';
import { LocalizationProvider } from 'contexts/LocalizationContext';
import { AuthContextProvider } from 'contexts/AuthContextProvider';
import { SwrveContextProvider } from 'contexts/SwrveContextProvider';
import { NetworkContextProvider } from 'contexts/NetworkContextProvider';
import { AlertContextProvider } from 'contexts/AlertContext';
import { ForceUpdateContextProvider } from 'contexts/ForceUpdateContextProvider';
import { IAPProductsContextProvider } from 'contexts/IAPProductsContext';
import { TimerContextProvider } from 'utils/TimerContext';
import AppNavigator from './src/screens/AppNavigator';

// Temp-fix: https://github.com/joltup/rn-fetch-blob/issues/183
// We should look for a long-term solution when working on Downloads, while is currently using
// `rn-fetch-blob` module for caching the images offline.

LogBox.ignoreLogs([
    'Remote debugger is in a background tab which may cause apps to perform slowly',
    'Require cycle: node_modules/rn-fetch-blob/index.js',
    'Require cycle: node_modules/react-native/Libraries/Network/fetch.js',
    'Permanent storage is not supported on tvOS, your data may be removed at any point',
]);

LogBox.ignoreAllLogs(); //Ignore all log notifications

enableScreens();

/**
 * Top-level app component
 */
export const Application = (): JSX.Element => {
    useEffect(() => {
        if (DeviceInfo.getDeviceType() === 'Handset') {
            Orientation.lockToPortrait();
        } else if (DeviceInfo.getDeviceType() === 'Tablet') {
            Orientation.unlockAllOrientations();
        }
        // if (!Platform.isTV) {
        const SwrveSDK = require('react-native-swrve-plugin');
        SwrveSDK.setListeners(
            /** Swrve listeners arg **/ null,
            { pushListener: onPushMessage, silentPushListener: onSilentPushMessage },
            /** in-app listeners arg **/ null,
        );
        // }
    }, []);

    const onPushMessage = async (payload: any) => {
        console.log('onPushMessage', payload);
    };

    const onSilentPushMessage = async (payload: any) => {
        console.log('onSilentPushMessage', payload);
    };

    return (
        <TimerContextProvider>
            <SafeAreaProvider>
                <NetworkContextProvider>
                    <AppPreferencesProvider>
                        <LocalizationProvider>
                            <AuthContextProvider>
                                <AppContextProvider>
                                    <IAPContextProvider>
                                        <IAPProductsContextProvider>
                                            <SwrveContextProvider>
                                                <AnalyticsContextProvider>
                                                    <AlertContextProvider>
                                                        <ForceUpdateContextProvider>
                                                            <AppNavigator />
                                                        </ForceUpdateContextProvider>
                                                    </AlertContextProvider>
                                                </AnalyticsContextProvider>
                                            </SwrveContextProvider>
                                        </IAPProductsContextProvider>
                                    </IAPContextProvider>
                                </AppContextProvider>
                            </AuthContextProvider>
                        </LocalizationProvider>
                    </AppPreferencesProvider>
                </NetworkContextProvider>
            </SafeAreaProvider>
        </TimerContextProvider>
    );
};

export default Application;
