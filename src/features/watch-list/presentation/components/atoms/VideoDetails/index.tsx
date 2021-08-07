import useAppColors from 'core/presentation/hooks/use-app-colors';
import { appFontStyle } from 'core/styles/AppStyles';
import React from 'react';
import { View, Text } from 'react-native';
import { VideoDetailsStyle } from './style';

export default function VideoDetails(props: VideoDetailsProps): JSX.Element {
    const appColors = useAppColors();
    const style = VideoDetailsStyle(appColors);
    return (
        <View style={style.container}>
            <Text style={[appFontStyle.sublineText, style.details]}>{getText(props)}</Text>
        </View>
    );
}

const getText = (data: VideoDetailsProps): string => {
    let text = '';
    if (data.type) {
        text = data.type;
    }
    if (data.duration) {
        text += (text ? ' | ' : '') + data.duration;
    }
    if (data.rating) {
        text += (text ? ' | ' : '') + data.rating;
    }
    return text;
};

export interface VideoDetailsProps {
    type: string;
    duration: string;
    rating: string;
}
