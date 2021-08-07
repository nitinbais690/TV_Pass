import React, { useEffect } from 'react';
// Importing here to fix race condition bug;
// see details here: https://github.com/kmagiera/react-native-gesture-handler/issues/320#issuecomment-443815828
import 'react-native-gesture-handler';
import DeviceInfo from 'react-native-device-info';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
import { enableScreens } from 'react-native-screens';
import { AppPreferencesProvider } from './src/utils/AppPreferencesContext';
import { AppContextProvider } from './src/utils/AppContextProvider';
import { LocalizationProvider } from './src/contexts/LocalizationContext';
import { AuthContextProvider } from './src/contexts/AuthContextProvider';
import { NetworkContextProvider } from './src/contexts/NetworkContextProvider';
import { AnalyticsContextProvider } from 'utils/AnalyticsReporterContext';
import { TimerContextProvider } from 'utils/TimerContext';
import { AlertContextProvider } from 'contexts/AlertContext';
import { GeoDataContextProvider } from 'contexts/GeoDataProviderContext';
import { MenuProvider } from 'react-native-popup-menu';
import { DownloadSettingsProvider } from 'features/downloads/presentation/contexts/DownloadSettingsContext';

// Temp-fix: https://github.com/joltup/rn-fetch-blob/issues/183
// We should look for a long-term solution when working on Downloads, while is currently using
// `rn-fetch-blob` module for caching the images offline.

LogBox.ignoreLogs([
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
        if (DeviceInfo.getDeviceType() === 'Handset' || DeviceInfo.getDeviceType() === 'Tablet') {
            Orientation.lockToPortrait();
        }
    }, []);

    return (
        <TimerContextProvider>
            <SafeAreaProvider>
                <NetworkContextProvider>
                    <AppPreferencesProvider>
                        <LocalizationProvider>
                            <AuthContextProvider>
                                <AppContextProvider>
                                    <GeoDataContextProvider>
                                        <AnalyticsContextProvider>
                                            <AlertContextProvider>
                                                <DownloadSettingsProvider>
                                                    <MenuProvider>
                                                        <AppNavigator />
                                                    </MenuProvider>
                                                </DownloadSettingsProvider>
                                            </AlertContextProvider>
                                        </AnalyticsContextProvider>
                                    </GeoDataContextProvider>
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
