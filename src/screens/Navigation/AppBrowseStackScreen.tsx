import React from 'react';
import { Animated, Platform } from 'react-native';
import {
    createStackNavigator,
    StackCardStyleInterpolator,
    TransitionPresets,
    StackCardInterpolationProps,
    StackCardInterpolatedStyle,
} from '@react-navigation/stack';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { selectDeviceType } from 'qp-common-ui';
import { PlatformContextProvider } from 'platform/PlatformContextProvider';
import { CreditsContextProvider } from 'utils/CreditsContextProvider';
import { EntitlementsContextProvider } from 'contexts/EntitlementsContextProvider';
import { AppPreviewContextProvider } from 'contexts/AppPreviewContextProvider';
import { UserDataContextProvider } from 'contexts/UserDataContextProvider';
import { ProfilesContextProvider, useProfiles } from 'contexts/ProfilesContextProvider';

import PlayerScreen from '../../features/player/presentation/screen/PlayerScreen';
import StorefrontScreen from '../StorefrontScreen';
import StorefrontTVScreen from '../StorefrontTVScreen';
import { NAVIGATION_TYPE } from './NavigationConstants';
import ModalScreen from '../ModalScreen';
import SettingsStackScreen from './SettingsStackScreen';
import SearchStackScreen from './SearchStackScreen';
import CreditsScreen from 'screens/CreditsScreen';
import DetailsScreen from 'screens/DetailsScreen';
import CollectionsDetailsScreen from 'screens/CollectionsDetailsScreen';
import CollectionsGridScreen from 'features/discovery/presentation/screens/CollectionGridScreen';

import AuthStackScreen from './AuthStackScreen';
import { DownloadsContextProvider } from 'utils/DownloadsContextProvider';
import DiscoveryTabsScreen from 'features/discovery/presentation/screens/DiscoveryTabsScreen';
import MarketingOnboardScreen from 'features/onboarding/presentation/screens/MarketingOnboardScreen';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import LanguageSelectionScreen from 'features/language-selection/presentation/screens/LanguageSelectionScreen';
import { APP_LANGUAGE_CONSTANTS } from 'features/language-selection/utils/app-language-constants';
import ProfileSelectionScreen from 'features/profile/presentation/profile-selection/screens';
import ManageProfileScreen from 'features/profile/presentation/ManageProfile/screens';
import AddOrEditProfileScreen from 'features/profile/presentation/AddOrEditProfile/screens';
import SwitchLanguageScreen from 'features/language-selection/presentation/screens/SwitchLanguageScreen';
import DownloadsStackScreen from './DownloadsStackScreen';

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
    ...(Platform.OS === 'android'
        ? TransitionPresets.ScaleFromCenterAndroid
        : TransitionPresets.ModalSlideFromBottomIOS),
    ...selectDeviceType<any>({ Handset: {}, Tv: {} }, { cardStyleInterpolator: forVerticalIOS }),
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
    const { onBoardingStatus } = useAppPreferencesState();
    const { loading, activeProfile } = useProfiles();
    return (
        <ProfilesContextProvider>
            <EntitlementsContextProvider>
                <PlatformContextProvider>
                    <DownloadsContextProvider>
                        <UserDataContextProvider>
                            <AppBrowseStack.Navigator
                                headerMode="none"
                                screenOptions={{
                                    animationEnabled: false,
                                }}
                                mode="modal">
                                {!onBoardingStatus && (
                                    <AppBrowseStack.Screen
                                        name={NAVIGATION_TYPE.CONTENT_LANGUAGE_SELECTION}
                                        component={LanguageSelectionScreen}
                                        initialParams={{ screenType: APP_LANGUAGE_CONSTANTS.CONTENT_LANGUAGE_SCREEN }}
                                    />
                                )}

                                {!loading && !activeProfile && (
                                    <AppBrowseStack.Screen
                                        name={NAVIGATION_TYPE.PROFILE_SELECTION}
                                        component={ProfileSelectionScreen}
                                    />
                                )}

                                <AppBrowseStack.Screen
                                    name="AppTabsScreen"
                                    component={Platform.isTV ? StorefrontTVScreen : DiscoveryTabsScreen}
                                />
                                <AppBrowseStack.Screen
                                    name="Search"
                                    component={SearchStackScreen}
                                    options={overlayScreenOptions}
                                />
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
                                    name={NAVIGATION_TYPE.CONTENT_DETAILS}
                                    component={DetailsScreen}
                                    options={overlayScreenOptions}
                                />
                                <AppBrowseStack.Screen
                                    name={NAVIGATION_TYPE.PLAYER}
                                    component={PlayerScreen}
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <AppBrowseStack.Screen
                                    name="SignIn"
                                    component={AuthStackScreen}
                                    options={{ animationEnabled: true }}
                                />
                                <AppBrowseStack.Screen
                                    name={NAVIGATION_TYPE.SETTINGS}
                                    component={SettingsStackScreen}
                                    options={{
                                        cardStyle: { backgroundColor: 'transparent' },
                                        cardStyleInterpolator: cardStyleInterpolator,
                                    }}
                                />

                                <AppBrowseStack.Screen
                                    name={NAVIGATION_TYPE.MARKETING_ONBOARD}
                                    component={MarketingOnboardScreen}
                                />

                                <AppBrowseStack.Screen
                                    name={NAVIGATION_TYPE.MANAGE_PROFILE}
                                    component={ManageProfileScreen}
                                />

                                <AppBrowseStack.Screen
                                    name={NAVIGATION_TYPE.EDIT_PROFILE}
                                    component={AddOrEditProfileScreen}
                                />

                                <AppBrowseStack.Screen
                                    name={NAVIGATION_TYPE.SWITCH_LANGUAGE}
                                    component={SwitchLanguageScreen}
                                />

                                <AppBrowseStack.Screen
                                    name={NAVIGATION_TYPE.DOWNLOADS}
                                    component={DownloadsStackScreen}
                                />
                            </AppBrowseStack.Navigator>
                        </UserDataContextProvider>
                    </DownloadsContextProvider>
                </PlatformContextProvider>
            </EntitlementsContextProvider>
        </ProfilesContextProvider>
    );
};

