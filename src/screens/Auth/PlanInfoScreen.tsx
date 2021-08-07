import React, { useEffect } from 'react';
import { useDimensions } from '@react-native-community/hooks';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { defaultPlanStyle } from 'styles/Plan.style';
import { formStyle } from 'styles/Common.style';
import { useLocalization } from 'contexts/LocalizationContext';
import Button from 'screens/components/Button';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import {
    ActionEvents,
    Attributes,
    getPageEventFromPageNavigation,
    getPageIdsFromPageEvents,
} from 'utils/ReportingUtils';
import { useAnalytics } from 'utils/AnalyticsReporterContext';

const PlanInfoScreen = (): JSX.Element => {
    const navigation = useNavigation();
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    let { appColors, appPadding } = prefs.appTheme!(prefs);
    const { width, height } = useDimensions().window;
    const isPortrait = height > width;
    const styles = defaultPlanStyle({ appColors, appPadding, isPortrait });
    const formStyles = formStyle({ appColors, appPadding, isPortrait });
    const { recordEvent } = useAnalytics();

    useEffect(() => {
        let data: Attributes = {};

        let pageEvents = getPageEventFromPageNavigation(NAVIGATION_TYPE.PLAN_INFO);
        data.pageID = getPageIdsFromPageEvents(pageEvents);
        data.event = pageEvents;

        recordEvent(pageEvents, data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openBrowser = (title: string) => {
        try {
            navigation.navigate(NAVIGATION_TYPE.BROWSE_WEBVIEW, {
                type: title,
            });
        } catch (error) {
            console.log(`[InAppBrowser] Error loading url: ${title}`, error);
        }
    };

    return (
        <BackgroundGradient>
            <ScrollView contentContainerStyle={styles.container} scrollEnabled={isPortrait}>
                <View style={[formStyles.formContainer, styles.formContainer]}>
                    <View style={formStyles.formGroup}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleLabel}>{strings['plan.title']}</Text>
                        </View>
                    </View>
                    <View style={styles.billingInfo}>
                        <Text style={styles.billingInfoText}>{strings['plan.billing_info']}</Text>
                    </View>
                    <View style={styles.planCardContainer}>
                        <View style={styles.topCardSection}>
                            <View style={styles.planType}>
                                <Text style={styles.planTypeText}>{strings['plan.type']}</Text>
                            </View>
                            <View style={styles.planPerMonth}>
                                <Text style={styles.planPerMonthText}>{strings['plan.per_month_info']}</Text>
                            </View>
                            <View style={styles.planSubscription}>
                                <Text style={styles.planSubscriptionText}>{strings['plan.subscription_info']}</Text>
                            </View>
                        </View>
                        <View style={styles.bottomCardSection}>
                            <Text style={[styles.planCardInfoText, styles.planCardInfoText1]}>
                                {strings['plan.card_footer_info1']}
                            </Text>
                            <Text
                                onPress={() => openBrowser('termsCondition')}
                                style={[styles.planCardInfoText, styles.planCardInfoTextLink]}>
                                {strings['plan.card_footer_info2']}
                                <Text style={styles.planCardInfoText}> {strings['plan.card_footer_info2_1']}</Text>
                            </Text>
                        </View>
                    </View>
                    <View style={styles.buttonSection}>
                        <Button
                            title={strings['plan.btn_label']}
                            onPress={() => {
                                let data: Attributes = {};
                                data.event = ActionEvents.ACTION_CREATE_ACCOUNT;
                                recordEvent(ActionEvents.ACTION_CREATE_ACCOUNT, data);
                                navigation.navigate(NAVIGATION_TYPE.AUTH_SIGN_UP);
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
        </BackgroundGradient>
    );
};
export default PlanInfoScreen;
