import { View, Text, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';

import useForm from 'helper/useForm';
import { mobileNumberValidate } from 'helper/validateRules';
import { mobileAuthTemplateStyle } from './style';
import { useAuth } from 'contexts/AuthContextProvider';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { AppEvents } from 'utils/ReportingUtils';
import { isTablet } from 'core/styles/AppStyles';
import { appFlexStyles } from 'core/styles/FlexStyles';
import { useLocalization } from 'contexts/LocalizationContext';
import { authStyles } from 'features/authentication/styles/AuthStyles';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import CommonTitle from 'core/presentation/components/atoms/CommonTitle';
import PrimaryButton from 'core/presentation/components/atoms/PrimaryButton';
import SocialLoginFooter from 'core/presentation/components/molecules/SocialLoginFooter';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';
import { EvergentAPIError } from 'features/profile/api/evergent-api-error';
import { LOGIN_ERROR_CODES } from 'features/profile/api/profile-api-constants';
import { EMAIL_AUTH_CONSTANTS } from 'features/authentication/utils/auth-constants';
import MobileNumberDropDown from 'core/presentation/components/atoms/MobileNumberDropDown';
import PreloginCommonTemplate from 'core/presentation/components/templates/PreloginCommonTemplate';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { useCreateOTP } from 'features/authentication/presentation/hooks/useCreateOTP';
import InputErrorView from 'core/presentation/components/atoms/InputErrorView';
import { CountryCode, getCountryCallingCode, isValidPhoneNumber } from 'libphonenumber-js';
import { findFlagUrlByIso2Code } from 'country-flags-svg';
import { SvgUri } from 'react-native-svg';
import { useGeoData } from 'contexts/GeoDataProviderContext';
import { AUTOMATION_TEST_ID } from 'features/authentication/presentation/automation-ids';
import { useAlert } from 'contexts/AlertContext';

export default function MobileNumberAuthTemplate(props: MobileNumberAuthTemplateProps) {
    const { login } = useAuth();
    const { recordEvent } = useAnalytics();
    const { strings }: any = useLocalization();
    const { countryCode } = useGeoData();
    const { Alert } = useAlert();

    const authStyle = authStyles(useAppColors());

    const mobileAuthTemplateStyles = mobileAuthTemplateStyle(useAppColors());
    const { createOTPCall } = useCreateOTP();
    const [selectedCountry, setSelectedCountry] = useState<Country>({
        country: '',
        countryCode: '',
    });
    const [isMobileNumberValid, setIsMobileNumberValid] = useState<boolean>(true);
    const [flagUrl, setFlagUrl] = useState<string>('');
    const initialValues = {
        mobileNumber: '',
    };
    const { values, handleSubmit, handleChange, errors } = useForm(
        initialValues,
        handleSubmitClick,
        mobileNumberValidate,
    );
    const [isLoading, setIsLoading] = React.useState(false);

    async function handleSubmitClick() {
        if (values.mobileNumber) {
            const isValidMobileNumber = isValidPhoneNumber(
                selectedCountry.countryCode + values.mobileNumber,
                selectedCountry.country as CountryCode,
            );
            setIsMobileNumberValid(isValidMobileNumber);
            if (!isValidMobileNumber) {
                return;
            }
            setIsLoading(true);
            const state = await createOTPCall(values.mobileNumber, selectedCountry.country);
            setIsLoading(false);

            if (state.isSuccess) {
                props.navigation.navigate(NAVIGATION_TYPE.AUTH_VERIFY_OTP, {
                    mobileNumber: values.mobileNumber,
                    country: selectedCountry.country,
                    countryCode: '+ ' + selectedCountry.countryCode,
                });
            } else if (state.error) {
                handleCreateOTPError(state.error);
            }
        }
    }

    useEffect(() => {
        if (countryCode) {
            const countryCallingCode = getCountryCallingCode(countryCode as CountryCode);
            const flagSVGUrl = findFlagUrlByIso2Code(countryCode);
            if (countryCode && flagSVGUrl) {
                let countryObj: Country = {
                    country: countryCode,
                    countryCode: countryCallingCode.toString(),
                };
                setSelectedCountry(countryObj);
                setFlagUrl(flagSVGUrl);
            }
        }
    }, [countryCode]);

    function handleCreateOTPError(error: any) {
        if (error instanceof EvergentAPIError) {
            Alert.alert('Error', error.message, [
                {
                    text: strings['error.ok'],
                },
            ]);
        }
    }

    const onProgress = () => {
        setIsLoading(true);
    };

    const onError = (error: string, provider: string) => {
        console.log('social signin failure: provider: ', provider, ' error: ', error);
        setIsLoading(false);
    };

    const onSocialSignin = (id: string, provider: string) => {
        setIsLoading(true);
        doSignIn(id, provider);
    };

    function doSignIn(userId: string, provider: string) {
        login({ socialLoginId: userId, socialLoginType: provider })
            .then(() => {
                setIsLoading(false);
                navigateToProfileSelection();
                recordEvent(AppEvents.LOGIN);
            })
            .catch(error => {
                setIsLoading(false);
                handleSignInError(error);
            });
    }

    function handleSignInError(error: any) {
        if (error instanceof EvergentAPIError) {
            Alert.alert('Error', error.message, [
                {
                    text:
                        error.code === LOGIN_ERROR_CODES.LOGIN_NO_USER_FOUND
                            ? strings['signup.title']
                            : strings['error.ok'],
                    onPress: () => {
                        if (error.code === LOGIN_ERROR_CODES.LOGIN_NO_USER_FOUND) {
                            navigateToSignupScreen();
                        }
                    },
                },
            ]);
        }
    }

    function navigateToProfileSelection() {
        console.log('move to profile screen');
        props.navigation.replace(NAVIGATION_TYPE.PROFILE_SELECTION);
    }

    function navigateToSignupScreen() {
        console.log('move to signup screen');
        props.navigation.navigate(NAVIGATION_TYPE.AUTH_SIGN_IN, {
            screenType: EMAIL_AUTH_CONSTANTS.SIGN_UP_SCREEN,
        });
    }

    return (
        <PreloginCommonTemplate>
            {isLoading && <AppLoadingIndicator style={authStyle.loaderStyle} />}
            <View style={isTablet ? authStyle.tabPreloginScreenContent : authStyle.mobilePreloginScreenContent}>
                <CommonTitle
                    style={mobileAuthTemplateStyles.commonTitleStyle}
                    text={strings['header.sign_in']}
                    showThemedDot={true}
                />
                <View style={mobileAuthTemplateStyles.mobileDropDownSection}>
                    <Text style={mobileAuthTemplateStyles.mobileNumberLabel}>{strings['label.mobile_number']}</Text>
                    <MobileNumberDropDown
                        countryIcon={<SvgUri width="100%" height="100%" uri={flagUrl} />}
                        countryCode={'+ ' + selectedCountry.countryCode}
                        onPress={() => {}}
                        onChangeMobileNumber={value => {
                            handleChange({ name: 'mobileNumber', value });
                        }}
                    />
                    {(errors.mobileNumber || !isMobileNumberValid) && (
                        <InputErrorView
                            errorText={
                                errors.mobileNumber
                                    ? strings[errors.mobileNumber]
                                    : strings['error.mobile_number_invalid']
                            }
                            style={authStyle.inputErrorStyle}
                        />
                    )}
                </View>
                <View style={appFlexStyles.rowHorizontalAlignEnd}>
                    <PrimaryButton
                        title={strings.proceed}
                        containerStyle={
                            isTablet ? authStyle.tabPreloginScreenButton : authStyle.mobilePreloginScreenButton
                        }
                        buttonStyle={
                            isTablet ? authStyle.tabPreloginScreenButton : authStyle.mobilePreloginScreenButton
                        }
                        onPress={() => {
                            Keyboard.dismiss();
                            handleSubmit();
                        }}
                        primaryTestID={AUTOMATION_TEST_ID.PROCEED_BUTTON}
                        primaryAccessibilityLabel={AUTOMATION_TEST_ID.PROCEED_BUTTON}
                    />
                </View>
            </View>
            <SocialLoginFooter onSignProgress={onProgress} onSigninSuccess={onSocialSignin} onSigninError={onError} />
        </PreloginCommonTemplate>
    );
}

interface MobileNumberAuthTemplateProps {
    navigation: any;
}

interface Country {
    countryCode: string;
    country: string;
}
