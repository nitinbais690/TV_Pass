import React, { useState } from 'react';
import { TextInputProps, View } from 'react-native';
import { TextinputBox } from 'core/presentation/components/atoms/TextinputBox';
import PasswordVisible from 'assets/images/ic_password_visible.svg';
import PasswordHide from 'assets/images/ic_hide_password.svg';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { passwordInputBoxStyle } from './styles';
import { AUTOMATION_TEST_ID } from 'core/presentation/automation-ids';

const PasswordInputBox = (props: PasswordInputBoxProps) => {
    const [securePassword, setInputType] = useState(true);

    return (
        <View>
            <View style={passwordInputBoxStyle.passwordToggleStyle}>
                <TouchableHighlight onPress={() => setInputType(!securePassword)}>
                    {securePassword ? (
                        <PasswordVisible
                            testID={AUTOMATION_TEST_ID.PASSWORD_VISIBLE_ICON}
                            accessibilityLabel={AUTOMATION_TEST_ID.PASSWORD_VISIBLE_ICON}
                        />
                    ) : (
                        <PasswordHide
                            testID={AUTOMATION_TEST_ID.PASSWORD_HIDE_ICON}
                            accessibilityLabel={AUTOMATION_TEST_ID.PASSWORD_HIDE_ICON}
                        />
                    )}
                </TouchableHighlight>
            </View>
            <TextinputBox
                value={props.passwordValue}
                secureTextEntry={securePassword}
                onChangeText={props.onTextChange}
                textInputBoxTestID={props.textInputBoxTestID}
                textInputBoxAccessibilityLabel={props.textInputBoxAccessibilityLabel}
                {...props}
            />
        </View>
    );
};

interface PasswordInputBoxProps extends TextInputProps {
    style?: {};
    onTextChange?: (value: string) => void;
    passwordValue: string;
    textInputBoxTestID?: string;
    textInputBoxAccessibilityLabel?: string;
}

export default PasswordInputBox;
