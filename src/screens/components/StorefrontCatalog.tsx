import React from 'react';
import { RefreshControl, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { useDimensions } from '@react-native-community/hooks';
import { ContainerVm, ResourceVm, DiscoveryCatalog, ContainerHookResponse } from 'qp-discovery-ui';
import { selectDeviceType } from 'qp-common-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appDimensions, appPadding, appFonts } from '../../../AppStyles';
import { NAVIGATION_TYPE } from '../Navigation/NavigationConstants';
import StorefrontCardView, { carouselCardWidth } from './StorefrontCardView';
import AppErrorComponent from 'utils/AppErrorComponent';
import SkeletonCatalog, { SkeletonCatalogType } from './loading/SkeletonCatalog';
import BackgroundGradient from './BackgroundGradient';
import { useHeaderTabBarHeight } from 'screens/components/HeaderTabBar';
import { usePageLoadAnimation } from 'screens/hooks/usePageLoadAnimation';
import { useHeader } from 'contexts/HeaderContextProvider';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { AppEvents, condenseViewAllData } from 'utils/ReportingUtils';
import { useAppState } from 'utils/AppContextProvider';
import { useAppPreview } from 'contexts/AppPreviewContextProvider';

interface StorefrontCatalogProps extends ContainerHookResponse {
    loadingType?: SkeletonCatalogType;
    showPageAnimation?: boolean;
    contentTabName?: string;
    scrollY?: Animated.AnimatedValue;
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
    scrollY,
    cardType = '',
}: StorefrontCatalogProps) => {
    const { width, height } = useDimensions().window;
    const navigation = useNavigation();
    const prefs = useAppPreferencesState();
    const headerHeight = useHeaderTabBarHeight();
    const { onScroll } = useHeader();
    const { appNavigationState } = useAppState();
    const { toggleModal } = useAppPreview();
    const { appTheme, catalogCardsPreview, appConfig } = prefs;
    let { appColors } = appTheme!(prefs);
    const onScrollAnimatedHeader = Animated.event(
        [
            {
                nativeEvent: {
                    contentOffset: {
                        y: scrollY,
                    },
                },
            },
        ],
        { useNativeDriver: true },
    );
    const { recordEvent } = useAnalytics();

    const onScrollHeader = scrollY ? onScrollAnimatedHeader : onScroll;

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
                    paddingTop: headerHeight,
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
                    paddingLeft: appPadding.sm(true),
                    paddingRight: appPadding.xs(true),
                },
            }),
        [],
    );

    const sectionHeaderStyle = React.useMemo(
        () =>
            StyleSheet.create({
                sectionHeader: {
                    fontSize: appFonts.xs,
                    fontFamily: appFonts.medium,
                    fontWeight: undefined,
                    marginTop: selectDeviceType({ Handset: appPadding.md() }, appPadding.xs()),
                    marginLeft: 0,
                    paddingBottom: selectDeviceType({ Handset: 10 }, 15),
                    paddingLeft: appPadding.sm(true),
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
        ({ item }: { item: ResourceVm }): JSX.Element => {
            const onResourcePress = (resource: ResourceVm) => {
                if (item.type && item.type === 'viewall') {
                    navigation.navigate(NAVIGATION_TYPE.STOREFRONT_VIEWALL, {
                        contentUrl: item.contentUrl,
                        title: item.title,
                    });
                } else {
                    let screenName = NAVIGATION_TYPE.CONTENT_DETAILS;
                    console.log('resource.collectionLayout', resource.collectionLayout);
                    if (resource.containerType === 'Collection') {
                        screenName =
                            resource.collectionLayout === 'grid'
                                ? NAVIGATION_TYPE.COLLECTIONS_GRID
                                : NAVIGATION_TYPE.COLLECTIONS;
                    } else if (resource.watchedOffset !== undefined && resource.showPlayerIcon) {
                        // continue watching
                        screenName = NAVIGATION_TYPE.PLAYER;
                    } else {
                        screenName = NAVIGATION_TYPE.CONTENT_DETAILS;
                    }
                    navigation.navigate(screenName, {
                        resource: resource,
                        title: resource.name,
                        resourceId: resource.id,
                        resourceType: resource.type,
                        contentTabName: contentTabName ? contentTabName : undefined,
                    });
                }
            };

            return (
                <StorefrontCardView
                    resource={item}
                    isPortrait={isPortrait}
                    onResourcePress={onResourcePress}
                    cardType={cardType}
                />
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [cardType, contentTabName, isPortrait, navigation],
    );

    const LoadingComponent = React.useMemo(() => <ActivityIndicator color={appColors.brandTint} size="small" />, [
        appColors.brandTint,
    ]);

    const ViewAllComponent = (containerItem: ContainerVm) => {
        const onResourcePress = () => {
            recordEvent(AppEvents.VIEW_ALL, condenseViewAllData(containerItem));
            if (appNavigationState === 'PREVIEW_APP') {
                toggleModal();
            } else {
                navigation.navigate(NAVIGATION_TYPE.STOREFRONT_VIEWALL, {
                    contentUrl: containerItem.contentUrl,
                    title: containerItem.name,
                });
            }
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
        <BackgroundGradient insetHeader={false}>
            {/* Loading State */}
            {loading && (
                <Animated.View style={showPageAnimation ? animatedStyle : {}}>
                    <SkeletonCatalog type={loadingType} />
                </Animated.View>
            )}

            {/* Content Render State */}
            {containers.length > 0 && (
                <DiscoveryCatalog
                    containers={containers}
                    isPortrait={isPortrait}
                    carouselCardWidth={bannerCarouselWidth}
                    numColumns={1}
                    bannerProps={bannerProps}
                    renderResource={customRenderResource}
                    sectionHeaderStyle={sectionHeaderStyle.sectionHeader}
                    initialNumOfContainersToRender={5}
                    contentContainerStyle={wrapperContainerStyle.container}
                    containerContentContainerStyle={listContainerStyle.container}
                    onScroll={onScrollHeader}
                    onEndReached={onEndReached}
                    onEndReachedWithinContainer={onEndReachedWithinContainer}
                    onEndReachedThreshold={0.8}
                    ViewAllComponent={cardType === 'collections' ? undefined : ViewAllComponent}
                    HorizontalListFooterComponent={LoadingComponent}
                    ListFooterComponent={hasMore ? LoadingComponent : undefined}
                    refreshControl={refreshControl}
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
        </BackgroundGradient>
    );
};

export default StorefrontCatalog;
