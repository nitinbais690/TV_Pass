import React from 'react';
import { View, Text, Platform } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { useAppPreferencesState } from '../../utils/AppPreferencesContext';
import { settingStyle } from '../../styles/Settings.Style';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAuth } from 'contexts/AuthContextProvider';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';

export const BillingPaymentsScreen = ({ navigation }: { navigation: any }) => {
    const { width, height } = useDimensions().window;
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const isPortrait = height > width;
    const settStyle = settingStyle({ appColors, isPortrait });
    const { strings } = useLocalization();
    const userAction = useAuth();
    const { accountProfile } = userAction;

    const openBrowser = async (type: string) => {
        if (!Platform.isTV) {
            try {
                navigation.navigate(NAVIGATION_TYPE.BROWSE_WEBVIEW, {
                    type: type,
                });
            } catch (error) {
                console.log(`[InAppBrowser] Error loading url: ${type}`, error);
            }
        }
    };

    return (
        <BackgroundGradient insetTabBar={true}>
            <View style={settStyle.mainContainer_mh}>
                <View style={[settStyle.row, settStyle.margin_h]}>
                    <Text style={settStyle.mainText}>{strings['billing.tvpass']}</Text>
                    <View>
                        <View
                            style={
                                accountProfile && accountProfile.accountStatus
                                    ? [settStyle.active, settStyle.activeColor]
                                    : [settStyle.active, settStyle.inactiveColor]
                            }>
                            <Text style={settStyle.activeText}>{accountProfile && accountProfile.accountStatus}</Text>
                        </View>
                    </View>
                </View>
                <View style={settStyle.top_Underline} />
                <Text style={[settStyle.subText, settStyle.margin_h]}>{strings['billing.apple']}</Text>
                <View style={settStyle.row_center}>
                    <Text
                        style={[settStyle.mainText, settStyle.margin_h, settStyle.margin_v]}
                        onPress={() => openBrowser('faq')}>
                        {strings['billing.help']}
                    </Text>
                </View>
            </View>
        </BackgroundGradient>
    );
};