const AppTVBrowseStack = createNativeStackNavigator();
const AppTVBrowseStackScreen = () => {
    const { onBoardingStatus } = useAppPreferencesState();
    return (
        <EntitlementsContextProvider>
            <PlatformContextProvider>
                <ProfilesContextProvider>
                    <DownloadsContextProvider>
                        <UserDataContextProvider>
                            <AppTVBrowseStack.Navigator
                                screenOptions={{
                                    headerShown: false,
                                    stackPresentation: 'fullScreenModal',
                                }}>
                                {!onBoardingStatus && (
                                    <AppTVBrowseStack.Screen
                                        name={NAVIGATION_TYPE.CONTENT_LANGUAGE_SELECTION}
                                        component={LanguageSelectionScreen}
                                        initialParams={{ screenType: APP_LANGUAGE_CONSTANTS.CONTENT_LANGUAGE_SCREEN }}
                                    />
                                )}
                                <AppTVBrowseStack.Screen name="AppTabsScreen" component={StorefrontTVScreen} />
                                <AppTVBrowseStack.Screen
                                    name="Search"
                                    component={SearchStackScreen}
                                    options={overlayScreenOptions}
                                />
                                <AppTVBrowseStack.Screen
                                    name="Credits"
                                    component={CreditsScreen}
                                    options={overlayScreenOptions}
                                />
                                <AppTVBrowseStack.Screen name="Alert" component={ModalScreen} />
                                <AppTVBrowseStack.Screen
                                    name={NAVIGATION_TYPE.COLLECTIONS}
                                    component={CollectionsDetailsScreen}
                                />
                                <AppTVBrowseStack.Screen
                                    name={NAVIGATION_TYPE.COLLECTIONS_GRID}
                                    component={CollectionsGridScreen}
                                />
                                <AppTVBrowseStack.Screen
                                    name={NAVIGATION_TYPE.CONTENT_DETAILS}
                                    component={DetailsScreen}
                                />
                                <AppTVBrowseStack.Screen
                                    name={NAVIGATION_TYPE.PLAYER}
                                    component={PlayerScreen}
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <AppTVBrowseStack.Screen name="SignIn" component={AuthStackScreen} />
                                <AppTVBrowseStack.Screen
                                    name={NAVIGATION_TYPE.SETTINGS}
                                    component={SettingsStackScreen}
                                />
                            </AppTVBrowseStack.Navigator>
                        </UserDataContextProvider>
                    </DownloadsContextProvider>
                </ProfilesContextProvider>
            </PlatformContextProvider>
        </EntitlementsContextProvider>
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
                        options={overlayScreenOptions}
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

export default Platform.isTV ? AppTVBrowseStackScreen : AppBrowseStackScreen;
