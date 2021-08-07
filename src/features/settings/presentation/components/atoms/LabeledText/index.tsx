import React from 'react';
import { View, Text } from 'react-native';
import { labeledTextStyle } from './style';
import useAppColors from 'core/presentation/hooks/use-app-colors';

const LabeledText = (props: LabeledTextProps) => {
    const appColors = useAppColors();
    const style = labeledTextStyle(appColors);

    return (
        <View style={props.style}>
            <Text style={style.label}>{props.label}</Text>
            <Text style={style.title}>{props.text}</Text>
        </View>
    );
};

interface LabeledTextProps {
    label: string;
    text: string;
    style?: {};
}

export default LabeledText;
