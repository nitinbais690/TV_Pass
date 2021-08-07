import React, { useEffect, useState, useRef } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import Ticker from 'react-native-ticker';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { useOnboarding } from 'contexts/OnboardingContext';
import { onboardingSpet6Style, onboardingStyle } from 'styles/Onboarding.style';
import Button from 'screens/components/Button';
import { Pill } from 'screens/components/Pill';
import CreditsIcon from '../../../assets/images/credits_small.svg';
import { CreditsUIButton } from 'screens/components/CreditsButton';
import { useDimensions } from '@react-native-community/hooks';

const OnboardingReceiveCreditScreen = (): JSX.Element => {
    const isMounted = useRef(true);
    const [credits, setCredits] = useState(20);
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    const { appColors, appPadding } = prefs.appTheme!(prefs);
    const { onboardSkip } = useOnboarding();
    const insets = useSafeArea();
    const { width, height } = useDimensions().window;
    const isPortrait = height > width;

    const styles = onboardingSpet6Style({ appColors, appPadding, insets, isPortrait });
    const cStyles = onboardingStyle({ appColors, appPadding, insets, isPortrait });

    useEffect(() => {
        isMounted.current = true;

        setTimeout(() => {
            if (isMounted.current) {
                setCredits(40);
            }
        }, 2000);

        return () => {
            isMounted.current = false;
        };
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.step6Container} scrollEnabled={false}>
            <View style={styles.headerCreditBtn6Cont}>
                <CreditsUIButton credits={credits} loading={false} />
            </View>
            <View style={styles.step6Wrapper}>
                <View />
                <View style={styles.creditsContainer}>
                    <View style={styles.credits}>
                        <Text style={styles.creditsText}>{strings['onboard.credits']}</Text>
                    </View>
                    <View style={styles.tickerWrapper}>
                        <Ticker textStyle={styles.tickerText}>{credits}</Ticker>
                        <View style={styles.pillWrapper}>
                            <Pill>
                                <CreditsIcon width={55} height={55} />
                            </Pill>
                        </View>
                    </View>
                </View>
                <View style={styles.step6BottomContaner}>
                    <View style={styles.creditInfo}>
                        <Text style={styles.creditInfoText}>{strings['onboard.step6_content_info']}</Text>
                    </View>
                    <View style={cStyles.bottomBtnSmt}>
                        <Button
                            title={strings['global.btn_continue']}
                            onPress={() => {
                                onboardSkip();
                            }}
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};
export default OnboardingReceiveCreditScreen;
