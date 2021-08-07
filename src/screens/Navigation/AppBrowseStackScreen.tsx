import React, { useEffect } from 'react';
import { Animated, StyleSheet, Linking, Platform } from 'react-native';
import {
    createStackNavigator,
    StackCardStyleInterpolator,
    TransitionPresets,
    StackCardInterpolationProps,
    StackCardInterpolatedStyle,
} from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import {
    createBottomTabNavigator,
    BottomTabBar,
    BottomTabBarProps,
    BottomTabBarOptions,
} from '@react-navigation/bottom-tabs';
import { selectDeviceType } from 'qp-common-ui';
import { PlatformContextProvider } from 'platform/PlatformContextProvider';
import { CreditsContextProvider } from 'utils/CreditsContextProvider';
import { useAppState } from 'utils/AppContextProvider';
import { EntitlementsContextProvider } from 'contexts/EntitlementsContextProvider';
import { AppPreviewContextProvider } from 'contexts/AppPreviewContextProvider';
import { useLocalization } from 'contexts/LocalizationContext';
import { OnboardingContextProvider } from 'contexts/OnboardingContextProvider';
import { UserDataContextProvider } from 'contexts/UserDataContextProvider';
import { CastContextProvider } from 'utils/CastContextProvider';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import PlayerScreen from '../PlayerScreen';
import StorefrontScreen from '../StorefrontScreen';
import UsageScreen from '../UsageScreen';
import { NAVIGATION_TYPE } from './NavigationConstants';
import ModalScreen from '../ModalScreen';
import MyContentStackScreen from './MyContentStackScreen';
import SettingsStackScreen from './SettingsStackScreen';
import SearchStackScreen from './SearchStackScreen';
import ChannelStackScreen from './ChannelStackScreen';
import CreditsScreen from 'screens/CreditsScreen';
import DetailsScreen from 'screens/DetailsScreen';
import CollectionsDetailsScreen from 'screens/CollectionsDetailsScreen';
import CollectionsGridScreen from 'screens/CollectionsGridScreen';
import StorefrontViewallScreenTV from '../../TV/StorefrontViewallScreenTV';
import CreditsWalkthroughTV from '../../TV/CreditsWalkthroughTV';
import CreditsWalkthroughTVStep2 from '../../TV/CreditsWalkthroughTVStep2';
import CreditsWalkthroughTVEnd from '../../TV/CreditsWalkthroughTVEnd';
import { appFonts } from '../../../AppStyles';
import TabIconBrowseOn from '../../../assets/images/tab_on_browse.svg';
import TabIconMyContentOn from '../../../assets/images/tab_on_my_content.svg';
import TabIconUsageOn from '../../../assets/images/tab_on_my_usage.svg';
import TabIconSettingsOn from '../../../assets/images/tab_on_settings.svg';
import TabIconBrowseOff from '../../../assets/images/tab_off_browse.svg';
import TabIconMyContentOff from '../../../assets/images/tab_off_my_content.svg';
import TabIconUsageOff from '../../../assets/images/tab_off_my_usage.svg';
import TabIconSettingsOff from '../../../assets/images/tab_off_settings.svg';
import AuthStackScreen from './AuthStackScreen';
import { DownloadsContextProvider } from 'utils/DownloadsContextProvider';
import { CancelSubscriptionContextProvider } from 'contexts/CancelSubscriptionContextProvider';
import { useLinkTo } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BlurComponent from 'screens/components/BlurComponent';
import CreditsWalkthroughTVStep3 from '../../TV/CreditsWalkthroughTVStep3';

const { multiply } = Animated;

// Note: this is extracated from react-navigation's standard
// Modal interpolation style, with a custom `overlayStyle`
// We use this on iPad only.
function forVerticalIOS({
    current,
    inverted,
    layouts: { screen },
}: StackCardInterpolationProps): StackCardInterpolatedStyle {
    const translateY = multiply(
        current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [screen.height, 0],
            extrapolate: 'clamp',
        }),
        inverted,
    );

    return {
        cardStyle: {
            transform: [
                // Translation for the animation of the current card
                { translateY },
            ],
        },
        overlayStyle: {
            opacity: current.progress.interpolate({
                inputRange: [0, 1, 1.0001, 2],
                outputRange: [0, 0.4, 1, 1],
            }),
        },
    };
}

