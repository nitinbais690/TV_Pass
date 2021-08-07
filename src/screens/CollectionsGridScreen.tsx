import React, { useEffect, useRef } from 'react';
import { StyleSheet, ActivityIndicator, RefreshControl, Animated, View, Platform, TVMenuControl } from 'react-native';
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
import CollectionHeaderLogo, { imageAspectRatio } from 'screens/components/CollectionHeaderLogo';
import AppErrorComponent from 'utils/AppErrorComponent';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { appFonts } from '../../AppStyles';
import { modalHeaderHeight } from 'screens/components/ModalOverlay';
import SkeletonGrid from 'screens/components/loading/SkeletonGrid';
import { AppEvents, condenseErrorObject, ErrorEvents, getContentDetailsAttributes } from 'utils/ReportingUtils';
import GradientBackground from '../../assets/images/backgroundRadianGradient.svg';

export const CollectionsGridScreen = ({ route, navigation }: { route: any; navigation: any }): JSX.Element => {
    const { resource, title, resourceId } = route.params;
    const { isInternetReachable } = useNetworkStatus();
    const { width: w, height: h } = useDimensions().window;
    const insets = useSafeArea();
    const { recordEvent, recordErrorEvent } = useAnalytics();

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

    useEffect(() => {
        TVMenuControl.enableTVMenuKey();
        return () => {
            TVMenuControl.disableTVMenuKey();
        };
    }, []);

    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors, appDimensions, appPadding } = appTheme!(prefs);

    const isPortrait = h > w;

    const cardsPerRow = selectDeviceType({ Handset: 2, Tv: 5 }, 3);
    const customPadding = 10;
    const listPadding = appPadding.sm(true) - customPadding / 2;
    const cellPadding = cardsPerRow * customPadding;

    const mh = selectDeviceType({ Tablet: isPortrait ? 40 : percentage<true>(15, true) }, 0);
    const width = w - 2 * mh - (cellPadding + 2 * listPadding);
    const fallbackAspectRatio = AspectRatio._16by9;

    const defaultRenderResource = React.useCallback(
        ({ item, index }: { item: ResourceVm; index: number }): JSX.Element => {
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
                    hasTVPreferredFocus={index === 0}
                    blockFocusUp={index < cardsPerRow - 1 ? true : false}
                    blockFocusRight={index !== 0 && index % cardsPerRow === cardsPerRow - 1 ? true : false}
                    blockFocusLeft={index === 0 ? true : index % cardsPerRow === 0}
                    blockFocusDown={resources && resources.length - cardsPerRow < index ? true : false}
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
            resources,
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

    const onEndReached = React.useCallback(() => {
        if (hasMore && loadMore) {
            loadMore(pageOffset);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasMore, pageOffset]);

    const containerStyles = StyleSheet.create({
        container: {
            paddingHorizontal: listPadding,
            paddingBottom: listPadding,
            paddingTop: listPadding / 2 + modalHeaderHeight(insets),
        },
        listContainer: {
            position: 'absolute',
            zIndex: -1,
            height: appDimensions.fullHeight,
            width: appDimensions.fullWidth,
        },
        headerLogoStyle: {
            height: 50,
            width: 50,
        },
        // emptyListContainer: {
        //     height: appDimensions.fullHeight / 2,
        //     justifyContent: 'center',
        //     alignItems: 'center',
        // },
        // emptyTextStyle: {
        //     color: appColors.primary,
        //     fontSize: appFonts.md,
        // },
        listheaderTvStyle: {
            padding: appPadding.md(true),
        },
        gradientBackgroundStyle: {
            position: 'absolute',
            height: appDimensions.fullHeight,
            width: appDimensions.fullWidth,
            zIndex: -10,
        },
    });

    // const defaultRenderEmptyList = React.useCallback(() => {
    //     return (
    //         <View style={containerStyles.emptyListContainer}>
    //             <Text style={containerStyles.emptyTextStyle}>{""}</Text>
    //         </View>
    //     );
    // }, []);

    const defaultRenderHeaderTv = React.useCallback(() => {
        return <View style={containerStyles.listheaderTvStyle} />;
    }, [containerStyles.listheaderTvStyle]);

    const headerTitle = React.useCallback(
        () => (
            <View style={[Platform.isTV && containerStyles.headerLogoStyle]}>
                <CollectionHeaderLogo id={resourceId} />
            </View>
        ),
        [containerStyles.headerLogoStyle, resourceId],
    );
    const hasHeaderLogo = resource && resource.ia && resource.ia.includes(imageAspectRatio);

    const scrollY = useRef(new Animated.Value(0)).current;
    const isHandset = DeviceInfo.getDeviceType() === 'Handset';

    return (
        <ModalOverlay
            scrollY={scrollY}
            isCollapsable={true}
            headerTransparent={true}
            hideBackgroundGradient={true}
            isHideCrossIcon={true}
            headerTitle={hasHeaderLogo ? headerTitle : title ? title : ''}>
            {/* <Animated.View style={animationStyle}> */}
            <View style={containerStyles.gradientBackgroundStyle}>
                <GradientBackground height={'100%'} width={'100%'} />
            </View>

            {!Platform.isTV && <View style={{ paddingVertical: isHandset ? appPadding.xl() : appPadding.md() }} />}
            <View style={[Platform.isTV && containerStyles.listContainer]}>
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
                        // ListEmptyComponent={defaultRenderEmptyList}
                        ListHeaderComponent={Platform.isTV ? defaultRenderHeaderTv : null}
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
                        ListFooterComponent={hasMore ? LoadingComponent : undefined}
                        contentContainerStyle={containerStyles.container}
                    />
                )}
            </View>
            {/* </Animated.View> */}
            {/* Error State */}
            {error && resources && resources.length === 0 && <AppErrorComponent reload={reload} />}
        </ModalOverlay>
    );
};

export default CollectionsGridScreen;
