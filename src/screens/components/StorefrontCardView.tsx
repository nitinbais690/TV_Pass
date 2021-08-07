import React from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
    ResourceVm,
    ResourceCardViewBaseProps,
    ResourceCardView,
    CardSize,
    CardStyle,
    CardLayout,
    EmptyResourceCardView,
} from 'qp-discovery-ui';
import { selectDeviceType, AspectRatio, AspectRatioUtil, ImageType } from 'qp-common-ui';
import { AppConfig, useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appFonts, appPadding, tvPixelSizeForLayout } from '../../../AppStyles';
import CardOverlay from './CardOverlay';
import CardFooter from './CardFooter';
import RoundedCardOverlay from './RoundedCardOverlay';

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

export const carouselCardWidth = (isPortrait: boolean, catalogCardsPreview: number, appConfig?: AppConfig) => {
    const padding = cardPadding(isPortrait, 'banner');
    const aspectRatio = cardAspectRatio(isPortrait, appConfig, 'banner', AspectRatio._16by9);
    const width = cardWidth(isPortrait, aspectRatio, catalogCardsPreview, padding, 'banner');
    return [width + padding / 2, aspectRatio];
};

export const cardWidth = (
    isPortait: boolean,
    ar: AspectRatio,
    catalogCardsPreview: number,
    padding: number,
    layout?: CardLayout,
    size?: CardSize,
    containerSize?: { width: number; height: number },
    containerName?: string,
) => {
    const { width, height } = containerSize ? containerSize : Dimensions.get('window');
    // Note: Indicates the aspect ratio is extra wide (e.g. 3x1)
    // We should style the banner carousel based on whether the aspect is extra wide or not,
    // this is especially true for iPad landscape
    const isWideAspect = ar > 2;
    if (layout === 'banner') {
        const w = width - 2 * appPadding.sm(true);
        return isPortait || isWideAspect ? w : Math.floor((height / 1.5) * ar - padding);
    }

    if (Platform.isTV && layout === 'carousel' && containerName === 'Channels') {
        // console.log('CONTAINER SIZE: ', width);
        const w = width - 2 * appPadding.sm(true);
        // console.log('CONTAINER W : ', w);
        return isPortait || isWideAspect ? w : 175;
    }

    const standardWidth = (width - (catalogCardsPreview + 1) * padding) / catalogCardsPreview;
    return standardWidth * sizeFactor(size) * aspecRatioFactor(ar) * orientationFactor(isPortait);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const cardPadding = (isPortait: boolean, layout?: CardLayout) => {
    return 20;
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

const StorefrontCardView = ({
    resource,
    isPortrait,
    onResourcePress,
    fallbackAspectRatio,
    containerSize,
    cardsPreview,
    gridMode,
    blockFocusDown,
    blockFocusLeft,
    blockFocusRight,
    isDetailsTvLayout,
    isCardCustomSpacing,
    hasTVPreferredFocus,
    blockFocusUp,
    shiftScrollToFocusIndex,
    cardType = '',
    route,
}: {
    resource: ResourceVm;
    isPortrait: boolean;
    onResourcePress?: (resource: ResourceVm) => void;
    fallbackAspectRatio?: AspectRatio;
    containerSize?: { width: number; height: number };
    cardsPreview?: number;
    gridMode?: boolean;
    blockFocusDown?: boolean;
    blockFocusUp?: boolean;
    blockFocusLeft?: boolean;
    blockFocusRight?: boolean;
    hasTVPreferredFocus?: boolean;
    isCardCustomSpacing?: boolean | undefined;
    isDetailsTvLayout?: boolean;
    shiftScrollToFocusIndex?: () => void;
    cardType?: string;
    route?: string;
}): JSX.Element => {
    const prefs = useAppPreferencesState();
    const { appTheme, catalogCardsPreview, appConfig } = prefs;
    let { appColors, appDimensions } = appTheme(prefs);

    const cardBorderRadius = (layout?: CardLayout, style?: CardStyle) => {
        if (layout === 'banner') {
            return appDimensions.cardRadius;
        }

        return style === 'rounded' ? resourceCardWidth / 2 : appDimensions.cardRadius;
    };

    const aspectRatio = cardAspectRatio(
        isPortrait,
        appConfig,
        resource.layout,
        resource.aspectRatio,
        fallbackAspectRatio,
    );
    const padding = cardPadding(isPortrait, resource.layout);
    const resourceCardWidth = cardWidth(
        isPortrait,
        aspectRatio,
        cardsPreview ? cardsPreview : catalogCardsPreview,
        padding,
        resource.layout,
        resource.size,
        containerSize,
        resource.containerName,
    );
    const borderRadius = cardBorderRadius(resource.layout, resource.style);

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    width: resourceCardWidth,
                    marginRight: isCardCustomSpacing
                        ? tvPixelSizeForLayout(10)
                        : isDetailsTvLayout
                        ? padding / 2
                        : resource.layout === 'banner'
                        ? Platform.isTV
                            ? 30
                            : padding / 4
                        : Platform.isTV
                        ? resource.layout === 'carousel' && resource.containerName === 'Channels'
                            ? 10
                            : 30
                        : padding / 2,
                    marginLeft: isCardCustomSpacing ? 0 : resource.layout === 'banner' ? padding / 4 : 0,
                    marginTop: isCardCustomSpacing
                        ? 0
                        : isDetailsTvLayout
                        ? 0
                        : resource.layout === 'banner'
                        ? selectDeviceType({ Tv: 25 }, 20)
                        : gridMode
                        ? selectDeviceType({ Tv: 15 }, 10)
                        : selectDeviceType({ Tv: 25 }, 0),
                    marginBottom: isCardCustomSpacing ? 0 : isDetailsTvLayout ? 0 : Platform.isTV ? padding : 0,
                    borderRadius: borderRadius,
                    backgroundColor: 'transparent',
                    borderWidth: Platform.isTV ? 2 : 0,
                    borderColor: 'transparent',
                    overflow: resource.layout === 'banner' || resource.style === 'rounded' ? 'hidden' : undefined,
                    shadowOffset: { width: 0, height: 2 },
                    shadowColor: '#000',
                    shadowOpacity: 0.15,
                    shadowRadius: 2,
                    elevation: 2,
                },
                wrapperStyle: {
                    width: '100%',
                    height:
                        Platform.isTV && resource.layout === 'carousel' && resource.containerName === 'Channels'
                            ? 95
                            : undefined,
                    aspectRatio: selectDeviceType(
                        {
                            Tv: resource.containerName === 'Channels' ? AspectRatio._16by9 : aspectRatio,
                            Handset: aspectRatio,
                            Tablet: aspectRatio,
                        },
                        aspectRatio,
                    ),
                    borderTopLeftRadius: borderRadius,
                    borderTopRightRadius: borderRadius,
                    borderRadius: !resource.showFooter ? borderRadius : undefined,
                    backgroundColor: appColors.primary,
                },
                imageStyle: {
                    borderTopLeftRadius: borderRadius,
                    borderTopRightRadius: borderRadius,
                    borderBottomRightRadius: resource.containerName !== 'Channels' ? 0 : borderRadius,
                    borderBottomLeftRadius: resource.containerName !== 'Channels' ? 0 : borderRadius,
                    flex: 1,
                },
                titleStyle: {
                    fontSize: appFonts.sm,
                    fontFamily: appFonts.light,
                    color: appColors.secondary,
                    fontWeight: undefined,
                },
                footer: {
                    justifyContent: 'space-between',
                    backgroundColor: appColors.primaryVariant1,
                    borderBottomLeftRadius: borderRadius,
                    borderBottomRightRadius: borderRadius,
                },
                footerTitle: {
                    fontSize: appFonts.xs,
                    fontFamily: appFonts.primary,
                    color: appColors.secondary,
                    fontWeight: '500',
                },
                footerSubtitle: {
                    fontSize: appFonts.xxs,
                    fontFamily: appFonts.primary,
                    color: appColors.caption,
                    fontWeight: '500',
                    paddingTop: 5,
                },
                onFocusCardStyle: {
                    borderColor: appColors.brandTint,
                    borderRadius: borderRadius,
                    borderWidth: 2,
                    elevation: 20,
                    shadowOffset: { width: 0, height: 5 },
                    shadowColor: appColors.brandTint,
                    shadowOpacity: 0.5,
                    shadowRadius: 20,
                },
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [resourceCardWidth, aspectRatio, borderRadius, padding, resource.showFooter, resource.layout],
    );

    const cardProps: ResourceCardViewBaseProps<ResourceVm> = React.useMemo(
        () => ({
            onResourcePress: onResourcePress,
            tvParallaxProperties: {
                magnification: 1.0,
            },
            underlayColor: 'rgb(18, 18, 18)',
            activeOpacity: Platform.isTV ? 1 : 0.5,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const overlayView = React.useMemo(() => <CardOverlay resource={resource} />, [resource]);
    const rounderOverlayView = React.useMemo(() => <RoundedCardOverlay resource={resource} />, [resource]);
    const footerView =
        resource.layout === 'banner' || resource.containerType === 'Collection' ? (
            undefined
        ) : (
            <CardFooter resource={resource} />
        );
    let hideGradient: boolean = true;
    if (route === 'My Content' && Platform.isTV) {
        hideGradient = false;
    }
    return (
        <>
            {cardType === 'EmptyCard' ? (
                <EmptyResourceCardView
                    resource={resource}
                    isPortrait={isPortrait}
                    hideGradient={true}
                    {...cardProps}
                    cardStyle={styles}
                    cardAspectRatio={aspectRatio}
                    cardImageType={resource.imageType}
                    overlayView={resource.style === 'rounded' ? rounderOverlayView : overlayView}
                    footerView={footerView}
                />
            ) : (
                <ResourceCardView
                    resource={resource}
                    isPortrait={isPortrait}
                    hideGradient={hideGradient}
                    {...cardProps}
                    cardStyle={styles}
                    cardAspectRatio={selectDeviceType(
                        {
                            Tv: resource.containerName === 'Channels' ? AspectRatio._16by9 : aspectRatio,
                            Handset: aspectRatio,
                            Tablet: aspectRatio,
                        },
                        aspectRatio,
                    )}
                    cardImageType={
                        Platform.isTV && resource.containerName === 'Channels' ? ImageType.Cover : resource.imageType
                    }
                    shiftScrollToFocusIndex={shiftScrollToFocusIndex}
                    hasTVPreferredFocus={hasTVPreferredFocus}
                    blockFocusUp={blockFocusUp}
                    blockFocusDown={blockFocusDown}
                    blockFocusLeft={blockFocusLeft}
                    blockFocusRight={blockFocusRight}
                    overlayView={resource.style === 'rounded' ? rounderOverlayView : overlayView}
                    footerView={footerView}
                />
            )}
        </>
    );
};

const propsAreEqual = (prevProps: any, nextProps: any): boolean => {
    return (
        prevProps.resource.id === nextProps.resource.id &&
        prevProps.resource.expiresIn === nextProps.resource.expiresIn &&
        prevProps.resource.completedPercent === nextProps.resource.completedPercent &&
        prevProps.isPortrait === nextProps.isPortrait
    );
};

export default React.memo(StorefrontCardView, propsAreEqual);
