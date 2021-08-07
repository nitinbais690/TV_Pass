import React from 'react';
import { StyleSheet, Dimensions, Platform, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
    ResourceVm,
    ResourceCardViewBaseProps,
    ResourceCardView,
    CardSize,
    CardStyle,
    CardLayout,
    getDiffDays,
    isFutureDate,
} from 'qp-discovery-ui';
import { selectDeviceType, AspectRatio, AspectRatioUtil, scale } from 'qp-common-ui';
import { AppConfig, useAppPreferencesState } from 'utils/AppPreferencesContext';
import RoundedCardOverlay from './RoundedCardOverlay';
import { appDimensionValues, appPaddingValues, appFonts } from 'core/styles/AppStyles';
import CardOverlay from './CardOverlay';
import ContentCardFooter from 'features/details/presentation/components/organisms/ContentCardFooter';
import CardPlayOverlay from 'features/discovery/presentation/components/molecules/CardPlayOverlay';
import CardTagsOverlay from 'features/discovery/presentation/components/molecules/CardTagsOverlay';
import BlackBgWithBorder from 'core/presentation/components/atoms/BlackBgWithBorder';
import { useLocalization } from 'contexts/LocalizationContext';
import { appFlexStyles } from 'core/styles/FlexStyles';

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
) => {
    const { width, height } = containerSize ? containerSize : Dimensions.get('window');
    // Note: Indicates the aspect ratio is extra wide (e.g. 3x1)
    // We should style the banner carousel based on whether the aspect is extra wide or not,
    // this is especially true for iPad landscape
    const isWideAspect = ar > 2;
    if (layout === 'banner') {
        let w = width;
        if (size === 'large') {
            let SLIDER_WIDTH = Dimensions.get('window').width;
            let ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.75);
            let ITEM_HORIZONTAL_MARGIN = Math.round(SLIDER_WIDTH * 0.02);
            let ITEM_WIDTH_FIX = ITEM_WIDTH + ITEM_HORIZONTAL_MARGIN * 2;
            w = ITEM_WIDTH_FIX;
        }

        return isPortait || isWideAspect ? w : Math.floor((height / 1.5) * ar - padding);
    }

    const standardWidth = (width - (catalogCardsPreview + 1) * padding) / catalogCardsPreview;
    return standardWidth * sizeFactor(size) * aspecRatioFactor(ar) * orientationFactor(isPortait);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const cardPadding = (isPortait: boolean, layout?: CardLayout) => {
    if (!Platform.isTV) {
        return layout === 'banner' ? 0 : 20;
    } else {
        return layout === 'banner' ? 0 : 4;
    }
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
    cardProps = {},
    fallbackAspectRatio,
    containerSize,
    cardsPreview,
    gridMode,
}: {
    resource: ResourceVm;
    isPortrait: boolean;
    onResourcePress?: (resource: ResourceVm) => void;
    cardProps?: ResourceCardViewBaseProps<ResourceVm>;
    fallbackAspectRatio?: AspectRatio;
    containerSize?: { width: number; height: number };
    cardsPreview?: number;
    gridMode?: boolean;
}): JSX.Element => {
    const prefs = useAppPreferencesState();
    const { appTheme, catalogCardsPreview, appConfig } = prefs;
    let { appColors, appDimensions } = appTheme(prefs);
    const { strings } = useLocalization();

    const cardBorderRadius = (layout?: CardLayout, style?: CardStyle, size?: CardSize) => {
        if (size === 'large' && !Platform.isTV) {
            return 8;
        }

        if (layout === 'banner') {
            return 0;
        }

        if (Platform.isTV && style !== 'rounded') {
            return 0;
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
    );
    const borderRadius = cardBorderRadius(resource.layout, resource.style, resource.size);

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    width: resourceCardWidth,
                    marginRight: resource.layout === 'banner' ? padding / 4 : padding / 2,
                    marginLeft: resource.layout === 'banner' ? padding / 4 : 0,
                    marginTop: resource.layout === 'banner' ? 0 : gridMode ? 10 : 0,
                    marginBottom: 0,
                    borderRadius: borderRadius,
                    // backgroundColor: appColors.primaryVariant3,
                    borderWidth: Platform.isTV ? 2 : 0,
                    borderColor: 'transparent',
                    overflow: 'hidden',
                },
                wrapperStyle: {
                    width: resourceCardWidth,
                    aspectRatio: aspectRatio,
                    borderTopLeftRadius: borderRadius,
                    borderTopRightRadius: borderRadius,
                    borderRadius: !resource.showFooter ? borderRadius : undefined,
                    // backgroundColor: appColors.primaryVariant3,
                },
                imageStyle: {
                    borderTopLeftRadius: borderRadius,
                    borderTopRightRadius: borderRadius,
                    borderBottomLeftRadius: borderRadius,
                    borderBottomRightRadius: borderRadius,
                    borderRadius: undefined,
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
                    borderColor: 'white',
                    borderRadius: borderRadius,
                    borderWidth: 2,
                    elevation: 20,
                    shadowOffset: { width: 0, height: 5 },
                    shadowColor: appColors.brandTint,
                    shadowOpacity: 0.5,
                    shadowRadius: 20,
                },
                overviewWrapperStyle: {
                    flexDirection: 'row',
                    position: 'absolute',
                    right: 0,
                },

                footerViewStyle: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingTop: appPaddingValues.xxxxs,
                    backgroundColor: 'transparent',
                },
                footerTextStyle: {
                    color: appColors.secondary,
                    maxWidth: '60%',
                    fontFamily: appFonts.semibold,
                    fontSize: selectDeviceType({ Handset: scale(12, 0) }, scale(16, 0)),
                    paddingRight: appPaddingValues.xxxs,
                    lineHeight: appDimensionValues.xs,
                },
                comingSoonDateIndicator: {
                    marginHorizontal: appDimensionValues.xxxlg,
                    marginTop: scale(-12),
                    ...appFlexStyles.flexColumnFill,
                },
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [resourceCardWidth, aspectRatio, borderRadius, padding, resource.showFooter, resource.layout],
    );

    const storeFrontCardProps: ResourceCardViewBaseProps<ResourceVm> = React.useMemo(
        () => ({
            ...cardProps,
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

    const overlayView = React.useMemo(() => {
        //console.log("resource.containerName",resource.containerName)
        if (resource.containerType === 'Collection') {
            return undefined;
        } else if (
            resource.containerName &&
            (resource.containerName.toLowerCase() === 'trailers' || resource.completedPercent !== undefined)
        ) {
            return <CardPlayOverlay isOriginals={resource.isOriginals} isPremium={!resource.isFreeContent} />;
        } else if (resource.layout === 'banner' || resource.size === 'large') {
            return <CardOverlay resource={resource} />;
        } else if (resource.style === 'rounded') {
            return <RoundedCardOverlay resource={resource} />;
        } else {
            return <CardTagsOverlay isOriginals={resource.isOriginals} isPremium={!resource.isFreeContent} />;
        }
    }, [resource]);

    const rating = resource.allRatings && Object.values(resource.allRatings);

    const footerViewContinueWatching = <ContentCardFooter resource={resource} rating={rating} />;

    const footerView =
        resource.completedPercent !== undefined ? (
            footerViewContinueWatching
        ) : resource.enableUpcomingTag ||
          resource.layout === 'banner' ||
          resource.containerType === 'Collection' ||
          resource.size === 'large' ? (
            undefined
        ) : (
            <ContentCardFooter resource={resource} rating={rating} />
        );

    const comingSoonView = (
        <View style={{ width: resourceCardWidth }}>
            {resource.licenseWindowStarTime && isFutureDate(resource.licenseWindowStarTime) && (
                <View style={[styles.comingSoonDateIndicator]}>
                    <BlackBgWithBorder
                        text={getDiffDays(resource.licenseWindowStarTime) + ' ' + strings.coming_soon_subTitle}
                    />
                </View>
            )}

            <ContentCardFooter resource={resource} rating={rating} />
        </View>
    );

    return (
        <View>
            <ResourceCardView
                resource={resource}
                isPortrait={isPortrait}
                hideGradient={true}
                {...storeFrontCardProps}
                cardWidth={resourceCardWidth}
                cardStyle={styles}
                cardAspectRatio={aspectRatio}
                cardImageType={resource.imageType}
                overlayView={overlayView}
                footerView={footerView}
            />
            {resource.enableUpcomingTag && comingSoonView}
        </View>
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
