import React from 'react';
import { AccessibilityProps, View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { styles } from './styles';

export default function RoundIconButton(props: RoundIconButtonProps) {
    const appColors = useAppColors();
    const roundIconStyles = styles(props, appColors);

    return (
        <TouchableOpacity style={[props.style]} onPress={props.onPress} testID={props.testID}>
            <View style={roundIconStyles.containerStyle}>
                <LinearGradient
                    style={roundIconStyles.circle}
                    colors={[appColors.primaryVariant3, appColors.primaryVariant1]}
                    useAngle={true}
                    angle={180}
                    locations={[0.094, 1]}>
                    {props.svgIcon}
                </LinearGradient>
                {props.title && <Text style={roundIconStyles.actionTextStyle}>{props.title}</Text>}
            </View>
        </TouchableOpacity>
    );
}

export interface RoundIconButtonProps extends AccessibilityProps {
    width: number;
    height: number;
    svgIcon: any;
    title?: string;
    style?: {};
    onPress?: () => void;
    testID?: string;
}
