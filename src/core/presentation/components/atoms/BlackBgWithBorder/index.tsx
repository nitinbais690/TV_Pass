import useAppColors from 'core/presentation/hooks/use-app-colors';
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../BlackBgWithBorder/styles';

export default function BlackBgWithBorder(props: BlackBgWithBorderProps) {
    const appColors = useAppColors();
    const style = styles(appColors);
    return (
        <View style={style.containerStyle}>
            <Text style={style.titleStyle}>{props.text}</Text>
        </View>
    );
}

interface BlackBgWithBorderProps {
    text: string;
    style?: {};
}
