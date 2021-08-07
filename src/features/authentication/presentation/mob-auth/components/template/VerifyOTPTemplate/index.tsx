import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Keyboard } from 'react-native';

import { AppEvents } from 'utils/ReportingUtils';
import { isTablet } from 'core/styles/AppStyles';
import { useAuth } from 'contexts/AuthContextProvider';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { useLocalization } from 'contexts/LocalizationContext';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { authStyles } from 'features/authentication/styles/AuthStyles';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import CommonTitle from 'core/presentation/components/atoms/CommonTitle';
import OTPOrganism from 'core/presentation/components/organisms/OTPInput';
import { EvergentAPIError } from 'features/profile/api/evergent-api-error';
import PrimaryButton from 'core/presentation/components/atoms/PrimaryButton';
import VerifyOTPFooter from 'core/presentation/components/atoms/VerifyOTPFooter';
import { useCreateOTP } from 'features/authentication/presentation/hooks/useCreateOTP';
import RightArrowActionButton from 'core/presentation/components/atoms/RightArrowActionButton';
import PreloginCommonTemplate from 'core/presentation/components/templates/PreloginCommonTemplate';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { otpTemplateStyles } from './styles';
import { AUTH_TYPES, EMAIL_AUTH_CONSTANTS } from 'features/authentication/utils/auth-constants';
import { useAlert } from 'contexts/AlertContext';
import { AUTOMATION_TEST_ID } from 'features/authentication/presentation/automation-ids';
export default function VerifyOTPTemplate(props: VerifyOTPTemplateProps) {
    const { strings } = useLocalization();
    const authStyle = authStyles(useAppColors());
    const styles = otpTemplateStyles(useAppColors());
    const userAction = useAuth();
    const resendOtpTimerInterval = useRef<any>();
    const RESEND_OTP_TIME_LIMIT = 30;
    const { appConfig } = useAppPreferencesState();
    const { Alert } = useAlert();
    const pinLength = appConfig && appConfig.authOTPLength ? appConfig.authOTPLength : 0;
    const { confirmOTP } = userAction;
    const { recordEvent } = useAnalytics();
    const { createOTPCall } = useCreateOTP();
    const [otp, setOTP] = useState('');
    const [reset, setResetOTP] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(RESEND_OTP_TIME_LIMIT);

    const startResendOtpTimer = useCallback(() => {
        if (resendOtpTimerInterval && resendOtpTimerInterval.current) {
            clearInterval(resendOtpTimerInterval.current);
        }
        resendOtpTimerInterval.current = setInterval(() => {
            if (resendButtonDisabledTime <= 0) {
                clearInterval(resendOtpTimerInterval.current);
            } else {
                setResendButtonDisabledTime(resendButtonDisabledTime - 1);
            }
        }, 1000);
    }, [resendButtonDisabledTime]);

    useEffect(() => {
        startResendOtpTimer();
        return () => {
            if (resendOtpTimerInterval.current) {
                clearInterval(resendOtpTimerInterval.current);
            }
        };
    }, [resendButtonDisabledTime, resendOtpTimerInterval, startResendOtpTimer]);

    async function verifyOTP() {
        Keyboard.dismiss();
        if (otp.length === Number(pinLength)) {
            setIsLoading(true);
            confirmOTP({ mobileNumber: props.mobileNumber, country: props.country, otp: otp })
                .then(() => {
                    setIsLoading(false);
                    navigateToProfileSelection();
                    recordEvent(AppEvents.LOGIN);
                })
                .catch(error => {
                    handleConfirmOTPError(error);
                });
        }
    }

    function handleConfirmOTPError(error: any) {
        setIsLoading(false);
        if (error instanceof EvergentAPIError) {
            Alert.alert('Error', error.message, [
                {
                    text: strings['error.ok'],
                },
            ]);
        }
    }

    function navigateToProfileSelection() {
        props.navigation.replace(NAVIGATION_TYPE.PROFILE_SELECTION);
    }

    async function resendOTP() {
        setResetOTP(true);
        setIsLoading(true);
        startResendOtpTimer();
        setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);
        const state = await createOTPCall(props.mobileNumber, props.country);
        setIsLoading(false);
        if (state.isSuccess) {
            setResetOTP(false);
        } else if (state.error) {
            setResetOTP(false);
            handleCreateOTPError(state.error);
        } else {
            setResetOTP(false);
        }
    }

    function handleCreateOTPError(error: any) {
        if (error instanceof EvergentAPIError) {
            Alert.alert('Error', error.message, [
                {
                    text: strings['error.ok'],
                },
            ]);
        }
    }

    function changeMobileNumber() {
        props.navigation.navigate(NAVIGATION_TYPE.AUTH_SIGN_IN, {
            signInType: AUTH_TYPES.MOBILE_SIGN_IN,
            screenType: EMAIL_AUTH_CONSTANTS.SIGN_IN_SCREEN,
        });
    }

    return (
        <PreloginCommonTemplate>
            {isLoading && <AppLoadingIndicator style={authStyle.loaderStyle} />}
            <View style={isTablet ? styles.tabPreloginScreenContent : authStyle.mobilePreloginScreenContent}>
                <CommonTitle style={styles.commonTitleStyle} text={strings['verifyotp.title']} showThemedDot={true} />
                {pinLength && (
                    <OTPOrganism
                        mobileNumber={props.countryCode + ' ' + props.mobileNumber}
                        getOTP={otpValue => {
                            setOTP(otpValue);
                        }}
                        onMobileNumberChange={() => {
                            changeMobileNumber();
                        }}
                        pinCount={pinLength}
                        reset={reset}
                    />
                )}
                <View style={isTablet ? styles.tabButtonSection : styles.mobileButtonSection}>
                    {resendButtonDisabledTime > 0 ? (
                        <Text style={styles.resendOTPCount}>
                            {strings['verifyotp.resend_otp_in'] +
                                ' ' +
                                resendButtonDisabledTime +
                                ' ' +
                                strings['verifyotp.seconds']}
                        </Text>
                    ) : (
                        <RightArrowActionButton
                            title={strings['verifyotp.resend_otp']}
                            onPress={() => {
                                resendOTP();
                            }}
                            testID={AUTOMATION_TEST_ID.RESEND_OTP}
                            accessibilityLabel={AUTOMATION_TEST_ID.RESEND_OTP}
                        />
                    )}

                    <PrimaryButton
                        title={strings.verify_otp}
                        containerStyle={
                            isTablet ? styles.tabPreloginScreenButton : authStyle.mobilePreloginScreenButton
                        }
                        buttonStyle={isTablet ? styles.tabPreloginScreenButton : authStyle.mobilePreloginScreenButton}
                        onPress={() => {
                            verifyOTP();
                        }}
                        primaryTestID={AUTOMATION_TEST_ID.VERIFY_OTP_BUTTON}
                        primaryAccessibilityLabel={AUTOMATION_TEST_ID.VERIFY_OTP_BUTTON}
                    />
                </View>
            </View>
            <VerifyOTPFooter />
        </PreloginCommonTemplate>
    );
}

interface VerifyOTPTemplateProps {
    mobileNumber: string;
    country: string;
    countryCode: string;
    navigation: any;
}
