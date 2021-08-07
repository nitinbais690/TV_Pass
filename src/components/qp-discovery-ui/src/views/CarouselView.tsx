import React, { useEffect, useRef } from 'react';
import { FlatList, ViewToken, FlatListProps, Platform } from 'react-native';

export interface CarouselViewBaseProps {
    /**
     * Trigger autoplay on list. Set `@pagingEnabled` to `true` for better user experience. The default value is false.
     */
    autoplay?: boolean;

    /**
     * When true, the items in the list would repeat on either side, mimicking an endless list.
     * This would work only when the there are a minimum of n items that cover the screen.
     *
     * The default value is false.
     */
    loop?: boolean;

    /**
     * Delay in ms until navigating to the next item.
     *
     * The default value is 5000.
     */
    autoplayInterval?: number;

    /**
     * When set, causes the scroll view to stop at multiples of the value of `snapToInterval`.
     * This can be used for paginating through children that have lengths smaller than the scroll view.
     * Used in combination with `snapToAlignment` and `decelerationRate="fast"`. Overrides less
     * configurable `pagingEnabled` prop.
     */
    snapToInterval?: number;

    /**
     * The viewOffset at which the carousel should be animated when orientation changes
     */
    viewScrollOffset?: number;
    /**
     * Represented if the current layout orientation is in portrait or landscape
     */
    isPortrait?: boolean;
}

export interface CarouselViewProps<T> extends CarouselViewBaseProps, FlatListProps<T> {
    /*
     * Used to read the active page on the carousal
     * callback is done to the parent element and value is passed to the casousalpageindicator child element
     */
    onIndexChange?: (activeIndex: number) => void;
}

/**
 * A Custom React component for rendering a collection of objects as a Carousel.
 *
 * @param  {CarouselViewProps} props
 */
export const CarouselView = <T extends {}>(props: CarouselViewProps<T>): JSX.Element => {
    const listRef = useRef<FlatList<T>>(null);
    const carouselTimer = useRef<number | null>(null);
    let currentIndex = useRef<number>(props.initialScrollIndex || 0);
    let swapToIndex = useRef<number>(-1);
    const onIndexChange = props.onIndexChange;
    const viewabilityConfig = React.useMemo(
        () => ({
            itemVisiblePercentThreshold: 100,
        }),
        [],
    );
    const autoplayInterval = props.autoplayInterval || 5000;
    const actualResources = props.data || [];
    const canLoopOrAutoplay = props.loop && actualResources.length >= 3;
    const resources = canLoopOrAutoplay
        ? [...actualResources, ...actualResources, ...actualResources]
        : actualResources;

    const onViewableItemsChanged = (info: { viewableItems: ViewToken[]; changed: ViewToken[] }): void => {
        // if (info.viewableItems.length && info.viewableItems[0].index) {
        if (info.viewableItems.length > 0 && info.viewableItems[0].index !== null) {
            currentIndex.current = info.viewableItems[0].index;
        }
        onIndexChange(currentIndex.current);
        if (canLoopOrAutoplay) {
            let newLoopIndex = currentIndex.current;

            if (currentIndex.current >= actualResources.length * 2) {
                newLoopIndex = currentIndex.current - actualResources.length;
            } else if (currentIndex.current < actualResources.length) {
                newLoopIndex = currentIndex.current + actualResources.length;
            }

            if (newLoopIndex !== currentIndex.current) {
                // Swap here would cause the animation to be janky, since the previous scrollToIndex may not have finished yet.
                // So, we wait until the scroll animation has completed before swapping the position.
                swapToIndex.current = newLoopIndex;
            }

            clearAutoplayTimer();
            setupAutoplayTimer();
        }
    };

    // onViewableItemsChanged has to be the same reference across renders.
    // Hence we are using the ref instead of directly referencing the function.
    // See here for more info: https://github.com/facebook/react-native/issues/17408
    const handleItemChangedRef = useRef(onViewableItemsChanged).current;

    const onMomentumScrollEnd = React.useCallback((): void => {
        if (swapToIndex.current >= 0) {
            currentIndex.current = swapToIndex.current;

            swapToIndex.current = -1;
            (listRef.current as FlatList<T>).scrollToIndex({
                animated: false,
                index: currentIndex.current,
                viewPosition: 0.5,
            });
        }
    }, []);

    const clearAutoplayTimer = () => {
        if (carouselTimer.current) {
            clearTimeout(carouselTimer.current);
        }
    };

    const setupAutoplayTimer = () => {
        if (canLoopOrAutoplay && autoplayInterval !== undefined && autoplayInterval > 0) {
            carouselTimer.current = setInterval(() => {
                if (listRef && listRef.current) {
                    if (currentIndex.current + 1 < resources.length) {
                        currentIndex.current = currentIndex.current + 1;
                    } else {
                        currentIndex.current = 0;
                    }

                    listRef.current.scrollToIndex({
                        animated: true,
                        index: currentIndex.current,
                        viewPosition: 0.5,
                    });
                }
            }, autoplayInterval);
        }
    };

    useEffect(() => {
        if (listRef && listRef.current && props.viewScrollOffset) {
            if (currentIndex.current + 1 < resources.length) {
                currentIndex.current = currentIndex.current + 1;
            } else {
                currentIndex.current = 0;
            }
            if (!Platform.isTV) {
                listRef.current.scrollToIndex({
                    animated: true,
                    index: currentIndex.current,
                    viewOffset: props.viewScrollOffset,
                });
            }
        }
    }, [props.isPortrait, props.viewScrollOffset, resources.length]);

    return (
        <FlatList
            {...props}
            ref={listRef}
            data={resources}
            pagingEnabled={false}
            snapToAlignment="center"
            decelerationRate="fast"
            snapToStart={false}
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={handleItemChangedRef}
            viewabilityConfig={viewabilityConfig}
            onMomentumScrollEnd={onMomentumScrollEnd}
            // onScrollToIndexFailed={() => {}}
            onMomentumScrollBegin={() => clearAutoplayTimer()}
            onScrollBeginDrag={() => clearAutoplayTimer()}
            horizontal
            bounces={false}
            initialScrollIndex={canLoopOrAutoplay ? props.initialScrollIndex : 0}
        />
    );
};
