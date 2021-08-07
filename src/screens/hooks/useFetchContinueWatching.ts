import { useCallback, useContext, useState, useRef, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ClientContext } from 'react-fetching-library';
import { BookmarkRecord } from 'rn-qp-nxg-player';
import {
    ContainerVm,
    ResourceVm,
    fetchContentIdsLookup,
    ResourceResponse,
    metaDataResourceAdapter,
} from 'qp-discovery-ui';
import { AspectRatio, ImageType } from 'qp-common-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import { useUserData } from 'contexts/UserDataContextProvider';
import { ScreenOrigin } from 'utils/ReportingUtils';

interface State {
    hasMore: boolean;
    error: boolean;
    errorObject: any;
    loading: boolean;
    continueWatchingContainer: ContainerVm | undefined;
}

const initialState: State = {
    hasMore: false,
    error: false,
    errorObject: undefined,
    loading: true,
    continueWatchingContainer: undefined,
};

// const isExpiringIn = (asset: VODEntitlement, days: number) => {
//     const end = moment(parseInt(asset.validityEndDate, 10));
//     const now = moment();
//     const expiresInHours = end.diff(now, 'hours');
//     const expiresInDays = expiresInHours / 24;
//     return expiresInDays <= days;
// };

// const sortByExpiringAscending = (a: VODEntitlement, b: VODEntitlement) => {
//     return parseInt(a.validityEndDate, 10) - parseInt(b.validityEndDate, 10);
// };

// const mixin = (asset: VODEntitlement, bookmark: BookmarkRecord): VODEntitlement | undefined => {
//     if (!asset) {
//         return undefined;
//     }

//     return {
//         ...asset,
//         offset: bookmark.offset,
//         updatedTimestamp: bookmark.updatedTimestamp,
//     };
// };

