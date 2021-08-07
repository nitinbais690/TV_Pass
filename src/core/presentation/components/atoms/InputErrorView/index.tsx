import useAppColors from 'core/presentation/hooks/use-app-colors';
import React from 'react';
import { Text, View } from 'react-native';
import { inputErrorViewStyles } from './styles';

export default function InputErrorView(props: InputErrorViewProps) {
    const appColors = useAppColors();
    const styles = inputErrorViewStyles(appColors);
    return (
        <View>{props.errorText && <Text style={[styles.inputErrorStyle, props.style]}>{props.errorText}</Text>}</View>
    );
}

interface InputErrorViewProps {
    style?: {};
    errorText: string;
}
