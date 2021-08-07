import React from 'react';
import { View } from 'react-native';
import RoundIconButton from 'core/presentation/components/atoms/RoundIconButton';
import DownloadIcon from 'assets/images/ic_download.svg';
import DeleteIcon from 'assets/images/ic_delete.svg';
import PlayIcon from 'assets/images/ic_play_sharp-edge.svg';
import { DELETE_ICON_SIZE, DOWNLOAD_ICON_SIZE, PLAY_ICON_SIZE, ROUND_BUTTON_SIZE, VideoActionStyles } from './style';

export default function VideoActions(props: VideoActionsProp) {
    const styles = VideoActionStyles();
    return (
        <View style={styles.container}>
            <RoundIconButton
                width={ROUND_BUTTON_SIZE}
                height={ROUND_BUTTON_SIZE}
                svgIcon={<PlayIcon width={PLAY_ICON_SIZE.width} height={PLAY_ICON_SIZE.height} />}
                style={styles.button}
                onPress={props.onPressPlay}
            />
            <RoundIconButton
                width={ROUND_BUTTON_SIZE}
                height={ROUND_BUTTON_SIZE}
                svgIcon={<DownloadIcon width={DOWNLOAD_ICON_SIZE.width} height={DOWNLOAD_ICON_SIZE.height} />}
                style={styles.button}
                onPress={props.onPressDownload}
            />
            <RoundIconButton
                width={ROUND_BUTTON_SIZE}
                height={ROUND_BUTTON_SIZE}
                svgIcon={<DeleteIcon width={DELETE_ICON_SIZE.width} height={DELETE_ICON_SIZE.height} />}
                style={styles.button}
                onPress={props.onPressDelete}
            />
        </View>
    );
}

export interface VideoActionsProp {
    onPressPlay: () => void;
    onPressDownload: () => void;
    onPressDelete: () => void;
}
