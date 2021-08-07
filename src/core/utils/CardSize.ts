import { AspectRatio, AspectRatioUtil, selectDeviceType } from 'qp-common-ui';
import { CardLayout, CardSize, ResourceVm } from 'qp-discovery-ui';
import { Dimensions, Platform } from 'react-native';
import { AppConfig } from 'utils/AppPreferencesContext';
import DeviceInfo from 'react-native-device-info';

export const cardWidth = (
    isPortrait: boolean,
    catalogCardsPreview: number,
    appConfig: AppConfig,
    resource: ResourceVm,
    containerSize?: { width: number; height: number },
    fallbackAspectRatio?: AspectRatio,
) => {
    const padding = cardPadding(isPortrait, resource.layout);
    const aspectRatio = cardAspectRatio(
        isPortrait,
        appConfig,
        resource.layout,
        resource.aspectRatio,
        fallbackAspectRatio,
    );
    const { width, height } = containerSize ? containerSize : Dimensions.get('window');
    // Note: Indicates the aspect ratio is extra wide (e.g. 3x1)
    // We should style the banner carousel based on whether the aspect is extra wide or not,
    // this is especially true for iPad landscape
    const isWideAspect = aspectRatio > 2;
    if (resource.layout === 'banner') {
        let w = width;
        if (resource.size === 'large') {
            let SLIDER_WIDTH = Dimensions.get('window').width;
            let ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.75);
            let ITEM_HORIZONTAL_MARGIN = Math.round(SLIDER_WIDTH * 0.02);
            let ITEM_WIDTH_FIX = ITEM_WIDTH + ITEM_HORIZONTAL_MARGIN * 2;
            w = ITEM_WIDTH_FIX;
        }

        return isPortrait || isWideAspect ? w : Math.floor((height / 1.5) * aspectRatio - padding);
    }

    const standardWidth = (width - (catalogCardsPreview + 1) * padding) / catalogCardsPreview;
    return standardWidth * sizeFactor(resource.size) * aspecRatioFactor(aspectRatio) * orientationFactor(isPortrait);
};

export const sizeFactor = (size?: CardSize): number => {
    switch (size) {
        case 'large':
            return 1.3;
        case 'xlarge':
            return selectDeviceType({ Tablet: 1.5 }, 2.2);
        default:
            return 1;
    }
};

export const aspecRatioFactor = (ratio?: AspectRatio): number => {
    switch (ratio) {
        case AspectRatio._16by9:
        case AspectRatio._3by4:
            return ratio;
        case AspectRatio._1by1:
            return selectDeviceType({ Tv: 1.2 }, 0.65);
        default:
            return 1;
    }
};

const orientationFactor = (isPortait: boolean) => {
    return isPortait ? 1 : 0.7;
};

export const cardAspectRatio = (
    isPortrait: boolean,
    appConfig?: AppConfig,
    layout?: CardLayout,
    resourceAspectRatio?: AspectRatio,
    fallbackAspectRatio?: AspectRatio,
) => {
    const ar = resourceAspectRatio || fallbackAspectRatio || AspectRatio._16by9;
    const aspectRatioOverrideKey = Platform.isTV
        ? `sf.aspectratio_${layout}_${DeviceInfo.getDeviceType().toLowerCase()}`
        : `sf.aspectratio_${layout}_${DeviceInfo.getDeviceType().toLowerCase()}_${
              isPortrait ? 'portrait' : 'landscape'
          }`;
    const arOverride = appConfig && appConfig[aspectRatioOverrideKey];
    if (arOverride) {
        return AspectRatioUtil.fromString(arOverride);
    }
    return ar;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const cardPadding = (isPortait: boolean, layout?: CardLayout) => {
    if (!Platform.isTV) {
        return layout === 'banner' ? 0 : 20;
    } else {
        return layout === 'banner' ? 0 : 4;
    }
};
