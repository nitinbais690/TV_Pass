import { AspectRatio, ImageType, AspectRatioUtil } from 'qp-common-ui';
import { PixelRatio } from 'react-native';
import { URLBuilder } from './URLBuilder';

const stripUrlParams = (sourceURL: string, parameter: string) => {
    let url = sourceURL;
    let urlparts = url.split('?');

    if (urlparts.length >= 2) {
        let urlBase = urlparts.shift();
        let queryString = urlparts.join('?');

        let prefix = encodeURIComponent(parameter) + '=';
        let pars = queryString.split(/[&;]/g);
        for (let i = pars.length; i-- > 0; ) {
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                pars.splice(i, 1);
            }
        }
        url = urlBase + '?' + pars.join('&');
    }
    return url;
};

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
    return URLBuilder(resizerEndpoint, resizerPath, params);
};
const formUrlPath = (resizerPath: string, contentId: string, imageType: ImageType, aspectRatioKey: string): string => {
    const format =
        imageType === ImageType.Logo || imageType === ImageType.LogoSponsor || imageType === ImageType.LogoHeader
            ? 'png'
            : 'jpg';
    return `${resizerPath}/${contentId}/${imageType}-${aspectRatioKey}.${format}`;
};

export const imageResizer = (uri: string | undefined, width: number): string => {
    if (uri && uri.includes('?width=')) {
        let newUri = stripUrlParams(uri, 'width');
        return newUri + 'width=' + PixelRatio.getPixelSizeForLayoutSize(width);
    }
    return uri + '?width=' + PixelRatio.getPixelSizeForLayoutSize(width);
};
