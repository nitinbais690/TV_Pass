import React, { useRef } from 'react';
import { StatusBar, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useAppState, AppNavigationState } from 'utils/AppContextProvider';
import SplashScreen from './SplashScreen';
import AuthStackScreen from './Navigation/AuthStackScreen';
import RegionLockScreen from './Errors/RegionLockScreen';
import OfflineScreen from './Errors/OfflineScreen';
import AppBrowseStackScreen, { AppPreviewStackScreen } from './Navigation/AppBrowseStackScreen';
import SubscriptionStackScreen from './Navigation/SubscriptionStackScreen';
import { AppEvents, condenseScreenTrackingData, RN_INTERACTION, ScreenTabs } from 'utils/ReportingUtils';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { navigationRef } from 'utils/RootNavigation';
// Application Top-level Navigation Structure
// ------------------------------------------
//     ┌─────────┐
// ┌───│RootStack│
// │   └─────────┘
// │        │
// │         ─ ─ ─ ─ ── (one of) ─ ─ ─ ┐
// │        │             │            │
// │        ▼             ▼            ▼
// │  ┌ ─ ─ ─ ─ ─ ┐ ┌ ─ ─ ─ ─ ─ ┐ ┌ ─ ─ ─ ─ ┐
// │   SplashStack   AppTabStack   AuthStack
// │  └ ─ ─ ─ ─ ─ ┘ └ ─ ─ ─ ─ ─ ┘ └ ─ ─ ─ ─ ┘
// │                      │
// │  ┌─────────────┐     │  ┌────────────┐
// ├─▶│SettingsStack│     ├─▶│BrowseStack │
// │  └─────────────┘     │  └────────────┘
// │  ┌───────────┐       │  ┌──────────────┐
// ├─▶│SearchStack│       ├─▶│MyContentStack│
// │  └───────────┘       │  └──────────────┘
// │  ┌────────────┐      │  ┌──────────┐
// └─▶│CreditsStack│      └─▶│UsageStack│
//    └────────────┘         └──────────┘
//
const RootStack = createStackNavigator();
const RootStackScreen = () => {
    const { appNavigationState } = useAppState();

    console.debug('[appNavigationState] >>> ', appNavigationState);

    const screenForAppState = (appState: AppNavigationState) => {
        switch (appState) {
            case 'INIT':
                return <RootStack.Screen name="Loading" component={SplashScreen} />;
            case 'PURCHASE_SUBSCRIPTION':
                return <RootStack.Screen name="Subscription" component={SubscriptionStackScreen} />;
            case 'REGION_LOCK':
                return <RootStack.Screen name="RegionLock" component={RegionLockScreen} />;
            case 'OFFLINE':
                return <RootStack.Screen name="Offline" component={OfflineScreen} />;
            case 'PREVIEW_APP':
                return <RootStack.Screen name="AppPreviewStackScreen" component={AppPreviewStackScreen} />;
            case 'AUTH':
                return <RootStack.Screen name="AuthStackScreen" component={AuthStackScreen} />;
            case 'BROWSE_APP':
                return <RootStack.Screen name="AppBrowseStackScreen" component={AppBrowseStackScreen} />;
        }
    };

    return (
        <RootStack.Navigator
            headerMode="none"
            screenOptions={{
                animationEnabled: false,
            }}
            mode="modal">
            {/*
             * Load Stack based on AppNavigationState
             */}
            {screenForAppState(appNavigationState)}
        </RootStack.Navigator>
    );
};

/**
 * Sets up the applications main navigator either as a nested tab structure or a single-level tab controller.
 *
 * Currently, the single-level tab controller is preferred on TV screens and the nested tabs are used on mobile.
 */
export default () => {
    const prefs = useAppPreferencesState();
    const { appTheme, useDefaultStyle } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    let routeNameRef = useRef<string | null>(null);
    // let navigationRef = useRef<NavigationContainerRef | null>(null);
    const { recordEvent } = useAnalytics();

    // Theming is managed via Standard React-Navigation APIs
    // See here for more details: https://reactnavigation.org/docs/themes
    const AppNavigationTheme: Theme = {
        ...DefaultTheme,
        dark: !useDefaultStyle || true,
        colors: {
            ...DefaultTheme.colors,
            primary: appColors.secondary,
            background: appColors.primary,
            card: appColors.primary,
            text: appColors.secondary,
            border: appColors.border,
        },
    };

    const onRouteChange = async (from: string | null, to: string | null) => {
        console.debug(`[Navigation] from: (${from}) -> to: (${to})`);
    };

    const config = {
        screens: {
            AppBrowseStackScreen: {
                screens: {
                    AppTabsScreen: {
                        screens: {
                            Browse: 'browse/:tabIndex',
                            'My Collection': {
                                screens: {
                                    MyContent: 'mycontent/:type',
                                },
                            },
                            Usage: 'usage',
                            Settings: {
                                initialRouteName: 'Settings',
                                screens: {
                                    Settings: 'settings',
                                    Profile: 'settings/profile',
                                    Preferences: 'settings/preferences',
                                    ManageDevices: 'settings/manageDevices',
                                    BillingPayments: 'settings/billingPayments',
                                    Help: 'settings/help',
                                    BrowseWebView: 'info/:type',
                                },
                            },
                        },
                    },
                    Details: 'details/:resourceType/:resourceId',
                    CollectionsGrid: 'collections/:title/:resourceId',
                    Credits: 'credits',
                    Search: {
                        screens: {
                            Search: 'search',
                        },
                    },
                },
            },
        },
    };

    const linking = {
        prefixes: [
            'https://struum.com',
            'https://tvp-web-ui.api.tvpass.firstlight.ai',
            'https://tvp-web-ui.fl-tvpass.firstlight.ai',
            'struum://app',
        ],
        config,
    };

    return (
        <NavigationContainer
            linking={linking}
            theme={AppNavigationTheme}
            ref={navigationRef}
            onReady={() => {
                if (navigationRef.current !== null) {
                    routeNameRef.current = (navigationRef.current as any).getCurrentRoute().name;
                }
            }}
            onStateChange={() => {
                // TODO: this implementation has to be tweaked to identify tab changes, identify same route navigation (Details -> Details)
                const previousRouteName = routeNameRef.current;
                const currentRouteName = (navigationRef.current as any).getCurrentRoute().name;
                if (previousRouteName !== currentRouteName) {
                    onRouteChange(previousRouteName, currentRouteName);
                    recordEvent(
                        RN_INTERACTION.RECORD_INTERACTION,
                        condenseScreenTrackingData(currentRouteName, previousRouteName),
                    );
                }
                if (
                    Object.values(ScreenTabs).includes(currentRouteName) &&
                    Object.values(ScreenTabs).includes(previousRouteName)
                ) {
                    recordEvent(
                        AppEvents.MENU_TAB_CHANGE,
                        condenseScreenTrackingData(currentRouteName, previousRouteName),
                    );
                }
                // Save the current route name for later comparision
                routeNameRef.current = currentRouteName;
            }}>
            <>
                {!Platform.isTV && (
                    <StatusBar
                        barStyle={useDefaultStyle ? 'dark-content' : 'light-content'}
                        translucent={Platform.OS === 'ios'}
                        hidden={Platform.OS === 'android'}
                    />
                )}
                <RootStackScreen />
            </>
        </NavigationContainer>
    );
};
