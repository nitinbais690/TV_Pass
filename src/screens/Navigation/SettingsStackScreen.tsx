import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileScreen } from '../settings/Profile';
import { PreferencesScreen } from '../settings/Preference';
import { BillingPaymentsScreen } from '../settings/BillingPayments';
import { ManageDevices } from '../settings/ManageDevices';
import { headerStyle } from '../../styles/Common.style';
import { useLocalization } from 'contexts/LocalizationContext';
import { NAVIGATION_TYPE } from './NavigationConstants';
import { LanguagePreferenceScreen } from 'screens/settings/LanguagePreference';
import { userProfileScreen } from 'screens/settings/userProfileScreen';
import MenuScreen from 'features/menu/presentation/screens/MenuScreen';
import SettingsScreen from 'features/settings/presentation/screens/SettingsScreen';
import ManageProfileScreen from 'features/profile/presentation/ManageProfile/screens';

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
                cardStyle: {
                    backgroundColor: 'transparent',
                },
                headerTransparent: true,
                headerShown: !Platform.isTV,
            }}>
            <SettingsStack.Screen
                name={NAVIGATION_TYPE.SETTINGS}
                component={SettingsScreen}
                options={{
                    headerShown: false,
                }}
            />
            <SettingsStack.Screen name={NAVIGATION_TYPE.MENU} component={MenuScreen} />

            <SettingsStack.Screen
                name={NAVIGATION_TYPE.PROFILE}
                component={ProfileScreen}
                options={{
                    title: strings['settingsScreenKey.Profile'],
                }}
            />
            <SettingsStack.Screen
                name={NAVIGATION_TYPE.USER_PROFILE}
                component={ManageProfileScreen}
                options={{
                    title: strings['settingsScreenKey.User_Profile'],
                    headerShown: false,
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
                name={NAVIGATION_TYPE.LANGUAGE_PREFERENCES}
                component={LanguagePreferenceScreen}
                options={{
                    title: strings['settingsScreenKey.LanguagePreferences'],
                }}
            />
            <SettingsStack.Screen
                name={NAVIGATION_TYPE.PROFILE_SELECTION}
                component={userProfileScreen}
                options={{
                    title: strings['settingsScreenKey.SelectUser'],
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
        </SettingsStack.Navigator>
    );
};

export default SettingsStackScreen;
