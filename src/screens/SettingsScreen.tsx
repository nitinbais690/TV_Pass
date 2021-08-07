import React from 'react';
import { View, StyleSheet, Platform, Text, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import Config from 'react-native-config';
import { useDimensions } from '@react-native-community/hooks';
import { typography, padding, selectDeviceType } from 'qp-common-ui';
import { useAuth } from 'contexts/AuthContextProvider';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appPadding, appFonts } from '../../AppStyles';
import RightArrow from '../../assets/images/RightArrow.svg';
import DeviceInfo from 'react-native-device-info';
import { useLocalization } from '../contexts/LocalizationContext';
import { useOnboarding } from 'contexts/OnboardingContext';
import { settingStyle } from '../styles/Settings.Style';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { AppEvents, ErrorEvents } from 'utils/ReportingUtils';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import Preference from '../../assets/images/Preferences.svg';
import BillingPayments from '../../assets/images/Billing_Payments.svg';
import Profile from '../../assets/images/Profile.svg';
import Help from '../../assets/images/Help.svg';
import PrivacyPolicy from '../../assets/images/Privacy.svg';
import TermsConditions from '../../assets/images/Terms_Conditions.svg';
import CreditWalkthrough from '../../assets/images/Credit_walkthrough.svg';
import Signout from '../../assets/images/Sign-out.svg';

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
const SettingsScreen = ({ navigation }: { navigation: any }): JSX.Element => {
    const { width, height } = useDimensions().window;
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    const { strings } = useLocalization();
    const { onboardNavigation } = useOnboarding();
    let { appColors } = appTheme && appTheme(prefs);
    const isPortrait = height > width;
    const settStyle = settingStyle({ appColors, isPortrait });
    const { recordEvent, recordErrorEvent } = useAnalytics();
    type BROWSE_TYPE = 'faq' | 'privacyPolicy' | 'termsCondition' | 'contentAvailability' | 'contact';

    const defaultStyles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
        },
        rowWrapperStyle: {
            height: selectDeviceType({ Handset: 70 }, 100),
            backgroundColor: appColors.backgroundInactive,
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
            width: Platform.isTV ? '40%' : '100%',
            alignSelf: 'center',
        },
    });

    const subscription: Array<SettingsItemProps> = [
        // {  type: 'ACTION_BUTTON', key: 'Preferences', screen: 'EnvScreen' },
        {
            type: 'ACTION_BUTTON',
            key: `${strings['settingsScreenKey.Preferences']}`,
            screen: NAVIGATION_TYPE.PREFERENCES,
            icon: <Preference />,
        },
        {
            type: 'ACTION_BUTTON',
            key: `${strings['settingsScreenKey.BillingPayments']}`,
            screen: NAVIGATION_TYPE.BILLING_PAYMENTS,
            icon: <BillingPayments />,
        },
        {
            type: 'ACTION_BUTTON',
            key: `${strings['settingsScreenKey.Profile']}`,
            screen: NAVIGATION_TYPE.PROFILE,
            icon: <Profile />,
        },
        {
            type: 'ACTION_BUTTON',
            key: `${strings['settingsScreenKey.Help']}`,
            screen: NAVIGATION_TYPE.HELP,
            icon: <Help />,
        },
        {
            type: 'ACTION_BUTTON',
            key: `${strings['title.privacyPolicy']}`,
            screen: NAVIGATION_TYPE.PRIVACY_POLICY,
            icon: <PrivacyPolicy />,
        },
        {
            type: 'ACTION_BUTTON',
            key: `${strings['title.termsCondition']}`,
            screen: NAVIGATION_TYPE.TERMS_CONDITIONS,
            icon: <TermsConditions />,
        },
        {
            type: 'ACTION_BUTTON',
            key: `${strings['settingsScreenKey.CreditsWalkthrough']}`,
            screen: NAVIGATION_TYPE.CREDITS_WALKTHROUGH,
            icon: <CreditWalkthrough />,
        },
        {
            type: 'ACTION_BUTTON',
            key: `${strings['settingsScreenKey.Logout']}`,
            screen: NAVIGATION_TYPE.LOGOUT,
            icon: <Signout />,
        },
    ];

    const { logout } = useAuth();

    const openBrowser = async (type: BROWSE_TYPE) => {
        if (!Platform.isTV) {
            try {
                navigation.push(NAVIGATION_TYPE.BROWSE_WEBVIEW, {
                    type: type,
                });
            } catch (error) {
                recordErrorEvent(ErrorEvents.BROWSE_ERROR, { error: error });
                console.log(`[InAppBrowser] Error loading type: ${type}`, error);
            }
        }
    };

    const handlePress = (screen: string) => {
        if (screen === NAVIGATION_TYPE.LOGOUT) {
            logout().then(() => {
                recordEvent(AppEvents.LOGOUT);
            });
        } else if (screen === NAVIGATION_TYPE.CREDITS_WALKTHROUGH) {
            onboardNavigation(NAVIGATION_TYPE.SETTINGS);
        } else if (screen === NAVIGATION_TYPE.PRIVACY_POLICY) {
            openBrowser('privacyPolicy');
        } else if (screen === NAVIGATION_TYPE.TERMS_CONDITIONS) {
            openBrowser('termsCondition');
        } else {
            navigation.push(screen);
        }
    };

    const ListSection = ({ settings }: { sectionTitle: string; settings: Array<SettingsItemProps> }) => {
        return (
            <View>
                {settings.map((item, i) =>
                    !item.hide ? (
                        <ListItem
                            topDivider={i !== 0}
                            key={i}
                            underlayColor={appColors.primaryVariant1}
                            containerStyle={defaultStyles.rowWrapperStyle}
                            title={item.key}
                            titleStyle={defaultStyles.mainText}
                            leftIcon={item.icon}
                            rightIcon={item.key !== strings['settingsScreenKey.Logout'] ? <RightArrow /> : undefined}
                            onPress={() => handlePress(item.screen)}
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

    return (
        <BackgroundGradient insetTabBar={true}>
            <View style={[defaultStyles.container, settStyle.mainContainer_mh, settStyle.mainContainer_mv]}>
                <ScrollView style={defaultStyles.listBottomPadding}>
                    <ListSection sectionTitle={'Subscription'} settings={subscription} />
                    <Text style={{ padding: appPadding.sm(true), color: appColors.tertiary }}>
                        {strings['settings.version']} {readableVersion} {environment}
                    </Text>
                </ScrollView>
            </View>
        </BackgroundGradient>
    );
};

export default SettingsScreen;
