import React from 'react';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { Text, View, ScrollView } from 'react-native';
import { onboardingSpet1Style, onboardingStyle } from 'styles/Onboarding.style';
import Button from 'screens/components/Button';
import { Button as EButton } from 'react-native-elements';
import { useLocalization } from 'contexts/LocalizationContext';
import { useOnboarding } from 'contexts/OnboardingContext';
import { Pill } from 'screens/components/Pill';
import CreditsIcon from '../../../assets/images/credits_small.svg';
import Ticker from 'react-native-ticker';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDimensions } from '@react-native-community/hooks';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { AppEvents } from 'utils/ReportingUtils';

const OnboardingIntroScreen = (): JSX.Element => {
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    const { appColors, appPadding } = prefs.appTheme!(prefs);
    const insets = useSafeArea();
    const { onboardNavigation, onboardSkip } = useOnboarding();
    const { width, height } = useDimensions().window;
    const isPortrait = height > width;
    const { recordEvent } = useAnalytics();

    const styles = onboardingSpet1Style({ appColors, appPadding, isPortrait });
    const cStyles = onboardingStyle({ appColors, appPadding, insets, isPortrait });

    return (
        <ScrollView contentContainerStyle={styles.step1Container} scrollEnabled={false}>
            <View style={styles.step1Wrapper}>
                <View style={styles.getStarted}>
                    <Text style={styles.getStartedText}>{strings['onboard.step1_get_started']}</Text>
                </View>
                <View style={styles.creditsContainer}>
                    <View style={styles.credits}>
                        <Text style={styles.creditsText}>{strings['onboard.credits']}</Text>
                    </View>
                    <View style={styles.tickerWrapper}>
                        <Ticker textStyle={styles.tickerText}>30</Ticker>
                        <View style={styles.pillWrapper}>
                            <Pill>
                                <CreditsIcon width={55} height={55} />
                            </Pill>
                        </View>
                    </View>
                </View>
                <View style={styles.step1BottomContaner}>
                    <View style={styles.creditInfo}>
                        <Text style={styles.creditInfoText}>{strings['onboard.step1_content_info']}</Text>
                    </View>
                    <View style={styles.freeCreditInfo}>
                        <Text style={styles.freeCreditInfoText}>{strings['onboard.step1_free_credit_info']}</Text>
                    </View>
                    <View style={cStyles.bottomBtnSmt}>
                        <Button
                            title={strings['onboard.show_me']}
                            onPress={() => {
                                onboardNavigation('onboardingCreditButton');
                                recordEvent(AppEvents.INTRO_WALKTHROUGH_COMPLETED);
                            }}
                        />
                    </View>
                    <View style={cStyles.bottomBtnSkip}>
                        <EButton
                            title={strings['onboard.skip_tutorial']}
                            type="clear"
                            onPress={() => {
                                onboardSkip();
                                recordEvent(AppEvents.INTRO_WALKTHROUGH_SKIPPED);
                            }}
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};
export default OnboardingIntroScreen;
