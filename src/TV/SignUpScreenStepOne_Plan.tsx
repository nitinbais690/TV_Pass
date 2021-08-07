import React from 'react';
import { useDimensions } from '@react-native-community/hooks';
import { Text, View, TouchableHighlight } from 'react-native';
import { defaultSignupTVStyle } from 'styles/Signup.style';
import { useLocalization } from 'contexts/LocalizationContext';
import FocusButton from 'screens/components/FocusButton';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useAlert } from 'contexts/AlertContext';

const SignUpScreenStepOne_Plan = ({ setTvSignUpStep }: { setTvSignUpStep: (step: number) => void }): JSX.Element => {
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    let { appColors, appPadding } = prefs.appTheme!(prefs);
    const { Alert, dismiss } = useAlert();
    const { width, height } = useDimensions().window;
    const isPortrait = height > width;
    const styles = defaultSignupTVStyle({ appColors, appPadding, isPortrait });

    const handleTermsCondition = () => {
        Alert.alert(
            strings['title.view_terms_conditions'],
            strings['legal.terms_tv'],
            [
                {
                    text: strings['signup.close'],
                    onPress: dismiss,
                    style: 'cancel',
                },
            ],
            { cancelable: false },
        );
    };

    return (
        <BackgroundGradient>
            <View style={styles.containerTV}>
                <View style={styles.planContainer}>
                    <View style={[styles.titleContainer, styles.planTitle]}>
                        <Text style={styles.titleLabel}>{strings['signup.plan']}</Text>
                    </View>
                    <View style={[styles.titleContainer, styles.planTitle]}>
                        <Text style={styles.checkboxSectionTextTv}>{strings['signup.billing']}</Text>
                    </View>

                    <View style={[styles.subscribtionView]}>
                        <Text style={[styles.legalInfoContainerText, styles.planTypeStyle]}>
                            {strings['signup.monthly']}
                        </Text>
                        <Text
                            style={[
                                styles.subHeadingLabel,
                                styles.subScriptionAmountStyle,
                                styles.subScriptionBenefitText,
                            ]}>
                            {strings['signup.includes'] + ' 100 ' + strings['signup.benefit']}
                        </Text>
                        <Text style={[styles.passInstructionLabelText, styles.subScriptionAmountStyle]}>
                            {'$4.99' + strings['signup.subscription_details']}
                        </Text>
                    </View>
                    <View style={[styles.noticeView]}>
                        <Text style={[styles.legalInfoContainerText, styles.descPlanText]}>
                            {strings['signup.notice']}
                        </Text>
                    </View>

                    <View style={styles.plantvButtonContainer}>
                        <FocusButton
                            title={strings['signup.btn_label']}
                            onPress={() => setTvSignUpStep(2)}
                            unFocusedColor={appColors.primaryVariant5}
                            loading={false}
                        />
                    </View>

                    <TouchableHighlight activeOpacity={1} onPress={handleTermsCondition}>
                        <Text style={styles.termsTextStyle}>{strings['title.view_terms_conditions']}</Text>
                    </TouchableHighlight>
                </View>
            </View>
        </BackgroundGradient>
    );
};
export default SignUpScreenStepOne_Plan;
