import React from 'react';
import { View, Platform } from 'react-native';
import { ResizableImage } from 'qp-discovery-ui';
import { ImageType } from 'qp-common-ui';
import { useDimensions } from '@react-native-community/hooks';
import { imageAspectRatio, styles } from './styles';

export default function DetailsThumbnail(props: DetailsPosterProps) {
    const { width, height } = useDimensions().window;
    const isPortrait = height > width;
    const posterStyles = styles();

    return (
        <View style={posterStyles.container}>
            {!Platform.isTV && (
                <ResizableImage
                    keyId={props.id || ''}
                    style={[posterStyles.imageStyle]}
                    imageType={ImageType.Banner}
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
