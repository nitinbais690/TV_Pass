import React, { useRef } from 'react';
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
    Animated,
    Platform,
} from 'react-native';
// Using react-navigation's FlatList since it offers Platform-native behavior like touch active tab to scroll to top.
// import { FlatList } from 'react-navigation';
import { colors, padding, typography } from 'qp-common-ui';
import { ContainerVm, ResourceVm } from '../models/ViewModels';
import ResourceCarouselView from './ResourceCarouselView';
import ResourceCardView, { ResourceCardViewBaseProps } from './ResourceCardView';
import StorefrontCarouselTV from '../../../../TV/components/StorefrontCarouselTV';
import { useLocalization } from 'contexts/LocalizationContext';
import { appDimensions, tvPixelSizeForLayout } from '../../../../../AppStyles';

const defaultCatalogStyle = StyleSheet.create({
    sectionHeaderContainer: {},
    sectionHeader: {
        ...typography.sectionHeader,
        marginLeft: padding.xs(),
        marginTop: padding.xs(),
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
     * Rendered view all card.
     */
    ViewAllComponent?: ((container: ContainerVm) => React.ReactElement) | null;
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
    containerContentContainerStyle?: StyleProp<ViewStyle>;
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

    /**
     *  set initial focus on coursel in tv
     */
    initialHasTVPreferredFocusOnCarousel?: boolean;
    /**
     *  set initial focus method on coursel in tv
     */
    onSetInitialFocus?: any;

    route?: string;
}

const propsAreEqual = (prevProps: any, nextProps: any): boolean => {
    return (
        prevProps.item.id === nextProps.item.id &&
        prevProps.isPortrait === nextProps.isPortrait &&
        prevProps.item.lazyLoading === nextProps.item.lazyLoading &&
        prevProps.item.pageNumber === nextProps.item.pageNumber &&
        prevProps.item.resources.length === nextProps.item.resources.length &&
        prevProps.item.resources.map((r: ResourceVm) => r.id).join(',') ===
            nextProps.item.resources.map((r: ResourceVm) => r.id).join(',') &&
        prevProps.item.resources.map((r: ResourceVm) => r.completedPercent).join(',') ===
            nextProps.item.resources.map((r: ResourceVm) => r.completedPercent).join(',')
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
    containerIndex,
    myContentTvStyle,
    ViewAllComponent,
    route,
}: {
    item: ContainerVm;
    cardProps?: ResourceCardViewBaseProps<ResourceVm>;
    renderResource?: ListRenderItem<ResourceVm>;
    containerContentContainerStyle?: StyleProp<ViewStyle>;
    isPortrait?: boolean;
    onEndReachedWithinContainer?: ((container: ContainerVm, info: { distanceFromEnd: number }) => void) | null;
    onEndReachedThreshold?: number | null;
    ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
    containerIndex: number;
    myContentTvStyle?: boolean;
    ViewAllComponent?: ((container: ContainerVm) => React.ReactElement) | null;
    route?: string;
}): JSX.Element => {
    let flatListRef = useRef<any>(undefined);
    const resourcesKeyExtractor = React.useCallback((item: ResourceVm, index: number) => `r-${index}-${item.id}`, []);
    const defaultRenderResource = React.useCallback(
        ({ item }: { item: ResourceVm }): JSX.Element => {
            return <ResourceCardView resource={item} isPortrait={isPortrait} {...cardProps} />;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isPortrait],
    );

    const shiftScrollToFocusIndex = (index: number) => {
        if (Platform.isTV && myContentTvStyle) {
            flatListRef.current.scrollToIndex({ animated: true, index });
        }
    };

    const getContentContainerPaddingRight = () => {
        const screenWidth = appDimensions.fullWidth;
        let cardPerScreen = screenWidth / tvPixelSizeForLayout(100);
        return (cardPerScreen - 1) * tvPixelSizeForLayout(100);
    };

    let RenderResource = Platform.isTV ? renderResource : undefined;

    return (
        <FlatList<ResourceVm>
            keyExtractor={resourcesKeyExtractor}
            horizontal={true}
            numColumns={1}
            showsHorizontalScrollIndicator={false}
            data={containerItem.resources!}
            ref={flatListRef}
            renderItem={
                RenderResource
                    ? ({ item, index }) => {
                          return (
                              <RenderResource
                                  shiftScrollToFocusIndex={shiftScrollToFocusIndex}
                                  item={item}
                                  index={index}
                                  containerIndex={containerIndex}
                              />
                          );
                      }
                    : renderResource
                    ? renderResource
                    : defaultRenderResource
            }
            contentContainerStyle={
                myContentTvStyle
                    ? {
                          paddingRight: getContentContainerPaddingRight(),
                      }
                    : containerContentContainerStyle
            }
            style={myContentTvStyle ? containerContentContainerStyle : undefined}
            onEndReached={info => onEndReachedWithinContainer && onEndReachedWithinContainer(containerItem, info)}
            onEndReachedThreshold={onEndReachedThreshold}
            // ListFooterComponent={containerItem.lazyLoading ? ListFooterComponent : null}
            ListFooterComponent={
                // containerItem.viewAll && ViewAllComponent !== undefined
                ViewAllComponent !== undefined && route !== 'My Content'
                    ? ViewAllComponent(containerItem)
                    : containerItem.lazyLoading
                    ? ListFooterComponent
                    : null
            }
        />
    );
};

const MemoizedResourceListView = React.memo(ResourceListView, propsAreEqual);

export const DiscoveryCatalog = (props: DiscoveryCatalogProps): JSX.Element => {
    const {
        route,
        containers,
        carouselCardWidth,
        renderContainer,
        initialNumOfContainersToRender,
        showSectionHeader = true,
        sectionHeaderStyle,
        cardProps = {},
        renderResource,
        bannerProps,
        contentContainerStyle,
        containerContentContainerStyle,
        onScroll,
        onEndReached,
        onEndReachedWithinContainer,
        onEndReachedThreshold,
        refreshControl,
        ListFooterComponent,
        HorizontalListFooterComponent,
        ViewAllComponent,
        isPortrait,
        initialHasTVPreferredFocusOnCarousel,
        onSetInitialFocus,
    } = props;

    const containerKeyExtractor = React.useCallback((item: ContainerVm, index: number) => `c-${index}-${item.id}`, []);
    //const [, cardViewHeight] = cardViewDimensions(cardProps.cardStyle);

    // const [, cardViewHeight] = cardViewDimensions(cardProps.cardStyle);

    // const cardViewLayout = (_data: any, index: number): { length: number; offset: number; index: number } => ({
    //     // length: cardViewDimensions(propsFromContainer(vm).cardStyle),
    //     length: cardViewHeight,
    //     offset: cardViewHeight * index,
    //     index,
    // });

    const { strings } = useLocalization();
    const defaultRenderResource = React.useCallback(
        ({ item }: { item: ResourceVm }): JSX.Element => {
            return <ResourceCardView resource={item} isPortrait={isPortrait} {...cardProps} />;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isPortrait],
    );

    const defaultRenderContainer = ({
        item: containerItem,
        index,
    }: {
        item: ContainerVm;
        index: number;
    }): JSX.Element => {
        if (
            containerItem.name === strings['my_content.recently_redeemed'] &&
            //containerItem.resources &&
            //containerItem.resources.length > 0 &&
            Platform.isTV
        ) {
            // let latestRedmeedResources = containerItem.resources.filter(
            //     resource => resource.watchedOffset && resource.watchedOffset === 0,
            // );
            return (
                <StorefrontCarouselTV
                    //resources={latestRedmeedResources}
                    resources={containerItem.resources!}
                    initialHasTVPreferredFocus={initialHasTVPreferredFocusOnCarousel}
                />
            );
        } else if (Platform.isTV && containerItem.layout === 'banner') {
            return (
                <StorefrontCarouselTV
                    resources={containerItem.resources!}
                    initialHasTVPreferredFocus={initialHasTVPreferredFocusOnCarousel}
                    onSetInitialFocus={onSetInitialFocus}
                />
            );
        } else if (containerItem.layout === 'banner') {
            return (
                <ResourceCarouselView
                    resources={containerItem.resources!}
                    carouselCardWidth={carouselCardWidth}
                    isPortrait={isPortrait}
                    {...bannerProps}
                    cardAspectRatio={containerItem.aspectRatio}
                    cardImageType={containerItem.imageType}
                    renderResource={renderResource}
                />
            );
        } else {
            return (
                <React.Fragment key={containerItem.id}>
                    {showSectionHeader && route === 'My Content' && Platform.isTV ? (
                        <View style={[defaultCatalogStyle.sectionHeaderContainer]}>
                            <Text
                                testID={containerItem.name}
                                style={[defaultCatalogStyle.sectionHeader, sectionHeaderStyle]}>
                                {containerItem.name}
                            </Text>
                        </View>
                    ) : showSectionHeader && index !== 1 && Platform.isTV ? (
                        <View style={[defaultCatalogStyle.sectionHeaderContainer]}>
                            <Text
                                testID={containerItem.name}
                                style={[defaultCatalogStyle.sectionHeader, sectionHeaderStyle]}>
                                {containerItem.name}
                            </Text>
                        </View>
                    ) : (
                        showSectionHeader &&
                        !Platform.isTV && (
                            <View style={[defaultCatalogStyle.sectionHeaderContainer]}>
                                <Text
                                    testID={containerItem.name}
                                    style={[defaultCatalogStyle.sectionHeader, sectionHeaderStyle]}>
                                    {containerItem.name}
                                </Text>
                            </View>
                        )
                    )}
                    <MemoizedResourceListView
                        item={containerItem}
                        cardProps={cardProps}
                        renderResource={renderResource ? renderResource : defaultRenderResource}
                        containerContentContainerStyle={containerContentContainerStyle}
                        myContentTvStyle={(route === 'My Content' || route === 'Browse') && Platform.isTV}
                        isPortrait={isPortrait}
                        containerIndex={index}
                        onEndReachedThreshold={onEndReachedThreshold}
                        onEndReachedWithinContainer={onEndReachedWithinContainer}
                        ListFooterComponent={HorizontalListFooterComponent}
                        ViewAllComponent={ViewAllComponent}
                        route={route}
                    />
                </React.Fragment>
            );
        }
    };

    return (
        <Animated.FlatList<ContainerVm>
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