export const useFetchContinueWatching = () => {
    const isMounted = useRef(true);
    const { isInternetReachable } = useNetworkStatus();
    const { strings } = useLocalization();
    const { appConfig } = useAppPreferencesState();
    const {
        loading: loadingUserData,
        error: userDataError,
        errorObject: userDataErrorObject,
        bookmarks,
        redeemedAssets,
        reload: reloadUserData,
    } = useUserData();
    const { query } = useContext(ClientContext);
    const [state, setState] = useState<State>(initialState);
    // const [redeemedAssetsMap, setRedeemedAssetsMap] = useState<{ [key: string]: VODEntitlement }>({});

    //const MAX_RECENTLY_REDEEMED_ITEMS = (appConfig && appConfig['mycontent.maxRecentlyRedeemed']) || 15;
    // const MAX_YOUR_CONTENT_ITEMS = (appConfig && appConfig['mycontent.maxYourContent']) || 30;
    // const EXPIRING_SOON_DAYS_THRESHOLD = (appConfig && appConfig['mycontent.expiringSoonThresholdDays']) || 5;
    //const RESOURCES_PAGE_SIZE = (appConfig && appConfig['mycontent.pagingPageSize']) || 5;
    const RESOURCES_PAGE_SIZE = 20;

    //  const showRecentlyRedeemed = appConfig && appConfig['mycontent.showRecentlyRedeemed'];
    const showContinueWatching = appConfig && appConfig['mycontent.showContinueWatching'];
    // const showExpiringSoon = appConfig && appConfig['mycontent.showExpiringSoon'];
    // const showYourMovies = appConfig && appConfig['mycontent.showYourMovies'];
    // const showYourTV = appConfig && appConfig['mycontent.showYourTV'];
    // const showYourShorts = appConfig && appConfig['mycontent.showYourShorts'];

    // const expiresIn = useCallback(
    //     (asset?: VODEntitlement): string | undefined => {
    //         if (!asset) {
    //             return;
    //         }

    //         const end = moment(parseInt(asset.validityEndDate, 10));
    //         const now = moment();
    //         const expiresInHours = end.diff(now, 'hours');
    //         const expiresInDays = expiresInHours / 24;
    //         const days = Math.max(Math.ceil(expiresInDays), 1);
    //         let key = strings.formatString(strings['my_content.expires_in_days'], days);
    //         if (days === 1) {
    //             key = strings['my_content.expires_in_day'];
    //         }
    //         return key as string;
    //     },
    //     [strings],
    // );

    const completedPercent = useCallback((asset?: BookmarkRecord, runningTime?: number): number | undefined => {
        if (!asset || !asset.offset || !runningTime) {
            return 0;
        }
        const totalRunningTime = runningTime * 1000;
        const percent = asset.offset >= 0 && totalRunningTime > 0 ? (asset.offset / totalRunningTime) * 100 : undefined;
        return percent;
    }, []);

    const fetchResources = useCallback(
        async (
            assetIds: string[],
            mixinContinueWatching?: boolean,
            assets?: BookmarkRecord[],
            containerName?: string,
            showFooterTitle?: boolean,
        ) => {
            const action = fetchContentIdsLookup(assetIds);
            const { payload, error, errorObject } = await query<ResourceResponse>(action);
            const resources =
                assets &&
                payload &&
                payload.data &&
                payload.data.map(content => {
                    const asset = assets.find(a => a.itemId === content.id);
                    return {
                        ...metaDataResourceAdapter(content),
                        aspectRatio: AspectRatio._2by3,
                        imageType: ImageType.Poster,
                        imageAspectRatio: `${ImageType.Poster}-${AspectRatio._2by3}`,
                        size: showFooterTitle ? 'large' : 'regular',
                        //   expiresIn: expiresIn( redeemedAssetsMap[content.id]),
                        watchedOffset: asset && asset.offset,
                        completedPercent: completedPercent(asset, content.rt),
                        get title() {
                            return this.seriesTitle ? this.seriesTitle : this.name;
                        },
                        get subtitle() {
                            return this.seasonNumber && this.episodeNumber
                                ? `S${this.seasonNumber} E${this.episodeNumber}: ${this.name}`
                                : undefined;
                        },
                        showFooter: true,
                        showFooterTitles: showFooterTitle,
                        origin: ScreenOrigin.MY_CONTENT,
                        containerName: containerName,
                    } as ResourceVm;
                });

            if (error) {
                console.debug('>>>>> error fetching resources', error, errorObject);
                return undefined;
            }

            return resources;
        },
        [query, completedPercent],
    );

    const containerForAssets = useCallback(
        async ({
            id,
            name,
            assets,
            maxResources,
            continueWatching,
            showContainer = true,
            showFooterTitle,
        }: {
            assets: BookmarkRecord[];
            id: string;
            name: string;
            maxResources: number;
            continueWatching?: boolean;
            showContainer?: boolean;
            showFooterTitle?: boolean;
        }): Promise<ContainerVm | undefined> => {
            if (showContainer === false) {
                return undefined;
            }

            const assetIds = assets.map(a => a.itemId);
            if (assetIds.length <= 0) {
                return undefined;
            }

            const resources = await fetchResources(
                assetIds.slice(0, Math.min(maxResources, RESOURCES_PAGE_SIZE)),
                continueWatching,
                assets,
                name,
                showFooterTitle,
            );

            return {
                id: id,
                name: name,
                aspectRatio: AspectRatio._16by9,
                imageType: ImageType.Poster,
                layout: 'carousel',
                size: showFooterTitle ? 'large' : 'regular',
                resources: resources,
                contentIds: assetIds,
                pageNumber: 1,
                lazyLoading: false,
                maxResources: maxResources,
                continueWatching: continueWatching,
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [fetchResources],
    );

    const fetchMyContent = useCallback(async () => {
        if (userDataError) {
            setState({
                ...state,
                loading: false,
                error: true,
                errorObject: userDataErrorObject,
            });
        }

        // const _redeemedAssetsMap = redeemedAssets.reduce(
        //     (acc: { [key: string]: VODEntitlement }, val: VODEntitlement) => {
        //         acc[val.serviceID] = val;
        //         return acc;
        //     },
        //     {},
        // );

        // Curate assets for all the my_content carousels
        // const recentlyRedeemedAssets = redeemedAssets;
        const bookmarkAssets = bookmarks;
        //  .map(bmk => mixin(_redeemedAssetsMap[bmk.itemId], bmk))
        //  .filter(Boolean) as VODEntitlement[];

        // const expiringSoonAssets = redeemedAssets
        //     .filter(asset => isExpiringIn(asset, EXPIRING_SOON_DAYS_THRESHOLD))
        //     .sort(sortByExpiringAscending);
        //     const redeemedMovies = redeemedAssets.filter(asset => asset.assetType === Category.Movie);
        //    const redeemedShows = redeemedAssets.filter(asset => asset.assetType === Category.TVEpisode);
        //  const redeemedShorts = redeemedAssets.filter(asset => asset.assetType === Category.Short);

        // setRedeemedAssetsMap(_redeemedAssetsMap);

        //console.log("bookmarkAssets",bookmarkAssets);

        // Fetch meta-data for all the carousel items
        const containers: ContainerVm | undefined = await Promise.resolve(
            // containerForAssets({
            //     assets: recentlyRedeemedAssets,
            //     name: strings['my_content.recently_redeemed'],
            //     id: '0',
            //     maxResources: MAX_RECENTLY_REDEEMED_ITEMS,
            //     showContainer: showRecentlyRedeemed,
            //     showFooterTitle: true,
            // }),
            containerForAssets({
                assets: bookmarkAssets,
                name: strings['my_content.continue_watching'],
                id: '1',
                maxResources: bookmarkAssets.length,
                continueWatching: true,
                showContainer: showContinueWatching,
                showFooterTitle: true,
            }),
            // containerForAssets({
            //     assets: expiringSoonAssets,
            //     name: strings['my_content.exipiring_soon'],
            //     id: '2',
            //     maxResources: expiringSoonAssets.length,
            //     showContainer: showExpiringSoon,
            //     showFooterTitle: true,
            // }),
            // containerForAssets({
            //     assets: redeemedMovies,
            //     name: strings['my_content.redeemed_movies'],
            //     id: '3',
            //     maxResources: MAX_YOUR_CONTENT_ITEMS,
            //     showContainer: showYourMovies,
            // }),
            // containerForAssets({
            //     assets: redeemedShows,
            //     name: strings['my_content.redeemed_shows'],
            //     id: '4',
            //     maxResources: MAX_YOUR_CONTENT_ITEMS,
            //     showContainer: showYourTV,
            // }),
            // containerForAssets({
            //     assets: redeemedShorts,
            //     name: strings['my_content.redeemed_shorts'],
            //     id: '5',
            //     maxResources: MAX_YOUR_CONTENT_ITEMS,
            //     showContainer: showYourShorts,
            // }),
        );

        // Filter empty containers
        // const filteredContainers: ContainerVm[] = containers.filter(
        //     c => c && c.resources && c.resources.length > 0,
        // ) as ContainerVm[];

        if (!isMounted.current) {
            return;
        }

        setState({
            ...state,
            loading: false,
            continueWatchingContainer: containers,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containerForAssets, strings, state, bookmarks, redeemedAssets]);

    useEffect(() => {
        if (!loadingUserData) {
            fetchMyContent();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingUserData, bookmarks]);

    useFocusEffect(
        useCallback(() => {
            isMounted.current = true;

            if (isInternetReachable === false) {
                setState({
                    ...state,
                    error: isInternetReachable === false,
                });
                return;
            }

            reloadUserData();

            return () => {
                isMounted.current = false;
            };

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [isInternetReachable]),
    );

    const reload = async () => fetchMyContent();

    const reset = async () => {
        setState({
            ...initialState,
            error: isInternetReachable === false,
        });
    };

    const loadMoreResources = useCallback(
        async (container: ContainerVm) => {
            if (
                !container.contentIds ||
                container.contentIds.length <= 0 ||
                !container.pageNumber ||
                container.lazyLoading
            ) {
                return;
            }

            const startIndex = container.pageNumber * RESOURCES_PAGE_SIZE;
            const endIndex = startIndex + RESOURCES_PAGE_SIZE;
            const actualEndIndex = container.maxResources ? Math.min(endIndex, container.maxResources) : endIndex;
            const assetIds = container.contentIds.slice(startIndex, actualEndIndex);
            if (assetIds.length <= 0) {
                return;
            }

            const resources = await fetchResources(
                assetIds,
                container.continueWatching,
                undefined,
                container.name,
                container.size === 'large',
            );
            if (!resources) {
                return;
            }

            if (!isMounted.current) {
                return;
            }

            setState({
                ...state,
                // containers: state.containers.map(c => {
                //     if (c.id === container.id) {
                //         return {
                //             ...container,
                //             lazyLoading: false,
                //             pageNumber: container.pageNumber ? container.pageNumber + 1 : 1,
                //             resources: [
                //                 ...(container.resources ? container.resources : []),
                //                 ...(resources ? resources : []),
                //             ],
                //         };
                //     } else {
                //         return c;
                //     }
                // }),
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [fetchResources, state],
    );
    return { ...state, reload, reset, loadMoreResources };
};
