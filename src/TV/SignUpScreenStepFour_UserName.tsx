import React, { useState, useEffect } from 'react';
import { useDimensions } from '@react-native-community/hooks';
import { ScrollView, Text, View } from 'react-native';
import { defaultSignupTVStyle } from 'styles/Signup.style';
import { formStyle } from 'styles/Common.style';
import { useLocalization } from 'contexts/LocalizationContext';
import FocusButton from 'screens/components/FocusButton';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import FloatingLabelInput from '../screens/components/FloatingLabelInput';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import AppContant from 'utils/AppContant';
import useFunction from 'helper/useFunction';

const SignUpScreenStepFour_UserName = ({
    handleChange,
    values,
    isSubmitLoading,
    lastRemoteKeyEvent,
    handleSubmit,
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
    const { isName } = useFunction();
    let { appColors, appPadding } = prefs.appTheme!(prefs);
    const [isFocusable, setFocusableInput] = useState(true);
    const { width, height } = useDimensions().window;
    const isPortrait = height > width;
    const styles = defaultSignupTVStyle({ appColors, appPadding, isPortrait });
    const formStyles = formStyle({ appColors, appPadding, isPortrait });

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
                        <View style={styles.subHeadingContainer}>
                            <Text style={styles.subHeadingLabel}>
                                {strings['signup.second_step_user_information_subheading']}
                            </Text>
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleLabel}>{strings['signup.get_user_name']}</Text>
                        </View>
                        <FloatingLabelInput
                            value={values.name}
                            isValid={isName(values.name)}
                            maxLength={15}
                            isFocusable={isFocusable}
                            onChangeText={value => handleChange({ name: 'name', value: value.trim() })}
                        />
                    </View>

                    <View style={[styles.passInstructionInfoLabel]}>
                        <Text style={styles.passInstructionLabelText}>
                            {strings['signup.password_instruction_info']}
                        </Text>
                    </View>

                    <View style={styles.tvButtonContainer}>
                        <FocusButton
                            disabled={
                                !values.name || values.name.length > 15 || !isName(values.name) || isSubmitLoading
                            }
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
export default SignUpScreenStepFour_UserName;
