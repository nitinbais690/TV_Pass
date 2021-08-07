import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { StyleSheet, ActivityIndicator, RefreshControl, Animated, View, TVMenuControl } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { useSafeArea } from 'react-native-safe-area-context';
// import DeviceInfo from 'react-native-device-info';
import { ResourceCardView, ResourceVm, ContainerVm, ResourceCardViewBaseProps } from 'qp-discovery-ui';
import { selectDeviceType, AspectRatio, percentage, ImageType } from 'qp-common-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import { NAVIGATION_TYPE } from '../screens/Navigation/NavigationConstants';
import CardOverlay from '../screens/components/CardOverlay';
import CardFooter from '../screens/components/CardFooter';
import ModalOverlay from '../screens/components/ModalOverlay';
import AppErrorComponent from 'utils/AppErrorComponent';
import { appFonts } from '../../AppStyles';
import { modalHeaderHeight } from 'screens/components/ModalOverlay';
import SkeletonGrid from 'screens/components/loading/SkeletonGrid';
import { ScreenOrigin } from 'utils/ReportingUtils';
import { ClientContext } from 'react-fetching-library';
import { queryString } from '../../src/components/qp-discovery-ui/src/utils/URLBuilder';
import { ResourceResponse } from '../../src/components/qp-discovery-ui/src/models/Storefront.types';
import { metaDataResourceAdapter } from '../../src/components/qp-discovery-ui/src/models/Adapters';
import { useFLPlatform } from 'platform/PlatformContextProvider';

interface State {
    hasMore: boolean;
    error: boolean;
    errorObject: any;
    loading: boolean;
    pageNumber: number;
    containers: ContainerVm[] | undefined;
    resources: ResourceVm[] | undefined;
}

