import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Text, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import Config from 'react-native-config';
import { useDimensions } from '@react-native-community/hooks';
import { typography, padding, selectDeviceType } from 'qp-common-ui';
import { useAuth } from 'contexts/AuthContextProvider';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appPadding, appFonts } from '../../AppStyles';
import RightArrow from '../../assets/images/RightArrow.svg';
import SVGIcons from './Settingsicons';
import DeviceInfo from 'react-native-device-info';
import { useLocalization } from '../contexts/LocalizationContext';
import { useProfiles } from '../contexts/ProfilesContextProvider';
import { settingStyle } from '../styles/Settings.Style';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { AppEvents, ErrorEvents } from 'utils/ReportingUtils';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';
import { openLink } from 'utils/InAppBrowserUtils';
import { UserProfileView } from './settings/UserProfileView';
import { useNavigation } from '@react-navigation/native';

interface SettingsItemProps {
    type: any;
    key: string;
    [key: string]: any;
}
/**
 * A component to display the settings/preference screen.
 *
 * @param props The app preference props
 */
var isTVdevice = Platform.isTV;
const SettingsScreen = (): JSX.Element => {
    const { width, height } = useDimensions().window;
    const prefs = useAppPreferencesState();
    const { appTheme, appConfig } = prefs;
    const { strings } = useLocalization();
    const navigation = useNavigation();
    let { appColors } = appTheme && appTheme(prefs);
    const isPortrait = height > width;
    const settStyle = settingStyle({ appColors, isPortrait });
    const { recordEvent, recordErrorEvent } = useAnalytics();
    const { logout, userType, accessToken } = useAuth();
    const defaultStyles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
        },
        rowWrapperStyle: {
            height: selectDeviceType({ Handset: 70 }, 100),
            backgroundColor: 'transparent',
            borderColor: appColors.border,
            paddingHorizontal: appPadding.sm(true),
        },
        separator: {
            marginVertical: padding.xs(),
            borderBottomColor: appColors.overlayText,
            borderBottomWidth: 1,
        },
        adaptiveWrapper: {
            flexDirection: !isTVdevice ? 'column' : 'row',
            justifyContent: !isTVdevice ? 'center' : 'space-between',
        },
        memberHeading: {
            color: appColors.secondary,
            fontSize: appFonts.md,
            marginBottom: appPadding.sm(),
            marginTop: appPadding.xs(),
            marginLeft: appPadding.sm(),
        },
        loginButtonStyle: {
            width: 200,
            borderRadius: 5,
            backgroundColor: appColors.brandTint,
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexShrink: 0,
            overflow: 'hidden',
            alignSelf: 'center',
            marginBottom: appPadding.sm(),
        },
        profileInfoStyle: {
            ...typography.button,
            color: appColors.caption,
            margin: appPadding.sm(),
            justifyContent: 'center',
            alignSelf: 'center',
        },
        loginButtonTextStyle: {
            ...typography.button,
            color: appColors.overlayText,
            margin: appPadding.sm(),
            marginTop: appPadding.md(),
            marginBottom: appPadding.md(),
        },
        mainText: {
            color: appColors.secondary,
            fontFamily: appFonts.medium,
            fontSize: appFonts.xs,
        },
        sectionHeader: {
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
            color: appColors.secondary,
            padding: appPadding.sm(true),
            marginTop: appPadding.md(true),
            textTransform: 'uppercase',
        },
        switch: { marginRight: appPadding.xs() },
        listBottomPadding: {
            margin: Platform.isTV ? appPadding.sm(true) : 0,
        },
    });
    const isLoggedIn = userType === 'LOGGED_IN' || userType === 'SUBSCRIBED';

    const subscription: Array<SettingsItemProps> = [
        // {  type: 'ACTION_BUTTON', key: 'Preferences', screen: 'EnvScreen' },
        {
            type: 'ACTION_BUTTON',
            key: `${strings['settingsScreenKey.Preferences']}`,
            screen: NAVIGATION_TYPE.PREFERENCES,
        },
        // {
        //     type: 'ACTION_BUTTON',
        //     key: `${strings['settingsScreenKey.LanguagePreferences']}`,
        //     screen: NAVIGATION_TYPE.LANGUAGE_PREFERENCES,
        // },
        {
            type: 'ACTION_BUTTON',
            key: `${strings['settingsScreenKey.LanguagePreferences']}`,
            screen: NAVIGATION_TYPE.LANGUAGE_PREFERENCES,
        },
        // {
        //     type: 'ACTION_BUTTON',
        //     key: `${strings['settingsScreenKey.SelectUser']}`,
        //     screen: NAVIGATION_TYPE.PROFILE_SELECTION,
        // },
        {
            type: 'ACTION_BUTTON',
            key: `${strings['settingsScreenKey.BillingPayments']}`,
            screen: NAVIGATION_TYPE.BILLING_PAYMENTS,
        },
        // {
        //     type: 'ACTION_BUTTON',
        //     key: `${strings['settingsScreenKey.Profile']}`,
        //     screen: NAVIGATION_TYPE.PROFILE,
        // },
        {
            type: 'ACTION_BUTTON',
            key: `${strings['settingsScreenKey.Help']}`,
            screen: NAVIGATION_TYPE.HELP,
        },
        {
            type: 'ACTION_BUTTON',
            key: `${strings['settingsScreenKey.PrivacyPolicy']}`,
            screen: NAVIGATION_TYPE.PRIVACY_POLICY,
        },
        {
            type: 'ACTION_BUTTON',
            key: `${strings['settingsScreenKey.TermsCondition']}`,
            screen: NAVIGATION_TYPE.TERMS_CONDITIONS,
        },
        {
            type: 'ACTION_BUTTON',
            key: isLoggedIn ? `${strings['settingsScreenKey.Logout']}` : `${strings['settingsScreenKey.Login']}`,
            screen: isLoggedIn ? NAVIGATION_TYPE.LOGOUT : NAVIGATION_TYPE.AUTH_SIGN_IN,
        },
    ];

    const { loading, profiles } = useProfiles();

    const openBrowser = async (url: string) => {
        try {
            await openLink(url, appColors);
        } catch (error) {
            recordErrorEvent(ErrorEvents.BROWSE_ERROR, { error: error, url: url });
            console.log(`[InAppBrowser] Error loading url: ${url}`, error);
        }
    };

    const handlePress = (screen: string) => {
        if (screen === NAVIGATION_TYPE.LOGOUT) {
            logout().then(() => {
                recordEvent(AppEvents.LOGOUT);
            });
        } else if (screen === NAVIGATION_TYPE.PRIVACY_POLICY) {
            openBrowser(appConfig && appConfig.privacyPolicyURL);
        } else if (screen === NAVIGATION_TYPE.TERMS_CONDITIONS) {
            openBrowser(appConfig && appConfig.termsAndConditionsURL);
        } else if (screen === NAVIGATION_TYPE.HELP) {
            openBrowser(appConfig && appConfig.helpCenterURL);
        } else {
            if (screen === NAVIGATION_TYPE.AUTH_SIGN_IN) {
                navigation.navigate(screen);
            } else {
                navigation.navigate(NAVIGATION_TYPE.SETTINGS, { screen: screen });
            }
        }
    };

    const ListSection = ({ settings }: { sectionTitle: string; settings: Array<SettingsItemProps> }) => {
        return (
            <View>
                {settings.map((item, i) =>
                    !item.hide ? (
                        <ListItem
                            //ViewComponent={TouchableOpacity}
                            topDivider={i !== 0}
                            key={i}
                            underlayColor={appColors.primaryVariant1}
                            containerStyle={defaultStyles.rowWrapperStyle}
                            title={item.key}
                            disabled={item.disabled}
                            disabledStyle={{ opacity: 0.3 }}
                            titleStyle={defaultStyles.mainText}
                            leftIcon={<SVGIcons name={item.key} height="40" width="40" />}
                            rightIcon={item.key !== 'Sign out' ? <RightArrow /> : undefined}
                            onPress={({ eventKeyAction }) => {
                                if (!Platform.isTV) {
                                    handlePress(item.screen);
                                } else if (eventKeyAction === 1) {
                                    handlePress(item.screen);
                                }
                            }}
                            switch={
                                item.type === 'SWITCH'
                                    ? {
                                          value: item.value,
                                          onValueChange: () => item.toggle && item.toggle(),
                                      }
                                    : undefined
                            }
                        />
                    ) : (
                        undefined
                    ),
                )}
            </View>
        );
    };
    const readableVersion = DeviceInfo.getReadableVersion();
    const environment = Config.ENVIRONMENT === 'staging' ? `(${Config.ENVIRONMENT})` : '';
    const [isFocused, setIsFocused] = useState(false);
    useEffect(
        () =>
            navigation.addListener('focus', () => {
                setIsFocused(true);
            }),
        [navigation],
    );
    useEffect(
        () =>
            navigation.addListener('blur', () => {
                setIsFocused(false);
            }),
        [navigation],
    );

    const renderScreen = () => {
        return (
            <BackgroundGradient insetTabBar={true}>
                <View style={[defaultStyles.container, settStyle.mainContainer_mh, settStyle.mainContainer_mv]}>
                    <ScrollView style={defaultStyles.listBottomPadding}>
                        {!loading && profiles.length > 0 && (
                            <Text style={defaultStyles.memberHeading}>Select Member</Text>
                        )}
                        {!loading && accessToken && profiles.length > 0 && (
                            <UserProfileView navigation={navigation} horizontal={true} />
                        )}
                        <ListSection sectionTitle={'Subscription'} settings={subscription} />
                        <Text style={{ padding: appPadding.sm(true), color: appColors.tertiary }}>
                            {strings['settings.version']} {readableVersion} {environment}
                        </Text>
                    </ScrollView>
                </View>
            </BackgroundGradient>
        );
    };
    //Workaround to fix https://github.com/react-native-tvos/react-native-tvos/issues/114
    return isTVdevice ? isFocused ? renderScreen() : <View /> : renderScreen();
};

export default SettingsScreen;
