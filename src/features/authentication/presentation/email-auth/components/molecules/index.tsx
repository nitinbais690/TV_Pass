import { useLocalization } from 'contexts/LocalizationContext';
import PrimaryButton from 'core/presentation/components/atoms/PrimaryButton';
import { TextinputBox } from 'core/presentation/components/atoms/TextinputBox';
import PasswordInputBox from 'core/presentation/components/atoms/PasswordInputBox';
import InputErrorView from 'core/presentation/components/atoms/InputErrorView';
import { appFontStyle } from 'core/styles/AppStyles';
import { EMAIL_AUTH_CONSTANTS } from 'features/authentication/utils/auth-constants';
import React from 'react';
import { Text, View } from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { emailAuthViewStyle } from './styles';
import ForwordIcon from 'assets/images/ic_forword_white.svg';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { AUTOMATION_TEST_ID } from 'features/authentication/presentation/automation-ids';

export default function EmailAuthView(props: EmailAuthViewProps) {
    const { strings } = useLocalization();
    const appPref = useAppPreferencesState();
    const { appTheme } = appPref;
    let { appColors } = appTheme && appTheme(appPref);
    const style = emailAuthViewStyle(appColors);

    return (
        <View>
            <Text style={[appFontStyle.subTitle, style.emailTitleeStyle]}>{strings['header.email_id']}</Text>

            <View style={style.inputBoxStyle}>
                <TextinputBox
                    value={props.email}
                    onChangeText={props.onChangeEmail}
                    autoCapitalize={'none'}
                    keyboardType={'email-address'}
                    onBlur={props.onEmailBlur}
                    textInputBoxTestID={AUTOMATION_TEST_ID.TEXT_INPUT_BOX_EMAIL_ID}
                    textInputBoxAccessibilityLabel={AUTOMATION_TEST_ID.TEXT_INPUT_BOX_EMAIL_ID}
                />
            </View>
            {props.emailError && <InputErrorView errorText={props.emailError} style={style.inputErrorStyle} />}
            {props.screenType !== EMAIL_AUTH_CONSTANTS.ENTER_EMAIL_SCREEN && (
                <View>
                    <Text style={[appFontStyle.subTitle, style.passwordTitleStyle]}>
                        {strings['header.enter_password']}
                    </Text>

                    <View style={style.inputBoxStyle}>
                        <PasswordInputBox
                            maxLength={60}
                            passwordValue={props.password}
                            onTextChange={props.onChangePassword}
                            onBlur={props.onPasswordBlur}
                            textInputBoxTestID={AUTOMATION_TEST_ID.TEXT_INPUT_BOX_PASSWORD}
                            textInputBoxAccessibilityLabel={AUTOMATION_TEST_ID.TEXT_INPUT_BOX_PASSWORD}
                        />
                    </View>
                    {props.passwordError && (
                        <InputErrorView errorText={props.passwordError} style={style.inputErrorStyle} />
                    )}
                </View>
            )}

            {props.screenType === EMAIL_AUTH_CONSTANTS.SIGN_IN_SCREEN && (
                <View
                    style={style.forgotPasswordContainer}
                    testID={AUTOMATION_TEST_ID.FORGOT_PASSWORD}
                    accessibilityLabel={AUTOMATION_TEST_ID.FORGOT_PASSWORD}>
                    <Text
                        style={[appFontStyle.body3, style.forgotPasswordLb]}
                        onPress={() => {
                            props.navigation.navigate(NAVIGATION_TYPE.AUTH_FORGOT_PASSWORD_RESET);
                        }}>
                        {strings['signin.forgot_your_password']}
                    </Text>
                    <ForwordIcon />
                </View>
            )}

            <PrimaryButton
                disabled={props.isLoading}
                containerStyle={style.buttonstyle}
                title={getButonName(props.screenType, strings)}
                onPress={props.onPress}
                primaryTestID={AUTOMATION_TEST_ID.PRIMARY_BUTTON}
                primaryAccessibilityLabel={AUTOMATION_TEST_ID.PRIMARY_BUTTON}
            />
        </View>
    );
}

function getButonName(screenType: string, strings: any) {
    var buttonName;
    if (screenType === EMAIL_AUTH_CONSTANTS.SIGN_IN_SCREEN) {
        buttonName = strings.sign_in;
    } else if (screenType === EMAIL_AUTH_CONSTANTS.SIGN_UP_SCREEN) {
        buttonName = strings['signup.title'];
    } else {
        buttonName = strings.next;
    }
    return buttonName;
}

interface EmailAuthViewProps {
    screenType: string;
    onPress: () => void;
    onEmailBlur?: () => void;
    onPasswordBlur?: () => void;
    isLoading: boolean;
    navigation: any;
    onChangeEmail: (text: string) => void;
    onChangePassword: (text: string) => void;
    email: string;
    password: string;
    emailError: string;
    passwordError: string;
}
