import React, { useState, useRef } from 'react';
import { useDimensions } from '@react-native-community/hooks';
import { useAuth } from 'contexts/AuthContextProvider';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import {
    Text,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableHighlight,
    StyleSheet,
    ImageBackground,
} from 'react-native';
import { loginValidate } from 'helper/validateRules';
import useForm from 'helper/useForm';
import { defaultSigninStyle } from 'styles/Signin.style';
import { formStyle } from 'styles/Common.style';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { useLocalization } from 'contexts/LocalizationContext';
import Button from 'screens/components/Button';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { AppEvents } from 'utils/ReportingUtils';
import ErrorMessageBox, { ErrorMessage } from 'screens/components/ErrorMessageBox';
import { useAlert } from 'contexts/AlertContext';
import { SearchBar } from 'react-native-elements';
import { percentage } from 'qp-common-ui';

const SigninScreenTv = ({ navigation }: { navigation: any }): JSX.Element => {
    const initialValues = {
        email: '',
        password: '',
    };
    const [submitError, setSubmitError] = useState<ErrorMessage>({
        displayError: false,
        message: '',
    });
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    let { appColors, appPadding } = prefs.appTheme!(prefs);
    const { values, handleSubmit, handleChange } = useForm(initialValues, handleSubmitCB, loginValidate);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    const { width, height } = useDimensions().window;
    const isPortrait = height > width;
    const userAction = useAuth();
    const { login } = userAction;
    const styles = defaultSigninStyle({ appColors, appPadding, isPortrait });
    const style = StyleSheet.create({
        searchContainer: {
            padding: 0,
            margin: 0,
            backgroundColor: 'transparent',
        },
        inputs: {
            padding: 0,
            borderRadius: 5,
            borderWidth: 1,
        },
        textinputContainer: {
            width: percentage(36, true),
            borderRadius: 5,
        },
        passwordContainer: {
            marginBottom: percentage(7, true),
        },
        textStyle: {
            color: appColors.secondary,
        },
    });
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

    const [shouldApplyUsernameFocusStyle, setShouldApplyUsernameFocusStyle] = useState(false);
    const [shouldApplyPasswordFocusStyle, setShouldApplyPasswordFocusStyle] = useState(false);
    const usernameRef = useRef<SearchBar>(null);
    const passwordRef = useRef<SearchBar>(null);
    const focusUsername = () => {
        if (usernameRef !== null && usernameRef.current !== null) {
            usernameRef.current.focus();
        }
    };
    const focusPassword = () => {
        if (passwordRef !== null && passwordRef.current !== null) {
            passwordRef.current.focus();
        }
    };
    const usernameFocusStyle = shouldApplyUsernameFocusStyle
        ? {
              borderWidth: 1,
              borderBottomWidth: 1,
              borderColor: appColors.brandTint,
              backgroundColor: appColors.primaryVariant3,
              elevation: 0,
          }
        : {
              borderBottomWidth: 0,
              backgroundColor: 'transparent',
              borderColor: appColors.brandTint,
              elevation: 0,
          };
    const passwordFocusStyle = shouldApplyPasswordFocusStyle
        ? {
              borderWidth: 1,
              borderBottomWidth: 1,
              borderColor: appColors.brandTint,
              backgroundColor: appColors.primaryVariant3,
              elevation: 0,
          }
        : { borderBottomWidth: 0, backgroundColor: 'transparent', elevation: 0 };

    const logoSource = require('../../../assets/images/splash_login_screen.jpg');

    return (
        <ImageBackground style={{ flex: 1 }} resizeMode="cover" source={logoSource}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={formStyles.keyboardAvoidView}>
                <ScrollView contentContainerStyle={formStyles.container} scrollEnabled={false}>
                    <View style={[formStyles.formContainer, styles.formContainer]}>
                        <View style={formStyles.formGroup}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.titleLabel}>{strings['signin.title']}</Text>
                            </View>
                            <TouchableHighlight
                                style={style.textinputContainer}
                                underlayColor={appColors.tertiary}
                                hasTVPreferredFocus={true}
                                activeOpacity={0.5}
                                onPress={() => {
                                    focusUsername();
                                }}
                                onFocus={() => setShouldApplyUsernameFocusStyle(true)}
                                onBlur={() => setShouldApplyUsernameFocusStyle(false)}>
                                <SearchBar
                                    accessibilityLabel={'Username'}
                                    placeholder={strings['auth.email_placeholder']}
                                    lightTheme={false}
                                    containerStyle={style.inputs}
                                    inputStyle={style.textStyle}
                                    inputContainerStyle={[usernameFocusStyle]}
                                    value={values.email}
                                    onChangeText={value => handleChange({ name: 'email', value })}
                                    ref={usernameRef}
                                    searchIcon={false}
                                    clearIcon={false}
                                />
                            </TouchableHighlight>
                        </View>
                        <View style={formStyles.formGroup}>
                            <TouchableHighlight
                                style={[style.textinputContainer, style.passwordContainer]}
                                underlayColor={appColors.tertiary}
                                activeOpacity={0.5}
                                onPress={() => {
                                    focusPassword();
                                }}
                                onFocus={() => setShouldApplyPasswordFocusStyle(true)}
                                onBlur={() => setShouldApplyPasswordFocusStyle(false)}>
                                <SearchBar
                                    accessibilityLabel={'Password'}
                                    placeholder={strings['auth.password_placeholder']}
                                    lightTheme={false}
                                    containerStyle={style.inputs}
                                    inputStyle={style.textStyle}
                                    inputContainerStyle={[passwordFocusStyle]}
                                    value={values.password}
                                    secureTextEntry={true}
                                    onChangeText={value => handleChange({ name: 'password', value })}
                                    ref={passwordRef}
                                    searchIcon={false}
                                    clearIcon={false}
                                />
                            </TouchableHighlight>
                        </View>

                        {submitError && submitError.displayError && (
                            <View style={styles.errorMessageContainer}>
                                <ErrorMessageBox value={submitError && submitError.message} />
                            </View>
                        )}
                        <Button
                            disabled={!values.email || !values.password || isSubmitLoading}
                            hasTVPreferredFocus={false}
                            title={strings['signin.btn_label']}
                            onPress={() => {
                                handleSubmit();
                            }}
                            loading={isSubmitLoading}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};
export default SigninScreenTv;
