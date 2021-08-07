import React, { useEffect, useState } from 'react';
import { useDimensions } from '@react-native-community/hooks';
import { ScrollView, Text, View } from 'react-native';
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
import {
    ActionEvents,
    Attributes,
    condenseErrorObject,
    getPageEventFromPageNavigation,
    getPageIdsFromPageEvents,
} from 'utils/ReportingUtils';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import CheckedIcon from '../../../assets/images/checked.svg';
import UncheckedIcon from '../../../assets/images/unchecked.svg';
import FloatingLabelInput, { InputType } from '../components/FloatingLabelInput';
import ErrorMessageBox, { ErrorMessage } from '../components/ErrorMessageBox';
import { useAuth } from 'contexts/AuthContextProvider';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';

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
    const isError = formErrors.email ? (formErrors.password ? true : false) : false;
    const deviceHeight = height;
    const styles = defaultSignupStyle({ appColors, appPadding, isPortrait, isError, deviceHeight });
    const formStyles = formStyle({ appColors, appPadding, isPortrait });
    const { recordEvent, recordErrorEvent } = useAnalytics();

    useEffect(() => {
        let data: Attributes = {};
        let pageEvents = getPageEventFromPageNavigation(NAVIGATION_TYPE.AUTH_SIGN_UP);
        data.pageID = getPageIdsFromPageEvents(pageEvents);
        data.event = pageEvents;
        recordEvent(pageEvents, data);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                let data: Attributes = {};
                data.event = ActionEvents.ACTION_USER_SETUP_COMPLETE;
                recordEvent(ActionEvents.ACTION_USER_SETUP_COMPLETE, data);
            })
            .catch(err => {
                let msg: string;
                if (err) {
                    msg = strings.formatString(strings['global.error_code'], err) as string;
                }

                let data: Attributes = condenseErrorObject(err);
                data.event = ActionEvents.ACTION_USER_SETUP_FAILED;

                recordErrorEvent(ActionEvents.ACTION_USER_SETUP_FAILED, data);
                // recordEvent(AppEvents.ERROR, condenseErrorObject(err, AppEvents.SIGNUP_ERROR));
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
        try {
            navigation.navigate(NAVIGATION_TYPE.BROWSE_WEBVIEW, {
                type: title,
            });
        } catch (error) {
            console.log(`[InAppBrowser] Error loading title: ${title}`, error);
        }
    };

    const trim = (val: string) => {
        return val.trim();
    };

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
                            onPress={() => {
                                let data: Attributes = {};
                                data.event = ActionEvents.ACTION_USER_SETUP_INITIATED;
                                recordEvent(ActionEvents.ACTION_USER_SETUP_INITIATED, data);
                                handleSubmit();
                            }}
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
