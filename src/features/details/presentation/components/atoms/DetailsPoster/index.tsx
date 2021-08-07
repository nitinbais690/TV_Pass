import React from 'react';
import { View, Platform } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ResizableImage } from 'qp-discovery-ui';
import { ImageType } from 'qp-common-ui';
import { useDimensions } from '@react-native-community/hooks';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { imageAspectRatio, styles } from './styles';

export default function DetailsPoster(props: DetailsPosterProps) {
    const prefs = useAppPreferencesState();
    const { width, height } = useDimensions().window;
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const isPortrait = height > width;
    const posterStyles = styles(appColors);

    return (
        <View style={posterStyles.container}>
            {props.mainResourceImage && (
                <FastImage
                    key={props.id || ''}
                    style={[posterStyles.epgImageStyle]}
                    resizeMode={FastImage.resizeMode.contain}
                    source={{ uri: `${props.mainResourceImage}` }}
                />
            )}
            {!Platform.isTV && (
                <ResizableImage
                    keyId={props.id || ''}
                    style={[posterStyles.imageStyle]}
                    imageType={ImageType.Poster}
                    aspectRatioKey={imageAspectRatio}
                    skipResize={false}
                    isPortrait={isPortrait}
                    source={{ uri: props.imageUrl }}
                />
            )}
        </View>
    );
}

interface DetailsPosterProps {
    mainResourceImage: string | undefined;
    imageUrl: string | undefined;
    id: string | undefined;
}
