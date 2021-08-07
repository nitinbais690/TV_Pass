import React, { useEffect } from 'react';
// Importing here to fix race condition bug;
// see details here: https://github.com/kmagiera/react-native-gesture-handler/issues/320#issuecomment-443815828
import 'react-native-gesture-handler';
import DeviceInfo from 'react-native-device-info';
import { YellowBox } from 'react-native';
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
// import SwrveSDK from 'react-native-swrve-plugin';
import KochavaTracker from 'react-native-kochava-tracker';
import Config from 'react-native-config';
import Crashes from 'appcenter-crashes';

// Temp-fix: https://github.com/joltup/rn-fetch-blob/issues/183
// We should look for a long-term solution when working on Downloads, while is currently using
// `rn-fetch-blob` module for caching the images offline.

YellowBox.ignoreWarnings([
    'Remote debugger is in a background tab which may cause apps to perform slowly',
    'Require cycle: node_modules/rn-fetch-blob/index.js',
    'Require cycle: node_modules/react-native/Libraries/Network/fetch.js',
]);

enableScreens();

/**
 * Top-level app component
 */
export const Application = (): JSX.Element => {
    const AppNavigator = require('./src/screens/AppNavigator').default;

    useEffect(() => {
        if (DeviceInfo.getDeviceType() === 'Handset') {
            Orientation.lockToPortrait();
        } else if (DeviceInfo.getDeviceType() === 'Tablet') {
            Orientation.unlockAllOrientations();
        }
        Crashes.setEnabled(true);
        // Configure Kochava

        var configMapObject: any = {};
        if (__DEV__) {
            configMapObject[KochavaTracker.PARAM_LOG_LEVEL_ENUM_KEY] = KochavaTracker.LOG_LEVEL_ENUM_TRACE_VALUE;
        } else {
            configMapObject[KochavaTracker.PARAM_LOG_LEVEL_ENUM_KEY] = KochavaTracker.LOG_LEVEL_ENUM_INFO_VALUE;
        }
        configMapObject[KochavaTracker.PARAM_IOS_APP_GUID_STRING_KEY] = Config.KOCHAVA_IOS_APP_GUID;
        configMapObject[KochavaTracker.PARAM_APP_TRACKING_TRANSPARENCY_ENABLED_BOOL_KEY] = true;
        KochavaTracker.configure(configMapObject);
    }, []);

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
