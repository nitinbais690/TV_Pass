import { appFontStyle } from 'core/styles/AppStyles';
import React from 'react';
import { Text } from 'react-native';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { styles } from './styles';

export default function DetailsCaption(props: { name: string | undefined; style?: {} }) {
    let titleStyles = styles(useAppColors());
    let fontStyle = appFontStyle;

    return (
        <Text style={[fontStyle.sublineText, titleStyles.titleStyle, props.style]}>
            {props.name ? props.name : 'A'}
        </Text>
    );
}
