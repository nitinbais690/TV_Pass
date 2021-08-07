import React, { useContext, useState } from 'react';
import { useDimensions } from '@react-native-community/hooks';
import { Platform, ScrollView, Text, View, useTVEventHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
import BackgroundGradient from 'screens/components/BackgroundGradient';
import CheckedIcon from '../../../assets/images/checked.svg';
import UncheckedIcon from '../../../assets/images/unchecked.svg';
import FloatingLabelInput, { InputType } from '../components/FloatingLabelInput';
import ErrorMessageBox, { ErrorMessage } from '../components/ErrorMessageBox';
import { useAuth } from 'contexts/AuthContextProvider';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { authAction } from 'contexts/AuthContextProvider';
import { ClientContext } from 'qp-discovery-ui';
import { requestBody, isSuccess, errorCode, EvergentEndpoints } from 'utils/EvergentAPIUtil';
import SignUpScreenStepOne_Plan from '../../TV/SignUpScreenStepOne_Plan';
import SignUpScreenStepTwo_Email from '../../TV/SignUpScreenStepTwo_Email';
import SignUpScreenStepThree_Password from '../../TV/SignUpScreenStepThree_Password';

const initialValues = {
    email: '',
    password: '',
    sendEmailUpdates: true,
    region: 'US',
};

const SignUpScreen = (): JSX.Element => {
    const navigation = useNavigation();
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    let { appColors, appPadding } = prefs.appTheme!(prefs);
    const { values, handleSubmit, handleChange } = useForm(initialValues, handleSubmitCB, signupValidate);
    const { isEmail } = useFunction();
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [lastRemoteKeyEvent, setLastRemoteKeyEvent] = useState('');
    const [tvSignUpStep, setTvSignUpStep] = useState(1);
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
    const { signUp, login } = userAction;
    const { appConfig } = useAppPreferencesState();
    const { query } = useContext(ClientContext);
    const styles = defaultSignupStyle({ appColors, appPadding, isPortrait });
    const formStyles = formStyle({ appColors, appPadding, isPortrait });
    const { recordEvent } = useAnalytics();
    const createUserEndpoint = EvergentEndpoints.CreateUser;

    async function signUpEmail(withPassword: boolean) {
        setIsSubmitLoading(true);
        let obj = {
            email: trim(values.email),
            region: values.region,
            accountAttributes: [
                {
                    type: 'String',
                    attributeName: 'emailUpdates',
                    value: 'No',
                },
            ],
        };

        if (withPassword) {
            obj = {
                ...obj,
                customerUsername: trim(values.email),
                password: trim(values.password),
                customerPassword: trim(values.password),
                sendEmailUpdates: values.sendEmailUpdates,
                signedUpInSession: true,
            };
        }
        const body = requestBody(createUserEndpoint, appConfig, obj);
        let action = authAction({
            method: 'POST',
            endpoint: createUserEndpoint,
            body,
        });
        const { payload } = await query(action);
        if (isSuccess(createUserEndpoint, payload)) {
            return isSuccess(createUserEndpoint, payload);
        } else {
            throw errorCode(createUserEndpoint, payload);
        }
    }

    async function handleEmailSubmit(withPassword: boolean) {
        console.log('SIGNUP CALLED');
        signUpEmail(withPassword)
            .then(async () => {
                if (Platform.isTV) {
                    if (withPassword) {
                        login({
                            email: trim(values.email),
                            password: trim(values.password),
                            signedUpInSession: true,
                            silentLogin: false,
                        })
                            .then(() => {
                                //setTvSignUpStep(4);
                                console.log('LOGIN SUCCESS');
                                setIsSubmitLoading(false);
                            })
                            .catch(err => {
                                setIsSubmitLoading(false);
                                setSubmitError({
                                    displayError: true,
                                    message: strings['signup.error.' + err],
                                });
                            });
                    } else {
                        setIsSubmitLoading(false);
                        setTvSignUpStep(3);
                    }
                }
            })
            .catch(err => {
                setIsSubmitLoading(false);
                let msg: string;
                if (err) {
                    msg = strings.formatString(strings['global.error_code'], err) as string;
                }
                setSubmitError({
                    displayError: true,
                    message: strings['signup.error.' + err] || strings['global.error.message'] + msg,
                });
            });
    }

    // async function userProfile({ firstName, dateOfBirth }: { firstName: string; dateOfBirth: string | null }) {
    //     const body = requestBody(updateProfileEndpoint, appConfig, { firstName, dateOfBirth });

    //     let action = authAction({
    //         method: 'POST',
    //         endpoint: updateProfileEndpoint,
    //         body: body,
    //         accessToken,
    //     });
    //     const { payload } = await query(action);
    //     if (isSuccess(updateProfileEndpoint, payload)) {
    //         return responsePayload(updateProfileEndpoint, payload);
    //     } else {
    //         throw errorCode(updateProfileEndpoint, payload);
    //     }
    // }

    // async function signUpEmail() {
    //     setIsSubmitLoading(true);
    //     const body = requestBody(createUserEndpoint, appConfig, {
    //         email: trim(values.email),
    //         region: values.region,
    //         accountAttributes: [
    //             {
    //                 type: 'String',
    //                 attributeName: 'emailUpdates',
    //                 value: 'No',
    //             },
    //         ],
    //     });
    //     let action = authAction({
    //         method: 'POST',
    //         endpoint: createUserEndpoint,
    //         body,
    //     });
    //     const { payload } = await query(action);
    //     if (isSuccess(createUserEndpoint, payload)) {
    //         return isSuccess(createUserEndpoint, payload);
    //     } else {
    //         throw errorCode(createUserEndpoint, payload);
    //     }
    // }

    async function handleSubmitCB() {
        setIsSubmitLoading(true);
        signUp({
            email: trim(values.email),
            password: trim(values.password),
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
    const legalInfo = strings['signup.legal_info.prefix'];

    const openBrowser = (title: string) => {
        if (!Platform.isTV) {
            try {
                navigation.navigate(NAVIGATION_TYPE.BROWSE_WEBVIEW, {
                    type: title,
                });
            } catch (error) {
                console.log(`[InAppBrowser] Error loading title: ${title}`, error);
            }
        }
    };

    const trim = (val: string) => {
        return val.trim();
    };

    const myTVEventHandler = (evt: { eventType: string }) => {
        setLastRemoteKeyEvent(evt.eventType);
    };

    useTVEventHandler(myTVEventHandler);

    if (Platform.isTV) {
        switch (tvSignUpStep) {
            case 1:
                return <SignUpScreenStepOne_Plan openBrowser={openBrowser} setTvSignUpStep={setTvSignUpStep} />;
            case 2:
                return (
                    <SignUpScreenStepTwo_Email
                        values={values}
                        handleChange={handleChange}
                        setFormErrors={setFormErrors}
                        formErrors={formErrors}
                        submitError={submitError}
                        isSubmitLoading={isSubmitLoading}
                        handleSubmit={handleEmailSubmit}
                        lastRemoteKeyEvent={lastRemoteKeyEvent}
                    />
                );
            case 3:
                return (
                    <SignUpScreenStepThree_Password
                        values={values}
                        handleChange={handleChange}
                        setFormErrors={setFormErrors}
                        formErrors={formErrors}
                        submitError={submitError}
                        isSubmitLoading={isSubmitLoading}
                        lastRemoteKeyEvent={lastRemoteKeyEvent}
                        handleSubmit={handleEmailSubmit}
                    />
                );
            default:
                return <SignUpScreenStepOne_Plan navigation={navigation} setTvSignUpStep={setTvSignUpStep} />;
        }
    }

    return (
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
                            isValid={isEmail(values.email)}
                            value={values.email}
                            errorMessage={formErrors.email}
                            onBlur={() =>
                                setFormErrors({
                                    ...formErrors,
                                    email: !isEmail(values.email) ? strings['auth.enter_valid_email'] : '',
                                })
                            }
                            onChangeText={value => handleChange({ name: 'email', value: value.trim() })}
                        />
                    </View>
                    <View style={formStyles.formGroup}>
                        <FloatingLabelInput
                            inputType={InputType.password}
                            label={'Password'}
                            value={values.password}
                            onChangeText={value => handleChange({ name: 'password', value: value.trim() })}
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
                            onPress={() => handleChange({ name: 'sendEmailUpdates', value: !values.sendEmailUpdates })}
                        />
                        <Text style={styles.checkboxSectionText}>{strings['signup.promotion_info']}</Text>
                    </View>
                    <View style={styles.legelInfoContainer}>
                        <Button
                            disabled={
                                !values.email ||
                                !isEmail(values.email) ||
                                !values.password ||
                                passwordScore < 4 ||
                                isSubmitLoading
                            }
                            title={strings['signup.btn_label']}
                            onPress={() => handleSubmit()}
                            disabledColor={appColors.primaryVariant5}
                            loading={isSubmitLoading}
                        />
                        {legalInfo.length > 0 && (
                            <View style={styles.legelInfoWrapper}>
                                <Text style={styles.legalInfoContainerText}>
                                    {strings['signup.legal_info.prefix']}
                                    <Text style={styles.linkColor} onPress={() => openBrowser('termsCondition')}>
                                        {strings['signup.terms']}
                                    </Text>
                                    <Text>{strings['signup.and']}</Text>
                                    <Text style={styles.linkColor} onPress={() => openBrowser('privacyPolicy')}>
                                        {strings['signup.privacy']}
                                    </Text>
                                    <Text>{strings['signup.legal_info.suffix']}</Text>
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </BackgroundGradient>
    );
};
export default SignUpScreen;