export const StorefrontViewallScreen = ({ route, navigation }: { route: any; navigation: any }): JSX.Element => {
    const { contentUrl, title } = route.params;
    const { isInternetReachable } = useNetworkStatus();
    const { width: w, height: h } = useDimensions().window;
    const insets = useSafeArea();
    const isMounted = useRef(true);
    const { query } = useContext(ClientContext);
    const { state: platformState } = useFLPlatform();
    const { platformAuthorizer } = platformState;
    const platformAuth = useRef(platformAuthorizer);

    const initialState: State = {
        hasMore: false,
        error: false,
        errorObject: undefined,
        loading: true,
        pageNumber: 1,
        containers: undefined,
        resources: undefined,
    };
    const [state, setState] = useState<State>(initialState);

    const prefs = useAppPreferencesState();
    const { appTheme, appConfig } = prefs;
    let { appColors, appDimensions, appPadding } = appTheme!(prefs);

    const viewAllImageType = (appConfig && appConfig.channelsImageType) || 3;
    const viewAllAspectRatio = (appConfig && appConfig.channelsAspectRatio) || 1;

    const isPortrait = h > w;
    const channelsCardsPerRow = viewAllAspectRatio && title === 'Channels';

    const cardsPerRow = selectDeviceType({ Handset: channelsCardsPerRow ? 3 : 2 }, 5);
    const customPadding = 40;
    const listPadding = appPadding.sm(true) - customPadding / 2;
    const cellPadding = cardsPerRow * customPadding;

    const mh = selectDeviceType({ Tablet: isPortrait ? 40 : percentage<true>(15, true) }, 0);
    const width = w - 2 * mh - (cellPadding + 2 * listPadding);
    const fallbackAspectRatio = AspectRatio._16by9;
    const pageOffset = 30;

    useEffect(() => {
        platformAuth.current = platformAuthorizer;
    }, [platformAuthorizer]);

    useEffect(() => {
        TVMenuControl.enableTVMenuKey();
        return () => {
            TVMenuControl.disableTVMenuKey();
        };
    }, []);

    const defaultRenderResource = React.useCallback(
        ({ item, index }: { item: ResourceVm; index: number }): JSX.Element => {
            const aspectRatio = item.aspectRatio || fallbackAspectRatio;
            const contentStyle = StyleSheet.create({
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
            const borderRadius = 10;
            const collectionStyle = StyleSheet.create({
                container: {
                    width: width / cardsPerRow,
                    marginLeft: customPadding / 2,
                    marginRight: customPadding / 2,
                    marginBottom: 0,
                    borderRadius: borderRadius,
                    backgroundColor: appColors.primary,
                    borderWidth: 0,
                    borderColor: 'transparent',
                    overflow: 'hidden',
                    shadowOffset: { width: 0, height: 2 },
                    shadowColor: '#000',
                    shadowOpacity: 0.15,
                    shadowRadius: 2,
                    elevation: 2,
                },
                wrapperStyle: {
                    width: width / cardsPerRow,
                    aspectRatio: aspectRatio,
                    borderTopLeftRadius: borderRadius,
                    borderTopRightRadius: borderRadius,
                    borderRadius: borderRadius,
                    backgroundColor: appColors.primary,
                },
                imageStyle: {
                    borderTopLeftRadius: borderRadius,
                    borderTopRightRadius: borderRadius,
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
                    backgroundColor: appColors.primaryVariant1,
                    borderBottomLeftRadius: borderRadius,
                    borderBottomRightRadius: borderRadius,
                },
                footerTitle: {
                    fontSize: appFonts.xs,
                    fontFamily: appFonts.primary,
                    color: appColors.secondary,
                    fontWeight: '500',
                },
                onFocusCardStyle: {
                    borderColor: appColors.brandTint,
                    borderRadius: borderRadius,
                    borderWidth: 2,
                    elevation: 20,
                    shadowOffset: { width: 0, height: 5 },
                    shadowColor: appColors.brandTint,
                    shadowOpacity: 0.5,
                    shadowRadius: 20,
                },
            });

            const cardStyle = item.type === 'movie' ? contentStyle : collectionStyle;

            const cardProps: ResourceCardViewBaseProps<ResourceVm> = {
                onResourcePress: (res: ResourceVm) => {
                    const screenName =
                        res.type === 'movie' || res.type === 'tvseries' || res.type === 'tvepisode'
                            ? NAVIGATION_TYPE.CONTENT_DETAILS
                            : res.layout === 'grid'
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
                    hasTVPreferredFocus={index === 0}
                    blockFocusUp={index < cardsPerRow - 1 ? true : false}
                    blockFocusRight={index !== 0 && index % cardsPerRow === cardsPerRow - 1 ? true : false}
                    blockFocusLeft={index === 0 ? true : index % cardsPerRow === 0}
                    blockFocusDown={state.resources && state.resources.length - cardsPerRow < index ? true : false}
                    {...cardProps}
                    cardStyle={cardStyle}
                    cardImageType={
                        item.imageType
                            ? item.imageType
                            : item.type
                            ? ImageType.Poster
                            : viewAllImageType && item.type === undefined
                            ? viewAllImageType
                            : ImageType.LogoHeader
                    }
                    cardAspectRatio={
                        viewAllAspectRatio && item.type === undefined ? viewAllAspectRatio : AspectRatio._16by9
                    }
                    footerView={item.type === 'movie' ? <CardFooter resource={item} /> : null}
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
            appColors.primary,
            appColors.brandTint,
            appDimensions.cardRadius,
            viewAllAspectRatio,
            isPortrait,
            viewAllImageType,
            navigation,
            state.resources,
        ],
    );

    const LoadingComponent = React.useMemo(() => <ActivityIndicator color={appColors.brandTint} size="small" />, [
        appColors.brandTint,
    ]);

    const refreshControl = React.useMemo(
        () => (
            <RefreshControl
                refreshing={(state.loading && state.resources && state.resources.length > 0) || false}
                onRefresh={reload}
                tintColor={appColors.tertiary}
                titleColor={appColors.tertiary}
                progressBackgroundColor={appColors.backgroundInactive}
                colors={[appColors.tertiary]}
            />
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [state.loading, state.resources, reload, appColors.tertiary, appColors.backgroundInactive],
    );

    const onEndReached = React.useCallback(() => {
        if (state.hasMore && loadMore) {
            loadMore(state.pageNumber);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.hasMore, state.pageNumber]);

    const containerStyles = StyleSheet.create({
        container: {
            paddingHorizontal: listPadding,
            paddingBottom: listPadding,
            paddingTop: listPadding / 2 + modalHeaderHeight(insets),
        },
        titleStyle: {
            fontSize: appFonts.md,
            fontFamily: appFonts.light,
            color: appColors.secondary,
            fontWeight: undefined,
            alignSelf: 'center',
            marginTop: -10,
        },
    });
    const scrollY = useRef(new Animated.Value(0)).current;

    const handleResourcePaginationQuery = async (pageNumber: number): Promise<void> => {
        const endpoint = contentUrl;
        if (!endpoint) {
            return;
        }
        if (!platformAuth.current) {
            return;
        }
        const queryParams = queryString({ pageNumber: pageNumber, pageSize: pageOffset });
        const queryDelimiter = endpoint.includes('?') ? '&' : '?';
        const authToken = await platformAuth.current.ensureAuthorization();
        const headers = {
            Authorization: `Bearer ${authToken.accessToken}`,
        };
        const { payload, error, errorObject } = await query<ResourceResponse>({
            method: 'GET',
            endpoint: `${endpoint}${queryDelimiter}${queryParams}`,
            headers,
        });
        let resources =
            (payload &&
                payload.data &&
                payload.data.map(content => {
                    return metaDataResourceAdapter(content, ScreenOrigin.COLLECTION, {
                        id: content.id,
                        name: '',
                        imageType: ImageType.Poster,
                        aspectRatio: title === 'Channels' ? AspectRatio._1by1 : AspectRatio._16by9,
                        layout: content.c_lo && content.c_lo === 'grid' ? 'grid' : 'carousel',
                    });
                })) ||
            [];
        let hasMore = false;
        if (payload && payload.header) {
            const header = payload.header;
            hasMore = header.start + header.rows < header.count;
        }

        if (isMounted.current) {
            setState({
                ...state,
                hasMore: hasMore,
                loading: false,
                error: error,
                errorObject: errorObject,
                resources: [...(pageNumber !== 1 && state.resources ? state.resources : []), ...resources],
                pageNumber: pageNumber + 1,
            });
        }
    };

    const handleQuery = async (pageNumber: number): Promise<void> => {
        if (!isMounted.current) {
            return;
        }

        if (pageNumber > 0) {
            await handleResourcePaginationQuery(pageNumber);
        }
    };

    useEffect(() => {
        isMounted.current = true;

        setState({
            ...initialState,
            error: isInternetReachable === false,
        });

        handleQuery(1);

        return () => {
            isMounted.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contentUrl, isInternetReachable]);

    const loadMore = (pn: number): Promise<void> => handleQuery(pn);
    const reload = useCallback(() => {
        handleQuery(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ModalOverlay
            scrollY={scrollY}
            isCollapsable={true}
            headerTransparent={true}
            headerTitle={title ? title : undefined}
            isHideCrossIcon={true}>
            <View style={{ paddingVertical: appPadding.sm() }} />
            {state.loading && (
                <SkeletonGrid
                    count={30}
                    aspectRatio={AspectRatio._16by9}
                    cardWidth={width / cardsPerRow}
                    containerStyle={[containerStyles.container]}
                    viewAllAspectRatio={title === 'Channels' ? viewAllAspectRatio : undefined}
                />
            )}

            {state.resources && (
                <Animated.FlatList<ResourceVm>
                    accessibilityLabel={'Collection'}
                    keyExtractor={listItem => listItem.id || ''}
                    horizontal={false}
                    numColumns={cardsPerRow}
                    key={isPortrait ? 'p' : 'l'}
                    showsHorizontalScrollIndicator={false}
                    data={state.resources}
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
                    ListFooterComponent={state.hasMore ? LoadingComponent : undefined}
                    contentContainerStyle={containerStyles.container}
                />
            )}
            {/* Error State */}
            {state.error && state.resources && state.resources.length === 0 && <AppErrorComponent reload={reload} />}
        </ModalOverlay>
    );
};

export default StorefrontViewallScreen;
