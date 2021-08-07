import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Animated, TouchableHighlight, Easing, findNodeHandle } from 'react-native';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appDimensions, appFonts, appPadding, tvPixelSizeForLayout } from '../../AppStyles';
import CreditsIcon from '../../assets/images/credits_large.svg';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import Menu from './components/Menu';
import { CreditsUIButton } from '../screens/components/CreditsButton';
import RadialGradient from 'react-native-radial-gradient';
import { useDimensions } from '@react-native-community/hooks';
import { colors } from 'qp-common-ui';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Pill } from '../screens/components/Pill';
import { BrandLogo } from '../screens/components/BrandLogo';
import Tooltip1 from '../../assets/animations/tv_tooltip_1.json';
import Tooltip2 from '../../assets/animations/tv_tooltip_2.json';
import LottieView from 'lottie-react-native';

const CreditsWalkthroughTVStep2 = ({ navigation, route }: { navigation: any; route: any }): JSX.Element => {
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    const enterCreditsAnimValue = useRef(new Animated.Value(0)).current;
    const enterTooltipAnimValue = useRef(new Animated.Value(0)).current;
    const fadeAnimRadialGradientValue = useRef(new Animated.Value(0)).current;
    const fadeAnimOverlayValue = useRef(new Animated.Value(0)).current;
    const fadeAnimTooltip = useRef(new Animated.Value(0)).current;
    const fadeAnimTooltip2 = useRef(new Animated.Value(0)).current;
    const fadeAnimTooltipText = useRef(new Animated.Value(0)).current;
    const fadeAnimTooltipText2 = useRef(new Animated.Value(0)).current;
    const enterTooltip2AnimValue = useRef(new Animated.Value(0)).current;
    // const tooltip1Button = useRef(null);
    const tooltip1Button = useRef(null);
    const tooltip2Button = useRef(null);
    // const fadeAnimTooltipText = useRef(new Animated.Value(0)).current;
    let { appColors } = appTheme(prefs);
    const [showContent] = useState(false);
    const [hasTVPreferredFocus, setHasTVPreferredFocus] = useState(false);
    const [counter, setCounter] = useState(0);
    const { width, height } = useDimensions().window;

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    flex: 1,
                },
                creditsButtonContainer: {
                    position: 'absolute',
                    top: 15,
                    zIndex: 10,
                },
                radialGradientcontainer: {
                    flex: 1,
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 11,
                },
                radialGradientCardContainer: {
                    flex: 1,
                    height: '100%',
                    width: '100%',
                    position: 'relative',
                    alignSelf: 'flex-end',
                    top: 0,
                    right: 0,
                },
                gradient: {
                    position: 'absolute',
                    top: 0,
                },
                cardGradient: {
                    alignSelf: 'flex-end',
                    top: -250,
                },
                movieCardMainContainer: {
                    position: 'relative',
                    height: '85%',
                    width: '100%',
                    paddingRight: appPadding.md(),
                    paddingLeft: appPadding.lg(),
                    paddingBottom: 0,
                    paddingTop: appPadding.xxs(),
                },
                mainMovieCard: {
                    borderRadius: appDimensions.cardRadius,
                    backgroundColor: appColors.primary,
                    height: '100%',
                    width: '100%',
                    overflow: 'hidden',
                    zIndex: 3,
                },
                movieCardsContainer: {
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                    paddingLeft: appPadding.lg(),
                },
                movieCard: {
                    height: tvPixelSizeForLayout(100),
                    borderRadius: appDimensions.cardRadius,
                    backgroundColor: appColors.primary,
                    width: tvPixelSizeForLayout(300),
                    overflow: 'hidden',
                    zIndex: 3,
                    marginRight: 15,
                },
                movieCardContainerShadow: {
                    shadowColor: appColors.brandTint,
                    shadowOffset: {
                        width: 0,
                        height: 0,
                    },
                    shadowRadius: 18,
                    elevation: 0,
                    zIndex: 10,
                },
                playButton: {
                    height: '100%',
                    width: 80,
                    opacity: 0.4,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                },
                overlay: {
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    height: height,
                    width: '100%',
                    zIndex: 2,
                },
                movieCardOverlay: {
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                },
                mainDot: {
                    backgroundColor: appColors.secondary,
                    opacity: 1,
                },
                dot: {
                    height: 10,
                    width: 10,
                    backgroundColor: appColors.secondary,
                    opacity: 0.3,
                    borderRadius: 5,
                    marginRight: 7,
                },
                dotsContainer: {
                    flexDirection: 'row',
                    height: tvPixelSizeForLayout(100),
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                pillContainer: {
                    justifyContent: 'center',
                    position: 'absolute',
                    bottom: tvPixelSizeForLayout(50),
                    left: tvPixelSizeForLayout(50),
                },
                pillWrapper: {
                    flexDirection: 'row',
                    marginHorizontal: 4,
                    marginVertical: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                },
                pillText: {
                    color: appColors.secondary,
                    fontFamily: appFonts.semibold,
                    fontSize: appFonts.md,
                    fontWeight: '500',
                    marginLeft: 4,
                },
                logoContainer: {
                    alignItems: 'flex-end',
                    position: 'absolute',
                    bottom: tvPixelSizeForLayout(60),
                    right: tvPixelSizeForLayout(50),
                    zIndex: 1,
                },
                tooltip: {
                    position: 'absolute',
                    height: tvPixelSizeForLayout(470),
                    width: tvPixelSizeForLayout(700),
                    backgroundColor: 'transparent',
                    zIndex: 16,
                    padding: appPadding.md(),
                    paddingRight: appPadding.xl(),
                },
                tooltip1: {
                    top: tvPixelSizeForLayout(160),
                    left: tvPixelSizeForLayout(45),
                },
                tooltip2: {
                    bottom: tvPixelSizeForLayout(200),
                    right: tvPixelSizeForLayout(50),
                    width: tvPixelSizeForLayout(650),
                },
                triangle: {
                    position: 'absolute',
                    top: -10,
                    left: 20,
                    width: 0,
                    height: 0,
                    borderLeftWidth: 12,
                    borderRightWidth: 12,
                    borderBottomWidth: 12,
                    borderStyle: 'solid',
                    backgroundColor: 'transparent',
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderBottomColor: appColors.primaryEnd,
                },
                leftTriangle: {
                    top: '60%',
                    left: -17,
                    transform: [{ rotate: '-90deg' }],
                },
                toolTipNumberText: {
                    fontFamily: appFonts.primary,
                    fontSize: appFonts.xxs,
                    fontWeight: '500',
                    color: appColors.tertiary,
                },
                tootlTip1Text: {
                    marginTop: 5,
                    fontFamily: appFonts.primary,
                    fontSize: appFonts.xlg,
                    fontWeight: 'bold',
                    color: appColors.secondary,
                },
                tooltipTextTint: {
                    fontFamily: appFonts.primary,
                    fontSize: appFonts.lg,
                    fontWeight: 'bold',
                    color: appColors.brandTint,
                },
                buttonContainer: {
                    width: tvPixelSizeForLayout(200),
                },
                nextButton: {
                    marginTop: 15,
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    borderColor: appColors.secondary,
                    borderWidth: 2,
                    backgroundColor: appColors.brandTint,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                lottieTooltip1: {
                    width: tvPixelSizeForLayout(800),
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    top: 0,
                    left: -5,
                    // left: Platform.OS === 'android' ? -95 : -65,
                    // top: Platform.OS === 'android' ? -50 : -36,
                    zIndex: 15,
                },
                lottieTooltip2: {
                    width: tvPixelSizeForLayout(800),
                    position: 'absolute',
                    top: tvPixelSizeForLayout(40),
                    right: tvPixelSizeForLayout(0),
                    // left: Platform.OS === 'android' ? -95 : -65,
                    // top: Platform.OS === 'android' ? -50 : -36,
                    zIndex: 15,
                },
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    useEffect(() => {
        Animated.parallel([
            Animated.timing(enterCreditsAnimValue, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
                easing: Easing.in(Easing.quad),
            }),
            Animated.timing(fadeAnimTooltip, {
                toValue: 0.7,
                duration: 2000,
                useNativeDriver: true,
                delay: 400,
                // easing: Easing.in(Easing.quad),
            }),
            Animated.timing(fadeAnimTooltipText, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
                delay: 900,
                // easing: Easing.in(Easing.quad),
            }),
            Animated.timing(fadeAnimRadialGradientValue, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
                easing: Easing.in(Easing.quad),
            }),
        ]).start(() => {
            // onboardNavigation('onboardingSelectContent');
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (showContent && counter < 3) {
            setTimeout(() => setCounter(counter => counter + 1), 200);
        }
    }, [counter, showContent]);

    const actionNext = () => {
        Animated.timing(fadeAnimTooltip, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
            delay: 0,
            // easing: Easing.in(Easing.quad),
        }).start();
        Animated.timing(fadeAnimTooltipText, {
            toValue: 2,
            duration: 500,
            useNativeDriver: true,
            delay: 500,
            // easing: Easing.in(Easing.quad),
        }).start();
        Animated.timing(fadeAnimTooltip2, {
            toValue: 0.8,
            duration: 2000,
            useNativeDriver: true,
            delay: 700,
            // easing: Easing.in(Easing.quad),
        }).start();
        Animated.timing(fadeAnimTooltipText2, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            delay: 1000,
            // easing: Easing.in(Easing.quad),
        }).start();
        Animated.timing(fadeAnimRadialGradientValue, {
            toValue: 2,
            duration: 500,
            useNativeDriver: true,
            // easing: Easing.in(Easing.quad),
        }).start();
        Animated.timing(enterTooltipAnimValue, {
            toValue: 2,
            duration: 1500,
            useNativeDriver: true,
            // easing: Easing.in(Easing.quad),
        }).start();
        Animated.timing(fadeAnimOverlayValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            // easing: Easing.in(Easing.quad),
        }).start();
        Animated.timing(enterTooltip2AnimValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            delay: 500,
        }).start(() => {
            setHasTVPreferredFocus(true);
            tooltip2Button.current.focus();
        });
    };

    const actionNext2 = () => {
        Animated.timing(fadeAnimTooltip2, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
            delay: 0,
            // easing: Easing.in(Easing.quad),
        }).start(() => {
            // onboardNavigation('onboardingSelectContent');
            navigation.navigate(NAVIGATION_TYPE.CREDITS_WALKTHROUGH_STEP_3, {
                setting: route.params && route.params.setting,
            });
        });
        Animated.timing(fadeAnimTooltipText2, {
            toValue: 2,
            duration: 500,
            useNativeDriver: true,
            delay: 400,
            // easing: Easing.in(Easing.quad),
        }).start();
    };

    return (
        <BackgroundGradient>
            <View style={styles.container}>
                <LottieView
                    style={styles.lottieTooltip1}
                    source={Tooltip1}
                    progress={fadeAnimTooltip}
                    loop={false}
                    onAnimationFinish={() => {
                        //LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
                    }}
                />
                <Animated.View
                    style={[
                        styles.tooltip,
                        styles.tooltip1,
                        {
                            opacity: fadeAnimTooltipText.interpolate({
                                inputRange: [0, 1, 2],
                                outputRange: [0, 1, 0], // 0 : 150, 0.5 : 75, 1 : 0
                            }),
                        },
                    ]}>
                    <Text style={styles.toolTipNumberText}>1 of 4</Text>
                    <Text style={styles.tootlTip1Text}>
                        {strings['tv.credit_walkthrough.tooltip1_1']}
                        <Text style={styles.tooltipTextTint}>{strings['tv.credit_walkthrough.tooltip1_2']}</Text>
                        <Text style={styles.tootlTip1Text}>
                            {strings['tv.credit_walkthrough.tooltip1_3']}
                            <Text style={styles.tooltipTextTint}>{strings['tv.credit_walkthrough.tooltip1_4']}</Text>
                            <Text style={styles.tootlTip1Text}>{strings['tv.credit_walkthrough.tooltip1_5']}</Text>
                        </Text>
                    </Text>
                    <View style={styles.buttonContainer}>
                        <TouchableHighlight
                            accessibilityLabel={'Next'}
                            ref={tooltip1Button}
                            activeOpacity={1}
                            nextFocusUp={findNodeHandle(tooltip1Button.current)}
                            nextFocusLeft={findNodeHandle(tooltip1Button.current)}
                            nextFocusRight={findNodeHandle(tooltip1Button.current)}
                            nextFocusDown={findNodeHandle(tooltip1Button.current)}
                            hasTVPreferredFocus={!hasTVPreferredFocus}
                            style={[styles.nextButton]}
                            onPress={() => {
                                actionNext();
                            }}>
                            <MaterialCommunityIcons color={colors.primary} size={30} name={'arrow-right'} />
                        </TouchableHighlight>
                    </View>
                </Animated.View>
                <Animated.View
                    style={[
                        styles.radialGradientcontainer,
                        {
                            opacity: fadeAnimRadialGradientValue.interpolate({
                                inputRange: [0, 1, 2],
                                outputRange: [0, 1, 0], // 0 : 150, 0.5 : 75, 1 : 0
                            }),
                        },
                    ]}>
                    <RadialGradient
                        style={[
                            styles.gradient,
                            { width: tvPixelSizeForLayout(700), height: tvPixelSizeForLayout(700) },
                        ]}
                        colors={['rgba(104, 110, 255, 0.6)', 'rgba(104, 110, 255, 0.3)', 'rgba(12,16,33, 0)']}
                        stops={[0, 0.3, 0.7]}
                        center={[10, 10]}
                        radius={width / 3.3}
                    />
                </Animated.View>
                <Animated.View
                    style={[
                        styles.creditsButtonContainer,
                        {
                            transform: [
                                {
                                    translateX: enterCreditsAnimValue.interpolate({
                                        inputRange: [0, 1, 2],
                                        outputRange: [-40, 0, 500], // 0 : 150, 0.5 : 75, 1 : 0
                                    }),
                                },
                            ],
                        },
                    ]}>
                    <CreditsUIButton credits={3} loading={false} />
                </Animated.View>
                <View>
                    <View style={styles.overlay} />
                </View>
                <Menu isTabOn={''} isOnboarding={true} hasMenuFocus={false} />
                <View style={styles.movieCardMainContainer}>
                    <LottieView
                        style={styles.lottieTooltip2}
                        source={Tooltip2}
                        progress={fadeAnimTooltip2}
                        loop={false}
                        onAnimationFinish={() => {
                            //LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
                        }}
                    />
                    <Animated.View
                        style={[
                            styles.tooltip,
                            styles.tooltip2,
                            {
                                opacity: fadeAnimTooltipText2.interpolate({
                                    inputRange: [0, 1, 2],
                                    outputRange: [0, 1, 0], // 0 : 150, 0.5 : 75, 1 : 0
                                }),
                            },
                        ]}>
                        <Text style={styles.toolTipNumberText}>2 of 4</Text>
                        <Text style={styles.tooltipTextTint}>
                            {strings['tv.credit_walkthrough.tooltip2_1']}
                            <Text style={styles.tootlTip1Text}>{strings['tv.credit_walkthrough.tooltip2_2']}</Text>
                            <Text style={styles.tooltipTextTint}>
                                {strings['tv.credit_walkthrough.tooltip2_3']}
                                <Text style={styles.tootlTip1Text}>{strings['tv.credit_walkthrough.tooltip2_4']}</Text>
                            </Text>
                        </Text>
                        <View style={styles.buttonContainer}>
                            <TouchableHighlight
                                accessibilityLabel={'Next'}
                                ref={tooltip2Button}
                                activeOpacity={1}
                                nextFocusUp={findNodeHandle(tooltip2Button.current)}
                                nextFocusLeft={findNodeHandle(tooltip2Button.current)}
                                nextFocusRight={findNodeHandle(tooltip2Button.current)}
                                nextFocusDown={findNodeHandle(tooltip2Button.current)}
                                hasTVPreferredFocus={hasTVPreferredFocus}
                                style={[styles.nextButton]}
                                onPress={() => {
                                    actionNext2();
                                }}>
                                <MaterialCommunityIcons color={colors.primary} size={30} name={'arrow-right'} />
                            </TouchableHighlight>
                        </View>
                    </Animated.View>
                    <View style={[styles.mainMovieCard, styles.movieCardContainerShadow]}>
                        <Animated.View
                            style={[
                                styles.movieCardOverlay,
                                {
                                    opacity: fadeAnimOverlayValue.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [1, 0], // 0 : 150, 0.5 : 75, 1 : 0
                                    }),
                                },
                            ]}
                        />
                        <Animated.View style={[styles.radialGradientCardContainer]}>
                            <RadialGradient
                                style={[styles.cardGradient, { width: '100%', height: tvPixelSizeForLayout(1500) }]}
                                colors={[
                                    'rgba(104, 110, 255, 0.8)',
                                    'rgba(104, 110, 255, 0.6)',
                                    'rgba(104, 110, 255, 0.5)',
                                    'rgba(104, 110, 255, 0.2)',
                                    'rgba(104, 110, 255, 0.05)',
                                    'rgba(12,16,33, 0)',
                                ]}
                                stops={[0, 0.3, 0.7]}
                                center={[720, 100]}
                                radius={width / 1.2}
                            />
                        </Animated.View>
                        <View style={styles.playButton}>
                            <MaterialCommunityIcons color={colors.primary} size={90} name={'play'} />
                        </View>
                        <View style={styles.pillContainer}>
                            <Pill borderRadius={18}>
                                <View style={styles.pillWrapper}>
                                    <CreditsIcon width={18} height={18} />
                                    <Text style={styles.pillText}>3</Text>
                                </View>
                            </Pill>
                        </View>
                        <View style={styles.logoContainer}>
                            <BrandLogo height={tvPixelSizeForLayout(80)} width={tvPixelSizeForLayout(425)} />
                        </View>
                    </View>
                </View>
                <View style={styles.dotsContainer}>
                    <View style={[styles.dot, styles.mainDot]} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                </View>
                <View style={styles.movieCardsContainer}>
                    <View style={styles.movieCard} />
                    <View style={styles.movieCard} />
                    <View style={styles.movieCard} />
                    <View style={styles.movieCard} />
                    <View style={styles.movieCard} />
                    <View style={styles.movieCard} />
                </View>
            </View>
        </BackgroundGradient>
    );
};

export default CreditsWalkthroughTVStep2;
