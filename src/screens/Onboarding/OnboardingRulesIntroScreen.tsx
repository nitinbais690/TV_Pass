import React from 'react';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { Text, View, ScrollView, TouchableHighlight } from 'react-native';
import { onboardingStyle, onboardingStep5Style } from 'styles/Onboarding.style';
import Button from 'screens/components/Button';
import { Button as EButton } from 'react-native-elements';
import { useLocalization } from 'contexts/LocalizationContext';
import { useOnboarding } from 'contexts/OnboardingContext';
import PlayIcon from '../../../assets/images/play_cta.svg';
import CreditsSmallIcon from '../../../assets/images/credits_small.svg';
import { CreditsUIButton } from 'screens/components/CreditsButton';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDimensions } from '@react-native-community/hooks';

const OnboardingRulesIntroScreen = (): JSX.Element => {
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    const { appColors, appPadding } = prefs.appTheme!(prefs);
    const insets = useSafeArea();
    const { onboardNavigation, onboardSkip } = useOnboarding();
    const { width, height } = useDimensions().window;
    const isPortrait = height > width;

    const styles = onboardingStep5Style({ appColors, appPadding, insets, isPortrait });
    const cStyles = onboardingStyle({ appColors, appPadding, insets, isPortrait });

    return (
        <ScrollView contentContainerStyle={cStyles.container} scrollEnabled={false}>
            <View style={[cStyles.wrapper, styles.step5Wrapper]}>
                <View style={[cStyles.headerCreditBtnCont, cStyles.headerCreditBtnCont1]}>
                    <CreditsUIButton credits={20} loading={false} />
                </View>
                <View style={cStyles.middleCont}>
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
                </View>
                <View style={cStyles.bottomContainer}>
                    <View style={cStyles.bottomWrapper}>
                        <View style={cStyles.bottomContentInfo}>
                            <Text style={cStyles.bottomContentInfoText}>{strings['onboard.step5_content_info']}</Text>
                        </View>
                        <View style={cStyles.bottomBtnSmt}>
                            <Button
                                title={strings['global.btn_continue']}
                                onPress={() => {
                                    onboardNavigation('onboardingReceiveCredit');
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
export default OnboardingRulesIntroScreen;
