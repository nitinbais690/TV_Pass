import React, { useState } from 'react';
import { useDimensions } from '@react-native-community/hooks';
import { useAuth } from 'contexts/AuthContextProvider';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { Text, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { loginValidate } from 'helper/validateRules';
import useForm from 'helper/useForm';
import { defaultSigninStyle } from 'styles/Signin.style';
import { formStyle } from 'styles/Common.style';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { useLocalization } from 'contexts/LocalizationContext';
import Button from 'screens/components/Button';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { AppEvents } from 'utils/ReportingUtils';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';
import FloatingLabelInput, { InputType } from '../components/FloatingLabelInput';
import ErrorMessageBox, { ErrorMessage } from 'screens/components/ErrorMessageBox';
import { useAlert } from 'contexts/AlertContext';

const initialValues = {
    email: '',
    password: '',
};

const SigninScreen = ({ navigation }: { navigation: any }): JSX.Element => {
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    let { appColors, appPadding } = prefs.appTheme!(prefs);
    const { values, handleSubmit, handleChange } = useForm(initialValues, handleSubmitCB, loginValidate);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [formErrors] = useState({
        email: '',
    });
    const [submitError, setSubmitError] = useState<ErrorMessage>({
        displayError: false,
        message: '',
    });

    const { width, height } = useDimensions().window;
    const isPortrait = height > width;
    const userAction = useAuth();
    const { login } = userAction;
    const styles = defaultSigninStyle({ appColors, appPadding, isPortrait });
    const formStyles = formStyle({ appColors, appPadding, isPortrait });
    const { recordEvent } = useAnalytics();
    const { Alert } = useAlert();
    //const { appConfig } = useAppPreferencesState();
    async function handleSubmitCB() {
        setIsSubmitLoading(true);
        login({ email: values.email.trim(), password: values.password, signedUpInSession: false, silentLogin: false })
            .then(() => {
                // const loadProfileScreen = appConfig && appConfig.showProfiles.toLowerCase() === 'true';
                // if (loadProfileScreen) {
                //     navigation.navigate('Profile');
                // } else {
                //     //setActiveProfile()
                //     navigation.navigate('AppTabsScreen');
                // }
                navigation.navigate('AppTabsScreen');
                recordEvent(AppEvents.LOGIN);
            })
            .catch(err => {
                // Check if there is no account exist with given email, display alert for signup
                if (err === 'eV2327') {
                    Alert.alert(strings['signin.email_error_title'], strings['signin.email_error_msg'], [
                        {
                            text: strings['signin.try_again'],
                            onPress: () => {},
                            style: 'cancel',
                        },
                        {
                            text: strings['signup.title'],
                            onPress: () => navigation.push(NAVIGATION_TYPE.AUTH_SIGN_UP),
                        },
                    ]);
                }
                setSubmitError({
                    displayError: true,
                    message: strings['signin.error.' + err] || strings['global.error.message'],
                });
                setIsSubmitLoading(false);
            });
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={formStyles.keyboardAvoidView}>
            <BackgroundGradient>
                <ScrollView contentContainerStyle={formStyles.container} scrollEnabled={false}>
                    <View style={[formStyles.formContainer, styles.formContainer]}>
                        <View style={formStyles.formGroup}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.titleLabel}>{strings['signin.title']}</Text>
                            </View>
                            <FloatingLabelInput
                                inputType={InputType.email}
                                label={strings['auth.email_placeholder']}
                                isValid
                                value={values.email}
                                errorMessage={formErrors.email}
                                onChangeText={value => handleChange({ name: 'email', value })}
                            />
                            <View style={styles.subscribeLabel}>
                                <Text style={styles.subscribeLabelText}>{strings['signin.not_subscriber']}</Text>
                                <TouchableOpacity
                                    onPress={() => navigation.push(NAVIGATION_TYPE.AUTH_SIGN_UP)}
                                    disabled={true}>
                                    <Text style={styles.subscribeSignupLabelText}> {strings.sign_aha_web}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={formStyles.formGroup}>
                            <FloatingLabelInput
                                inputType={InputType.password}
                                label={strings['auth.password_placeholder']}
                                value={values.password}
                                onChangeText={value => handleChange({ name: 'password', value })}
                            />
                        </View>
                        <View style={styles.forgotPasswordContainer}>
                            <Text style={styles.subscribeLabelText}>{strings['signin.forgot_your_password']}</Text>
                            <TouchableOpacity
                                testID="forgotPassword"
                                accessibilityLabel={'forgotPassword'}
                                disabled={true}
                                onPress={() => navigation.push(NAVIGATION_TYPE.AUTH_FORGOT_PASSWORD)}>
                                <Text style={styles.forgotPasswordText}> {strings.sign_aha_web}</Text>
                            </TouchableOpacity>
                        </View>
                        {submitError && submitError.displayError && (
                            <View style={styles.errorMessageContainer}>
                                <ErrorMessageBox value={submitError && submitError.message} />
                            </View>
                        )}
                        <Button
                            disabled={!values.email || !values.password || isSubmitLoading}
                            title={strings['signin.btn_label']}
                            onPress={() => handleSubmit()}
                            loading={isSubmitLoading}
                        />
                    </View>
                </ScrollView>
            </BackgroundGradient>
        </KeyboardAvoidingView>
    );
};
export default SigninScreen;
