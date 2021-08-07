import React from 'react';
import {
    RefreshControl,
    ActivityIndicator,
    StyleSheet,
    Animated,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    StyleProp,
    ViewStyle,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { useDimensions } from '@react-native-community/hooks';
import { ResourceVm, DiscoveryCatalog, ContainerHookResponse, ContainerVm } from 'qp-discovery-ui';
import { selectDeviceType } from 'qp-common-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appDimensions, appPadding, appFonts } from '../../../AppStyles';
import { NAVIGATION_TYPE } from '../Navigation/NavigationConstants';
import StorefrontCardView, { carouselCardWidth } from './StorefrontCardView';
import AppErrorComponent from 'utils/AppErrorComponent';
import SkeletonCatalog, { SkeletonCatalogType } from './loading/SkeletonCatalog';
// import BackgroundGradient from './BackgroundGradient';
import { useHeaderTabBarHeight } from 'screens/components/HeaderTabBar';
import { usePageLoadAnimation } from 'screens/hooks/usePageLoadAnimation';
import { useHeader } from 'contexts/HeaderContextProvider';
import AppLoadingIndicator from './AppLoadingIndicator';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { AppEvents, condenseViewAllData } from 'utils/ReportingUtils';

interface StorefrontCatalogProps extends ContainerHookResponse {
    loadingType?: SkeletonCatalogType;
    showPageAnimation?: boolean;
    contentTabName?: string;
    scrollY?: Animated.AnimatedValue;
    onTvScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    containerStyle?: StyleProp<ViewStyle>;
    isCardCustomSpacing?: boolean | undefined;
    blockFocusUpListReachedEnd?: boolean | undefined;
    blockFocusDownListReachedEnd?: boolean | undefined;
    blockFocusLeftListReachedEnd?: boolean | undefined;
    blockFocusRightListReachedEnd?: boolean | undefined;
    hasTVPreferredFocus?: boolean | undefined;
    initialHasTVPreferredFocusOnCarousel?: boolean;
    onSetInitialFocus?: any;
    cardType?: string;
}

const StorefrontCatalog = ({
    loading,
    error,
    containers,
    pageOffset,
    reload,
    reset,
    hasMore,
    loadMore,
    loadMoreResources,
    loadingType,
    contentTabName,
    showPageAnimation = false,
    // scrollY,
    onTvScroll,
    containerStyle,
    isCardCustomSpacing,
    blockFocusUpListReachedEnd,
    blockFocusDownListReachedEnd,
    blockFocusLeftListReachedEnd,
    blockFocusRightListReachedEnd,
    hasTVPreferredFocus,
    initialHasTVPreferredFocusOnCarousel,
    onSetInitialFocus,
    cardType = '',
}: StorefrontCatalogProps) => {
    const { width, height } = useDimensions().window;
    const navigation = useNavigation();
    const route = useRoute();
    const prefs = useAppPreferencesState();
    const headerHeight = useHeaderTabBarHeight();
    const { onScroll } = useHeader();
    const { appTheme, catalogCardsPreview, appConfig } = prefs;
    let { appColors } = appTheme!(prefs);
    // const onScrollAnimatedHeader = Animated.event(
    //     [
    //         {
    //             nativeEvent: {
    //                 contentOffset: {
    //                     y: scrollY,
    //                 },
    //             },
    //         },
    //     ],
    //     { useNativeDriver: true },
    // );

    // const onScrollHeader = scrollY ? onScrollAnimatedHeader : onScroll;
    const { recordEvent } = useAnalytics();
    const isPortrait = height > width;
    const [bannerCarouselWidth, bannerCarouselAspectRatio] = carouselCardWidth(
        isPortrait,
        catalogCardsPreview,
        appConfig,
    );
    const tabBarHeight = React.useContext(BottomTabBarHeightContext) || 0;

    const animatedStyle = usePageLoadAnimation(true, true);

    const wrapperContainerStyle = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    paddingTop: Platform.isTV ? 0 : headerHeight,
                    paddingBottom: tabBarHeight + 15,
                    marginLeft: 0,
                },
            }),
        [headerHeight, tabBarHeight],
    );

    const listContainerStyle = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    marginTop: 0,
                    marginBottom: 5,
                    marginRight: appPadding.xxs(true),
                    paddingLeft: Platform.isTV ? appPadding.lg(true) : appPadding.sm(true),
                    paddingRight: appPadding.xs(true),
                    zIndex: 5,
                },
            }),
        [],
    );

    const sectionHeaderStyle = React.useMemo(
        () =>
            StyleSheet.create({
                sectionHeader: {
                    fontSize: Platform.isTV ? appFonts.xlg : appFonts.xs,
                    fontFamily: appFonts.medium,
                    fontWeight: undefined,
                    marginTop: selectDeviceType({ Handset: appPadding.md(), Tv: appPadding.xxs() }, appPadding.xs()),
                    marginLeft: 0,
                    paddingBottom: selectDeviceType({ Handset: 10, Tv: 0 }, 15),
                    paddingLeft: Platform.isTV ? appPadding.lg(true) : appPadding.sm(true),
                    color: appColors.tertiary,
                    textAlign: 'left',
                    textTransform: 'none',
                },
            }),
        [appColors.tertiary],
    );

    const carouselAspectRatio = bannerCarouselAspectRatio || appDimensions.carouselAspectRatio;
    const bannerProps = React.useMemo(
        () => ({
            hideGradient: true,
            cardAspectRatio: carouselAspectRatio,
            autoplay: true,
            loop: true,
            showCarousalIndicator: false,
            isPortrait: isPortrait,
            carouselCardWidth: bannerCarouselWidth,
            viewScrollOffset: appPadding.sm(true),
            carousalIndicatorProps: {
                containerStyle: {
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    top: bannerCarouselWidth / carouselAspectRatio - selectDeviceType<number>({ Handset: 15 }, 30),
                    left: 0,
                    right: 0,
                    position: 'absolute',
                },
                pageStyle: {
                    width: 6,
                    height: 6,
                    borderRadius: 6,
                    backgroundColor: '#FFFFFF4A',
                    marginHorizontal: 6,
                },
                activePageStyle: {
                    width: 10,
                    height: 10,
                    borderRadius: 10,
                    backgroundColor: '#FFFFFF',
                    marginHorizontal: 5,
                },
            },
        }),
        [bannerCarouselWidth, carouselAspectRatio, isPortrait],
    );
    const customRenderResource = React.useCallback(
        ({
            item,
            index,
            containerIndex,
            shiftScrollToFocusIndex,
        }: {
            item: ResourceVm;
            index: number;
            containerIndex?: number;
            shiftScrollToFocusIndex?: (index: number) => void;
        }): JSX.Element => {
            const onResourcePress = (resource: ResourceVm) => {
                if (item.type && item.type === 'viewall') {
                    navigation.navigate(NAVIGATION_TYPE.STOREFRONT_VIEWALL_TV, {
                        contentUrl: item.contentUrl,
                        title: item.title,
                    });
                } else {
                    let screenName = NAVIGATION_TYPE.CONTENT_DETAILS;

                    if (resource.containerType === 'Collection') {
                        screenName =
                            resource.collectionLayout === 'grid'
                                ? NAVIGATION_TYPE.COLLECTIONS_GRID
                                : NAVIGATION_TYPE.COLLECTIONS;
                    } else if (resource.watchedOffset !== undefined) {
                        // continue watching
                        screenName = NAVIGATION_TYPE.PLAYER;
                    }
                    navigation.navigate(screenName, {
                        resource: resource,
                        title: resource.name,
                        resourceId: resource.id,
                        resourceType: resource.type,
                        contentTabName: contentTabName ? contentTabName : undefined,
                        isCardCustomSpacing: Platform.isTV,
                    });
                }
            };

            return (
                <StorefrontCardView
                    resource={item}
                    route={route.name}
                    blockFocusLeft={blockFocusLeftListReachedEnd && index === 0}
                    hasTVPreferredFocus={isCardCustomSpacing && index === 0 && containerIndex === 0}
                    blockFocusRight={
                        blockFocusRightListReachedEnd &&
                        containers &&
                        containers[containerIndex].resources &&
                        index === containers[containerIndex].resources.length - 1
                    }
                    blockFocusDown={
                        blockFocusDownListReachedEnd && containers && containers.length - 1 === containerIndex
                    }
                    blockFocusUp={blockFocusUpListReachedEnd && containers && containerIndex === 0}
                    isPortrait={isPortrait}
                    onResourcePress={onResourcePress}
                    shiftScrollToFocusIndex={() => shiftScrollToFocusIndex && shiftScrollToFocusIndex(index)}
                    isCardCustomSpacing={isCardCustomSpacing}
                    cardType={cardType}
                />
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            route.name,
            blockFocusLeftListReachedEnd,
            isCardCustomSpacing,
            blockFocusRightListReachedEnd,
            containers,
            blockFocusDownListReachedEnd,
            blockFocusUpListReachedEnd,
            isPortrait,
            cardType,
            navigation,
            contentTabName,
        ],
    );

    const LoadingComponent = React.useMemo(() => <ActivityIndicator color={appColors.brandTint} size="small" />, [
        appColors.brandTint,
    ]);

    const ViewAllComponent = (containerItem: ContainerVm) => {
        const onResourcePress = () => {
            recordEvent(AppEvents.VIEW_ALL, condenseViewAllData(containerItem));
            navigation.navigate(NAVIGATION_TYPE.STOREFRONT_VIEWALL_TV, {
                contentUrl: containerItem.contentUrl,
                title: containerItem.name,
            });
        };

        return (
            <StorefrontCardView
                resource={{ type: 'viewall', aspectRatio: containerItem.aspectRatio }}
                isPortrait={isPortrait}
                onResourcePress={onResourcePress}
            />
        );
    };

    const refreshControl = React.useMemo(
        () => (
            <RefreshControl
                refreshing={loading && containers.length > 0}
                onRefresh={reload}
                tintColor={appColors.tertiary}
                titleColor={appColors.tertiary}
                progressBackgroundColor={appColors.backgroundInactive}
                colors={[appColors.tertiary]}
                // title={'Pull to refresh'}
            />
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [appColors.tertiary, appColors.backgroundInactive, loading],
    );

    const onEndReachedWithinContainer = React.useCallback(
        container => {
            const hasMoreResources = container.maxResources
                ? container.maxResources > container.resources.length
                : true;
            if (!container.lazyLoading && hasMoreResources && loadMoreResources) {
                loadMoreResources(container);
            }
        },
        [loadMoreResources],
    );

    const onEndReached = React.useCallback(() => {
        if (hasMore && loadMore) {
            loadMore(pageOffset);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasMore, pageOffset]);
    return (
        <>
            {/* Loading State */}
            {loading && !Platform.isTV ? (
                <Animated.View style={showPageAnimation ? animatedStyle : {}}>
                    <SkeletonCatalog type={loadingType} />
                </Animated.View>
            ) : loading ? (
                <AppLoadingIndicator />
            ) : null}

            {/* Content Render State */}
            {containers.length > 0 && (
                <DiscoveryCatalog
                    route={route.name}
                    containers={containers}
                    isPortrait={isPortrait}
                    carouselCardWidth={bannerCarouselWidth}
                    numColumns={1}
                    bannerProps={bannerProps}
                    renderResource={customRenderResource}
                    hasTVPreferredFocus={hasTVPreferredFocus}
                    sectionHeaderStyle={sectionHeaderStyle.sectionHeader}
                    initialHasTVPreferredFocusOnCarousel={initialHasTVPreferredFocusOnCarousel}
                    initialNumOfContainersToRender={5}
                    contentContainerStyle={containerStyle ? containerStyle : wrapperContainerStyle.container}
                    containerContentContainerStyle={listContainerStyle.container}
                    onScroll={onTvScroll && Platform.isTV ? onTvScroll : onScroll}
                    onEndReached={onEndReached}
                    onEndReachedWithinContainer={onEndReachedWithinContainer}
                    onEndReachedThreshold={0.8}
                    ViewAllComponent={ViewAllComponent}
                    HorizontalListFooterComponent={LoadingComponent}
                    ListFooterComponent={hasMore ? LoadingComponent : undefined}
                    refreshControl={refreshControl}
                    onSetInitialFocus={onSetInitialFocus}
                />
            )}

            {/* Error State */}
            {!loading && error && containers.length === 0 && (
                <AppErrorComponent
                    reload={() => {
                        reset && reset();
                        reload && reload();
                    }}
                />
            )}
        </>
    );
};

export default StorefrontCatalog;
