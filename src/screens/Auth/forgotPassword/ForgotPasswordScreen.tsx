import React, { useEffect, useState } from 'react';
import { useDimensions } from '@react-native-community/hooks';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { Text, View } from 'react-native';
import useForm from 'helper/useForm';
import { formStyle } from 'styles/Common.style';
import { useLocalization } from 'contexts/LocalizationContext';
import Button from 'screens/components/Button';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import useFunction from 'helper/useFunction';
import useFP from 'utils/useFP';
import { AppEvents } from 'utils/ReportingUtils';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import FloatingLabelInput, { InputType } from '../../components/FloatingLabelInput';

const initialValues = {
    email: '',
};

const ForgotPasswordScreen = ({ navigation }: { navigation: any }): JSX.Element => {
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    let { appColors, appPadding } = prefs.appTheme!(prefs);
    const { values, handleSubmit, handleChange } = useForm(initialValues, handleSubmitCB, null);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const { isEmail } = useFunction();
    const { forgotPassword } = useFP();
    const [formErrors, setFormErrors] = useState({
        email: '',
    });

    const { width, height } = useDimensions().window;
    const isPortrait = height > width;

    const formStyles = formStyle({ appColors, appPadding, isPortrait });
    const { recordEvent } = useAnalytics();

    async function handleSubmitCB() {
        setIsSubmitLoading(true);
        forgotPassword({ email: values.email })
            .then(() => {
                navigation.push(NAVIGATION_TYPE.AUTH_FORGOT_PASSWORD_OTP, { email: values.email });
                setIsSubmitLoading(false);
            })
            .catch(err => {
                setFormErrors({
                    ...formErrors,
                    email: strings['fp.error.' + err] || strings['global.error.message'],
                });
                setIsSubmitLoading(false);
            });
    }
    useEffect(() => {
        recordEvent(AppEvents.FORGOT_PASSWORD);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <BackgroundGradient insetHeader={false}>
            <View style={formStyles.container}>
                <View style={formStyles.formContainer}>
                    <View style={formStyles.formGroup}>
                        <View style={formStyles.formLabel}>
                            <Text style={formStyles.inputLabelText}>{strings['fp.email.label']}</Text>
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
                            onChangeText={value => handleChange({ name: 'email', value })}
                        />
                    </View>
                    <View style={formStyles.buttonContainer}>
                        <Button
                            disabled={!values.email || !isEmail(values.email)}
                            title={strings['fp.btn_label']}
                            onPress={() => handleSubmit()}
                            loading={isSubmitLoading}
                        />
                    </View>
                </View>
            </View>
        </BackgroundGradient>
    );
};
export default ForgotPasswordScreen;
