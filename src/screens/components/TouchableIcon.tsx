import { AccessibilityProps, StyleProp, ViewStyle, GestureResponderEvent } from 'react-native';
import { TouchableHighlight } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

export interface TouchableIconProps extends AccessibilityProps {
    name: string;
    size?: number;
    color?: string;
    underlayColor?: string;
    style?: StyleProp<ViewStyle>;
    onPress?: (event: GestureResponderEvent) => void;
}

export const TouchableIcon = (props: TouchableIconProps) => {
    // console.log(`props= ${JSON.stringify(props)}`)
    return (
        <TouchableHighlight style={props.style} onPress={props.onPress} underlayColor={props.underlayColor}>
            <Icon name={props.name} size={props.size} color={props.color} />
        </TouchableHighlight>
    );
};
