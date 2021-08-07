import React, { useState } from 'react';
import { StatusBar, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import CommonTitle from 'core/presentation/components/atoms/CommonTitle';
import PreloginCommonTemplate from 'core/presentation/components/templates/PreloginCommonTemplate';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import EmailAuthView from '../molecules';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import {
    EMAIL_AUTH_CONSTANTS,
    AUTH_TYPES,
    SHOW_WELCOME_BANNER,
    SHOW,
} from 'features/authentication/utils/auth-constants';
import { useAuth } from 'contexts/AuthContextProvider';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { AppEvents } from 'utils/ReportingUtils';
import useForm from 'helper/useForm';
import { emailValidate, loginValidate, signUpValidate } from 'helper/validateRules';
import { EvergentAPIError } from 'features/profile/api/evergent-api-error';
import { LOGIN_ERROR_CODES } from 'features/profile/api/profile-api-constants';
import { useFetchAccountExists } from 'features/authentication/presentation/hooks/useFetchAccountExists';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';
import { authStyles } from 'features/authentication/styles/AuthStyles';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { useAlert } from 'contexts/AlertContext';
import { validateUserStyle } from './styles';

export default function EmailAuthTemplate(props: EmailAuthTemplateProps) {
    const { strings } = useLocalization();
    const appPref = useAppPreferencesState();
    const { appTheme } = appPref;
    let { appColors } = appTheme && appTheme(appPref);
    const userAction = useAuth();
    const { Alert } = useAlert();
    const { login, signUp } = userAction;
    const { recordEvent } = useAnalytics();
    const { fetchAccountExists } = useFetchAccountExists();
    const authStyle = authStyles(useAppColors());
    const validateUserStyles = validateUserStyle(useAppColors());
    const initialValues = {
        email: props.email,
        password: '',
    };
    const { values, handleSubmit, handleChange, errors, setUpdateValue } = useForm(
        initialValues,
        handleSubmitClick,
        getvalidationRule(),
    );
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    function getvalidationRule() {
        var validationRule;
        if (props.screenType === EMAIL_AUTH_CONSTANTS.ENTER_EMAIL_SCREEN) {
            validationRule = emailValidate;
        } else if (props.screenType === EMAIL_AUTH_CONSTANTS.SIGN_IN_SCREEN) {
            validationRule = loginValidate;
        } else {
            validationRule = signUpValidate;
        }
        return validationRule;
    }

    async function handleSubmitClick() {
        if (props.screenType === EMAIL_AUTH_CONSTANTS.ENTER_EMAIL_SCREEN) {
            if (values.email) {
                setIsSubmitLoading(true);
                const state = await fetchAccountExists(values.email);
                setIsSubmitLoading(false);
                const screenType = state.accountExist
                    ? EMAIL_AUTH_CONSTANTS.SIGN_IN_SCREEN
                    : EMAIL_AUTH_CONSTANTS.SIGN_UP_SCREEN;
                props.navigation.navigate(NAVIGATION_TYPE.AUTH_SIGN_IN, {
                    screenType: screenType,
                    signInType: AUTH_TYPES.EMAIL_SIGN_IN,
                    email: values.email,
                });
                setUpdateValue('password', '');
            }
        } else if (props.screenType === EMAIL_AUTH_CONSTANTS.SIGN_UP_SCREEN) {
            doSignUp();
        } else if (props.screenType === EMAIL_AUTH_CONSTANTS.SIGN_IN_SCREEN) {
            doSignIn();
        }
    }

    async function doSignIn() {
        setIsSubmitLoading(true);
        login({ email: values.email, password: values.password })
            .then(() => {
                navigateToProfileSelection();
                recordEvent(AppEvents.LOGIN);
            })
            .catch(error => {
                handleSignInError(error);
            });
    }

    function handleSignInError(error: any) {
        setIsSubmitLoading(false);
        if (error instanceof EvergentAPIError) {
            Alert.alert('', error.message, [
                {
                    text: strings['signin.try_again'],
                    style: 'cancel',
                },
                {
                    text:
                        error.code === LOGIN_ERROR_CODES.LOGIN_NO_USER_FOUND
                            ? strings['signup.title']
                            : strings['error.ok'],
                    onPress: () => {
                        if (error.code === LOGIN_ERROR_CODES.LOGIN_NO_USER_FOUND) {
                            props.navigation.navigate(NAVIGATION_TYPE.AUTH_SIGN_IN, {
                                screenType: EMAIL_AUTH_CONSTANTS.SIGN_UP_SCREEN,
                                signInType: AUTH_TYPES.EMAIL_SIGN_IN,
                                email: values.email,
                            });
                        }
                    },
                },
            ]);
        }
    }

    async function doSignUp() {
        if (values.email && values.password) {
            setIsSubmitLoading(true);
            signUp({
                email: values.email,
                password: values.password,
            })
                .then(async () => {
                    recordEvent(AppEvents.SIGN_UP);
                    await AsyncStorage.setItem(SHOW_WELCOME_BANNER, SHOW);
                    navigateToProfileSelection();
                })
                .catch(error => {
                    handleSignUpError(error);
                });
        }
    }

    function handleSignUpError(error: any) {
        if (error instanceof EvergentAPIError) {
            Alert.alert('', error.message, [
                {
                    text: strings['signin.try_again'],
                },
            ]);
        }
        setIsSubmitLoading(false);
    }

    function navigateToProfileSelection() {
        props.navigation.replace(NAVIGATION_TYPE.PROFILE_SELECTION);
    }

    return (
        <PreloginCommonTemplate>
            <StatusBar translucent backgroundColor={appColors.transparent} />
            <View>
                <CommonTitle
                    style={validateUserStyles.commonTitleStyle}
                    text={strings['header.sign_in']}
                    showThemedDot={true}
                />
                <EmailAuthView
                    navigation={props.navigation}
                    isLoading={isSubmitLoading}
                    email={values.email}
                    password={values.password}
                    screenType={props.screenType}
                    onChangeEmail={value => handleChange({ name: 'email', value })}
                    onChangePassword={value => handleChange({ name: 'password', value })}
                    emailError={strings[errors.email]}
                    passwordError={strings[errors.password]}
                    onPress={() => handleSubmit()}
                />
            </View>
            {isSubmitLoading && <AppLoadingIndicator style={authStyle.loaderStyle} />}
        </PreloginCommonTemplate>
    );
}

interface EmailAuthTemplateProps {
    screenType: string;
    navigation: any;
    email?: string;
}