const cardStyleInterpolator: StackCardStyleInterpolator = ({ current: { progress } }) => {
    return {
        cardStyle: {
            opacity: progress.interpolate({
                inputRange: [0, 0.5, 0.9, 1],
                outputRange: [0, 0.25, 0.7, 1],
            }),
        },
        overlayStyle: {
            opacity: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
                extrapolate: 'clamp',
            }),
        },
    };
};

const BlurTab = (props: BottomTabBarProps<BottomTabBarOptions>) => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    return (
        <BlurComponent
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
            }}>
            <LinearGradient
                useAngle={true}
                angle={0}
                colors={[appColors.bottomNavGradientStart, appColors.bottomNavGradientEnd]}
                style={StyleSheet.absoluteFillObject}
                {...props}>
                {!Platform.isTV && <BottomTabBar {...props} />}
            </LinearGradient>
        </BlurComponent>
    );
};
/**
 * Tab configuration
 */
const AppTabs = createBottomTabNavigator();
const AppTabsScreen = () => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const { strings } = useLocalization();
    const { routeToDownloads } = useAppState();
    const initialRouteName = (routeToDownloads && strings['tabs.my_content']) || undefined;

    return (
        <AppTabs.Navigator
            initialRouteName={initialRouteName}
            tabBar={props => <BlurTab {...props} />}
            tabBarOptions={{
                iconStyle: {
                    marginTop: selectDeviceType({ Handset: 5 }, undefined),
                },
                labelStyle: {
                    fontFamily: appFonts.primary,
                    fontSize: appFonts.xxs,
                    marginBottom: 3,
                },
                safeAreaInsets: {},
                style: {
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                },
                inactiveTintColor: appColors.tertiary,
            }}>
            <AppTabs.Screen
                name={strings['tabs.browse']}
                component={StorefrontScreen}
                options={{
                    tabBarIcon: props =>
                        props.focused ? (
                            <TabIconBrowseOn width={props.size} height={props.size} fill={props.color} />
                        ) : (
                            <TabIconBrowseOff width={props.size} height={props.size} fill={props.color} />
                        ),
                    tabBarVisible: Platform.isTV ? false : true,
                }}
            />
            <AppTabs.Screen
                name={strings['tabs.my_content']}
                component={MyContentStackScreen}
                initialParams={{
                    routeToDownloads: routeToDownloads,
                }}
                options={{
                    tabBarVisible: Platform.isTV ? false : true,
                    tabBarIcon: props =>
                        props.focused ? (
                            <TabIconMyContentOn width={props.size} height={props.size} fill={props.color} />
                        ) : (
                            <TabIconMyContentOff width={props.size} height={props.size} fill={props.color} />
                        ),
                }}
            />
            <AppTabs.Screen
                name={strings['tabs.usage']}
                component={UsageScreen}
                options={{
                    tabBarIcon: props =>
                        props.focused ? (
                            <TabIconUsageOn width={props.size} height={props.size} fill={props.color} />
                        ) : (
                            <TabIconUsageOff width={props.size} height={props.size} fill={props.color} />
                        ),
                }}
            />
            <AppTabs.Screen
                name={strings['tabs.settings']}
                component={SettingsStackScreen}
                options={{
                    tabBarIcon: props =>
                        props.focused ? (
                            <TabIconSettingsOn width={props.size} height={props.size} fill={props.color} />
                        ) : (
                            <TabIconSettingsOff width={props.size} height={props.size} fill={props.color} />
                        ),
                    tabBarVisible: !Platform.isTV,
                }}
            />
            {/* {Platform.isTV && Platform.OS == 'ios' && (
                <AppTabs.Screen
                    name={'Search'}
                    component={SearchStackScreen}
                    options={{
                        tabBarVisible: Platform.isTV ? false : true,
                        tabBarIcon: props =>
                            props.focused ? (
                                <TabIconSettingsOn width={props.size} height={props.size} fill={props.color} />
                            ) : (
                                <TabIconSettingsOff width={props.size} height={props.size} fill={props.color} />
                            ),
                    }}
                />
            )} */}
            {Platform.isTV && (
                <AppTabs.Screen
                    name={'Search'}
                    component={SearchStackScreen}
                    options={{
                        tabBarVisible: Platform.isTV ? false : true,
                        tabBarIcon: props =>
                            props.focused ? (
                                <TabIconSettingsOn width={props.size} height={props.size} fill={props.color} />
                            ) : (
                                <TabIconSettingsOff width={props.size} height={props.size} fill={props.color} />
                            ),
                    }}
                />
            )}

            {
                <AppTabs.Screen
                    name={'Channel'}
                    component={ChannelStackScreen}
                    options={{
                        tabBarVisible: Platform.isTV ? false : true,
                        tabBarIcon: props =>
                            props.focused ? (
                                <TabIconSettingsOn width={props.size} height={props.size} fill={props.color} />
                            ) : (
                                <TabIconSettingsOff width={props.size} height={props.size} fill={props.color} />
                            ),
                    }}
                />
            }
        </AppTabs.Navigator>
    );
};

