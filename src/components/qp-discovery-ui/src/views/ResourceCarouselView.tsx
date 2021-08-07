import React, { useState } from 'react';
import { ListRenderItem, StyleSheet } from 'react-native';
import { CarouselView, CarouselViewBaseProps } from './CarouselView';
import ResourceCardView, { cardStyles } from './ResourceCardView';
import { ResourceVm } from '../models/ViewModels';
import { ResourceCardViewBaseProps } from './ResourceCardView';
import {
    createStyles,
    dimensions,
    padding,
    colors,
    USE_ABSOLUTE_VALUE,
    typography,
    defaultFont,
    dimentionsValues,
} from 'qp-common-ui';
import { Platform } from 'react-native';
import { CarouselPageIndicator, IndicatorPageBaseProps } from './CarouselPageIndicator';

const paddingXS = padding.xs(USE_ABSOLUTE_VALUE);
const paddingSM = padding.sm(USE_ABSOLUTE_VALUE);

const defaultCarouselCardStyles = createStyles(cardStyles, {
    wrapperStyle: {
        width: dimensions.fullWidth / dimensions.carouselAspectRatio - 2 * paddingXS,
        aspectRatio: dimensions.carouselAspectRatio,
        marginLeft: paddingXS,
        marginRight: paddingXS,
        marginTop: Platform.isTV ? paddingSM : paddingXS,
        marginBottom: paddingXS,
        borderRadius: dimensions.cardRadius,
        shadowOffset: { width: 0, height: 2 },
        shadowColor: colors.secondary,
        shadowOpacity: 0.6,
        shadowRadius: 3,
        elevation: 2.0,
        backgroundColor: colors.primary,
    },
    titleStyle: {
        ...typography.title,
        fontFamily: defaultFont.bold,
        color: colors.primary,
    },
});

const styles = StyleSheet.create({
    carouselcontainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: dimentionsValues.sm,
    },
});

export interface ResourceCarouselViewProps<T> extends ResourceCardViewBaseProps<T>, CarouselViewBaseProps {
    /**
     * Must be either `ResourceVm` or one of its extensions.
     */
    resources: T[];
    /**
     * The width of the card view
     */
    carouselCardWidth: number;
    /*
     * When True, Active page in highlights carousel will be indicated below the carousel
     *
     * Default value is True
     */
    showCarousalIndicator?: boolean;
    /**
     * Optional. Carousel indicator props.
     */
    carousalIndicatorProps?: IndicatorPageBaseProps;
    /**
     * Allows the ability to provide a custom rendering of `ResourceVm`.
     * Would not take effect when a custom `renderContainer` implementation is provided.
     *
     * When none is provided, the default rendering would apply.
     */
    renderResource?: ListRenderItem<ResourceVm>;
    /**
     * The viewOffset at which the carousel should be animated when orientation changes
     */
    viewScrollOffset?: number;
}

/**
 * A custom component that wraps `CarouselView` to render ResourceVm as a Carousel.
 *
 * @param resources Array of `ResourceVm` to be rendered as a carousel
 */
const ResourceCarouselView = ({
    cardAspectRatio,
    resources,
    carouselCardWidth,
    onResourcePress,
    linearGradientProps,
    tvParallaxProperties,
    cardStyle: carouselCardStyle,
    showCarousalIndicator = true,
    carousalIndicatorProps = {},
    renderResource,
    loop,
    autoplay,
    autoplayInterval,
    hideGradient,
    underlayColor,
    activeOpacity,
    isPortrait,
    viewScrollOffset,
}: ResourceCarouselViewProps<ResourceVm>): JSX.Element => {
    const [activeIndex, updateActiveIndex] = useState<number>(0);

    const renderResourceItem = React.useCallback(
        ({ item }: { item: ResourceVm }): JSX.Element => {
            return (
                <ResourceCardView
                    testID={'carouselCardView'}
                    cardAspectRatio={cardAspectRatio}
                    resource={item}
                    cardStyle={carouselCardStyle || defaultCarouselCardStyles}
                    onResourcePress={onResourcePress}
                    linearGradientProps={linearGradientProps}
                    tvParallaxProperties={tvParallaxProperties}
                    hideGradient={hideGradient}
                    underlayColor={underlayColor}
                    activeOpacity={activeOpacity}
                />
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            activeOpacity,
            cardAspectRatio,
            carouselCardStyle,
            hideGradient,
            linearGradientProps,
            onResourcePress,
            tvParallaxProperties,
            underlayColor,
        ],
    );

    const resourceItemLayout = React.useCallback(
        (_data: any, index: number): { length: number; offset: number; index: number } => ({
            length: carouselCardWidth,
            offset: carouselCardWidth * index,
            index,
        }),
        [carouselCardWidth],
    );

    const keyExtractor = React.useCallback((item, index) => item.id + '_' + index, []);

    const memoisedCarouselView = React.useMemo(
        () => (
            <CarouselView<ResourceVm>
                keyExtractor={keyExtractor}
                data={resources}
                autoplay={autoplay}
                loop={loop}
                autoplayInterval={autoplayInterval}
                initialScrollIndex={0}
                snapToInterval={carouselCardWidth}
                getItemLayout={resourceItemLayout}
                renderItem={renderResource ? renderResource : renderResourceItem}
                onIndexChange={updateActiveIndex}
                isPortrait={isPortrait}
                viewScrollOffset={viewScrollOffset}
            />
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            autoplay,
            autoplayInterval,
            carouselCardWidth,
            isPortrait,
            keyExtractor,
            loop,
            renderResource,
            renderResourceItem,
            resourceItemLayout,
            resources,
            viewScrollOffset,
        ],
    );

    return (
        <>
            {memoisedCarouselView}
            {showCarousalIndicator && resources.length > 1 && (
                <CarouselPageIndicator
                    {...carousalIndicatorProps}
                    numberOfPages={resources.length}
                    activeIndexPage={activeIndex}
                    containerStyle={styles.carouselcontainer}
                />
            )}
        </>
    );
};

const propsAreEqual = (
    prevProps: ResourceCarouselViewProps<ResourceVm>,
    nextProps: ResourceCarouselViewProps<ResourceVm>,
): boolean => {
    return (
        prevProps.resources.map(r => r.id).join(',') === nextProps.resources.map(r => r.id).join(',') &&
        prevProps.isPortrait === nextProps.isPortrait
    );
};

export default React.memo(ResourceCarouselView, propsAreEqual);
