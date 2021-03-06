import React, { useEffect } from 'react';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { Text, View, StyleSheet } from 'react-native';
import { onboardingStyle, onboardingStep7Style } from 'styles/Onboarding.style';
import { useLocalization } from 'contexts/LocalizationContext';
import { useOnboarding } from 'contexts/OnboardingContext';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDimensions } from '@react-native-community/hooks';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';
import { BrandLogo } from 'screens/components/BrandLogo';
// import StorefrontCatalog from 'screens/components/StorefrontCatalog';
// import Config from 'react-native-config';
// import { ScreenOrigin } from 'utils/ReportingUtils';
// import { containerAdapter } from 'qp-discovery-ui';
// import { routesMock } from 'configs/OnboardingMockupData';
// import HeaderTabBar from 'screens/components/HeaderTabBar';
// import StorefrontCardView from 'screens/components/StorefrontCardView';
// import { AspectRatio } from 'qp-common-ui';
import Button, { ButtonType } from 'screens/components/Button';
// import { useNavigation } from '@react-navigation/native';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import CreditsIcon from '../../../assets/images/credits_small.svg';
import LinearGradient from 'react-native-linear-gradient';
// import { selectDeviceType } from 'qp-common-ui';

const OnboardingHelpScreen = (): JSX.Element => {
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    const { appColors, appPadding } = prefs.appTheme!(prefs);
    const insets = useSafeArea();
    const { onboardSkip, onboardNavigation } = useOnboarding();
    const { width, height } = useDimensions().window;
    const isPortrait = height > width;
    // const { appConfig } = useAppPreferencesState();
    // const navigation = useNavigation();

    const styles = onboardingStep7Style({ appColors, appPadding, insets, isPortrait, width });
    const cStyles = onboardingStyle({ appColors, appPadding, insets, isPortrait, width });

    var validityEndDate = new Date(); // Now
    validityEndDate.setDate(validityEndDate.getDate() + 30);

    // const storefrontId = (appConfig && appConfig.storefrontId) || '';
    const creditIconSize = DeviceInfo.getDeviceType() === 'Tablet' ? 42 : 33;

    // const containerTest =
    //     Config.ENVIRONMENT === 'staging'
    //         ? require('../../configs/stagingOnboardingStorefront.json')
    //         : require('../../configs/productionOnboardingStorefront.json');
    // const containers = containerTest.data
    //     .map(container => {
    //         return containerAdapter(container, storefrontId, 'All', 'All', ScreenOrigin.BROWSE);
    //     })
    //     .filter(c => c.resources && c.resources.length > 0);

    useEffect(() => {
        return () => {
            if (DeviceInfo.getDeviceType() === 'Tablet') {
                Orientation.unlockAllOrientations();
            } else {
                Orientation.lockToPortrait();
            }
        };
    });

    // const renderScene = () => {
    //     return (
    //         <View style={cStyles.vPlaceholderCont}>
    //             <StorefrontCatalog loading={false} error={false} containers={containers} pageOffset={0} />
    //         </View>
    //     );
    // };

    return (
        <View style={cStyles.container}>
            {/* <View style={styles.storeFrontCardContainer}>
                <StorefrontCardView
                    resource={onboardingResource!}
                    isPortrait={isPortrait}
                    fallbackAspectRatio={AspectRatio._16by9}
                    cardType="EmptyCard"
                />
            </View> */}
            {/* <HeaderTabBar routes={routesMock} renderScene={renderScene} /> */}

            {/* <View style={styles.opaqueOverlay} /> */}
            <LinearGradient
                colors={['transparent', 'rgba(104, 110, 255, 0.7)']}
                useAngle={true}
                angle={40}
                style={[
                    {
                        ...StyleSheet.absoluteFillObject,
                    },
                ]}
            />
            <LinearGradient
                colors={['rgba(12, 16, 33, 1)', 'transparent']}
                useAngle={true}
                angle={360}
                locations={[0.5, 0.8]}
                style={[
                    {
                        ...StyleSheet.absoluteFillObject,
                    },
                ]}
            />
            <View style={styles.textOverlay}>
                <View style={styles.step7Wrapper}>
                    <View style={styles.logoContainer}>
                        <CreditsIcon width={creditIconSize} height={creditIconSize} fill={appColors.brandTint} />
                        <View style={{ paddingTop: 5 }}>
                            <BrandLogo />
                        </View>
                    </View>
                    <View style={styles.step7MiddleContainer}>
                        <View style={cStyles.bottomContentInfo}>
                            <Text style={[cStyles.bottomContentInfoText, styles.completedText]}>
                                {strings['onboard.step7_walkthrough_done_1']}
                                <Text style={[styles.completedText, cStyles.bottomContentInfoWCText]}>
                                    {strings['onboard.step7_walkthrough_done_2']}
                                    <Text style={styles.completedText}>
                                        {strings['onboard.step7_walkthrough_done_3']}
                                    </Text>
                                </Text>
                            </Text>
                        </View>
                        <Text style={styles.step7QuestionsContainer}>{strings['onboard.step7_have_questions']}</Text>
                    </View>
                    <View style={styles.step7BottomContainer}>
                        {/* <Text
                            onPress={() => {
                                onboardNavigation(NAVIGATION_TYPE.SETTINGS);
                            }}
                            style={styles.step7VisitText}>
                            {' '}
                            {strings['onboard.step7_credits_walkthrough']}{' '}
                        </Text>
                        <View style={cStyles.bottomBtnSmt}>
                            <Button
                                title={strings['onboard.step7_back_to_settings']}
                                onPress={() => {
                                    onboardSkip();
                                }}
                            />
                        </View> */}
                        <View style={cStyles.bottomBtnSmt}>
                            <Button
                                title={strings['onboard.continue']}
                                onPress={() => {
                                    onboardSkip();
                                }}
                            />
                        </View>
                        <View style={cStyles.bottomBtnSkip}>
                            <Button
                                title={strings['onboard.step7_credits_walkthrough']}
                                onPress={() => {
                                    onboardNavigation(NAVIGATION_TYPE.SETTINGS);
                                }}
                                buttonType={ButtonType.CancelButton}
                                type={'solid'}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};
export default OnboardingHelpScreen;
