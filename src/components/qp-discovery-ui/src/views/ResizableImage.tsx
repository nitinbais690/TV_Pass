import React, { useState } from 'react';

import { ImageProps, LayoutChangeEvent, ImageURISource } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useConfig } from '../context/ConfigProvider';
import { AspectRatio, ImageType } from 'qp-common-ui';
import { imageResizerUri, imageResizer } from '../utils/ImageUtils';

interface ResizableImageProps extends Partial<ImageProps> {
    keyId: string;
    width?: number;
    height?: number;
    testID?: string;
    skipResize?: boolean;
    isPortrait?: boolean;
    aspectRatioKey: AspectRatio;
    imageType: ImageType;
}

/**
 * A Custom React component that wraps `Image` component for displaying network images
 * and works with Firstlight's ImageResizer server by dynamically adding required parameters.
 *
 * @param  {ResizableImageProps} props Takes standards `ImageProps` along with width and height optionally.
 *
 * @note `ResizableImage` supports computing the dimensions when the view gets layed out (onLayout event),
 * this should be in layouts, while this is convenient in many layouts, we would recommend passing in
 * width and height props while using `ResizableImage` within a list view
 * since computing the width and height onLayout can be very expensive on a complicated list,
 * which would lead to stuttering on scroll.
 */
const ResizableImage = (props: ResizableImageProps): JSX.Element | null => {
    const config = useConfig();
    const resizerEndpoint = (config && config.imageResizeURL) || undefined;
    const resizerPath = /*(config && config.imageResizerPath)*/ 'image' || undefined;
    let [uri, setUri] = useState(props.source ? (props.source as ImageURISource).uri : '');
    let onLayout = (_: LayoutChangeEvent): void => {};

    if (props.keyId.length < 1 && props.aspectRatioKey) {
        return null;
    }

    if (!uri && resizerEndpoint && !props.skipResize) {
        if (props.width) {
            uri = imageResizerUri(
                resizerEndpoint,
                resizerPath,
                props.keyId,
                props.aspectRatioKey,
                props.imageType,
                props.width,
            );
        } else {
            onLayout = (e: LayoutChangeEvent): void => {
                const l = e.nativeEvent.layout;
                setUri(
                    imageResizerUri(
                        resizerEndpoint,
                        resizerPath,
                        props.keyId,
                        props.aspectRatioKey,
                        props.imageType,
                        l.width,
                    ),
                );
            };
        }
    } else {
        if (props.width && props.height) {
            uri = imageResizer(uri, props.width, props.height);
        } else {
            onLayout = (e: LayoutChangeEvent): void => {
                const l = e.nativeEvent.layout;
                setUri(
                    imageResizerUri(
                        resizerEndpoint,
                        resizerPath,
                        props.keyId,
                        props.aspectRatioKey,
                        props.imageType,
                        l.width,
                    ),
                );
            };
        }
    }

    return (
        <FastImage
            testID={props.testID}
            style={props.style}
            source={{ uri: uri, cache: FastImage && FastImage.cacheControl ? FastImage.cacheControl.web : undefined }}
            onLayout={onLayout}
            resizeMode={FastImage && FastImage.resizeMode ? FastImage.resizeMode.contain : undefined}
        />
    );
};

// export default ResizableImage;
export default React.memo(ResizableImage, (prev: ResizableImageProps, next: ResizableImageProps): boolean => {
    return (
        prev.keyId === next.keyId && prev.isPortrait === next.isPortrait && prev.aspectRatioKey === next.aspectRatioKey
    );
});
