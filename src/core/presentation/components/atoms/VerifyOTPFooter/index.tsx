import React from 'react';
import { View, Text } from 'react-native';

import { verifyOTPFooterStyle } from './style';
import { openLink } from 'utils/InAppBrowserUtils';
import { ErrorEvents } from 'utils/ReportingUtils';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';

export default function VerifyOTPFooter() {
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    const { appTheme, appConfig } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const { recordErrorEvent } = useAnalytics();

    const verifyOTPFooterStyles = verifyOTPFooterStyle(appColors);

    const handlePress = (screen: string) => {
        if (screen === NAVIGATION_TYPE.TERMS_CONDITIONS) {
            openBrowser(appConfig && appConfig.termsAndConditionsURL);
        } else if (screen === NAVIGATION_TYPE.PRIVACY_POLICY) {
            openBrowser(appConfig && appConfig.privacyPolicyURL);
        }
    };
    const openBrowser = async (url: string) => {
        try {
            await openLink(url, appColors);
        } catch (error) {
            recordErrorEvent(ErrorEvents.BROWSE_ERROR, { error: error, url: url });
            console.log(`[InAppBrowser] Error loading url: ${url}`, error);
        }
    };
    return (
        <View style={verifyOTPFooterStyles.container}>
            <Text style={verifyOTPFooterStyles.footerNormalText}>{strings['verifyotp.footer_text']}</Text>
            <View style={verifyOTPFooterStyles.footerLinkSection}>
                <Text
                    style={verifyOTPFooterStyles.footerLinkText}
                    onPress={() => {
                        handlePress(NAVIGATION_TYPE.TERMS_CONDITIONS);
                    }}>
                    {strings['verifyotp.terms_of_service']}
                </Text>
                <Text style={verifyOTPFooterStyles.footerNormalText}>{strings['verifyotp.footer_text_and']}</Text>
                <Text
                    style={verifyOTPFooterStyles.footerLinkText}
                    onPress={() => {
                        handlePress(NAVIGATION_TYPE.PRIVACY_POLICY);
                    }}>
                    {strings['verifyotp.privacy_policy']}
                </Text>
            </View>
        </View>
    );
}
