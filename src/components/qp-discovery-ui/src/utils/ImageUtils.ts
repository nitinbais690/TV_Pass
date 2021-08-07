import { AspectRatio, ImageType, AspectRatioUtil } from 'qp-common-ui';
import { PixelRatio } from 'react-native';
import { URLBuilder } from './URLBuilder';

export const imageResizerUri = (
    resizerEndpoint: string,
    resizerPath: string | undefined,
    contentId: string,
    aspectRatioKey: AspectRatio,
    imageType: ImageType,
    width: number,
): string => {
    resizerPath = formUrlPath(resizerPath!, contentId, imageType, AspectRatioUtil.asString(aspectRatioKey));
    const params = {
        width: PixelRatio.getPixelSizeForLayoutSize(width),
    };
    // console.log(`url : ${URLBuilder(resizerEndpoint, resizerPath, params).toString()}`);
    return URLBuilder(resizerEndpoint, resizerPath, params);
};
const formUrlPath = (resizerPath: string, contentId: string, imageType: ImageType, aspectRatioKey: string): string => {
    const format =
        imageType === ImageType.Logo || imageType === ImageType.LogoSponsor || imageType === ImageType.LogoHeader
            ? 'png'
            : 'jpg';
    return `${resizerPath}/${contentId}/${imageType}-${aspectRatioKey}.${format}`;
};

export const imageResizer = (uri: string | undefined, width: number, height: number): string => {
    return (
        uri +
        '&width=' +
        PixelRatio.getPixelSizeForLayoutSize(width) +
        '&height=' +
        PixelRatio.getPixelSizeForLayoutSize(height) +
        '&scalingMode=aspectFit'
    );
};
