import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { Button as EButton } from 'react-native-elements';
import { useSafeArea } from 'react-native-safe-area-context';
import { AspectRatio } from 'qp-common-ui';
import { useLocalization } from 'contexts/LocalizationContext';
import { useOnboarding } from 'contexts/OnboardingContext';
import { AppConfig, useAppPreferencesState } from 'utils/AppPreferencesContext';
import { CreditsUIButton } from 'screens/components/CreditsButton';
import StorefrontCardView from 'screens/components/StorefrontCardView';
import { onboardingStyle } from 'styles/Onboarding.style';
import Button from 'screens/components/Button';

const OnboardingSelectContentScreen = (): JSX.Element => {
    const { strings }: any = useLocalization();
    const { width, height } = useDimensions().window;
    const prefs = useAppPreferencesState();
    const { appColors, appPadding } = prefs.appTheme!(prefs);
    const insets = useSafeArea();
    const { onboardNavigation, onboardSkip } = useOnboarding();
    const cStyles = onboardingStyle({ appColors, appPadding, insets });
    const { appConfig } = useAppPreferencesState();
    const isPortrait = height > width;

    const onboardMetadata = (appConfig: AppConfig | undefined) => {
        if (!(appConfig && appConfig.onboardingResource)) {
            return {};
        }

        try {
            const resourceJsonString = global.Buffer.from(appConfig.onboardingResource, 'base64').toString('ascii');
            const resourceJson = JSON.parse(resourceJsonString);
            return resourceJson;
        } catch (e) {
            console.error('[Onboard Resource] Error parsing onboard meta-data: ', e);
        }
        return {};
    };

    const resource = onboardMetadata(appConfig);

    return (
        <ScrollView contentContainerStyle={cStyles.container} scrollEnabled={false}>
            <View style={cStyles.wrapper}>
                <View style={cStyles.headerCreditBtnCont}>
                    <CreditsUIButton credits={30} loading={false} />
                </View>
                <View style={cStyles.vPlaceholderCont}>
                    <StorefrontCardView
                        resource={resource}
                        isPortrait={isPortrait}
                        fallbackAspectRatio={AspectRatio._16by9}
                        onResourcePress={() => {
                            onboardNavigation('onboardingRedeemContent');
                        }}
                    />
                </View>
                <View style={cStyles.bottomContainer}>
                    <View style={cStyles.bottomWrapper}>
                        <View style={cStyles.bottomContentInfo}>
                            <Text style={cStyles.bottomContentInfoText}>
                                {strings['onboard.step3_showtime_content_1']}
                                <Text
                                    onPress={() => {
                                        onboardNavigation('onboardingRedeemContent');
                                    }}
                                    style={[cStyles.bottomContentInfoText, cStyles.bottomContentInfoWCText]}>
                                    {strings['onboard.step3_showtime_content_2']}
                                </Text>
                                <Text style={cStyles.bottomContentInfoText}>
                                    {strings['onboard.step3_showtime_content_3']}
                                </Text>
                            </Text>
                        </View>
                        <View style={cStyles.bottomBtnSmt}>
                            <Button
                                title={strings['global.btn_continue']}
                                onPress={() => {
                                    onboardNavigation('onboardingRedeemContent');
                                }}
                            />
                        </View>
                        <View style={cStyles.bottomBtnSkip}>
                            <EButton
                                title={strings['onboard.skip_tutorial']}
                                titleStyle={cStyles.bottomBtnSkipText}
                                type="clear"
                                onPress={() => {
                                    onboardSkip();
                                }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};
export default OnboardingSelectContentScreen;
