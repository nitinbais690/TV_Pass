import React from 'react';
import { View } from 'react-native';
import VideoActions, { VideoActionsProp } from '../../atoms/VideoActions';
import VideoDetails, { VideoDetailsProps } from '../../atoms/VideoDetails';
import VideoTitle from '../../atoms/VideoTitle';
import { VideoContentStyles } from './style';

export default function VideoContent(props: VideoContentProps) {
    const styles = VideoContentStyles();
    return (
        <View style={[props.styles, styles.container]}>
            <VideoTitle title={props.title} />
            <VideoDetails type={props.details.type} duration={props.details.duration} rating={props.details.rating} />
            <VideoActions
                onPressDelete={props.actions.onPressDelete}
                onPressDownload={props.actions.onPressDownload}
                onPressPlay={props.actions.onPressPlay}
            />
        </View>
    );
}

export interface VideoContentProps {
    title: string;
    details: VideoDetailsProps;
    actions: VideoActionsProp;
    styles?: any;
}
