import React, { useState } from 'react';
import {
    FlatList,
    Text,
    ListRenderItem,
    TextStyle,
    StyleProp,
    StyleSheet,
    ViewStyle,
    RefreshControlProps,
    View,
    NativeSyntheticEvent,
    NativeScrollEvent,
    Dimensions,
    Platform,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
// Using react-navigation's FlatList since it offers Platform-native behavior like touch active tab to scroll to top.
// import { FlatList } from 'react-navigation';
import { colors, padding, scale, selectDeviceType, typography } from 'qp-common-ui';
import { ContainerVm, ResourceVm } from '../models/ViewModels';
import ResourceCardView, { ResourceCardViewBaseProps } from './ResourceCardView';
import { scrollInterpolators, animatedStyles, carouselStyle } from '../utils/CarouselAnimation';
import { isTablet } from 'core/styles/AppStyles';

const defaultCatalogStyle = StyleSheet.create({
    sectionHeaderContainer: {},
    sectionHeader: {
        ...typography.sectionHeader,
        marginLeft: padding.xs(),
        marginTop: selectDeviceType({ Handset: scale(32, 0), Tv: scale(43, 0) }, scale(36, 0)),
        paddingBottom: padding.xs(),
        color: colors.tertiary,
    },
});

export interface DiscoveryCatalogProps {
    /**
     * The array of containers to render.
     */
    containers: ReadonlyArray<ContainerVm> | null;
    /**
     * Instance of container which having focus
     */
    focusedContainer?: ContainerVm;
    /**
     * The width of the card view
     */
    carouselCardWidth: number;
    /**
     * Allows the ability to provide a custom rendering of `ContainerVm`.
     *
     * When none is provided, the default rendering would apply.
     *
     * Typical usage:
     * ```
     * _renderContainer = ({item}) => (
     *   <TouchableOpacity onPress={() => this._onPress(item)}>
     *     <Text>{item.title}</Text>
     *   <TouchableOpacity/>
     * );
     * ...
     * <DiscoveryCatalog containerId={"id"} renderContainer={this._renderContainer} />
     * ```
     */
    renderContainer?: ListRenderItem<ContainerVm>;
    /**
     * Allows the ability to provide a custom rendering of `ResourceVm`.
     * Would not take effect when a custom `renderContainer` implementation is provided.
     *
     * When none is provided, the default rendering would apply.
     */
    renderResource?: ListRenderItem<ResourceVm>;
    /**
     * Multiple columns can only be rendered with `horizontal={false}` and will zig-zag like a `flexWrap` layout.
     * Items should all be the same height - masonry layouts are not supported.
     */
    numColumns?: number;
    /**
     * Rendered at the very end of the list.
     */
    HorizontalListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
    /**
     * Rendered at the very end of the list.
     */
    ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
    /**
     * These styles will be applied to the scroll view content container which
     * wraps all of the child views. Example:
     *
     *   return (
     *     <ScrollView contentContainerStyle={styles.contentContainer}>
     *     </ScrollView>
     *   );
     *   ...
     *   const styles = StyleSheet.create({
     *     contentContainer: {
     *       paddingVertical: 20
     *     }
     *   });
     */
    contentContainerStyle?: StyleProp<ViewStyle>;
    /**
     * These styles will be applied to the scroll view content container which
     * wraps all of the child views. Example:
     *
     *   return (
     *     <ScrollView contentContainerStyle={styles.contentContainer}>
     *     </ScrollView>
     *   );
     *   ...
     *   const styles = StyleSheet.create({
     *     contentContainer: {
     *       paddingVertical: 20
     *     }
     *   });
     */
    containerContentContainerStyle?: ViewStyle;
    /**
     * How many containers rows to render in the initial batch. This should be enough to fill the screen but not much more.
     * Note these items will never be unmounted as part of the windowed rendering
     * in order to improve perceived performance of scroll-to-top actions.
     */
    initialNumOfContainersToRender?: number;
    /**
     * Determines whether to show or hide the section headers
     */
    showSectionHeader?: boolean;
    /**
     * Styles for section header
     */
    sectionHeaderStyle: StyleProp<TextStyle>;
    /**
     * Props for default `ResourceCarouselView` component
     */
    bannerProps?: ResourceCardViewBaseProps<ResourceVm>;
    /**
     * Props for default `ResourceCardView` component
     */
    cardProps?: ResourceCardViewBaseProps<ResourceVm>;
    /**
     * Fires at most once per frame during scrolling.
     * The frequency of the events can be contolled using the scrollEventThrottle prop.
     */
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    /**
     * Called once when the scroll position gets within onEndReachedThreshold of the rendered content.
     */
    onEndReached?: ((info: { distanceFromEnd: number }) => void) | null;
    /**
     * How far from the end (in units of visible length of the list) the bottom edge of the
     * list must be from the end of the content to trigger the `onEndReached` callback.
     * Thus a value of 0.5 will trigger `onEndReached` when the end of the content is
     * within half the visible length of the list.
     */
    onEndReachedThreshold?: number | null;
    /**
     * A RefreshControl component, used to provide pull-to-refresh
     * functionality for the ScrollView.
     */
    refreshControl?: React.ReactElement<RefreshControlProps>;
    /**
     * Called once when the scroll position gets within onEndReachedThreshold of the rendered content.
     */
    onEndReachedWithinContainer?: ((container: ContainerVm, info: { distanceFromEnd: number }) => void) | null;
    /**
     * Indicates the orientation of the card
     */
    isPortrait?: boolean;
    /**
     * The viewOffset at which the carousel should be animated when orientation changes
     */
    viewScrollOffset?: number;
}

const propsAreEqual = (prevProps: any, nextProps: any): boolean => {
    return (
        prevProps.item.id === nextProps.item.id &&
        prevProps.isPortrait === nextProps.isPortrait &&
        prevProps.focusedContainer === nextProps.focusedContainer &&
        prevProps.item.lazyLoading === nextProps.item.lazyLoading &&
        prevProps.item.pageNumber === nextProps.item.pageNumber &&
        prevProps.item.resources.length === nextProps.item.resources.length &&
        prevProps.item.resources.map((r: ResourceVm) => r.id).join(',') ===
            nextProps.item.resources.map((r: ResourceVm) => r.id).join(',')
    );
};

const ResourceListView = ({
    item: containerItem,
    cardProps = {},
    renderResource,
    containerContentContainerStyle,
    isPortrait,
    onEndReachedWithinContainer,
    onEndReachedThreshold,
    ListFooterComponent,
    focusedContainer,
}: {
    item: ContainerVm;
    cardProps?: ResourceCardViewBaseProps<ResourceVm>;
    renderResource?: ListRenderItem<ResourceVm>;
    containerContentContainerStyle?: ViewStyle;
    isPortrait?: boolean;
    onEndReachedWithinContainer?: ((container: ContainerVm, info: { distanceFromEnd: number }) => void) | null;
    onEndReachedThreshold?: number | null;
    ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
    focusedContainer?: ContainerVm;
}): JSX.Element => {
    const resourcesKeyExtractor = React.useCallback((item: ResourceVm, index: number) => `r-${index}-${item.id}`, []);
    const defaultRenderResource = React.useCallback(
        ({ item }: { item: ResourceVm }): JSX.Element => {
            return <ResourceCardView resource={item} isPortrait={isPortrait} {...cardProps} />;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isPortrait],
    );

    const getContentContainerPaddingLeft = () => {
        if (containerContentContainerStyle && containerContentContainerStyle.paddingLeft) {
            return containerContentContainerStyle.paddingLeft;
        }

        return 0;
    };

    const getContentContainerPaddingRight = () => {
        if (containerItem && containerItem.cardWidth) {
            const screenWidth = Dimensions.get('window').width;
            let cardPerScreen = screenWidth / containerItem.cardWidth;
            return (cardPerScreen - 1) * containerItem.cardWidth;
        }
        return 0;
    };
    const styles = StyleSheet.create({
        focusFrame: {
            marginTop: scale(2.5, 0),
            position: 'absolute',
            top: 0,
            left: getContentContainerPaddingLeft(),
            width: cardProps.cardWidth ? cardProps.cardWidth : 0,
            aspectRatio: cardProps.cardAspectRatio,
            borderColor: 'white',
            borderWidth: scale(2.5, 0),
        },
    });

    return (
        <View>
            <FlatList<ResourceVm>
                ref={c => {
                    containerItem.containerListRef = c;
                }}
                keyExtractor={resourcesKeyExtractor}
                horizontal={true}
                numColumns={1}
                showsHorizontalScrollIndicator={false}
                data={containerItem.resources!}
                renderItem={renderResource ? renderResource : defaultRenderResource}
                contentContainerStyle={[
                    { ...containerContentContainerStyle },
                    Platform.isTV && { paddingRight: getContentContainerPaddingRight() },
                ]}
                onEndReached={info => onEndReachedWithinContainer && onEndReachedWithinContainer(containerItem, info)}
                onEndReachedThreshold={onEndReachedThreshold}
                ListFooterComponent={containerItem.lazyLoading ? ListFooterComponent : null}
            />
            {cardProps &&
                cardProps.cardWidth &&
                cardProps.cardAspectRatio &&
                focusedContainer &&
                focusedContainer.id === containerItem.id && <View style={styles.focusFrame} />}
        </View>
    );
};

const MemoizedResourceListView = React.memo(ResourceListView, propsAreEqual);

export const DiscoveryCatalog = (props: DiscoveryCatalogProps): JSX.Element => {
    const {
        containers,
        focusedContainer,
        renderContainer,
        initialNumOfContainersToRender,
        showSectionHeader = true,
        sectionHeaderStyle,
        cardProps = {},
        renderResource,
        contentContainerStyle,
        containerContentContainerStyle,
        onScroll,
        onEndReached,
        onEndReachedWithinContainer,
        onEndReachedThreshold,
        refreshControl,
        ListFooterComponent,
        HorizontalListFooterComponent,
        isPortrait,
    } = props;

    const containerKeyExtractor = React.useCallback((item: ContainerVm, index: number) => `c-${index}-${item.id}`, []);
    const [activeIndexForEffectScroll, updateActiveIndexForEffectScroll] = useState<number>(0);
    const [activeIndexForNormalScroll, updateActiveIndexForNormalScroll] = useState<number>(0);
    //const [, cardViewHeight] = cardViewDimensions(cardProps.cardStyle);

    // const [, cardViewHeight] = cardViewDimensions(cardProps.cardStyle);

    // const cardViewLayout = (_data: any, index: number): { length: number; offset: number; index: number } => ({
    //     // length: cardViewDimensions(propsFromContainer(vm).cardStyle),
    //     length: cardViewHeight,
    //     offset: cardViewHeight * index,
    //     index,
    // });

    const defaultRenderResource = React.useCallback(
        ({ item }: { item: ResourceVm }): JSX.Element => {
            return <ResourceCardView resource={item} isPortrait={isPortrait} {...cardProps} />;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isPortrait],
    );

    const renderSectionHeader = (itemName: string) => {
        return (
            <View style={[defaultCatalogStyle.sectionHeaderContainer]}>
                <Text testID={itemName} style={[defaultCatalogStyle.sectionHeader, sectionHeaderStyle]}>
                    {itemName}
                </Text>
            </View>
        );
    };

    const defaultRenderContainer = ({ item: containerItem }: { item: ContainerVm }): JSX.Element => {
        //If Tablet and Type as aha_original need to use carousel
        //TODO: Need to discuss with CMS team to update a carousel type for AHA-Original Tablet.
        if (containerItem.layout === 'banner' && isOriginals(containerItem) && (isTablet || Platform.isTV)) {
            containerItem.layout = 'carousel';
        }

        if (containerItem.layout === 'banner') {
            let SLIDER_WIDTH = Dimensions.get('window').width;
            let ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.75);
            let ITEM_HORIZONTAL_MARGIN = Math.round(SLIDER_WIDTH * 0.02);
            let ITEM_WIDTH_FIX = ITEM_WIDTH + ITEM_HORIZONTAL_MARGIN * 2;
            return (
                <React.Fragment key={containerItem.id}>
                    {showSectionHeader && isOriginals(containerItem) && renderSectionHeader(containerItem.name)}
                    <Carousel
                        data={containerItem.resources!}
                        renderItem={renderResource}
                        sliderWidth={SLIDER_WIDTH}
                        itemWidth={isOriginals(containerItem) ? ITEM_WIDTH_FIX : SLIDER_WIDTH}
                        autoplay={isOriginals(containerItem) ? false : true}
                        autoplayInterval={3000}
                        layout={'default'}
                        containerCustomStyle={isOriginals(containerItem) ? carouselStyle.containerStyle : null}
                        contentContainerCustomStyle={
                            isOriginals(containerItem) ? carouselStyle.containerCustomStyle : null
                        }
                        enableMomentum={isOriginals(containerItem) ? true : false}
                        lockScrollWhileSnapping={true}
                        inactiveSlideScale={1}
                        inactiveSlideOpacity={1}
                        scrollInterpolator={
                            isOriginals(containerItem) ? scrollInterpolators.scrollInterpolatorPerspectiveEffect : null
                        }
                        slideInterpolatedStyle={
                            isOriginals(containerItem) ? animatedStyles.animatedStylesPerspectiveEffect : null
                        }
                        useScrollView={true}
                        slideStyle={isOriginals(containerItem) ? carouselStyle.sliderStyle : null}
                        onSnapToItem={(index: number) =>
                            isOriginals(containerItem)
                                ? updateActiveIndexForEffectScroll(index)
                                : updateActiveIndexForNormalScroll(index)
                        }
                    />
                    <Pagination
                        dotsLength={containerItem.resources!.length}
                        activeDotIndex={
                            isOriginals(containerItem)
                                ? activeIndexForEffectScroll
                                    ? activeIndexForEffectScroll
                                    : 0
                                : activeIndexForNormalScroll
                                ? activeIndexForNormalScroll
                                : 0
                        }
                        containerStyle={
                            isOriginals(containerItem)
                                ? carouselStyle.containerPaginationStyle
                                : carouselStyle.containerPaginationStyleNormalEffet
                        }
                        dotStyle={carouselStyle.activePaginationDotStyle}
                        inactiveDotStyle={carouselStyle.inactivePaginationDotStyle}
                        inactiveDotScale={1}
                    />
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment key={containerItem.id}>
                    {showSectionHeader && renderSectionHeader(containerItem.name)}
                    <MemoizedResourceListView
                        item={containerItem}
                        cardProps={{
                            ...cardProps,
                            cardWidth: containerItem.cardWidth,
                            cardAspectRatio: containerItem.cardAspectRatio,
                        }}
                        renderResource={renderResource ? renderResource : defaultRenderResource}
                        containerContentContainerStyle={containerContentContainerStyle}
                        isPortrait={isPortrait}
                        onEndReachedThreshold={onEndReachedThreshold}
                        onEndReachedWithinContainer={onEndReachedWithinContainer}
                        ListFooterComponent={HorizontalListFooterComponent}
                        focusedContainer={focusedContainer}
                    />
                </React.Fragment>
            );
        }
    };

    return (
        <FlatList<ContainerVm>
            data={containers}
            initialNumToRender={initialNumOfContainersToRender}
            keyExtractor={containerKeyExtractor}
            renderItem={renderContainer ? renderContainer : defaultRenderContainer}
            windowSize={11}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={contentContainerStyle}
            onEndReached={onEndReached}
            onEndReachedThreshold={onEndReachedThreshold}
            refreshControl={refreshControl}
            ListFooterComponent={ListFooterComponent}
            onScroll={onScroll}
        />
    );
};

function isOriginals(item: ContainerVm): boolean {
    return item.containerType === 'aha_original';
}
