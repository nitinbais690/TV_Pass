import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ActivityIndicator, RefreshControl, Animated, View } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { useSafeArea } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import { useFetchCollectionQuery, ResourceCardView, ResourceVm, ResourceCardViewBaseProps } from 'qp-discovery-ui';
import { selectDeviceType, AspectRatio, percentage } from 'qp-common-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import { NAVIGATION_TYPE } from './Navigation/NavigationConstants';
import CardOverlay from './components/CardOverlay';
import CardFooter from './components/CardFooter';
import ModalOverlay from './components/ModalOverlay';
import CollectionHeaderLogo from 'screens/components/CollectionHeaderLogo';
import AppErrorComponent from 'utils/AppErrorComponent';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { appFonts } from '../../AppStyles';
import { modalHeaderHeight } from 'screens/components/ModalOverlay';
import SkeletonGrid from 'screens/components/loading/SkeletonGrid';
import { AppEvents, condenseErrorObject, ErrorEvents, getContentDetailsAttributes } from 'utils/ReportingUtils';

export const CollectionsGridScreen = ({ route, navigation }: { route: any; navigation: any }): JSX.Element => {
    const { resource, title, resourceId } = route.params;
    const { isInternetReachable } = useNetworkStatus();
    const { width: w, height: h } = useDimensions().window;
    const insets = useSafeArea();
    const { recordEvent, recordErrorEvent } = useAnalytics();
    const [pageLoading, setPageLoading] = useState(false);

    const { loading, error, errorObject, resources, loadMore, hasMore, reload, pageOffset } = useFetchCollectionQuery(
        resourceId,
        title,
        1,
        isInternetReachable,
        true,
    );

    // const animationStyle = usePageLoadAnimation(true, true);

    useEffect(() => {
        recordEvent(AppEvents.VIEW_COLLECTION_DETAILS, getContentDetailsAttributes(resource), true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (error === true) {
            recordErrorEvent(ErrorEvents.COLLECTION_FETCH_ERROR, condenseErrorObject(errorObject));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors, appDimensions, appPadding } = appTheme!(prefs);

    const isPortrait = h > w;

    const cardsPerRow = selectDeviceType({ Handset: 2 }, 3);
    const customPadding = 10;
    const listPadding = appPadding.sm(true) - customPadding / 2;
    const cellPadding = cardsPerRow * customPadding;

    const mh = selectDeviceType({ Tablet: isPortrait ? 40 : percentage<true>(15, true) }, 0);
    const width = w - 2 * mh - (cellPadding + 2 * listPadding);
    const fallbackAspectRatio = AspectRatio._16by9;

    const defaultRenderResource = React.useCallback(
        ({ item }: { item: ResourceVm }): JSX.Element => {
            const aspectRatio = item.aspectRatio || fallbackAspectRatio;

            const cardStyle = StyleSheet.create({
                container: {
                    width: width / cardsPerRow,
                    marginLeft: customPadding / 2,
                    marginRight: customPadding / 2,
                    marginBottom: 0,
                    shadowOffset: { width: 0, height: 2 },
                    shadowColor: '#000',
                    shadowOpacity: 0.15,
                    shadowRadius: 1,
                    elevation: 0,
                    backgroundColor: appColors.primaryVariant2,
                    borderRadius: appDimensions.cardRadius,
                },
                wrapperStyle: {
                    width: width / cardsPerRow,
                    aspectRatio: aspectRatio,
                    borderTopLeftRadius: appDimensions.cardRadius,
                    borderTopRightRadius: appDimensions.cardRadius,
                    backgroundColor: appColors.primaryVariant2,
                    overflow: 'hidden',
                },
                imageStyle: {
                    borderTopLeftRadius: appDimensions.cardRadius,
                    borderTopRightRadius: appDimensions.cardRadius,
                    flex: 1,
                },
                gradientOverlayStyle: {
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderRadius: appDimensions.cardRadius,
                },
                footer: {
                    flex: 1,
                    justifyContent: 'space-between',
                    backgroundColor: appColors.primaryVariant1,
                    borderBottomLeftRadius: appDimensions.cardRadius,
                    borderBottomRightRadius: appDimensions.cardRadius,
                },
                footerTitle: {
                    fontSize: appFonts.xxs,
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
            });

            const cardProps: ResourceCardViewBaseProps<ResourceVm> = {
                onResourcePress: (res: ResourceVm) => {
                    const screenName =
                        res.containerType !== 'Collection'
                            ? NAVIGATION_TYPE.CONTENT_DETAILS
                            : res.collectionLayout === 'grid'
                            ? NAVIGATION_TYPE.COLLECTIONS_GRID
                            : NAVIGATION_TYPE.COLLECTIONS;
                    navigation.navigate(screenName, {
                        resource: res,
                        title: res.name,
                        resourceId: res.id,
                        resourceType: res.type,
                    });
                },
                cardStyle: cardStyle,
                underlayColor: 'black',
                activeOpacity: 0.5,
            };

            return (
                <ResourceCardView
                    isPortrait={isPortrait}
                    resource={item}
                    hideGradient={true}
                    {...cardProps}
                    cardStyle={cardStyle}
                    cardImageType={item.imageType}
                    cardAspectRatio={aspectRatio}
                    footerView={<CardFooter resource={item} />}
                    overlayView={<CardOverlay resource={item} />}
                />
            );
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [
            fallbackAspectRatio,
            width,
            cardsPerRow,
            appColors.primaryVariant2,
            appColors.primaryVariant1,
            appColors.secondary,
            appColors.caption,
            appDimensions.cardRadius,
            isPortrait,
            navigation,
        ],
    );

    const LoadingComponent = React.useMemo(() => <ActivityIndicator color={appColors.brandTint} size="small" />, [
        appColors.brandTint,
    ]);

    const refreshControl = React.useMemo(
        () => (
            <RefreshControl
                refreshing={(loading && resources && resources.length > 0) || false}
                onRefresh={reload}
                tintColor={appColors.tertiary}
                titleColor={appColors.tertiary}
                progressBackgroundColor={appColors.backgroundInactive}
                colors={[appColors.tertiary]}
                // title={'Pull to refresh'}
            />
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [appColors.tertiary, appColors.backgroundInactive],
    );

    const onEndReached = React.useCallback(async () => {
        setPageLoading(true);
        if (hasMore && loadMore) {
            await loadMore(pageOffset);
        }
        setPageLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasMore, pageOffset]);

    const headerTitle = React.useCallback(() => <CollectionHeaderLogo id={resourceId} />, [resourceId]);
    // const hasHeaderLogo = resource && resource.ia && resource.ia.includes(imageAspectRatio);
    const containerStyles = StyleSheet.create({
        container: {
            paddingHorizontal: listPadding,
            paddingBottom: listPadding,
            paddingTop: listPadding / 2 + modalHeaderHeight(insets),
        },
    });
    const scrollY = useRef(new Animated.Value(0)).current;
    const isHandset = DeviceInfo.getDeviceType() === 'Handset';

    return (
        <ModalOverlay
            scrollY={scrollY}
            isCollapsable={true}
            headerTransparent={true}
            headerTitle={resourceId ? headerTitle : title ? title : ' '}>
            {/* <Animated.View style={animationStyle}> */}
            <View style={{ width: w - 2 * mh, paddingVertical: isHandset ? appPadding.xl() : appPadding.md() }} />
            {loading && (
                <SkeletonGrid
                    count={30}
                    aspectRatio={AspectRatio._16by9}
                    cardWidth={width / cardsPerRow}
                    containerStyle={[containerStyles.container]}
                />
            )}

            {resources && (
                <Animated.FlatList<ResourceVm>
                    accessibilityLabel={'Collection'}
                    keyExtractor={listItem => listItem.id || ''}
                    horizontal={false}
                    numColumns={cardsPerRow}
                    key={isPortrait ? 'p' : 'l'}
                    showsHorizontalScrollIndicator={false}
                    data={resources}
                    onScroll={Animated.event(
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
                    )}
                    scrollEventThrottle={1}
                    renderItem={defaultRenderResource}
                    onEndReached={onEndReached}
                    refreshControl={refreshControl}
                    onEndReachedThreshold={0.8}
                    ListFooterComponent={pageLoading ? LoadingComponent : undefined}
                    contentContainerStyle={containerStyles.container}
                />
            )}
            {/* </Animated.View> */}
            {/* Error State */}
            {error && resources && resources.length === 0 && <AppErrorComponent reload={reload} />}
        </ModalOverlay>
    );
};

export default CollectionsGridScreen;
