import React from 'react';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { Text, View, ScrollView, TouchableHighlight } from 'react-native';
import { onboardingStyle, onboardingStep4Style } from 'styles/Onboarding.style';
import Button from 'screens/components/Button';
import { Button as EButton } from 'react-native-elements';
import { useLocalization } from 'contexts/LocalizationContext';
import { useOnboarding } from 'contexts/OnboardingContext';
import CreditsIcon from '../../../assets/images/credits.svg';
import { CreditsUIButton } from 'screens/components/CreditsButton';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDimensions } from '@react-native-community/hooks';

const OnboardingRedeemContentScreen = (): JSX.Element => {
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    const { appColors, appPadding } = prefs.appTheme!(prefs);
    const insets = useSafeArea();
    const { onboardNavigation, onboardSkip } = useOnboarding();
    const { width, height } = useDimensions().window;
    const isPortrait = height > width;

    const styles = onboardingStep4Style({ appColors, appPadding, insets, isPortrait });
    const cStyles = onboardingStyle({ appColors, appPadding, insets, isPortrait });

    return (
        <ScrollView contentContainerStyle={cStyles.container} scrollEnabled={false}>
            <View style={[cStyles.wrapper, styles.step4Wrapper]}>
                <View style={[cStyles.headerCreditBtnCont, cStyles.headerCreditBtnCont1]}>
                    <CreditsUIButton credits={30} loading={false} />
                </View>
                <View style={cStyles.middleCont}>
                    <View />
                    <View style={styles.watchCreditBtnCont}>
                        <TouchableHighlight
                            onPress={() => {
                                onboardNavigation('onboardingRulesIntro');
                            }}
                            style={styles.watchCreditBtnHigh}>
                            <View style={styles.watchCreditBtnWrapper}>
                                <CreditsIcon />
                                <Text style={styles.watchCreditBtnText}>{strings['onboard.watch_10_credit']}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>

                <View style={cStyles.bottomContainer}>
                    <View style={cStyles.bottomWrapper}>
                        <View style={cStyles.bottomContentInfo}>
                            <Text style={cStyles.bottomContentInfoText}>
                                {strings['onboard.step4_select_prefix']}
                                <Text
                                    onPress={() => {
                                        onboardNavigation('onboardingRulesIntro');
                                    }}
                                    style={[cStyles.bottomContentInfoText, cStyles.bottomContentInfoWCText]}>
                                    {strings['onboard.step4_select_middle']}
                                </Text>
                                {strings['onboard.step4_select_suffix']}
                            </Text>
                        </View>
                        <View style={cStyles.bottomBtnSmt}>
                            <Button
                                title={strings['global.btn_continue']}
                                onPress={() => {
                                    onboardNavigation('onboardingRulesIntro');
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
export default OnboardingRedeemContentScreen;
