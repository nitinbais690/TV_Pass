import React from 'react';
import { Text, View } from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';

import { formStyle } from 'styles/Common.style';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { OTPInputStyle } from '../../styles/OTPInput.style';
import { ErrorMessage } from './ErrorMessageBox';

interface OTPInputProps {
    pinCount?: number;
    error?: ErrorMessage;
    onCodeChanged: (text: string) => void;
    onCodeFilled: (text: string) => void;
}

const OTPInput = (props: OTPInputProps): JSX.Element => {
    const prefs = useAppPreferencesState();
    let { appColors, appPadding } = prefs.appTheme!(prefs);
    const { error } = props;
    const errorMessage = error && error.message;
    const styles: any = OTPInputStyle({ appColors, appPadding, errorMessage });
    const formStyles = formStyle({ appColors, appPadding });

    return (
        <>
            <View style={[formStyles.inputContainer, styles.otpContainer]}>
                <OTPInputView
                    onCodeChanged={props.onCodeChanged}
                    style={[formStyles.inputs, styles.otpInput]}
                    placeholderCharacter={'0'}
                    placeholderTextColor={appColors.primaryVariant1}
                    pinCount={6}
                    autoFocusOnLoad
                    codeInputFieldStyle={styles.underlineStyleBase}
                    codeInputHighlightStyle={styles.underlineStyleHighLighted}
                    onCodeFilled={props.onCodeFilled}
                    selectionColor={appColors.secondary}
                />
            </View>
            {props.error && props.error.displayError && (
                <View style={styles.errorMessageContainer}>
                    <Text style={styles.errorMessageText}>{props.error && props.error.message}</Text>
                </View>
            )}
        </>
    );
};

export default OTPInput;
