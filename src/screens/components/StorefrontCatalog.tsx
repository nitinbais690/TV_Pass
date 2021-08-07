import React, { useState, useEffect } from 'react';
import { RefreshControl, ActivityIndicator, StyleSheet, Animated, View, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { useDimensions } from '@react-native-community/hooks';
import {
    ResourceVm,
    DiscoveryCatalog,
    ContainerHookResponse,
    ContainerVm,
    ResourceCardViewBaseProps,
} from 'qp-discovery-ui';
import { selectDeviceType } from 'qp-common-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { NAVIGATION_TYPE } from '../Navigation/NavigationConstants';
import StorefrontCardView, { carouselCardWidth } from './StorefrontCardView';
import AppErrorComponent from 'utils/AppErrorComponent';
import { useHeader } from 'contexts/HeaderContextProvider';
import SkeletonCatalog, { SkeletonCatalogType } from './loading/SkeletonCatalog';
import { usePageLoadAnimation } from 'screens/hooks/usePageLoadAnimation';
import {
    appDimensions,
    appDimensionValues,
    appPadding,
    appFontStyle,
    appPaddingValues,
    appFonts,
} from 'core/styles/AppStyles';
import DetailPopup from 'features/details/presentation/components/template/DetailPopupScreen';
import { useFetchContinueWatching } from 'screens/hooks/useFetchContinueWatching';
import { cardAspectRatio, cardWidth } from 'core/utils/CardSize';

interface StorefrontCatalogProps extends ContainerHookResponse {
    loadingType?: SkeletonCatalogType;
    showPageAnimation?: boolean;
}

interface FocusedResource {
    resource: ResourceVm;
    hasFocus: boolean;
    index?: number;
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
    showPageAnimation = false,
}: StorefrontCatalogProps) => {
    const { width, height } = useDimensions().window;
    const navigation = useNavigation();
    const prefs = useAppPreferencesState();
    const { onScroll } = useHeader();
    const { appTheme, catalogCardsPreview, appConfig } = prefs;
    let { appColors } = appTheme!(prefs);
    const listPaddingLeft = appPaddingValues.sm;
    const [detailModelResource, setDetailModelResource] = useState({});

    const { continueWatchingContainer } = useFetchContinueWatching();
    const [updatedContainers, setUpdatedContainers] = useState<ContainerVm[]>([]);
    const [focusedContainer, setFocusedContainer] = useState<ContainerVm>();
    const [focusedResource, setFocusedResource] = useState<FocusedResource>();

    useEffect(() => {
        let updatedContainer = [];
        containers.forEach(container => {
            if (container.soureType === 'continue_watching') {
                if (continueWatchingContainer) {
                    updatedContainer.push(continueWatchingContainer);
                }
            } else {
                updatedContainer.push(container);
            }

            if (appConfig && container && container.resources && container.resources.length > 0) {
                const firstResource = container.resources[0];
                container.cardWidth = cardWidth(isPortrait, catalogCardsPreview, appConfig, firstResource);
                container.cardAspectRatio = cardAspectRatio(
                    isPortrait,
                    appConfig,
                    firstResource.layout,
                    firstResource.aspectRatio,
                );
            }
        });

        setUpdatedContainers(updatedContainer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containers, continueWatchingContainer]);

    const isPortrait = height > width;
    const [bannerCarouselWidth, bannerCarouselAspectRatio] = carouselCardWidth(
        isPortrait,
        catalogCardsPreview,
        appConfig,
    );
    const tabBarHeight = React.useContext(BottomTabBarHeightContext) || 0;

    const animatedStyle = usePageLoadAnimation(true, true);

    const wrapperContainerStyle = StyleSheet.create({
        container: {
            paddingBottom: tabBarHeight + 15,
            marginLeft: 0,
        },
    });

    const listContainerStyle = StyleSheet.create({
        container: {
            marginTop: 0,
            marginBottom: 5,
            marginRight: appPaddingValues.xxs,
            paddingLeft: Platform.isTV ? listPaddingLeft : appPaddingValues.sm,
            paddingRight: appPaddingValues.xs,
        },
    });

    const sectionHeaderStyle = React.useMemo(
        () =>
            StyleSheet.create({
                sectionHeader: {
                    ...appFontStyle.body3,
                    fontFamily: appFonts.semibold,
                    lineHeight: appDimensionValues.xs,
                    color: appColors.secondary,
                    paddingLeft: appPadding.xs(true),
                    paddingBottom: appPaddingValues.xxs,
                },
            }),
        [appColors.secondary],
    );

    const carouselAspectRatio = bannerCarouselAspectRatio || appDimensions.carouselAspectRatio;
    const bannerProps = React.useMemo(
        () => ({
            hideGradient: true,
            cardAspectRatio: carouselAspectRatio,
            autoplay: true,
            loop: true,
            showCarousalIndicator: true,
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
                    width: appDimensionValues.xxxs,
                    height: appDimensionValues.xxxs,
                    borderRadius: appDimensionValues.xxxs,
                    backgroundColor: '#FFFFFF3A',
                    marginHorizontal: appDimensionValues.xxxxs,
                },
                activePageStyle: {
                    width: appDimensionValues.xxxs,
                    height: appDimensionValues.xxxs,
                    borderRadius: appDimensionValues.xxxs,
                    backgroundColor: '#FFFFFF6A',
                    marginHorizontal: appDimensionValues.xxxxs,
                },
            },
        }),
        [bannerCarouselWidth, carouselAspectRatio, isPortrait],
    );

    const onFocusChange = (resource: ResourceVm, hasFocus: boolean, index?: number) => {
        let currentFocusResource: FocusedResource = {
            resource: resource,
            hasFocus: hasFocus,
            index: index,
        };

        setFocusedResource(currentFocusResource);
    };

    useEffect(() => {
        if (focusedResource && Platform.isTV) {
            const resource = focusedResource.resource;
            if (resource.layout === 'banner') {
                setFocusedContainer(undefined);
                return;
            }
            if (focusedResource.hasFocus) {
                if (focusedContainer && resource.containerId === focusedContainer.id) {
                    scrollToFocusItem();
                } else {
                    updatedContainers.forEach(container => {
                        if (container && container.id === resource.containerId) {
                            setFocusedContainer(container);
                            scrollToFocusItem();
                        }
                    });
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusedResource]);

    const storeFrontCardProps: ResourceCardViewBaseProps<ResourceVm> = React.useMemo(
        () => ({
            onFocusChange: onFocusChange,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const customRenderResource = React.useCallback(
        ({ item, index }: { item: ResourceVm; index: number }): JSX.Element => {
            const onResourcePress = (resource: ResourceVm) => {
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

                if (screenName === NAVIGATION_TYPE.CONTENT_DETAILS) {
                    setDetailModelResource({
                        resource: resource,
                        title: resource.name,
                        resourceId: resource.id,
                        resourceType: resource.type,
                    });
                } else {
                    navigation.navigate(screenName, {
                        resource: resource,
                        title: resource.name,
                        resourceId: resource.id,
                        resourceType: resource.type,
                    });
                }
            };

            return (
                <StorefrontCardView
                    resource={item}
                    isPortrait={isPortrait}
                    onResourcePress={onResourcePress}
                    cardProps={{
                        ...storeFrontCardProps,
                        resourceIndex: index,
                        isShowTVFocus: Platform.isTV && item.layout === 'banner',
                    }}
                />
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isPortrait, navigation, storeFrontCardProps],
    );

    const onModelClosed = () => {
        setDetailModelResource({});
    };

    const scrollToFocusItem = () => {
        if (
            focusedContainer &&
            focusedResource &&
            focusedResource.index !== undefined &&
            focusedResource.index !== null
        ) {
            focusedContainer.containerListRef &&
                focusedContainer.containerListRef.scrollToIndex({
                    animated: true,
                    index: focusedResource.index,
                    viewOffset: listPaddingLeft,
                });
        }
    };

    const LoadingComponent = React.useMemo(() => <ActivityIndicator color={appColors.brandTint} size="small" />, [
        appColors.brandTint,
    ]);

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
        <View>
            {/* Loading State */}
            {loading && (
                <Animated.View style={showPageAnimation ? animatedStyle : {}}>
                    <SkeletonCatalog type={loadingType} />
                </Animated.View>
            )}

            {/* Content Render State */}
            {updatedContainers.length > 0 && (
                <DiscoveryCatalog
                    containers={updatedContainers}
                    isPortrait={isPortrait}
                    carouselCardWidth={bannerCarouselWidth}
                    numColumns={1}
                    bannerProps={bannerProps}
                    renderResource={customRenderResource}
                    sectionHeaderStyle={sectionHeaderStyle.sectionHeader}
                    initialNumOfContainersToRender={5}
                    contentContainerStyle={wrapperContainerStyle.container}
                    containerContentContainerStyle={listContainerStyle.container}
                    onScroll={onScroll}
                    onEndReached={onEndReached}
                    onEndReachedWithinContainer={onEndReachedWithinContainer}
                    onEndReachedThreshold={0.8}
                    HorizontalListFooterComponent={LoadingComponent}
                    ListFooterComponent={hasMore ? LoadingComponent : undefined}
                    refreshControl={refreshControl}
                    focusedContainer={focusedContainer}
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
            <DetailPopup onModelClosed={onModelClosed} data={detailModelResource} />
        </View>
    );
};

export default StorefrontCatalog;
