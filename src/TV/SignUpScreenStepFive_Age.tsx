import React, { useState, useEffect, useRef } from 'react';
import { useDimensions } from '@react-native-community/hooks';
import { ScrollView, Text, View, TouchableHighlight } from 'react-native';
import { defaultSignupTVStyle } from 'styles/Signup.style';
import { formStyle } from 'styles/Common.style';
import { useLocalization } from 'contexts/LocalizationContext';
import FocusButton from 'screens/components/FocusButton';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import FloatingLabelInput from '../screens/components/FloatingLabelInput';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import AppContant from 'utils/AppContant';

const SignUpScreenStepFive_Age = ({
    handleChange,
    values,
    isSubmitLoading,
    lastRemoteKeyEvent,
    handleSubmit,
    onSkipDOB,
}: {
    handleChange: any;
    values: any;
    setFormErrors: any;
    formErrors: any;
    submitError: any;
    isSubmitLoading: any;
    handleSubmit: any;
    lastRemoteKeyEvent: string;
    onSkipDOB?: () => void;
}): JSX.Element => {
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    let { appColors, appPadding } = prefs.appTheme!(prefs);
    let inputRefAge = useRef();
    let inputRefDay = useRef();
    const { width, height } = useDimensions().window;
    const isPortrait = height > width;
    const styles = defaultSignupTVStyle({ appColors, appPadding, isPortrait });
    const formStyles = formStyle({ appColors, appPadding, isPortrait });
    const [isFocusable, setFocusableInput] = useState(true);
    const [isFocusableDay, setFocusableDayInput] = useState(false);

    useEffect(() => {
        if (lastRemoteKeyEvent === AppContant.right && isFocusable) {
            setFocusableInput(false);
            setFocusableDayInput(true);
            inputRefAge.current.onBlur && inputRefAge.current.onBlur();
            inputRefDay.current.onFocus && inputRefDay.current.onFocus();
        }
        if (lastRemoteKeyEvent === AppContant.left && isFocusableDay) {
            setFocusableDayInput(false);
            setFocusableInput(true);
            inputRefAge.current.onFocus && inputRefAge.current.onFocus();
            inputRefDay.current.onBlur && inputRefDay.current.onBlur();
        }
        if (lastRemoteKeyEvent === AppContant.down && isFocusableDay) {
            inputRefDay.current.onBlur && inputRefDay.current.onBlur();
            setFocusableDayInput(false);
        }
        if (lastRemoteKeyEvent === AppContant.down && isFocusable) {
            inputRefAge.current.onBlur && inputRefAge.current.onBlur();
            setFocusableInput(false);
        }
    }, [isFocusable, isFocusableDay, lastRemoteKeyEvent]);

    return (
        <BackgroundGradient>
            <ScrollView contentContainerStyle={styles.containerTV} scrollEnabled={isPortrait}>
                <View style={[styles.formContainer]}>
                    <View style={formStyles.formGroup}>
                        <View style={styles.subHeadingContainer}>
                            <Text style={styles.subHeadingLabel}>
                                {strings['signup.second_step_user_information_subheading']}
                            </Text>
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleLabel}>{strings['signup.get_user_age']}</Text>
                        </View>

                        <View style={styles.rowContainer}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabelStyle}>{strings['signup.month']}</Text>
                                <FloatingLabelInput
                                    ref={inputRefAge}
                                    value={values.month}
                                    isFocusable={isFocusable}
                                    maxLength={2}
                                    onChangeText={value => {
                                        if (parseInt(value) > 0 && parseInt(value) <= 12) {
                                            handleChange({ name: 'month', value: value.trim() });
                                        }
                                    }}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabelStyle}>{strings['signup.day']}</Text>
                                <FloatingLabelInput
                                    value={values.day}
                                    ref={inputRefDay}
                                    isFocusable={isFocusableDay}
                                    onFocus={() => {
                                        setFocusableDayInput(true);
                                        setFocusableInput(false);
                                    }}
                                    onChangeText={value => {
                                        if (parseInt(value) > 0 && parseInt(value) <= 31) {
                                            handleChange({ name: 'day', value: value.trim() });
                                        }
                                    }}
                                />
                            </View>
                        </View>
                    </View>

                    <TouchableHighlight
                        activeOpacity={0.8}
                        onPress={onSkipDOB}
                        style={[styles.passInstructionInfoLabel]}>
                        <Text style={styles.passInstructionLabelText}>{strings['signup.optional']}</Text>
                    </TouchableHighlight>

                    <View style={styles.tvButtonContainer}>
                        <FocusButton
                            disabled={!values.day || isSubmitLoading}
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
export default SignUpScreenStepFive_Age;
