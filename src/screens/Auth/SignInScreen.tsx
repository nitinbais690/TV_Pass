import React, { useEffect, useRef, useState } from 'react';
import { useDimensions } from '@react-native-community/hooks';
import { useAuth } from 'contexts/AuthContextProvider';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { Text, View, ScrollView, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { loginValidate } from 'helper/validateRules';
import useForm from 'helper/useForm';
import useFunction from 'helper/useFunction';
import { defaultSigninStyle } from 'styles/Signin.style';
import { formStyle } from 'styles/Common.style';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { useLocalization } from 'contexts/LocalizationContext';
import Button from 'screens/components/Button';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { AppEvents } from 'utils/ReportingUtils';
import BackgroundGradient from 'screens/components/BackgroundGradient';
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
    const inputRef1 = useRef();
    const inputRef2 = useRef();
    let { appColors, appPadding } = prefs.appTheme!(prefs);
    const { values, handleSubmit, handleChange } = useForm(initialValues, handleSubmitCB, loginValidate);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({
        email: '',
    });
    const [submitError, setSubmitError] = useState<ErrorMessage>({
        displayError: false,
        message: '',
    });

    const { width, height } = useDimensions().window;
    const isPortrait = height > width;
    const { isEmail } = useFunction();
    const userAction = useAuth();
    const { login } = userAction;
    const styles = defaultSigninStyle({ appColors, appPadding, isPortrait });
    const formStyles = formStyle({ appColors, appPadding, isPortrait });
    const { recordEvent } = useAnalytics();
    const { Alert } = useAlert();

    async function handleSubmitCB() {
        setIsSubmitLoading(true);
        login({
            email: trim(values.email),
            password: trim(values.password),
            signedUpInSession: false,
            silentLogin: false,
        })
            .then(() => {
                recordEvent(AppEvents.LOGIN);
            })
            .catch(err => {
                // Check if there is no account exist with given email, display alert for signup
                if (err === 'eV2327') {
                    Alert.alert(strings['signin.email_error_title'], strings['signin.email_error_msg'], [
                        {
                            text: strings['signup.title'],
                            onPress: () => navigation.push(NAVIGATION_TYPE.AUTH_SIGN_UP),
                        },
                        {
                            text: strings['signin.try_again'],
                            onPress: () => {},
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

    const trim = (val: string) => {
        return val.trim();
    };

    useEffect(() => {
        if (Platform.isTV) {
            inputRef1.current.focus();
        }
    }, []);

    const triggerFocus = () => {
        if (Platform.isTV) {
            if (!values.email || formErrors.email) {
                inputRef1.current.focus();
            } else if (values.email && !formErrors.email && !values.password) {
                inputRef2.current.focus();
            }
        }
    };

    return (
        <BackgroundGradient>
            <ScrollView contentContainerStyle={formStyles.container} scrollEnabled={false}>
                <View style={[formStyles.formContainer, styles.formContainer]}>
                    <View style={formStyles.formGroup}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleLabel}>{strings['signin.title']}</Text>
                        </View>
                        <FloatingLabelInput
                            ref={inputRef1}
                            inputType={InputType.email}
                            label={strings['auth.email_placeholder']}
                            isValid={isEmail(values.email)}
                            value={values.email}
                            errorMessage={formErrors.email}
                            onBlur={() => {
                                setFormErrors({
                                    ...formErrors,
                                    email: !isEmail(trim(values.email)) ? strings['auth.enter_valid_email'] : '',
                                });
                                triggerFocus();
                            }}
                            onChangeText={value => handleChange({ name: 'email', value: value.trim() })}
                        />
                        <View style={styles.subscribeLabel}>
                            <Text style={styles.subscribeLabelText}>{strings['signin.not_subscriber']}</Text>
                            <TouchableOpacity onPress={() => navigation.push(NAVIGATION_TYPE.AUTH_SIGN_UP)}>
                                <Text style={styles.subscribeSignupLabelText}> {strings['signup.title_small']}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={formStyles.formGroup}>
                        <FloatingLabelInput
                            ref={inputRef2}
                            inputType={InputType.password}
                            label={strings['auth.password_placeholder']}
                            value={values.password}
                            onBlur={() => triggerFocus()}
                            onChangeText={value => handleChange({ name: 'password', value: value })}
                        />
                    </View>
                    <View style={styles.forgotPasswordContainer}>
                        <Text style={styles.subscribeLabelText}>{strings['signin.forgot_your_password']}</Text>
                        <TouchableOpacity
                            testID="forgotPassword"
                            accessibilityLabel={'forgotPassword'}
                            onPress={() => navigation.push(NAVIGATION_TYPE.AUTH_FORGOT_PASSWORD)}>
                            <Text style={styles.forgotPasswordText}> {strings['signin.reset_it']}</Text>
                        </TouchableOpacity>
                    </View>
                    {submitError && submitError.displayError && (
                        <View style={styles.errorMessageContainer}>
                            <ErrorMessageBox value={submitError && submitError.message} />
                        </View>
                    )}
                    <Button
                        disabled={!values.email || !values.password || !isEmail(trim(values.email)) || isSubmitLoading}
                        title={strings['signin.btn_label']}
                        onPress={() => handleSubmit()}
                        loading={isSubmitLoading}
                    />
                </View>
            </ScrollView>
        </BackgroundGradient>
    );
};
export default SigninScreen;
