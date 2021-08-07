import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../SettingsScreen';
import { UserProfile } from '../settings/UserProfile';
import { ProfileScreen } from '../settings/Profile';
import { PreferencesScreen } from '../settings/Preference';
import { BillingPaymentsScreen } from '../settings/BillingPayments';
import { ManageDevices } from '../settings/ManageDevices';
import { headerStyle } from '../../styles/Common.style';
import { useLocalization } from 'contexts/LocalizationContext';
import { NAVIGATION_TYPE } from './NavigationConstants';
import BrowseWebView from 'screens/components/BrowseWebView';
import HelpScreen from 'screens/HelpScreen';
import { Platform } from 'react-native';
import SettingsTVScreen from 'screens/SettingsTvScreen';

const SettingsStack = createStackNavigator();
const SettingsStackScreen = () => {
    const { strings } = useLocalization();
    return (
        <SettingsStack.Navigator
            screenOptions={{
                headerTitleStyle: headerStyle().headerTitle,
                headerBackTitleVisible: false,
                headerStyle: {
                    backgroundColor: 'transparent',
                },
                headerTransparent: true,
                headerTitleAlign: 'center',
            }}>
            <SettingsStack.Screen
                name={NAVIGATION_TYPE.SETTINGS}
                component={Platform.isTV ? SettingsTVScreen : SettingsScreen}
                options={{ headerShown: !Platform.isTV }}
            />
            <SettingsStack.Screen
                name={NAVIGATION_TYPE.PROFILE}
                component={ProfileScreen}
                options={{
                    title: strings['settingsScreenKey.Profile'],
                }}
            />
            <SettingsStack.Screen
                name={NAVIGATION_TYPE.USER_PROFILE}
                component={UserProfile}
                options={{
                    title: strings['settingsScreenKey.User_Profile'],
                }}
            />
            <SettingsStack.Screen
                name={NAVIGATION_TYPE.PREFERENCES}
                component={PreferencesScreen}
                options={{
                    title: strings['settingsScreenKey.Preferences'],
                }}
            />
            <SettingsStack.Screen
                name={NAVIGATION_TYPE.BILLING_PAYMENTS}
                component={BillingPaymentsScreen}
                options={{
                    title: strings['settingsScreenKey.BillingPayments'],
                }}
            />
            <SettingsStack.Screen
                name={NAVIGATION_TYPE.MANAGE_DEVICES}
                component={ManageDevices}
                options={{
                    title: strings['settingsScreenKey.Manage_Devices'],
                }}
            />
            <SettingsStack.Screen
                name={NAVIGATION_TYPE.HELP}
                component={HelpScreen}
                options={{
                    title: strings['settingsScreenKey.Help'],
                }}
            />
            <SettingsStack.Screen
                name={NAVIGATION_TYPE.BROWSE_WEBVIEW}
                component={BrowseWebView}
                options={({ route }) => ({
                    headerTransparent: false,
                    headerStyle: { shadowColor: 'transparent' },
                    title: route.params && route.params.type ? strings['title.' + route.params.type] : '',
                })}
            />
        </SettingsStack.Navigator>
    );
};

export default SettingsStackScreen;