/**
 * iOS uses `ModalPresentationIOS` preset to get iOS 13 style modal presentation
 *
 * iPad uses `ModalSlideFromBottomIOS` with a custom card interpolation style
 * to get the overlay fadein effect
 */
const overlayScreenOptions = {
    cardStyle: {
        backgroundColor: selectDeviceType({ Handset: 'transparent' }, 'transparent'),
    },
    // ...selectDeviceType({ Handset: TransitionPresets.ModalPresentationIOS }, TransitionPresets.ModalSlideFromBottomIOS),
    ...TransitionPresets.ModalSlideFromBottomIOS,
    ...selectDeviceType<any>({ Handset: {} }, { cardStyleInterpolator: forVerticalIOS }),
    gestureEnabled: true,
    cardOverlayEnabled: true,
    animationEnabled: true,
};

/**
 * AppBrowseStack sets up the full tab bar navigator with all the app screens,
 * which is intended to be displayed for a subscribed user.
 */
const AppBrowseStack = createStackNavigator();
const AppBrowseStackScreen = () => {
    const linkTo = useLinkTo();

    useEffect(() => {
        // get notification deeplink url from AsyncStorage
        const getDLink = async () => {
            const linking = await AsyncStorage.getItem('deeplink');
            if (linking) {
                AsyncStorage.setItem('deeplink', '');
                linkTo(linking.replace('struum://app', ''));
            }
        };
        getDLink();
        handleInitState();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Need to handle the deeplinking initial URL
    const handleInitState = async () => {
        // handle initial url
        const linking = await Linking.getInitialURL();
        if (linking) {
            linkTo(linking.replace('struum://app', ''));
        }
    };

    return (
        <CancelSubscriptionContextProvider>
            <EntitlementsContextProvider>
                <PlatformContextProvider>
                    <CreditsContextProvider>
                        <OnboardingContextProvider>
                            <CastContextProvider>
                                <DownloadsContextProvider>
                                    <UserDataContextProvider>
                                        <AppBrowseStack.Navigator
                                            headerMode="none"
                                            screenOptions={{
                                                animationEnabled: false,
                                            }}
                                            mode="modal">
                                            <AppBrowseStack.Screen name="AppTabsScreen" component={AppTabsScreen} />
                                            {!Platform.isTV && (
                                                <AppBrowseStack.Screen
                                                    name="Search"
                                                    component={SearchStackScreen}
                                                    options={overlayScreenOptions}
                                                />
                                            )}
                                            <AppBrowseStack.Screen
                                                name="Credits"
                                                component={CreditsScreen}
                                                options={overlayScreenOptions}
                                            />
                                            <AppBrowseStack.Screen
                                                name="Alert"
                                                component={ModalScreen}
                                                options={{
                                                    animationEnabled: true,
                                                    cardStyle: { backgroundColor: 'rgba(0, 0, 0, 0.15)' },
                                                    cardOverlayEnabled: true,
                                                    cardStyleInterpolator: cardStyleInterpolator,
                                                }}
                                            />
                                            <AppBrowseStack.Screen
                                                name={NAVIGATION_TYPE.COLLECTIONS}
                                                component={CollectionsDetailsScreen}
                                                options={overlayScreenOptions}
                                            />
                                            <AppBrowseStack.Screen
                                                name={NAVIGATION_TYPE.COLLECTIONS_GRID}
                                                component={CollectionsGridScreen}
                                                options={overlayScreenOptions}
                                            />
                                            <AppBrowseStack.Screen
                                                name={NAVIGATION_TYPE.STOREFRONT_VIEWALL_TV}
                                                component={StorefrontViewallScreenTV}
                                                options={overlayScreenOptions}
                                            />
                                            <AppBrowseStack.Screen
                                                name={NAVIGATION_TYPE.CREDITS_WALKTHROUGH}
                                                component={CreditsWalkthroughTV}
                                                options={overlayScreenOptions}
                                            />
                                            <AppBrowseStack.Screen
                                                name={NAVIGATION_TYPE.CREDITS_WALKTHROUGH_STEP_2}
                                                component={CreditsWalkthroughTVStep2}
                                                options={overlayScreenOptions}
                                            />
                                            <AppBrowseStack.Screen
                                                name={NAVIGATION_TYPE.CREDITS_WALKTHROUGH_STEP_3}
                                                component={CreditsWalkthroughTVStep3}
                                                options={overlayScreenOptions}
                                            />
                                            <AppBrowseStack.Screen
                                                name={NAVIGATION_TYPE.CREDITS_WALKTHROUGH_END}
                                                component={CreditsWalkthroughTVEnd}
                                                options={overlayScreenOptions}
                                            />
                                            <AppBrowseStack.Screen
                                                name={NAVIGATION_TYPE.CONTENT_DETAILS}
                                                component={DetailsScreen}
                                                options={overlayScreenOptions}
                                            />
                                            <AppBrowseStack.Screen
                                                name="Player"
                                                component={PlayerScreen}
                                                options={{
                                                    headerShown: false,
                                                }}
                                            />
                                        </AppBrowseStack.Navigator>
                                    </UserDataContextProvider>
                                </DownloadsContextProvider>
                            </CastContextProvider>
                        </OnboardingContextProvider>
                    </CreditsContextProvider>
                </PlatformContextProvider>
            </EntitlementsContextProvider>
        </CancelSubscriptionContextProvider>
    );
};

/**
 * AppPreviewStack sets up the Content Browse stack, which is displayed when a non-logged-in selects
 * Preview App option. Since we do not allow Playback in this mode, we do not wrap this stack within
 * `PlatformContextProvider`
 */
const AppPreviewStack = createStackNavigator();
export const AppPreviewStackScreen = () => {
    return (
        <CreditsContextProvider>
            <AppPreviewContextProvider>
                <AppPreviewStack.Navigator
                    headerMode="none"
                    screenOptions={{
                        animationEnabled: false,
                    }}
                    mode="modal">
                    <AppPreviewStack.Screen name="BrowseStackScreen" component={StorefrontScreen} />
                    <AppPreviewStack.Screen
                        name="Search"
                        component={SearchStackScreen}
                        //options={overlayScreenOptions}
                    />
                    <AppPreviewStack.Screen
                        name="Channel"
                        component={ChannelStackScreen}
                        //options={overlayScreenOptions}
                    />

                    <AppPreviewStack.Screen
                        name={NAVIGATION_TYPE.COLLECTIONS}
                        component={CollectionsDetailsScreen}
                        options={overlayScreenOptions}
                    />
                    <AppPreviewStack.Screen
                        name={NAVIGATION_TYPE.COLLECTIONS_GRID}
                        component={CollectionsGridScreen}
                        options={overlayScreenOptions}
                    />
                    <AppPreviewStack.Screen
                        name={NAVIGATION_TYPE.CONTENT_DETAILS}
                        component={DetailsScreen}
                        options={overlayScreenOptions}
                    />
                    <AppBrowseStack.Screen
                        name="AuthHome"
                        component={AuthStackScreen}
                        options={{ animationEnabled: true }}
                    />
                </AppPreviewStack.Navigator>
            </AppPreviewContextProvider>
        </CreditsContextProvider>
    );
};

export default AppBrowseStackScreen;
