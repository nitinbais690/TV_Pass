import React, { useEffect, useRef, useState } from 'react';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { Text, View, ScrollView, Animated } from 'react-native';
import { onboardingStyle, onboardingStep4Style } from 'styles/Onboarding.style';
import { useLocalization } from 'contexts/LocalizationContext';
import { useOnboarding } from 'contexts/OnboardingContext';
import { CreditsUIButton } from 'screens/components/CreditsButton';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDimensions } from '@react-native-community/hooks';
import { RedeemButton } from '../components/RedeemButton';
import { DetailScreenUI } from '../DetailsScreen';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';

const OnboardingRedeemContentScreen = (): JSX.Element => {
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    const { appColors, appPadding } = prefs.appTheme!(prefs);
    const insets = useSafeArea();
    const { onboardNavigation, onboardingResource } = useOnboarding();
    const { width, height } = useDimensions().window;
    const isPortrait = height > width;
    const fadeInAnimValue = useRef(new Animated.Value(0)).current;

    const styles = onboardingStep4Style({ appColors, appPadding, insets, isPortrait, width });
    const cStyles = onboardingStyle({ appColors, appPadding, insets, isPortrait, width });

    const [isLoading, setIsLoading] = useState(false);
    const MockParams = {
        params: {
            resource: onboardingResource,
            resourceType: onboardingResource!.type,
            resourceId: onboardingResource!.type,
            searchPosition: undefined,
            recommendedSearchWord: undefined,
            contentTabName: undefined,
        },
    };

    useEffect(() => {
        Animated.timing(fadeInAnimValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
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

    const exitFunction = () => {
        setIsLoading(true);
        setTimeout(() => {
            onboardNavigation('onboardingRulesIntro');
        }, 1000);
    };

    return (
        <ScrollView contentContainerStyle={cStyles.container} scrollEnabled={false}>
            <Animated.View style={[styles.step4Wrapper]}>
                <Animated.View style={[styles.fadeInWrapper, { opacity: fadeInAnimValue }]}>
                    <View style={cStyles.darkOverlay} />
                    <View style={styles.creditsButtonContainer}>
                        <CreditsUIButton credits={10} loading={false} />
                    </View>
                    <View style={styles.redeemButtonContainer}>
                        <RedeemButton
                            asset={onboardingResource!}
                            entitlement={undefined}
                            loading={isLoading}
                            onPress={() => exitFunction()}
                        />
                    </View>
                    <DetailScreenUI
                        route={MockParams}
                        isOnboarding={true}
                        dataResponse={{ loading: false, error: false, mainResource: onboardingResource! }}
                        entitlementResponse={{
                            loading: false,
                            entitled: false,
                            redeemError: false,
                            redeem: async () => {},
                        }}
                        cardType="EmptyCard"
                    />
                </Animated.View>
                <View style={cStyles.bottomContainer}>
                    <View style={cStyles.bottomWrapper}>
                        <Animated.View style={cStyles.bottomContentInfo}>
                            <Text style={cStyles.bottomContentInfoText}>
                                {strings['onboard.step4_select_prefix']}
                                <Text
                                    onPress={() => {
                                        onboardNavigation('onboardingRulesIntro');
                                    }}
                                    style={[cStyles.bottomContentInfoText, cStyles.bottomContentInfoWCText]}>
                                    {strings['onboard.step4_select_middle']}
                                </Text>
                            </Text>
                        </Animated.View>
                    </View>
                </View>
            </Animated.View>
        </ScrollView>
    );
};
export default OnboardingRedeemContentScreen;
