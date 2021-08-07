import React, { useEffect, useState } from 'react';
import { useDimensions } from '@react-native-community/hooks';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { Text, View, StyleSheet } from 'react-native';
import useForm from 'helper/useForm';
import { formStyle } from 'styles/Common.style';
import { useLocalization } from 'contexts/LocalizationContext';
import Button from 'screens/components/Button';
import { Button as LButtopn } from 'react-native-elements';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { appFonts } from '../../../../AppStyles';
import OTPInput from '../../components/OTPInput';
import useFP from 'utils/useFP';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import { ErrorMessage } from 'screens/components/ErrorMessageBox';

const initialValues = {
    email: '',
    otpCode: '',
};

const ForgotPasswordOtpScreen = ({ route, navigation }: { route: any; navigation: any }): JSX.Element => {
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    let { appColors, appPadding } = prefs.appTheme!(prefs);
    const { values, handleSubmit, handleChange, setUpdateValue } = useForm(initialValues, handleSubmitCB, null);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [isResend, setIsResend] = useState(false);
    const [errorMsg, setIsErrorMsg] = useState<ErrorMessage>({
        displayError: false,
        message: '',
    });
    const { forgotPasswordOtp, forgotPassword } = useFP();

    const { width, height } = useDimensions().window;
    const isPortrait = height > width;

    const styles = defaultFPStyle({ appColors, appPadding, isPortrait });
    const formStyles = formStyle({ appColors, appPadding, isPortrait });
    const { email } = route.params;

    useEffect(() => {
        if (route.params.email !== undefined) {
            setUpdateValue('email', route.params.email);
        }
    }, [route.params, setUpdateValue]);

    async function handleSubmitCB() {
        setIsSubmitLoading(true);
        forgotPasswordOtp({ email: values.email, otpCode: values.otpCode })
            .then(res => {
                setIsSubmitLoading(false);
                let userToken = res.token || '';
                navigation.push(NAVIGATION_TYPE.AUTH_FORGOT_PASSWORD_RESET, {
                    email: values.email,
                    userToken: userToken,
                });
            })
            .catch(err => {
                setIsErrorMsg({
                    displayError: true,
                    message: strings['fp.error.' + err] || strings['global.error.message'],
                });
                setIsSubmitLoading(false);
            });
    }

    function handleResend() {
        setIsResend(true);
        forgotPassword({ email: values.email })
            .then(() => setIsResend(false))
            .catch(() => setIsResend(false));
    }

    if (!email) {
        navigation.push(NAVIGATION_TYPE.AUTH_FORGOT_PASSWORD);
    }

    return (
        <BackgroundGradient insetHeader={false}>
            <View style={formStyles.container}>
                <View style={formStyles.formContainer}>
                    <View style={styles.optInfo}>
                        <Text style={styles.optInfoText}>
                            {email} {strings['fp.opt_sent_info']}
                        </Text>
                    </View>
                    <View style={formStyles.formGroup}>
                        <OTPInput
                            onCodeChanged={code => {
                                handleChange({ name: 'otpCode', value: code.replace(/\s/g, '') });
                            }}
                            onCodeFilled={code => {
                                handleChange({ name: 'otpCode', value: code.replace(/\s/g, '') });
                            }}
                            error={errorMsg}
                        />
                    </View>
                    <View style={styles.otpResendLabel}>
                        <Text style={styles.otpResendLabelText}>{strings['fp.otp_didt_receive']}</Text>
                        <LButtopn
                            titleStyle={styles.titleStyle}
                            type="clear"
                            title={strings['fp.otp_resend']}
                            loading={isResend}
                            onPress={handleResend}
                        />
                    </View>

                    <View style={formStyles.buttonContainer}>
                        <Button
                            disabled={!values.email || !values.otpCode || values.otpCode.length < 6}
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
export default ForgotPasswordOtpScreen;

const defaultFPStyle = ({ appColors }: any) =>
    StyleSheet.create({
        otpResendLabel: {
            paddingTop: 20,
            paddingBottom: 10,
            alignSelf: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
        },
        otpResendLabelText: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
            fontWeight: '500',
        },
        titleStyle: {
            color: appColors.brandTint,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
            fontWeight: '500',
        },
        optInfo: {
            paddingBottom: 10,
            textAlign: 'left',
            marginTop: 40,
        },
        optInfoText: {
            color: appColors.secondary,
            fontSize: appFonts.xs,
            fontFamily: appFonts.primary,
        },
    });
