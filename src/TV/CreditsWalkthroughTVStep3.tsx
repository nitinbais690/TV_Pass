import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Platform, Animated, TouchableHighlight, Easing, findNodeHandle } from 'react-native';
// import BackgroundGradient from 'screens/components/BackgroundGradient';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appDimensions, appFonts, appPadding, tvPixelSizeForLayout } from '../../AppStyles';
// import CreditsIcon from '../../assets/images/credits_large.svg';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
// import Menu from './components/Menu';
import { CreditsUIButton } from '../screens/components/CreditsButton';
import RadialGradient from 'react-native-radial-gradient';
import { useDimensions } from '@react-native-community/hooks';
import { colors } from 'qp-common-ui';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BrandLogo } from '../screens/components/BrandLogo';
import GradientBackground from '../../assets/images/backgroundRadianGradient.svg';
import { useOnboarding } from '../contexts/OnboardingContext';
import { RedeemButton } from '../screens/components/RedeemButton';
import { PlayButton } from '../screens/components/PlayButton';
import { defaultContentDetailsStyle } from '../styles/ContentDetails.style';
import { useSafeArea } from 'react-native-safe-area-context';
import Tooltip3 from '../../assets/animations/tv_tooltip_3.json';
import Tooltip4 from '../../assets/animations/tv_tooltip_4.json';
import LottieView from 'lottie-react-native';

