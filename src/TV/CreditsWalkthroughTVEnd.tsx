import React, { useRef, useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    Animated,
    InteractionManager,
    Easing,
    Linking,
    TouchableOpacity,
} from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appFonts, tvPixelSizeForLayout } from '../../AppStyles';
import CreditsIcon from '../../assets/images/brand_logo.png';
import { useLocalization } from 'contexts/LocalizationContext';
import FocusButton from 'screens/components/FocusButton';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import GradientBackground from '../../assets/images/backgroundRadianGradient.svg';
import { useUserData } from 'contexts/UserDataContextProvider';

const CreditsWalkthroughTVEnd = ({ navigation, route }: { navigation: any; route: any }): JSX.Element => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors, appDimensions } = appTheme(prefs);
    const { strings } = useLocalization();
    const param = route.params;
    const [hasTVPreferredFocus, setHasTVPreferredFocus] = useState(true);
    let animatedValue = useRef<Animated.Value>(new Animated.Value(0));
    const { updateSettingValue } = useUserData();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                mainContainer: {
                    backgroundColor: appColors.primary,
                    flex: 1,
                    justifyContent: 'center',
                },
                container: {
                    flex: 1,
                    justifyContent: 'center',
                },
                endTitle: {
                    color: appColors.secondary,
                    alignSelf: 'center',
                    fontFamily: appFonts.bold,
                    fontSize: tvPixelSizeForLayout(70),
                    fontWeight: '600',
                    width: appDimensions.fullWidth / 2,
                    textAlign: 'center',
                },
                endTitleSpan: {
                    color: appColors.brandTint,
                    alignSelf: 'center',
                    fontFamily: appFonts.bold,
                    fontSize: tvPixelSizeForLayout(70),
                    fontWeight: '600',
                },
                endDescription: {
                    color: appColors.secondary,
                    alignSelf: 'center',
                    fontFamily: appFonts.bold,
                    fontSize: tvPixelSizeForLayout(32),
                    fontWeight: '600',
                    textAlign: 'center',
                    marginTop: tvPixelSizeForLayout(20),
                },
                endDescriptionSpan: {
                    color: appColors.secondary,
                    alignSelf: 'center',
                    fontFamily: appFonts.bold,
                    fontSize: tvPixelSizeForLayout(32),
                    fontWeight: '600',
                    textAlign: 'center',
                },
                endDescriptionView: {
                    marginTop: tvPixelSizeForLayout(20),
                    borderBottomWidth: 1,
                    borderBottomColor: 'white',
                    marginLeft: 10,
                },
                creditsIconSpacing: {
                    alignSelf: 'center',
                    width: tvPixelSizeForLayout(230),
                    height: tvPixelSizeForLayout(230),
                    justifyContent: 'center',
                },
                buttonView: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '50%',
                    alignSelf: 'center',
                    marginTop: tvPixelSizeForLayout(40),
                },
                middleView: {
                    marginVertical: tvPixelSizeForLayout(190),
                },
                buttonContainer: {
                    width: tvPixelSizeForLayout(452),
                },
                iconImage: {
                    flex: 1,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                },
                gradientBackgroundStyle: {
                    position: 'absolute',
                    height: appDimensions.fullHeight,
                    width: appDimensions.fullWidth,
                },
                titleView: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                },
                lineView: {
                    flexDirection: 'row',
                    width: '60%',
                    alignSelf: 'center',
                },
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const titleAnimationStyle = {
        transform: [
            {
                translateY: animatedValue.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-80, 0],
                }),
            },
        ],
    };

    useEffect(() => {
        const runAnimations = () => {
            const duration = 800;
            Animated.timing(animatedValue.current, {
                delay: 0,
                toValue: 1,
                duration: duration,
                useNativeDriver: true,
                easing: Easing.out(Easing.quad),
            }).start();
        };

        InteractionManager.runAfterInteractions(() => runAnimations());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const goPrevious = () => {
        navigation.navigate(NAVIGATION_TYPE.CREDITS_WALKTHROUGH);
    };

    const onMoveNext = () => {
        if (param && route.params.setting) {
            updateSettingValue(true);
            setHasTVPreferredFocus(false);
            setTimeout(() => {
                navigation.navigate(NAVIGATION_TYPE.SETTINGS);
            }, 400);
        } else {
            navigation.navigate(NAVIGATION_TYPE.BROWSE);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.gradientBackgroundStyle}>
                <GradientBackground height={'100%'} width={'100%'} />
            </View>
            <View style={styles.container}>
                <Animated.View style={[styles.titleView, titleAnimationStyle]}>
                    <View style={styles.creditsIconSpacing}>
                        <Image style={styles.iconImage} source={CreditsIcon} />
                    </View>
                    <View style={styles.middleView}>
                        <Text style={styles.endTitle}>
                            {strings['tv.credit_walkthrough.end_title']}
                            <Text style={styles.endTitleSpan}>{' ' + strings['tv.credit_walkthrough.struum']}.</Text>
                        </Text>
                        <View style={styles.lineView}>
                            <Text style={styles.endDescription}>
                                {strings['tv.credit_walkthrough.end_description']}
                            </Text>
                            <TouchableOpacity
                                style={styles.endDescriptionView}
                                onPress={() => Linking.openURL('https://struum.com/help')}>
                                <Text style={styles.endDescriptionSpan}>
                                    {strings['tv.credit_walkthrough.strumm_link']}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
                <View style={styles.buttonView}>
                    <View style={styles.buttonContainer}>
                        <FocusButton
                            title={strings['tv.credit_walkthrough.take_walkthrough_again']}
                            onPress={() => goPrevious()}
                            blockFocusDown={true}
                            blockFocusUp={true}
                            blockFocusLeft={true}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <FocusButton
                            hasTVPreferredFocus={hasTVPreferredFocus}
                            title={strings['global.continue_btn']}
                            onPress={() => onMoveNext()}
                            blockFocusLeft={false}
                            blockFocusDown={true}
                            blockFocusRight={true}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default CreditsWalkthroughTVEnd;
