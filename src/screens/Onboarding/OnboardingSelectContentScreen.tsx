import React, { useEffect, useRef } from 'react';
import { Text, View, Animated, TouchableWithoutFeedback } from 'react-native';
import Config from 'react-native-config';
import { useDimensions } from '@react-native-community/hooks';
import { useSafeArea } from 'react-native-safe-area-context';
import { AspectRatio } from 'qp-common-ui';
import { useLocalization } from 'contexts/LocalizationContext';
import { useOnboarding } from 'contexts/OnboardingContext';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { CreditsUIButton } from 'screens/components/CreditsButton';
import StorefrontCardView from 'screens/components/StorefrontCardView';
import { onboardingStyle } from 'styles/Onboarding.style';
import HeaderTabBar from '../components/HeaderTabBar';
import { routesMock } from '../../configs/OnboardingMockupData';
import { containerAdapter } from 'qp-discovery-ui';
import { ScreenOrigin } from '../../utils/ReportingUtils';
import StorefrontCatalog from '../components/StorefrontCatalog';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';

const OnboardingSelectContentScreen = (): JSX.Element => {
    const { strings }: any = useLocalization();
    const { width, height } = useDimensions().window;
    const prefs = useAppPreferencesState();
    const { appColors, appPadding } = prefs.appTheme!(prefs);
    const insets = useSafeArea();
    const { onboardNavigation, onboardingResource } = useOnboarding();
    const cStyles = onboardingStyle({ appColors, appPadding, insets, width });
    const { appConfig } = useAppPreferencesState();
    const isPortrait = height > width;
    const fadeOverlayAnimValue = useRef(new Animated.Value(0)).current;
    const shadowOpacityAnimValue = useRef(new Animated.Value(0)).current;
    const borderColorAnimValue = useRef(new Animated.Value(0)).current;
    const bottomTextFadeAnimValue = useRef(new Animated.Value(0.2)).current;

    useEffect(() => {
        Orientation.lockToPortrait();
        const duration = 500;
        Animated.parallel([
            Animated.timing(bottomTextFadeAnimValue, {
                toValue: 1,
                duration: duration,
                useNativeDriver: true,
            }),
            Animated.timing(fadeOverlayAnimValue, {
                toValue: 1,
                duration: duration,
                useNativeDriver: true,
            }),
            Animated.timing(shadowOpacityAnimValue, {
                toValue: 1,
                duration: duration,
                useNativeDriver: true,
            }),
            Animated.timing(borderColorAnimValue, {
                toValue: 1,
                duration: duration,
                useNativeDriver: false,
            }),
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

    const renderScene = () => {
        return (
            <Animated.View style={cStyles.vPlaceholderCont}>
                <StorefrontCatalog loading={false} error={false} containers={containers} pageOffset={0} />
            </Animated.View>
        );
    };

    return (
        <View style={cStyles.container}>
            <View style={cStyles.darkOverlay} />
            <View style={cStyles.creditsButtonContainerSelectcontent}>
                <CreditsUIButton credits={10} loading={false} />
            </View>
            <View style={cStyles.storeFrontCardContainer}>
                <Animated.View
                    style={[
                        {
                            opacity: fadeOverlayAnimValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0],
                            }),
                        },
                        cStyles.darkOverlay,
                    ]}
                />
                <Animated.View style={[cStyles.cardContainerShadow, { shadowOpacity: shadowOpacityAnimValue }]}>
                    <StorefrontCardView
                        resource={onboardingResource!}
                        isPortrait={isPortrait}
                        fallbackAspectRatio={AspectRatio._16by9}
                        onResourcePress={() => {
                            onboardNavigation('onboardingRedeemContent');
                        }}
                    />
                    <TouchableWithoutFeedback onPress={() => onboardNavigation('onboardingRedeemContent')}>
                        <Animated.View
                            style={[
                                cStyles.cardBorderHighlight,
                                {
                                    borderColor: borderColorAnimValue.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['transparent', appColors.brandTint],
                                    }),
                                },
                            ]}
                        />
                    </TouchableWithoutFeedback>
                </Animated.View>
            </View>
            <HeaderTabBar routes={routesMock} renderScene={renderScene} />
            <View style={cStyles.bottomContainer}>
                <View style={cStyles.bottomWrapper}>
                    <Animated.View style={[cStyles.bottomContentInfo, { opacity: bottomTextFadeAnimValue }]}>
                        <Text style={cStyles.bottomContentInfoText}>
                            <Text style={[cStyles.bottomContentInfoText, cStyles.bottomContentInfoWCText]}>
                                {strings['onboard.step3_showtime_content_1']}
                            </Text>
                            {strings['onboard.step3_showtime_content_2']}
                            <Text style={[cStyles.bottomContentInfoText, cStyles.bottomContentInfoWCText]}>
                                {strings['onboard.step3_showtime_content_3']}
                            </Text>
                            {strings['onboard.step3_showtime_content_4']}
                        </Text>
                    </Animated.View>
                </View>
            </View>
        </View>
    );
};
export default OnboardingSelectContentScreen;
