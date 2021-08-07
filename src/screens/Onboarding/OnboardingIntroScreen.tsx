import React, { useRef, useEffect, useState } from 'react';
import { Animated, StyleSheet, Easing, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';
import Orientation from 'react-native-orientation-locker';
import DeviceInfo from 'react-native-device-info';
import { Button as EButton } from 'react-native-elements';
import { BrandLogo } from 'screens/components/BrandLogo';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { onboardingSpet1Style, onboardingStyle } from 'styles/Onboarding.style';
import Button from 'screens/components/Button';
import { useLocalization } from 'contexts/LocalizationContext';
import { useOnboarding } from 'contexts/OnboardingContext';
import CreditsIcon from '../../../assets/images/credits_small.svg';
import Ticker from 'react-native-ticker';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDimensions } from '@react-native-community/hooks';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { AppEvents } from 'utils/ReportingUtils';
import BackgroundGradient from '../components/BackgroundGradient';

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
        Orientation.lockToPortrait();
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
            setEnterAnimation(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        return () => {
            if (DeviceInfo.getDeviceType() === 'Tablet') {
                Orientation.unlockAllOrientations();
            }
        };
    });

    const exitAnimations = () => {
        Animated.timing(exitPillAnimvalue, {
            toValue: 1,
            duration: 6000,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
        Animated.timing(fadeAnim2, {
            toValue: 0,
            duration: 400,
            delay: 300,
            useNativeDriver: true,
        }).start();
        Animated.timing(fadeAnim, {
            toValue: 2,
            duration: 300,
            delay: 300,
            useNativeDriver: true,
        }).start(() => {
            /*LayoutAnimation.configureNext(LayoutAnimation.create(
                100,
                LayoutAnimation.Types.easeIn,
                LayoutAnimation.Properties.opacity
            ));*/
        });
        setTimeout(() => {
            onboardNavigation('onboardingCreditButton');
            recordEvent(AppEvents.INTRO_WALKTHROUGH_COMPLETED);
        }, 410);
    };

    return (
        <View style={styles.step1Container}>
            <Animated.View style={[styles.logoContainer, { opacity: fadeAnim2 }]}>
                <BrandLogo />
            </Animated.View>
            <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: fadeAnim1 }]}>
                <BackgroundGradient style={[styles.container]} insetHeader={false} />
            </Animated.View>
            <View style={styles.step1Wrapper}>
                <Animated.View style={[styles.getStarted, { opacity: fadeAnim2 }]}>
                    <Text style={styles.getStartedText}>{strings['onboard.step1_get_started']}</Text>
                    <Text style={styles.getStartedSubtitle}>{strings['onboard.step1_subtitle']}</Text>
                </Animated.View>
                <View style={styles.creditsContainer}>
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
                                            outputRange: [-40, 0, 200], // 0 : 150, 0.5 : 75, 1 : 0
                                        }),
                                    },
                                ],
                            },
                        ]}>
                        <CreditsIcon width={55} height={55} />
                        <Ticker textStyle={styles.tickerText}>10</Ticker>
                    </Animated.View>
                    {enterAnimation ? (
                        <LottieView
                            style={styles.lottieContainer}
                            source={EnterAnimation}
                            autoPlay
                            loop={false}
                            progress={1}
                            onAnimationFinish={() => {
                                //LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
                            }}
                        />
                    ) : (
                        <LottieView
                            style={styles.lottieContainerExit}
                            source={ExitAnimation}
                            progress={exitPillAnimvalue}
                            loop={false}
                            onAnimationFinish={() => {
                                //LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
                            }}
                        />
                    )}
                </View>
                <Animated.View style={[styles.step1BottomContainer, { opacity: fadeAnim2 }]}>
                    <Text style={cStyles.bottomContentInfoText}>
                        <Text style={[cStyles.bottomContentInfoText, cStyles.bottomContentInfoWCText]}>
                            {strings['onboard.step1_why_credits']}
                        </Text>
                        <Text style={cStyles.bottomContentInfoText}>{strings['onboard.step1_content_info']}</Text>
                    </Text>
                    <View style={styles.freeCreditInfo} />
                    <View style={cStyles.bottomBtnSmt}>
                        <Button
                            title={strings['onboard.show_me']}
                            onPress={() => {
                                //onboardNavigation('onboardingCreditButton');
                                exitAnimations();
                                //recordEvent(AppEvents.INTRO_WALKTHROUGH_COMPLETED);
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
                            titleStyle={cStyles.bottomBtnSkipText}
                        />
                    </View>
                </Animated.View>
            </View>
        </View>
    );
};

export default OnboardingIntroScreen;
