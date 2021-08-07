import React, { useState } from 'react';
import { useDimensions } from '@react-native-community/hooks';
import { useAuth } from 'contexts/AuthContextProvider';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { signupValidate } from 'helper/validateRules';
import useForm from 'helper/useForm';
import useFunction from 'helper/useFunction';
import { defaultSignupStyle } from 'styles/Signup.style';
import { formStyle } from 'styles/Common.style';
import PasswordStrengthMeter, { getPasswordScore, getPasswordError } from 'screens/components/PasswordStrengthMeter';
import { useLocalization } from 'contexts/LocalizationContext';
import Button from 'screens/components/Button';
import { AppEvents } from 'utils/ReportingUtils';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';
import FloatingLabelInput, { InputType } from '../components/FloatingLabelInput';
import ErrorMessageBox, { ErrorMessage } from '../components/ErrorMessageBox';
import CheckedIcon from '../../../assets/images/checked.svg';
import UncheckedIcon from '../../../assets/images/unchecked.svg';

const initialValues = {
    email: '',
    password: '',
    sendEmailUpdates: true,
    region: 'US',
};

const SignUpScreen = (): JSX.Element => {
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    let { appColors, appPadding } = prefs.appTheme!(prefs);
    const { values, handleSubmit, handleChange } = useForm(initialValues, handleSubmitCB, signupValidate);
    const { isEmail } = useFunction();
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({
        email: '',
        password: '',
    });
    const [submitError, setSubmitError] = useState<ErrorMessage>({
        displayError: false,
        message: '',
    });

    const { width, height } = useDimensions().window;
    const isPortrait = height > width;
    const userAction = useAuth();
    const { signUp } = userAction;
    const styles = defaultSignupStyle({ appColors, appPadding, isPortrait });
    const formStyles = formStyle({ appColors, appPadding, isPortrait });
    const { recordEvent } = useAnalytics();

    async function handleSubmitCB() {
        setIsSubmitLoading(true);
        signUp({
            email: values.email,
            password: values.password,
            region: values.region,
            sendEmailUpdates: values.sendEmailUpdates,
            signedUpInSession: true,
        })
            .then(() => {
                recordEvent(AppEvents.SIGN_UP);
            })
            .catch(err => {
                let msg: string;
                if (err) {
                    msg = strings.formatString(strings['global.error_code'], err) as string;
                }
                setSubmitError({
                    displayError: true,
                    message: strings['signup.error.' + err] || strings['global.error.message'] + msg,
                });
                setIsSubmitLoading(false);
            });
    }

    const passwordScore = getPasswordScore(values.password);
    const legalInfo = strings['signup.legal_info'];

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={formStyles.keyboardAvoidView}>
            <BackgroundGradient>
                <ScrollView contentContainerStyle={styles.container} scrollEnabled={isPortrait}>
                    <View style={[formStyles.formContainer, styles.formContainer]}>
                        <View style={formStyles.formGroup}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.titleLabel}>{strings['signup.title']}</Text>
                            </View>
                            <FloatingLabelInput
                                inputType={InputType.email}
                                label={strings['auth.email_placeholder']}
                                isValid
                                value={values.email}
                                errorMessage={formErrors.email}
                                onChangeText={value => handleChange({ name: 'email', value })}
                            />
                        </View>
                        <View style={formStyles.formGroup}>
                            <FloatingLabelInput
                                inputType={InputType.password}
                                label={'Password'}
                                value={values.password}
                                onChangeText={value => handleChange({ name: 'password', value })}
                                onBlur={() =>
                                    setFormErrors({
                                        ...formErrors,
                                        password: getPasswordError(values.password)
                                            ? strings['auth.password_' + getPasswordError(values.password)]
                                            : '',
                                    })
                                }
                                errorMessage={formErrors.password}
                            />
                        </View>
                        <View style={styles.passInstructionLabel}>
                            <Text style={styles.passInstructionLabelText}>{strings['auth.password_instruction']}</Text>
                        </View>
                        <PasswordStrengthMeter password={values.password} />
                        {submitError.displayError && <ErrorMessageBox value={submitError.message} />}
                        <View style={styles.checkboxSection}>
                            <CheckBox
                                containerStyle={{ padding: 0 }}
                                checked={values.sendEmailUpdates}
                                checkedIcon={<CheckedIcon />}
                                uncheckedIcon={<UncheckedIcon />}
                                onPress={() =>
                                    handleChange({ name: 'sendEmailUpdates', value: !values.sendEmailUpdates })
                                }
                            />
                            <Text style={styles.checkboxSectionText}>{strings['signup.promotion_info']}</Text>
                        </View>
                        <View style={styles.legelInfoContainer}>
                            {legalInfo.length > 0 && (
                                <View style={styles.legelInfoWrapper}>
                                    <Text style={styles.legalInfoContainerText}>{strings['signup.legal_info']}</Text>
                                </View>
                            )}
                        </View>
                        <Button
                            disabled={
                                !values.email ||
                                !isEmail(values.email) ||
                                !values.password ||
                                passwordScore < 3 ||
                                isSubmitLoading
                            }
                            title={strings['signup.btn_label']}
                            onPress={() => handleSubmit()}
                            loading={isSubmitLoading}
                        />
                    </View>
                </ScrollView>
            </BackgroundGradient>
        </KeyboardAvoidingView>
    );
};
export default SignUpScreen;
