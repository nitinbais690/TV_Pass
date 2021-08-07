import React, { useEffect, useState } from 'react';
import { useDimensions } from '@react-native-community/hooks';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import useFunction from 'helper/useFunction';
import { defaultSignupTVStyle } from 'styles/Signup.style';
import { formStyle } from 'styles/Common.style';
import { useLocalization } from 'contexts/LocalizationContext';
import FocusButton from 'screens/components/FocusButton';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import CheckedIcon from '../../assets/images/checked.svg';
import UncheckedIcon from '../../assets/images/unchecked.svg';
import FloatingLabelInput, { InputType } from '../screens/components/FloatingLabelInput';
import ErrorMessageBox from '../screens/components/ErrorMessageBox';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { tvPixelSizeForLayout } from '../../AppStyles';
import AppContant from 'utils/AppContant';

const SignUpScreenStepTwo_Email = ({
    handleSubmit,
    handleChange,
    values,
    setFormErrors,
    formErrors,
    submitError,
    isSubmitLoading,
    lastRemoteKeyEvent,
}: {
    handleSubmit: () => void;
    handleChange: any;
    values: any;
    setFormErrors: any;
    formErrors: any;
    submitError: any;
    isSubmitLoading: any;
    lastRemoteKeyEvent: string;
}): JSX.Element => {
    const { strings }: any = useLocalization();
    const [isFocusable, setFocusableInput] = useState(true);
    const prefs = useAppPreferencesState();
    let { appColors, appPadding } = prefs.appTheme!(prefs);
    const { isEmail } = useFunction();
    const { width, height } = useDimensions().window;
    const isPortrait = height > width;
    const styles = defaultSignupTVStyle({ appColors, appPadding, isPortrait });
    const formStyles = formStyle({ appColors, appPadding, isPortrait });
    const [checkBoxFocused, setCheckBoxFocused] = useState(false);
    const legalInfo = strings['signup.legal_info.prefix'];

    useEffect(() => {
        if (lastRemoteKeyEvent === AppContant.up && !checkBoxFocused) {
            setFocusableInput(true);
        }
        if (lastRemoteKeyEvent === AppContant.down && checkBoxFocused) {
            setFocusableInput(false);
        }
    }, [lastRemoteKeyEvent, checkBoxFocused]);

    return (
        <BackgroundGradient>
            <ScrollView contentContainerStyle={styles.containerTV} scrollEnabled={isPortrait}>
                <View style={[styles.formContainer]}>
                    <View style={formStyles.formGroup} importantForAccessibility="yes">
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleLabel}>{strings['signup.first_step_title_tv']}</Text>
                        </View>
                        <FloatingLabelInput
                            inputType={InputType.email}
                            label={strings['auth.email_placeholder']}
                            isValid={isEmail(values.email)}
                            value={values.email}
                            errorMessage={formErrors.email}
                            hasTVPreferredFocus
                            isFocusable={isFocusable}
                            onBlur={() =>
                                setFormErrors({
                                    ...formErrors,
                                    email: !isEmail(values.email) ? strings['auth.enter_valid_email_tv'] : '',
                                })
                            }
                            onChangeText={value => handleChange({ name: 'email', value: value.trim() })}
                        />
                    </View>
                    {submitError.displayError && <ErrorMessageBox value={submitError.message} />}

                    <TouchableOpacity
                        onFocus={() => {
                            setCheckBoxFocused(true);
                        }}
                        onBlur={() => {
                            setCheckBoxFocused(false);
                        }}
                        activeOpacity={0.9}
                        onPress={() => handleChange({ name: 'sendEmailUpdates', value: !values.sendEmailUpdates })}
                        style={styles.checkboxSection}>
                        <>
                            <View
                                style={[
                                    styles.checkboxContainerStyleTv,
                                    checkBoxFocused && styles.checkboxContainerStyleActiveTv,
                                    values.sendEmailUpdates
                                        ? styles.checkboxActiveBackgroundTv
                                        : styles.checkboxInActiveBackgroundTv,
                                ]}>
                                {values.sendEmailUpdates ? (
                                    <CheckedIcon height={tvPixelSizeForLayout(80)} width={tvPixelSizeForLayout(80)} />
                                ) : (
                                    <UncheckedIcon height={tvPixelSizeForLayout(80)} width={tvPixelSizeForLayout(80)} />
                                )}
                            </View>
                            <Text style={styles.checkboxSectionTextTv}>{strings['signup.promotion_info_tv']}</Text>
                        </>
                    </TouchableOpacity>

                    <View style={styles.legelInfoContainer}>
                        <View style={styles.emailButtonContainer}>
                            <FocusButton
                                disabled={!values.email || !isEmail(values.email) || isSubmitLoading}
                                title={strings['signup.btn_label']}
                                onPress={() => handleSubmit(false)}
                                unFocusedColor={appColors.primaryVariant5}
                                loading={isSubmitLoading}
                            />
                        </View>

                        {legalInfo.length > 0 && (
                            <View style={styles.legelInfoWrapper}>
                                <Text style={styles.legalInfoContainerText}>
                                    {strings['singnup.legal_info_instruction']}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </BackgroundGradient>
    );
};
export default SignUpScreenStepTwo_Email;
