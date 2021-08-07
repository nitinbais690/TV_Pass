import React, { useEffect, useState } from 'react';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { Text, View, ScrollView } from 'react-native';
import { onboardingStyle, onboardingStep5Style } from 'styles/Onboarding.style';
import Button from 'screens/components/Button';
import { useLocalization } from 'contexts/LocalizationContext';
import { useOnboarding } from 'contexts/OnboardingContext';
import { CreditsUIButton } from 'screens/components/CreditsButton';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDimensions } from '@react-native-community/hooks';
import { DetailScreenUI } from '../DetailsScreen';
import { RedeemButton } from '../components/RedeemButton';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';

const OnboardingRulesIntroScreen = (): JSX.Element => {
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    const { appColors, appPadding } = prefs.appTheme!(prefs);
    const insets = useSafeArea();
    const { onboardingResource, onboardNavigation } = useOnboarding();
    const { width, height } = useDimensions().window;
    const isPortrait = height > width;

    const styles = onboardingStep5Style({ appColors, appPadding, insets, isPortrait, width });
    const cStyles = onboardingStyle({ appColors, appPadding, insets, isPortrait, width });

    const [isLoading, setIsLoading] = useState(true);

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

    var validityEndDate = new Date(); // Now
    validityEndDate.setDate(validityEndDate.getDate() + 30);

    const mockEntitlement = {
        contentId: onboardingResource!.id,
        validityTill: validityEndDate.getTime(),
    };

    useEffect(() => {
        setIsLoading(false);
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

    return (
        <ScrollView contentContainerStyle={cStyles.container} scrollEnabled={false}>
            <View style={[styles.step5Wrapper]}>
                <View style={cStyles.darkOverlay} />
                <View style={styles.creditsButtonContainer}>
                    <CreditsUIButton credits={0} loading={false} />
                </View>
                <View style={styles.redeemButtonContainer}>
                    <RedeemButton
                        asset={onboardingResource!}
                        entitlement={isLoading ? undefined : mockEntitlement}
                        loading={isLoading}
                        onPress={() => {}}
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
                {/*<View style={[cStyles.headerCreditBtnCont, cStyles.headerCreditBtnCont1]}>
                    <CreditsUIButton credits={20} loading={false} />
                </View>*/}

                {/*<View style={cStyles.middleCont}>
                    <View style={styles.playCreditBtnCont}>
                        <TouchableHighlight style={styles.playCreditBtnHigh}>
                            <View style={styles.playCreditBtnWrapper}>
                                <PlayIcon />
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.availCreditBtnCont}>
                        <TouchableHighlight style={styles.availCreditBtnHigh}>
                            <View style={styles.availCreditBtnWrapper}>
                                <CreditsSmallIcon />
                                <Text style={styles.availCreditBtnText}>{strings['onboard.avail_credit_days']}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>*/}
                <View style={cStyles.bottomContainer}>
                    <View style={cStyles.bottomWrapper}>
                        <View style={cStyles.bottomContentInfo}>
                            <Text style={[cStyles.bottomContentInfoText]}>
                                {strings['onboard.step5_content_info_1']}
                                <Text style={[cStyles.bottomContentInfoText, cStyles.bottomContentInfoWCText]}>
                                    {strings['onboard.step5_content_info_2']}
                                    <Text style={[cStyles.bottomContentInfoText]}>
                                        {strings['onboard.step5_content_info_3']}
                                    </Text>
                                </Text>
                            </Text>
                        </View>
                        <View style={cStyles.bottomBtnSmt}>
                            <Button
                                title={strings['global.btn_continue']}
                                onPress={() => {
                                    onboardNavigation('onboardingHelpScreen');
                                }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};
export default OnboardingRulesIntroScreen;
