import React, { useEffect, useState, useRef } from 'react';
import { Text, View, StyleSheet, Platform, LayoutAnimation } from 'react-native';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appFonts, tvPixelSizeForLayout } from '../../AppStyles';
import CreditsIcon from '../../assets/images/credits_large.svg';
import FocusButton from 'screens/components/FocusButton';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import LottieView from 'lottie-react-native';
import { useIsFocused } from '@react-navigation/native';
import { useUserData } from 'contexts/UserDataContextProvider';

const CreditsWalkthroughTV = ({ navigation, route }: { navigation: any; route: any }): JSX.Element => {
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme(prefs);
    const param = route.params;
    const [showContent, setShowContent] = useState(false);
    const [hasTVPreferredFocus, setHasTVPreferredFocus] = useState(param && route.params.setting ? true : false);
    const [counter, setCounter] = useState(0);
    const [showExit, setShowExit] = useState(false);
    const isFocused = useIsFocused();
    const { updateSettingValue } = useUserData();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    flex: 1,
                    justifyContent: 'center',
                },
                titleOne: {
                    color: appColors.brandTint,
                    alignSelf: 'center',
                    fontFamily: appFonts.bold,
                    fontSize: tvPixelSizeForLayout(75),
                    fontWeight: '600',
                },
                titleTwo: {
                    alignSelf: 'center',
                    fontFamily: appFonts.semibold,
                    fontSize: tvPixelSizeForLayout(75),
                    fontWeight: '600',
                    color: appColors.secondary,
                },
                descriptionOne: {
                    alignSelf: 'center',
                    fontFamily: appFonts.primary,
                    fontSize: tvPixelSizeForLayout(45),
                    color: appColors.brandTint,
                },
                descriptionTwo: {
                    alignSelf: 'center',
                    fontFamily: appFonts.primary,
                    fontSize: tvPixelSizeForLayout(45),
                    color: appColors.secondary,
                    width: '60%',
                    textAlign: 'center',
                },
                creditsContainerTV: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    borderColor: appColors.border,
                    backgroundColor: 'transparent',
                    width: tvPixelSizeForLayout(510),
                    marginVertical: tvPixelSizeForLayout(90),
                    height: tvPixelSizeForLayout(270),
                    borderRadius: tvPixelSizeForLayout(150),
                    alignSelf: 'center',
                    paddingBottom: 15,
                },
                creditsIconSpacing: {
                    marginRight: tvPixelSizeForLayout(20),
                    marginTop: Platform.OS === 'ios' ? 80 : 30,
                },
                credits: {
                    fontFamily: appFonts.primary,
                    fontSize: tvPixelSizeForLayout(130),
                    color: appColors.secondary,
                    fontWeight: '500',
                    marginTop: Platform.OS === 'ios' ? 80 : 25,
                    alignSelf: 'center',
                },
                creditView: {
                    height: tvPixelSizeForLayout(760),
                    width: tvPixelSizeForLayout(760),
                    backgroundColor: 'transparent',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    borderRadius: tvPixelSizeForLayout(380),
                    position: 'absolute',
                },
                buttonView: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '50%',
                    alignSelf: 'center',
                    marginTop: tvPixelSizeForLayout(40),
                },
                buttonContainer: {
                    width: tvPixelSizeForLayout(452),
                },
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const onMoveNext = () => {
        setShowContent(false);
        setHasTVPreferredFocus(false);
        setShowExit(true);
    };

    const creditButtonRef = useRef();

    useEffect(() => {
        if (showContent && counter < 3) {
            setTimeout(() => setCounter(counter => counter + 1), 200);
        }
        if (!param) {
            setTimeout(() => {
                setHasTVPreferredFocus(true);
            }, 6000);
        }
    }, [counter, param, showContent]);

    useEffect(() => {
        setShowContent(false);
        setCounter(0);
        setShowExit(false);
        creditButtonRef.current && creditButtonRef.current.play();
        if (isFocused && param && route.params.setting) {
            setHasTVPreferredFocus(true);
        }
    }, [isFocused, param, route.params.setting]);

    const onPrevious = () => {
        if (route.params.setting) {
            updateSettingValue(true);
            setHasTVPreferredFocus(false);
            setTimeout(() => {
                navigation.navigate(NAVIGATION_TYPE.SETTINGS);
            }, 400);
        } else {
            navigation.navigate(NAVIGATION_TYPE.BROWSE);
        }
    };

    const renderCreditBtn = () => {
        return (
            <LottieView
                source={require('../../assets/animations/Lottie_OTT_Pill_Enter.json')}
                ref={creditButtonRef}
                autoPlay
                loop={false}
                onAnimationFinish={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
                    setShowContent(true);
                }}
                style={{
                    marginBottom: 15,
                    shadowColor: appColors.brandTint,
                    shadowOpacity: 0.5,
                    shadowOffset: {
                        width: 0,
                        height: 0,
                    },
                    shadowRadius: tvPixelSizeForLayout(190),
                    elevation: 0,
                }}
            />
        );
    };

    const renderExitBtn = () => {
        return (
            <LottieView
                source={require('../../assets/animations/Lottie_OTT_Pill_Exit.json')}
                autoPlay
                loop={false}
                onAnimationFinish={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
                    if (param && route.params.setting) {
                        navigation.navigate(NAVIGATION_TYPE.CREDITS_WALKTHROUGH_STEP_2, {
                            setting: route.params.setting,
                        });
                    } else {
                        navigation.navigate(NAVIGATION_TYPE.CREDITS_WALKTHROUGH_STEP_2);
                    }
                }}
                style={{ marginBottom: 15 }}
            />
        );
    };

    return (
        <BackgroundGradient>
            <View style={styles.container}>
                <View style={styles.creditView} />
                {showContent && (
                    <View>
                        <Text style={styles.titleOne}>{strings['tv.credit_walkthrough.startTitleOne']}</Text>
                        <Text style={styles.titleTwo}>{strings['tv.credit_walkthrough.startTitleTwo']}</Text>
                    </View>
                )}
                {!showExit && renderCreditBtn()}
                {showExit && renderExitBtn()}
                <View style={[styles.creditsContainerTV]}>
                    <View style={styles.creditsIconSpacing}>
                        {showContent && (
                            <CreditsIcon width={tvPixelSizeForLayout(100)} height={tvPixelSizeForLayout(100)} />
                        )}
                    </View>
                    {showContent && <Text style={styles.credits}>{counter}</Text>}
                </View>

                {showContent && (
                    <View>
                        <Text style={styles.descriptionOne}>{strings['tv.credit_walkthrough.startDescOne']}</Text>
                        <Text style={styles.descriptionTwo}>{strings['tv.credit_walkthrough.startDescTwo']}</Text>
                    </View>
                )}

                {showContent && (
                    <View style={styles.buttonView}>
                        <View style={styles.buttonContainer}>
                            <FocusButton
                                title={strings['tv.credit_walkthrough.skip_walkthrough']}
                                onPress={() => onPrevious()}
                                blockFocusDown={true}
                                blockFocusUp={true}
                                blockFocusLeft={true}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <FocusButton
                                hasTVPreferredFocus={hasTVPreferredFocus}
                                title={strings['global.continue_btn']}
                                onPress={() => {
                                    onMoveNext();
                                }}
                                blockFocusDown={true}
                                blockFocusUp={true}
                                blockFocusRight={true}
                            />
                        </View>
                    </View>
                )}
            </View>
        </BackgroundGradient>
    );
};

export default CreditsWalkthroughTV;
