import useAppColors from 'core/presentation/hooks/use-app-colors';
import { appFontStyle } from 'core/styles/AppStyles';
import React from 'react';
import { View, Text } from 'react-native';
import { headerTextStyle } from './styles';
import AhaLogo from 'assets/images/aha_mini_logo.svg';

export default function CommonTitle(props: HeaderTextprops) {
    var value: string = props.text;
    const appColors = useAppColors();
    if (props.showThemedDot && value) {
        value = value.endsWith('.') ? value.slice(0, -1) : value;
        return (
            <View style={props.style}>
                <Text style={[appFontStyle.header1, headerTextStyle(appColors).textStyle]}>
                    {value}
                    <Text style={[appFontStyle.header1, headerTextStyle(appColors).dotText]}>.</Text>
                </Text>
            </View>
        );
    } else {
        return (
            <Text style={[appFontStyle.header1, headerTextStyle(appColors).textStyle, props.style]}>
                {props.text} {props.showAhaLogo && <AhaLogo />}
            </Text>
        );
    }
}

interface HeaderTextprops {
    text: string;
    showThemedDot: boolean;
    showAhaLogo?: boolean;
    style?: {};
}
