import React, { useState, useEffect } from 'react';
import { useDimensions } from '@react-native-community/hooks';
import { ScrollView, Text, View } from 'react-native';
import { defaultSignupTVStyle } from 'styles/Signup.style';
import { formStyle } from 'styles/Common.style';
import PasswordStrengthMeter, { getPasswordScore, getPasswordError } from 'screens/components/PasswordStrengthMeter';
import { useLocalization } from 'contexts/LocalizationContext';
import FocusButton from 'screens/components/FocusButton';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import FloatingLabelInput, { InputType } from '../screens/components/FloatingLabelInput';
import ErrorMessageBox from '../screens/components/ErrorMessageBox';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import AppContant from 'utils/AppContant';

const SignUpScreenStepThree_Password = ({
    handleChange,
    values,
    setFormErrors,
    formErrors,
    submitError,
    isSubmitLoading,
    handleSubmit,
    lastRemoteKeyEvent,
}: {
    handleChange: any;
    values: any;
    setFormErrors: any;
    formErrors: any;
    submitError: any;
    isSubmitLoading: any;
    handleSubmit: any;
    lastRemoteKeyEvent: string;
}): JSX.Element => {
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    let { appColors, appPadding } = prefs.appTheme!(prefs);
    const [isFocusable, setFocusableInput] = useState(true);
    const { width, height } = useDimensions().window;
    const isPortrait = height > width;
    const styles = defaultSignupTVStyle({ appColors, appPadding, isPortrait });
    const formStyles = formStyle({ appColors, appPadding, isPortrait });

    const passwordScore = getPasswordScore(values.password);

    useEffect(() => {
        if (lastRemoteKeyEvent === AppContant.up && !isFocusable) {
            setFocusableInput(true);
        }
        if (lastRemoteKeyEvent === AppContant.down && isFocusable) {
            setFocusableInput(false);
        }
    }, [lastRemoteKeyEvent, isFocusable]);

    return (
        <BackgroundGradient>
            <ScrollView contentContainerStyle={styles.containerTV} scrollEnabled={isPortrait}>
                <View style={[styles.formContainer]}>
                    <View style={formStyles.formGroup}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleLabel}>{strings['signup.second_step_title_tv']}</Text>
                        </View>
                        <View style={styles.passInstructionLabel}>
                            <Text style={styles.passInstructionLabelText}>
                                {strings['auth.password_instruction_tv']}
                            </Text>
                        </View>
                        <FloatingLabelInput
                            inputType={InputType.password}
                            label={'Password'}
                            hasTVPreferredFocus={isFocusable}
                            value={values.password}
                            isFocusable={isFocusable}
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
                    {submitError.displayError && <ErrorMessageBox value={submitError.message} />}
                    <PasswordStrengthMeter password={values.password} />

                    <View style={[styles.passInstructionInfoLabel]}>
                        <Text style={styles.passInstructionLabelText}>
                            {strings['signup.password_instruction_info']}
                        </Text>
                    </View>

                    <View style={styles.tvButtonContainer}>
                        <FocusButton
                            disabled={passwordScore < 3 || isSubmitLoading}
                            title={strings['signup.btn_label']}
                            onPress={() => handleSubmit(true)}
                            unFocusedColor={appColors.primaryVariant5}
                            loading={isSubmitLoading}
                        />
                    </View>
                </View>
            </ScrollView>
        </BackgroundGradient>
    );
};
export default SignUpScreenStepThree_Password;
