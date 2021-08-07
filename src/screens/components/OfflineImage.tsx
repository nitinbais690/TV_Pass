import { Platform, ImageSourcePropType, StyleProp, ImageStyle, ImageResizeMode, Image } from 'react-native';
import { useDownloadedImage } from './hooks/useDownloadedImage';
import React from 'react';
// import FastImage, { FastImageSource } from 'react-native-fast-image';

export type OfflimeImageSourcePropType = ImageSourcePropType;
export interface OfflineImageProps /*extends ImageProps*/ {
    imageURI: string;
    offlineID: string;
    fallbackSource: ImageSourcePropType;
    style?: StyleProp<ImageStyle>;
    resizeMode?: ImageResizeMode;
    resizeMethod?: 'auto' | 'resize' | 'scale';
    testID?: string;
}
/**
 * Used to cache an image fetched from Network for Offline Use.
 * @param props
 */
export const OfflineImage = (props: OfflineImageProps) => {
    const localPath = useDownloadedImage(props.imageURI, props.offlineID);
    let imageSource: OfflimeImageSourcePropType = localPath
        ? { uri: Platform.OS === 'android' ? 'file://' + localPath : '' + localPath }
        : props.fallbackSource;
    // console.log(`imageSource = ${JSON.stringify(imageSource)}`)
    return <Image {...props} source={imageSource} key={localPath} />;
};
