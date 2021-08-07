import React, { useState, useEffect, useRef } from 'react';
import { useDimensions } from '@react-native-community/hooks';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { Text, View } from 'react-native';
import { fpResetValidate } from 'helper/validateRules';
import useForm from 'helper/useForm';
import { formStyle } from 'styles/Common.style';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAlert } from 'contexts/AlertContext';
import Button from 'screens/components/Button';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import PasswordStrengthMeter, { getPasswordError, getPasswordScore } from 'screens/components/PasswordStrengthMeter';
import useFP from 'utils/useFP';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import FloatingLabelInput, { InputType } from '../../components/FloatingLabelInput';

const initialValues = {
    email: '',
    newPassword: '',
    confirmPassword: '',
    userToken: '',
};

const ForgotPasswordResetScreen = ({ route, navigation }: { route: any; navigation: any }): JSX.Element => {
    const { Alert } = useAlert();
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    let { appColors, appPadding } = prefs.appTheme!(prefs);
    const { values, errors, handleSubmit, handleChange, setUpdateValue } = useForm(
        initialValues,
        handleSubmitCB,
        fpResetValidate,
    );
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const isSubmit = useRef(false);
    const [formErrors, setFormErrors] = useState({
        password: '',
    });
    const { forgotPasswordReset } = useFP();

    const { width, height } = useDimensions().window;
    const isPortrait = height > width;

    const formStyles = formStyle({ appColors, appPadding, isPortrait });
    const { email, userToken } = route.params;

    useEffect(() => {
        if (route.params.email !== undefined) {
            setUpdateValue('email', route.params.email);
        }
        if (route.params.userToken !== undefined) {
            setUpdateValue('userToken', route.params.userToken);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route.params]);

    useEffect(() => {
        if (isSubmit.current === true && Object.keys(errors).length > 0) {
            handleErrors();
            isSubmit.current = false;
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errors]);

    function handleFormSubmit() {
        isSubmit.current = true;
        handleSubmit();
    }

    async function handleSubmitCB() {
        setIsSubmitLoading(true);
        forgotPasswordReset({
            email: values.email,
            newPassword: values.newPassword,
            userToken: values.userToken,
        })
            .then(() => {
                setIsSubmitLoading(false);
                Alert.alert(strings['global.general_success_title'], strings['fp.fp_reset_success'], [
                    {
                        text: 'OK',
                        onPress: () =>
                            navigation.reset({
                                index: 0,
                                routes: [{ name: NAVIGATION_TYPE.AUTH_SIGN_IN }],
                            }),
                    },
                ]);
            })
            .catch(err => {
                let msg;
                if (err) {
                    msg = strings.formatString(strings['global.error_code'], err) as string;
                }
                Alert.alert(strings['fp.error.' + err] || strings['global.error.message'], msg, [
                    { text: strings['global.okay'] },
                ]);
                setIsSubmitLoading(false);
            });
    }

    function handleErrors() {
        if (Object.keys(errors).length > 0) {
            let errMsg = strings['global.error.message'];
            if (errors.confirmPassword) {
                errMsg = errors.confirmPassword;
            }

            Alert.alert(strings['error.' + errMsg], undefined, [{ text: strings['global.okay'] }]);
        }
    }

    if (!email || !userToken) {
        navigation.reset({
            index: 0,
            routes: [{ name: NAVIGATION_TYPE.AUTH_SIGN_IN }],
        });
    }
    const passwordScore = getPasswordScore(values.newPassword);
    return (
        <BackgroundGradient>
            <View style={formStyles.container}>
                <View style={formStyles.formContainer}>
                    <View style={formStyles.formGroup}>
                        <View style={formStyles.inputLabel}>
                            <Text style={formStyles.inputLabelText}>{strings['auth.new_password_label']}</Text>
                        </View>
                        <FloatingLabelInput
                            inputType={InputType.password}
                            label={strings['auth.password_label']}
                            value={values.newPassword}
                            onChangeText={value => handleChange({ name: 'newPassword', value })}
                            onBlur={() =>
                                setFormErrors({
                                    ...formErrors,
                                    password: getPasswordError(values.newPassword)
                                        ? strings['auth.password_' + getPasswordError(values.newPassword)]
                                        : '',
                                })
                            }
                            errorMessage={formErrors.password}
                        />
                    </View>
                    <PasswordStrengthMeter password={values.newPassword} />
                    <View style={formStyles.formGroup}>
                        <View style={formStyles.inputLabel}>
                            <Text style={formStyles.inputLabelText}>{strings['auth.confirm_password_label']}</Text>
                        </View>
                        <FloatingLabelInput
                            inputType={InputType.password}
                            label={strings['auth.confirm_password_label']}
                            value={values.confirmPassword}
                            onChangeText={value => handleChange({ name: 'confirmPassword', value })}
                        />
                    </View>
                    <View style={formStyles.buttonContainer}>
                        <Button
                            disabled={
                                !values.email || !values.newPassword || !values.confirmPassword || passwordScore < 3
                            }
                            title={strings['fp.btn_label']}
                            onPress={() => handleFormSubmit()}
                            loading={isSubmitLoading}
                        />
                    </View>
                </View>
            </View>
        </BackgroundGradient>
    );
};
export default ForgotPasswordResetScreen;
