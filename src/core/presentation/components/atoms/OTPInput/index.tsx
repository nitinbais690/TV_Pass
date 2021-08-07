import React, { useCallback, useState } from 'react';
import { TextInput, View } from 'react-native';

import { otpInputStyles } from './style';
import LinearGradient from 'react-native-linear-gradient';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { AUTOMATION_TEST_ID } from 'core/presentation/automation-ids';

export default function OTPInput(props: OTPInputProps) {
    const appColors = useAppColors();
    let otpTextInput: Array<any> = [];
    const styles = otpInputStyles(appColors);
    const [otp, setOTPValue] = useState<any>([]);

    const focusPrevious = useCallback(
        (key: string, index: number) => {
            if (key === 'Backspace' && index !== 0) {
                otpTextInput[index - 1].focus();
            }
        },
        [otpTextInput],
    );

    const focusNext = useCallback(
        (index: number, value: string) => {
            if (index < otpTextInput.length - 1 && value) {
                otpTextInput[index + 1].focus();
            }
            if (index === otpTextInput.length - 1) {
                otpTextInput[index].blur();
            }

            const otpValue = otp;
            otpValue[index] = value;
            setOTPValue(otpValue);
            props.getOTP(otp.join(''));
        },
        [otp, otpTextInput, props],
    );

    const txtBox = useCallback(() => {
        return Array(Number(props.pinCount))
            .fill(0)
            .map((data, index) => (
                <LinearGradient
                    key={index}
                    style={styles.otpBox}
                    colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0)']}
                    useAngle={true}
                    angle={139.8}
                    locations={[0.138, 1]}>
                    <TextInput
                        style={styles.otpInputBox}
                        keyboardType="numeric"
                        onChangeText={v => focusNext(index, v)}
                        onKeyPress={element => focusPrevious(element.nativeEvent.key, index)}
                        ref={ref => (otpTextInput[index] = ref)}
                        autoFocus={index === 0 ? true : undefined}
                        selectionColor={appColors.brandTint}
                        maxLength={1}
                        value={props.reset ? '' : undefined}
                        testID={AUTOMATION_TEST_ID.OTP_INPUT + index}
                        accessibilityLabel={AUTOMATION_TEST_ID.OTP_INPUT + index}
                    />
                </LinearGradient>
            ));
    }, [
        appColors.brandTint,
        focusNext,
        focusPrevious,
        otpTextInput,
        props.pinCount,
        props.reset,
        styles.otpBox,
        styles.otpInputBox,
    ]);

    return <View style={[styles.otpContainer, props.style]}>{txtBox()}</View>;
}

interface OTPInputProps {
    pinCount: string;
    getOTP: (otpValue: string) => void;
    style?: {};
    reset: boolean;
}
