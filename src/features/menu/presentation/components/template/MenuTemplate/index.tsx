import { useAuth } from 'contexts/AuthContextProvider';
import { useProfiles } from 'contexts/ProfilesContextProvider';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';
import React, { useState } from 'react';
import { View, StatusBar } from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { MenuFooterView } from '../../molecules/MenuFooterView';
import MenuHeaderView from '../../molecules/MenuHeaderView';
import MenuList from '../../molecules/MenuList';
import { ProfileListView } from '../../molecules/ProfileListView';
import { MenuTemplateStyle } from './style';
import { CommonActions } from '@react-navigation/native';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { openLink } from 'utils/InAppBrowserUtils';
import { ErrorEvents } from 'utils/ReportingUtils';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';

export default function MenuTemplate({ navigation }: { navigation: any }) {
    const { userType, logout } = useAuth();
    const isLoggedIn = userType === 'LOGGED_IN' || userType === 'SUBSCRIBED';
    const appPref = useAppPreferencesState();
    const { appTheme, appConfig } = appPref;
    let { appColors } = appTheme && appTheme(appPref);
    const { profiles, cleanupProfiles } = useProfiles();
    const { recordErrorEvent } = useAnalytics();
    const style = MenuTemplateStyle();

    const [isLoading, setIsLoading] = useState(false);

    const openBrowser = async (url: string) => {
        try {
            await openLink(url, appColors);
        } catch (error) {
            recordErrorEvent(ErrorEvents.BROWSE_ERROR, { error: error, url: url });
            console.log(`[InAppBrowser] Error loading url: ${url}`, error);
        }
    };

    const navigateToHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [{ name: NAVIGATION_TYPE.APP_TABS }],
            }),
        );
    };

    const handlePress = (screen: string) => {
        if (screen === NAVIGATION_TYPE.TERMS_CONDITIONS) {
            openBrowser(appConfig && appConfig.termsAndConditionsURL);
        } else if (screen === NAVIGATION_TYPE.HELP) {
            openBrowser(appConfig && appConfig.helpCenterURL);
        } else if (screen === NAVIGATION_TYPE.LOGOUT) {
            setIsLoading(true);
            logout()
                .then(() => cleanupProfiles())
                .then(() => {
                    setIsLoading(false);
                    navigateToHome();
                });
        } else if (screen === NAVIGATION_TYPE.MENU_SETTINGS) {
            navigation.navigate(NAVIGATION_TYPE.SETTINGS);
        }
    };

    return (
        <BackgroundGradient insetTabBar={false}>
            <StatusBar translucent backgroundColor={appColors.transparent} />
            <View style={style.mainContainer}>
                <View style={style.headerContainer}>
                    <MenuHeaderView
                        showTitle={!isLoggedIn}
                        closeBtnAction={() => {
                            navigation.goBack();
                        }}
                    />
                    {isLoggedIn && <ProfileListView profiles={profiles} />}
                    <MenuList onPress={handlePress} />
                </View>
                <View style={style.footerContainer}>
                    <MenuFooterView />
                </View>
            </View>
            {isLoading && <AppLoadingIndicator style={style.loaderStyle} />}
        </BackgroundGradient>
    );
}