const CreditsWalkthroughTVStep3 = ({ navigation, route }: { navigation: any; route: any }): JSX.Element => {
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    const insets = useSafeArea();
    const { onboardingResource } = useOnboarding();
    const { appTheme } = prefs;
    const enterCreditsAnimValue = useRef(new Animated.Value(0)).current;
    const enterTooltipAnimValue = useRef(new Animated.Value(0)).current;
    const fadeAnimRadialGradientValue = useRef(new Animated.Value(0)).current;
    const fadeAnimTooltip = useRef(new Animated.Value(0)).current;
    const fadeAnimTooltip2 = useRef(new Animated.Value(0)).current;
    const fadeAnimTooltipText = useRef(new Animated.Value(0)).current;
    const fadeAnimTooltipText2 = useRef(new Animated.Value(0)).current;
    // const enterTooltip2AnimValue = useRef(new Animated.Value(0)).current;
    const tooltip3Button = useRef(null);
    const tooltip4Button = useRef(null);
    let { appColors } = appTheme(prefs);
    const [showContent] = useState(false);
    const [counter, setCounter] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [entitlement, setEntitlement] = useState(undefined);
    const [credits, setCredits] = useState(3);
    const [hasTVPreferredFocus, setHasTVPreferredFocus] = useState(false);

    const { width, height } = useDimensions().window;

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    flex: 1,
                    backgroundColor: appColors.primary,
                },
                creditsButtonContainer: {
                    position: 'absolute',
                    top: 15,
                    zIndex: 10,
                },
                radialGradientCardContainer: {
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                },
                gradient: {},
                cardGradient: {},
                detailsContainer: {
                    position: 'relative',
                    flexDirection: 'row',
                    height: '85%',
                    width: '100%',
                    paddingRight: appPadding.md(),
                    paddingLeft: appPadding.md(),
                    paddingBottom: appPadding.lg(),
                    paddingTop: appPadding.lg(),
                    zIndex: 50,
                },
                mainMovieCard: {
                    borderRadius: appDimensions.cardRadius,
                    backgroundColor: appColors.primary,
                    height: '100%',
                    width: '100%',
                    overflow: 'hidden',
                    zIndex: 3,
                },
                descriptionContainer: {
                    width: '45%',
                },
                movieCardContainer: {
                    width: '55%',
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
                    zIndex: 50,
                },
                mainDot: {
                    backgroundColor: appColors.secondary,
                    opacity: 1,
                },
                sectionTitle: {
                    width: '100%',
                    borderBottomWidth: 0.5,
                    borderBottomColor: appColors.secondary,
                },
                dotsContainer: {
                    flexDirection: 'row',
                    height: tvPixelSizeForLayout(100),
                    width: '100%',
                    paddingHorizontal: appPadding.md(),
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
                    zIndex: 1,
                    marginBottom: 5,
                },
                tooltip: {
                    position: 'absolute',
                    height: tvPixelSizeForLayout(350),
                    width: tvPixelSizeForLayout(700),
                    borderRadius: 15,
                    zIndex: 90,
                    padding: appPadding.md(),
                    paddingRight: appPadding.xl(),
                },
                tooltip2: {
                    bottom: tvPixelSizeForLayout(125),
                    left: tvPixelSizeForLayout(680),
                    width: tvPixelSizeForLayout(650),
                    zIndex: 90,
                },
                tooltip3: {
                    bottom: tvPixelSizeForLayout(120),
                    left: tvPixelSizeForLayout(700),
                    width: tvPixelSizeForLayout(690),
                    height: tvPixelSizeForLayout(550),
                    zIndex: 90,
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
                    // marginTop: 5,
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
                infoContainer: {
                    height: '100%',
                    width: '100%',
                    zIndex: 20,
                },
                infoTextContainer: {
                    padding: appPadding.md(),
                    height: '100%',
                    width: '100%',
                    justifyContent: 'center',
                },
                seriesTitleStyle: {
                    fontSize: Platform.isTV ? tvPixelSizeForLayout(32) : appFonts.xs,
                    fontFamily: appFonts.primary,
                    color: appColors.brandTint,
                    marginVertical: Platform.isTV ? tvPixelSizeForLayout(15) : 5,
                    marginBottom: 0,
                },
                infoTextStyle: {
                    fontSize: Platform.isTV ? tvPixelSizeForLayout(32) : appFonts.xs,
                    fontFamily: appFonts.primary,
                    color: appColors.secondary,
                },
                caption1: {
                    fontSize: Platform.isTV ? tvPixelSizeForLayout(24) : appFonts.xxs,
                    fontFamily: appFonts.primary,
                    color: Platform.isTV ? appColors.tertiary : appColors.caption,
                    textTransform: 'none',
                    marginBottom: 10,
                },
                titleStyle: {
                    fontSize: Platform.isTV ? tvPixelSizeForLayout(75) : appFonts.xxxlg,
                    fontFamily: appFonts.bold,
                    color: appColors.secondary,
                    marginBottom: 2,
                },
                redeemButtonContainer: {
                    flexDirection: 'row',
                    marginTop: 20,
                    width: '60%',
                },
                playButtonContainer: {
                    marginRight: 15,
                },
                radialGradientcontainer: {
                    flex: 1,
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 11,
                },
                lottieTooltip1: {
                    width: tvPixelSizeForLayout(800),
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    top: tvPixelSizeForLayout(115),
                    left: tvPixelSizeForLayout(300),
                    // left: Platform.OS === 'android' ? -95 : -65,
                    // top: Platform.OS === 'android' ? -50 : -36,
                    zIndex: 20,
                },
                lottieTooltip2: {
                    width: tvPixelSizeForLayout(800),
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    top: tvPixelSizeForLayout(60),
                    right: tvPixelSizeForLayout(250),
                    // left: Platform.OS === 'android' ? -95 : -65,
                    // top: Platform.OS === 'android' ? -50 : -36,
                    zIndex: 15,
                },
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    useEffect(() => {
        Animated.timing(fadeAnimTooltip, {
            toValue: 0.7,
            duration: 2000,
            useNativeDriver: true,
            delay: 400,
            // easing: Easing.in(Easing.quad),
        }).start();
        Animated.timing(fadeAnimTooltipText, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            delay: 900,
            // easing: Easing.in(Easing.quad),
        }).start();
        Animated.parallel([
            Animated.timing(enterCreditsAnimValue, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
                easing: Easing.in(Easing.quad),
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
        Animated.timing(enterTooltipAnimValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            delay: 400,
            // easing: Easing.in(Easing.quad),
        }).start();
        Animated.timing(enterCreditsAnimValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            // easing: Easing.in(Easing.quad),
        }).start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (showContent && counter < 3) {
            setTimeout(() => setCounter(counter => counter + 1), 200);
        }
    }, [counter, showContent]);

    var validityEndDate = new Date(); // Now
    validityEndDate.setDate(validityEndDate.getDate() + 30);

    const mockEntitlement = {
        contentId: onboardingResource!.id,
        validityTill: validityEndDate.getTime(),
    };

    const stylesPlayButton = defaultContentDetailsStyle({ appColors, appPadding, insets });

    const redeemFunction = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setCredits(0);
            setEntitlement(mockEntitlement);
            Animated.timing(fadeAnimTooltip2, {
                toValue: 0.8,
                duration: 2000,
                useNativeDriver: true,
                delay: 500,
            }).start();
            Animated.timing(fadeAnimTooltipText2, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
                delay: 900,
            }).start(() => {
                setHasTVPreferredFocus(true);
                tooltip4Button.current.focus();
            });
            Animated.timing(fadeAnimRadialGradientValue, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
                easing: Easing.in(Easing.quad),
            }).start();
        }, 1000);
    };

    const actionNext = () => {
        setHasTVPreferredFocus(false);
        Animated.timing(fadeAnimTooltip, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            // easing: Easing.in(Easing.quad),
        }).start(() => {
            redeemFunction();
        });
        Animated.timing(fadeAnimTooltipText, {
            toValue: 2,
            duration: 500,
            useNativeDriver: true,
            // easing: Easing.in(Easing.quad),
        }).start();
    };

    return (
        <View style={styles.container}>
            <View style={{ height: '100%', position: 'absolute', width: '100%', right: -80 }}>
                <GradientBackground height={'100%'} width={'100%'} />
            </View>
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
                    style={[styles.gradient, { width: tvPixelSizeForLayout(700), height: tvPixelSizeForLayout(700) }]}
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
                <CreditsUIButton credits={credits} loading={false} />
            </Animated.View>
            {/*<View>*/}
            {/*</View>*/}
            {/*<View style={styles.overlay} />*/}
            <View style={styles.detailsContainer}>
                <LottieView
                    style={styles.lottieTooltip1}
                    source={Tooltip3}
                    progress={fadeAnimTooltip}
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
                            opacity: fadeAnimTooltipText.interpolate({
                                inputRange: [0, 1, 2],
                                outputRange: [0, 1, 0], // 0 : 150, 0.5 : 75, 1 : 0
                            }),
                        },
                    ]}>
                    <Text style={styles.toolTipNumberText}>3 of 4</Text>
                    <Text style={styles.tooltipTextTint}>
                        {strings['tv.credit_walkthrough.tooltip3_1']}
                        <Text style={styles.tootlTip1Text}>{strings['tv.credit_walkthrough.tooltip3_2']}</Text>
                        <Text style={styles.tooltipTextTint}>
                            {strings['tv.credit_walkthrough.tooltip3_3']}
                            <Text style={styles.tootlTip1Text}>{strings['tv.credit_walkthrough.tooltip3_4']}</Text>
                        </Text>
                    </Text>
                    <View style={styles.buttonContainer}>
                        <TouchableHighlight
                            accessibilityLabel={'Next'}
                            ref={tooltip3Button}
                            activeOpacity={1}
                            nextFocusUp={findNodeHandle(tooltip3Button.current)}
                            nextFocusLeft={findNodeHandle(tooltip3Button.current)}
                            nextFocusRight={findNodeHandle(tooltip3Button.current)}
                            nextFocusDown={findNodeHandle(tooltip3Button.current)}
                            hasTVPreferredFocus={!hasTVPreferredFocus}
                            style={[styles.nextButton]}
                            onPress={() => {
                                actionNext();
                            }}>
                            <MaterialCommunityIcons color={colors.primary} size={30} name={'arrow-right'} />
                        </TouchableHighlight>
                    </View>
                </Animated.View>
                <LottieView
                    style={styles.lottieTooltip2}
                    source={Tooltip4}
                    progress={fadeAnimTooltip2}
                    loop={false}
                    onAnimationFinish={() => {
                        //LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
                    }}
                />
                <Animated.View
                    style={[
                        styles.tooltip,
                        styles.tooltip3,
                        {
                            opacity: fadeAnimTooltipText2.interpolate({
                                inputRange: [0, 1, 2],
                                outputRange: [0, 1, 0], // 0 : 150, 0.5 : 75, 1 : 0
                            }),
                        },
                    ]}>
                    <Text style={styles.toolTipNumberText}>4 of 4</Text>
                    <Text style={styles.tootlTip1Text}>
                        {strings['tv.credit_walkthrough.tooltip4_1']}
                        <Text style={styles.tooltipTextTint}>{strings['tv.credit_walkthrough.tooltip4_2']}</Text>
                        <Text style={styles.tootlTip1Text}>{strings['tv.credit_walkthrough.tooltip4_3']}</Text>
                    </Text>
                    <View style={styles.buttonContainer}>
                        <TouchableHighlight
                            accessibilityLabel={'Next'}
                            ref={tooltip4Button}
                            activeOpacity={1}
                            nextFocusUp={findNodeHandle(tooltip4Button.current)}
                            nextFocusLeft={findNodeHandle(tooltip4Button.current)}
                            nextFocusRight={findNodeHandle(tooltip4Button.current)}
                            nextFocusDown={findNodeHandle(tooltip4Button.current)}
                            // underlayColor={controlUnderlayColor}
                            hasTVPreferredFocus={hasTVPreferredFocus}
                            style={[styles.nextButton]}
                            onPress={() => {
                                navigation.navigate(NAVIGATION_TYPE.CREDITS_WALKTHROUGH_END, {
                                    setting: route.params && route.params.setting,
                                });
                            }}>
                            <MaterialCommunityIcons color={colors.primary} size={30} name={'arrow-right'} />
                        </TouchableHighlight>
                    </View>
                </Animated.View>
                <View style={styles.descriptionContainer}>
                    <View style={styles.infoContainer}>
                        <View style={styles.infoTextContainer}>
                            <View style={styles.logoContainer}>
                                <BrandLogo height={tvPixelSizeForLayout(50)} width={tvPixelSizeForLayout(125)} />
                            </View>
                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.infoTextStyle]}>
                                {strings['tv.credit_walkthrough.step3_1']}
                            </Text>
                            <Text style={[styles.titleStyle]}>{strings['tv.credit_walkthrough.step3_title']}</Text>
                            <View style={styles.titleContainerStyle}>
                                <Text style={[styles.caption1]}>{strings['tv.credit_walkthrough.step3_caption']}</Text>
                            </View>
                            <Text numberOfLines={3} ellipsizeMode={'tail'} style={[styles.infoTextStyle]}>
                                {strings['tv.credit_walkthrough.step3_description']}
                            </Text>
                            <View style={styles.redeemButtonContainer}>
                                {entitlement && (
                                    <View style={styles.playButtonContainer}>
                                        <PlayButton
                                            styles={stylesPlayButton}
                                            // isFocusTopButton={isFocusTopButton}
                                            playAvailable={true}
                                            onPress={() => {}}
                                            appColors={appColors}
                                        />
                                    </View>
                                )}
                                <RedeemButton
                                    asset={onboardingResource!}
                                    style={styles.redeemButton}
                                    entitlement={isLoading ? undefined : entitlement}
                                    loading={isLoading}
                                    onPress={() => {}}
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.movieCardContainer}>
                    <View style={[styles.mainMovieCard]}>
                        <View style={[styles.radialGradientCardContainer]}>
                            <GradientBackground height={'100%'} width={'100%'} />
                        </View>
                        <View style={styles.playButton}>
                            <MaterialCommunityIcons color={colors.primary} size={90} name={'play'} />
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.dotsContainer}>
                <View style={[styles.sectionTitle]} />
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
    );
};

export default CreditsWalkthroughTVStep3;
