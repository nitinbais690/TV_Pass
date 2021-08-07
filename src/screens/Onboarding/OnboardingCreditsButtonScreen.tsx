import React from 'react';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { Text, View, ScrollView } from 'react-native';
import { onboardingStyle } from 'styles/Onboarding.style';
import Button from 'screens/components/Button';
import { Button as EButton } from 'react-native-elements';
import { useLocalization } from 'contexts/LocalizationContext';
import { useOnboarding } from 'contexts/OnboardingContext';
import { CreditsUIButton } from 'screens/components/CreditsButton';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDimensions } from '@react-native-community/hooks';

const OnboardingCreditsButtonScreen = (): JSX.Element => {
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    const insets = useSafeArea();
    const { appColors, appPadding } = prefs.appTheme!(prefs);
    const { onboardNavigation, onboardSkip } = useOnboarding();
    const { width, height } = useDimensions().window;
    const isPortrait = height > width;

    const cStyles = onboardingStyle({ appColors, appPadding, insets, isPortrait });

    return (
        <ScrollView contentContainerStyle={cStyles.container} scrollEnabled={false}>
            <View style={cStyles.wrapper}>
                <View style={cStyles.headerCreditBtnCont}>
                    <CreditsUIButton credits={30} loading={false} />
                </View>
                <View style={cStyles.middleCont} />
                <View style={cStyles.bottomContainer}>
                    <View style={cStyles.bottomWrapper}>
                        <View style={cStyles.bottomContentInfo}>
                            <Text style={cStyles.bottomContentInfoText}>{strings['onboard.step2_credits_info']}</Text>
                        </View>
                        <View style={cStyles.bottomBtnSmt}>
                            <Button
                                title={strings['global.btn_continue']}
                                onPress={() => {
                                    onboardNavigation('onboardingSelectContent');
                                }}
                            />
                        </View>
                        <View style={cStyles.bottomBtnSkip}>
                            <EButton
                                titleStyle={cStyles.bottomBtnSkipText}
                                title={strings['onboard.skip_tutorial']}
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
export default OnboardingCreditsButtonScreen;
