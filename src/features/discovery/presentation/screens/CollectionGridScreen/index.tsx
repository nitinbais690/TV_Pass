import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, ActivityIndicator, RefreshControl, Animated } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { useFetchCollectionQuery, ResourceCardView, ResourceVm, ResourceCardViewBaseProps } from 'qp-discovery-ui';
import { selectDeviceType, AspectRatio, percentage } from 'qp-common-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import AppErrorComponent from 'utils/AppErrorComponent';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import SkeletonGrid from 'screens/components/loading/SkeletonGrid';
import { usePageLoadAnimation } from 'screens/hooks/usePageLoadAnimation';
import { AppEvents, condenseErrorObject, ErrorEvents, getContentDetailsAttributes } from 'utils/ReportingUtils';
import DetailPopup from 'features/details/presentation/components/template/DetailPopupScreen';
import ContentCardFooter from 'features/details/presentation/components/organisms/ContentCardFooter';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';
import BackNavigation from 'core/presentation/components/atoms/BackNavigation';

import { cardStyles } from './styles';
import CardTagsOverlay from '../../components/molecules/CardTagsOverlay';

export const CollectionsGridScreen = ({ route, navigation }: { route: any; navigation: any }): JSX.Element => {
    const { resource, title } = route.params;
    const { isInternetReachable } = useNetworkStatus();
    const { width: w, height: h } = useDimensions().window;
    const { recordEvent, recordErrorEvent } = useAnalytics();
    const [detailModelResource, setDetailModelResource] = useState({});

    const { loading, error, errorObject, resources, loadMore, hasMore, reload, pageOffset } = useFetchCollectionQuery(
        resource.id,
        title,
        1,
        isInternetReachable,
        true,
    );

    const animationStyle = usePageLoadAnimation(true, true);

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
    let { appColors, appPadding } = appTheme!(prefs);

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
            const cardStyle = cardStyles(width, cardsPerRow, customPadding, aspectRatio, appColors);
            const cardProps: ResourceCardViewBaseProps<ResourceVm> = {
                onResourcePress: (res: ResourceVm) => {
                    const screenName =
                        res.containerType !== 'Collection'
                            ? NAVIGATION_TYPE.CONTENT_DETAILS
                            : res.collectionLayout === 'grid'
                            ? NAVIGATION_TYPE.COLLECTIONS_GRID
                            : NAVIGATION_TYPE.COLLECTIONS;

                    if (screenName === NAVIGATION_TYPE.CONTENT_DETAILS) {
                        setDetailModelResource({
                            resource: res,
                            title: res.name,
                            resourceId: res.id,
                            resourceType: res.type,
                        });
                    } else {
                        navigation.navigate(screenName, {
                            resource: res,
                            title: res.name,
                            resourceId: res.id,
                            resourceType: res.type,
                        });
                    }
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
                    footerView={
                        <ContentCardFooter resource={item} rating={item.allRatings && Object.values(item.allRatings)} />
                    }
                    overlayView={
                        <CardTagsOverlay isOriginals={resource.isOriginals} isPremium={!resource.isFreeContent} />
                    }
                />
            );
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [
            fallbackAspectRatio,
            width,
            cardsPerRow,
            appColors,
            isPortrait,
            resource.isOriginals,
            resource.isFreeContent,
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
        },
    });

    const onModelClosed = () => {
        setDetailModelResource({});
    };

    return (
        <BackgroundGradient>
            <BackNavigation
                isFullScreen={true}
                navigationTitle={resource.name}
                onPress={() => {
                    navigation.goBack();
                }}
            />

            <Animated.View style={animationStyle}>
                {loading && (
                    <SkeletonGrid
                        count={30}
                        aspectRatio={AspectRatio._16by9}
                        cardWidth={width / cardsPerRow}
                        containerStyle={[containerStyles.container]}
                    />
                )}

                {resources && (
                    <FlatList<ResourceVm>
                        accessibilityLabel={'Collection'}
                        keyExtractor={listItem => listItem.id || ''}
                        horizontal={false}
                        numColumns={cardsPerRow}
                        key={isPortrait ? 'p' : 'l'}
                        showsHorizontalScrollIndicator={false}
                        data={resources}
                        renderItem={defaultRenderResource}
                        onEndReached={onEndReached}
                        refreshControl={refreshControl}
                        onEndReachedThreshold={0.8}
                        ListFooterComponent={hasMore ? LoadingComponent : undefined}
                        contentContainerStyle={containerStyles.container}
                    />
                )}

                {/* Error State */}
                {error && resources && resources.length === 0 && <AppErrorComponent reload={reload} />}
            </Animated.View>
            <DetailPopup onModelClosed={onModelClosed} data={detailModelResource} />
        </BackgroundGradient>
    );
};

export default CollectionsGridScreen;
