import React, { useRef, useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View, Easing } from 'react-native';
import LottieView from 'lottie-react-native';
import Orientation from 'react-native-orientation-locker';
import DeviceInfo from 'react-native-device-info';
import { BrandLogo } from 'screens/components/BrandLogo';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { onboardingSpet1Style, onboardingStyle } from 'styles/Onboarding.style';
import Button, { ButtonType } from 'screens/components/Button';
import { useLocalization } from 'contexts/LocalizationContext';
import { useOnboarding } from 'contexts/OnboardingContext';
import CreditsIcon from '../../../assets/images/credits_small.svg';
import Ticker from 'react-native-ticker';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDimensions } from '@react-native-community/hooks';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { AppEvents } from 'utils/ReportingUtils';
import BackgroundGradient from '../components/BackgroundGradient';
import { selectDeviceType } from 'components/qp-common-ui';
const EnterAnimation = require('../../../assets/animations/Struum_Onboarding_Pill_Enter.json');
const ExitAnimation = require('../../../assets/animations/Struum_Onboarding_Pill_Exit.json');
const OnboardingIntroScreen = (): JSX.Element => {
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    const { appColors, appPadding } = prefs.appTheme!(prefs);
    const insets = useSafeArea();
    const { onboardNavigation, onboardSkip } = useOnboarding();
    const { width, height } = useDimensions().window;
    const isPortrait = height > width;
    const { recordEvent } = useAnalytics();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim1 = useRef(new Animated.Value(0)).current;
    const fadeAnim2 = useRef(new Animated.Value(0)).current;
    const exitPillAnimvalue = useRef(new Animated.Value(0)).current;
    const [enterAnimation, setEnterAnimation] = useState(true);
    const styles = onboardingSpet1Style({ appColors, appPadding, isPortrait, insets });
    const cStyles = onboardingStyle({ appColors, appPadding, insets, isPortrait });
    useEffect(() => {
        Animated.timing(fadeAnim1, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
        }).start();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            delay: 400,
            useNativeDriver: true,
        }).start(() => {
            Animated.timing(fadeAnim2, {
                toValue: 1,
                duration: 400,
                delay: 100,
                useNativeDriver: true,
            }).start();
            // setEnterAnimation(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        return () => {
            if (DeviceInfo.getDeviceType() === 'Tablet') {
                Orientation.unlockAllOrientations();
            } else {
                Orientation.lockToPortrait();
            }
        };
    });
    const exitAnimations = () => {
        Animated.timing(exitPillAnimvalue, {
            toValue: 1,
            duration: 700,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
        Animated.timing(fadeAnim2, {
            toValue: 0,
            duration: 700,
            delay: 300,
            useNativeDriver: true,
        }).start();
        Animated.timing(fadeAnim, {
            toValue: 2,
            duration: 700,
            delay: 300,
            useNativeDriver: true,
        }).start();
        setTimeout(() => {
            onboardNavigation('onboardingCreditButton');
        }, 800);
    };
    useEffect(() => {
        if (!enterAnimation) {
            exitAnimations();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enterAnimation]);
    return (
        <View style={styles.step1Container}>
            <Animated.View style={[styles.logoContainer, { opacity: fadeAnim2 }]}>
                <View style={{ flexDirection: 'row' }}>
                    <CreditsIcon width={20} height={selectDeviceType({ Handset: 18 }, 28)} />
                    <View style={{ marginRight: 7 }} />
                    <BrandLogo />
                </View>
            </Animated.View>
            <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: fadeAnim1 }]}>
                <BackgroundGradient style={[styles.container]} insetHeader={false} />
            </Animated.View>
            <View style={styles.step1Wrapper}>
                <Animated.View style={[styles.getStarted, { opacity: fadeAnim2 }]}>
                    <Text style={styles.getStartedText}>{strings['onboard.step1_get_started']}</Text>
                    <Text style={styles.getStartedSubtitle}>{strings['onboard.step1_subtitle']}</Text>
                </Animated.View>
                <View
                    style={[
                        styles.creditShadowOpacity,
                        {
                            shadowRadius: 80,
                            elevation: 20,
                        },
                    ]}>
                    <View
                        style={[
                            styles.creditsContainer,
                            styles.creditShadowOpacity,
                            {
                                shadowRadius: 20,
                                elevation: 20,
                            },
                        ]}>
                        <Animated.View
                            style={[
                                styles.tickerWrapper,
                                {
                                    opacity: fadeAnim.interpolate({
                                        inputRange: [0, 1, 2],
                                        outputRange: [0, 1, 0],
                                    }),
                                    transform: [
                                        {
                                            translateX: fadeAnim.interpolate({
                                                inputRange: [0, 1, 2],
                                                outputRange: [-50, 0, 10], // 0 : 150, 0.5 : 75, 1 : 0
                                            }),
                                        },
                                    ],
                                },
                            ]}>
                            <CreditsIcon width={50} height={50} />
                            <Ticker textStyle={styles.tickerText}>10</Ticker>
                        </Animated.View>
                        {enterAnimation ? (
                            <LottieView
                                style={styles.lottieContainer}
                                source={EnterAnimation}
                                autoPlay
                                loop={false}
                                onAnimationFinish={() => {
                                    // setEnterAnimation(false);
                                }}
                                hardwareAccelerationAndroid
                            />
                        ) : (
                            <LottieView
                                style={styles.lottieContainerExit}
                                source={ExitAnimation}
                                progress={exitPillAnimvalue}
                                loop={false}
                                hardwareAccelerationAndroid
                            />
                        )}
                    </View>
                </View>
                <Animated.View style={[styles.step1BottomContainer, { opacity: fadeAnim2 }]}>
                    <Text style={cStyles.bottomContentInfoText}>
                        <Text style={[cStyles.bottomContentInfoText, cStyles.bottomContentInfoWCText]}>
                            {strings['onboard.step1_why_credits']}
                        </Text>
                    </Text>
                    <Text style={cStyles.bottomContentInfoText}>{strings['onboard.step1_content_info']}</Text>
                    <View style={styles.freeCreditInfo} />
                    <View style={cStyles.bottomBtnSmt}>
                        <Button
                            title={strings['onboard.continue']}
                            onPress={() => {
                                setEnterAnimation(false);
                            }}
                        />
                    </View>
                    <View style={cStyles.bottomBtnSkip}>
                        <Button
                            title={strings['onboard.skip_tutorial']}
                            onPress={() => {
                                onboardSkip();
                                recordEvent(AppEvents.INTRO_WALKTHROUGH_SKIPPED, {}, true);
                            }}
                            buttonType={ButtonType.CancelButton}
                            type={'solid'}
                        />
                    </View>
                </Animated.View>
            </View>
        </View>
    );
};
export default OnboardingIntroScreen;
