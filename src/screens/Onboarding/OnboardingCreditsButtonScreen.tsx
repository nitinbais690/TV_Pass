import React, { useEffect, useRef } from 'react';
import { Text, View, Animated, Easing } from 'react-native';
import Config from 'react-native-config';
import Orientation from 'react-native-orientation-locker';
import DeviceInfo from 'react-native-device-info';
// @ts-ignore
import RadialGradient from 'react-native-radial-gradient';
import { AspectRatio } from 'qp-common-ui';
import { onboardingStep2Style, onboardingStyle } from 'styles/Onboarding.style';
import Button from 'screens/components/Button';
import { useLocalization } from 'contexts/LocalizationContext';
import { useOnboarding } from 'contexts/OnboardingContext';
import { CreditsUIButton } from 'screens/components/CreditsButton';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDimensions } from '@react-native-community/hooks';
import HeaderTabBar from '../components/HeaderTabBar';
import StorefrontCardView from '../components/StorefrontCardView';
import { containerAdapter } from 'qp-discovery-ui';
import { ScreenOrigin } from '../../utils/ReportingUtils';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import StorefrontCatalog from '../components/StorefrontCatalog';
import { routesMock } from '../../configs/OnboardingMockupData';

const OnboardingCreditsButtonScreen = (): JSX.Element => {
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    const insets = useSafeArea();
    const { appColors, appPadding } = prefs.appTheme!(prefs);
    const { onboardNavigation, onboardingResource } = useOnboarding();
    const { width, height } = useDimensions().window;
    const { appConfig } = useAppPreferencesState();
    const isPortrait = height > width;
    const enterCreditsAnimValue = useRef(new Animated.Value(0)).current;
    const bottomContainerAnimValue = useRef(new Animated.Value(0)).current;
    const gradientFadeValue = useRef(new Animated.Value(0)).current;
    const bottomTextFadeAnimValue = useRef(new Animated.Value(0)).current;

    const cStyles = onboardingStyle({ appColors, appPadding, insets, isPortrait, width, height });
    const stylesStep2 = onboardingStep2Style({ appColors, appPadding, insets });

    useEffect(() => {
        Orientation.lockToPortrait();
        Animated.sequence([
            Animated.timing(enterCreditsAnimValue, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
                // easing: Easing.in(Easing.quad),
            }),
            Animated.parallel([
                Animated.timing(gradientFadeValue, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                    easing: Easing.in(Easing.quad),
                }),
                Animated.timing(bottomTextFadeAnimValue, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                    easing: Easing.in(Easing.quad),
                    delay: 100,
                }),
                Animated.timing(bottomContainerAnimValue, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.ease),
                }),
            ]),
        ]).start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        return () => {
            if (DeviceInfo.getDeviceType() === 'Tablet') {
                Orientation.unlockAllOrientations();
            }
        };
    });

    const storefrontId = (appConfig && appConfig.storefrontId) || '';

    const containerTest =
        Config.ENVIRONMENT === 'staging'
            ? require('../../configs/stagingOnboardingStorefront.json')
            : require('../../configs/productionOnboardingStorefront.json');
    const containers = containerTest.data
        .map(container => {
            return containerAdapter(container, storefrontId, 'All', 'All', ScreenOrigin.BROWSE);
        })
        .filter(c => c.resources && c.resources.length > 0);

    const exitAnimations = () => {
        Animated.parallel([
            Animated.timing(bottomTextFadeAnimValue, {
                toValue: 0.1,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.in(Easing.quad),
            }),
            Animated.timing(gradientFadeValue, {
                toValue: 0,
                duration: 300,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onboardNavigation('onboardingSelectContent');
        });
    };

    const renderScene = () => {
        return (
            <Animated.View
                style={[
                    cStyles.vPlaceholderCont,
                    {
                        opacity: enterCreditsAnimValue,
                        transform: [
                            {
                                translateY: enterCreditsAnimValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [100, 0], // 0 : 150, 0.5 : 75, 1 : 0
                                }),
                            },
                        ],
                    },
                ]}>
                <StorefrontCatalog loading={false} error={false} containers={containers} pageOffset={0} />
            </Animated.View>
        );
    };

    return (
        <View style={cStyles.container}>
            <Animated.View
                style={[
                    stylesStep2.creditsButtonContainer,
                    {
                        transform: [
                            {
                                translateX: enterCreditsAnimValue.interpolate({
                                    inputRange: [0, 1, 2],
                                    outputRange: [-40, 0, 200], // 0 : 150, 0.5 : 75, 1 : 0
                                }),
                            },
                        ],
                    },
                ]}>
                <CreditsUIButton credits={10} loading={false} />
            </Animated.View>
            <View style={cStyles.darkOverlay} />
            <Animated.View
                style={[
                    stylesStep2.storeFrontCardContainer,
                    {
                        opacity: enterCreditsAnimValue,
                        transform: [
                            {
                                translateY: enterCreditsAnimValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [50, 0], // 0 : 150, 0.5 : 75, 1 : 0
                                }),
                            },
                        ],
                    },
                ]}>
                {/*<View style={stylesStep2.darkOverlay} />*/}
                <StorefrontCardView
                    resource={onboardingResource!}
                    isPortrait={isPortrait}
                    fallbackAspectRatio={AspectRatio._16by9}
                    onResourcePress={() => {
                        onboardNavigation('onboardingRedeemContent');
                    }}
                />
            </Animated.View>
            <HeaderTabBar routes={routesMock} renderScene={renderScene} />
            {/*<View style={cStyles.wrapper}>
            </View>*/}
            <Animated.View
                style={[
                    cStyles.bottomContainer,
                    {
                        transform: [
                            {
                                translateY: bottomContainerAnimValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [400, 0], // 0 : 150, 0.5 : 75, 1 : 0
                                }),
                            },
                        ],
                    },
                ]}>
                <View style={cStyles.bottomWrapper}>
                    <Animated.View style={[cStyles.bottomContentInfo, { opacity: bottomTextFadeAnimValue }]}>
                        <Text style={cStyles.bottomContentInfoText}>
                            {strings['onboard.step2_credits_info_1']}
                            <Text style={[cStyles.bottomContentInfoText, cStyles.bottomContentInfoWCText]}>
                                {strings['onboard.step2_credits_info_2']}
                            </Text>
                            {strings['onboard.step2_credits_info_3']}
                            <Text style={[cStyles.bottomContentInfoText, cStyles.bottomContentInfoWCText]}>
                                {strings['onboard.step2_credits_info_4']}
                            </Text>
                            {strings['onboard.step2_credits_info_5']}
                        </Text>
                    </Animated.View>
                    <Animated.View style={[cStyles.bottomBtnSmt, { opacity: bottomTextFadeAnimValue }]}>
                        <Button
                            title={strings['global.btn_continue']}
                            onPress={() => {
                                exitAnimations();
                            }}
                        />
                    </Animated.View>
                </View>
            </Animated.View>
            <Animated.View
                style={[
                    stylesStep2.radialGradientcontainer,
                    {
                        opacity: gradientFadeValue.interpolate({
                            inputRange: [0, 1, 2],
                            outputRange: [0, 1, 0],
                        }),
                    },
                ]}>
                <RadialGradient
                    style={[stylesStep2.radialGradient, { width: width, height: height / 2 }]}
                    colors={['rgba(104, 110, 255, 0.6)', 'rgba(104, 110, 255, 0.3)', 'rgba(12,16,33, 0)']}
                    stops={[0, 0.3, 0.7]}
                    center={[10, 40]}
                    radius={width / 1.2}
                />
            </Animated.View>
        </View>
    );
};
export default OnboardingCreditsButtonScreen;
