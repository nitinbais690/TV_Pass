import useAppColors from 'core/presentation/hooks/use-app-colors';
import { appFontStyle } from 'core/styles/AppStyles';
import React from 'react';
import { View, Text } from 'react-native';
import { VideoTitleStyle } from './style';

export default function VideoTitle(props: any): JSX.Element {
    const appColors = useAppColors();
    const styles = VideoTitleStyle(appColors);
    return (
        <View style={styles.container}>
            <Text style={[appFontStyle.body3, styles.titleText]}>{props.title}</Text>
        </View>
    );
}
