import React from 'react';
import { AccessibilityProps, View, Text, TouchableOpacity } from 'react-native';

import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { authStyles } from 'features/authentication/styles/AuthStyles';

export default function SocialLoginButton(props: RoundIconButtonProps) {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    let authStyle = authStyles(appColors);

    return (
        <TouchableOpacity style={authStyle.socialLoginButtonContainer} onPress={props.onPress}>
            <View style={authStyle.socialLoginButton}>
                {props.icon}
                <Text style={authStyle.socailLoginText}>{props.title}</Text>
            </View>
        </TouchableOpacity>
    );
}

export interface RoundIconButtonProps extends AccessibilityProps {
    title: string;
    icon: JSX.Element;
    onPress?: () => void;
}
