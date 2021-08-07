import { appFontStyle } from 'core/styles/AppStyles';
import React from 'react';
import { Text } from 'react-native';
import { styles } from './styles';

export default function DetailsTitle(props: { name: string | undefined; style?: {} }) {
    let titleStyles = styles();
    let fontStyle = appFontStyle;
    return (
        <Text style={[fontStyle.header2, titleStyles.titleStyle, props.style]} numberOfLines={2} ellipsizeMode={'tail'}>
            {props.name ? props.name : ' '}
        </Text>
    );
}
