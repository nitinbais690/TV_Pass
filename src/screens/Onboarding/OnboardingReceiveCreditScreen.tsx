import React, { useEffect, useState, useRef } from 'react';
import { Text, View, ScrollView, Animated, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import Orientation from 'react-native-orientation-locker';
import DeviceInfo from 'react-native-device-info';
import { useSafeArea } from 'react-native-safe-area-context';
import Ticker from 'react-native-ticker';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { useOnboarding } from 'contexts/OnboardingContext';
import { onboardingSpet6Style, onboardingStyle } from 'styles/Onboarding.style';
import Button from 'screens/components/Button';
import CreditsIcon from '../../../assets/images/credits_small.svg';
import { CreditsUIButton } from 'screens/components/CreditsButton';
import { useDimensions } from '@react-native-community/hooks';
// @ts-ignore
import RadialGradient from 'react-native-radial-gradient';
import BackgroundGradient from '../components/BackgroundGradient';
import { BrandLogo } from '../components/BrandLogo';

const EnterAnimation = require('../../../assets/animations/Struum_Onboarding_Pill_2_Enter.json');

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
    const fadeAnimRadialGradientValue = useRef(new Animated.Value(0)).current;
    const backgroundFadeValue = useRef(new Animated.Value(0)).current;
    const creditsFadeValue = useRef(new Animated.Value(0)).current;

    const styles = onboardingSpet6Style({ appColors, appPadding, insets, isPortrait });
    const cStyles = onboardingStyle({ appColors, appPadding, insets, isPortrait });

    useEffect(() => {
        Orientation.lockToPortrait();
        Animated.timing(fadeAnimRadialGradientValue, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
            delay: 1200,
        }).start();
        Animated.timing(creditsFadeValue, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
            delay: 1800,
        }).start();
        Animated.timing(backgroundFadeValue, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
        }).start();
        isMounted.current = true;
        setTimeout(() => {
            if (isMounted.current) {
                setCredits(40);
            }
        }, 2000);

        return () => {
            isMounted.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        return () => {
            if (DeviceInfo.getDeviceType() === 'Tablet') {
                Orientation.unlockAllOrientations();
            }
        };
    });

    return (
        <ScrollView contentContainerStyle={styles.step6Container} scrollEnabled={false}>
            <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: backgroundFadeValue }]}>
                <BackgroundGradient style={[styles.container]} insetHeader={false} />
            </Animated.View>
            <View style={cStyles.logoContainer}>
                <BrandLogo />
            </View>
            <Animated.View
                style={[cStyles.creditsButtonContainerSelectcontent, { opacity: fadeAnimRadialGradientValue }]}>
                <CreditsUIButton credits={credits} loading={false} />
            </Animated.View>
            <Animated.View style={[styles.radialGradientcontainer, { opacity: fadeAnimRadialGradientValue }]}>
                <RadialGradient
                    style={[styles.radialGradient, { width: width }]}
                    colors={['rgba(104, 110, 255, 1)', 'rgba(104, 110, 255, 0.4)', 'rgba(12,16,33, 0)']}
                    stops={[0, 0.3, 0.7]}
                    center={[width / 2, height / 2.2]}
                    radius={width}
                />
            </Animated.View>
            <View style={styles.step6Wrapper}>
                <View />
                <View style={styles.creditsContainer}>
                    <Animated.View style={[styles.credits, { opacity: fadeAnimRadialGradientValue }]}>
                        <Text style={styles.creditsText}>+</Text>
                    </Animated.View>

                    <View style={styles.tickerWrapper}>
                        <LottieView
                            style={styles.lottieView}
                            source={EnterAnimation}
                            autoPlay
                            loop={false}
                            onAnimationFinish={() => {
                                //LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
                            }}
                        />
                        <Animated.View style={[styles.creditsAnimatedContainer, { opacity: creditsFadeValue }]}>
                            <View style={styles.pillWrapper}>
                                <CreditsIcon width={55} height={55} />
                            </View>
                            <Ticker textStyle={styles.tickerText}>{credits}</Ticker>
                        </Animated.View>
                    </View>
                </View>
                <Animated.View style={[styles.step6BottomContaner, { opacity: fadeAnimRadialGradientValue }]}>
                    <View style={styles.creditInfo}>
                        <Text style={styles.creditInfoText}>
                            {strings['onboard.step6_content_info']}
                            <Text style={styles.creditInfoTextTint}>{strings['onboard.step6_content_info_tint']}</Text>
                        </Text>
                    </View>
                    <View style={cStyles.bottomBtnSmt}>
                        <Button
                            title={strings['onboard.step6_backto_settings']}
                            onPress={() => {
                                onboardSkip();
                            }}
                        />
                    </View>
                </Animated.View>
            </View>
        </ScrollView>
    );
};
export default OnboardingReceiveCreditScreen;
