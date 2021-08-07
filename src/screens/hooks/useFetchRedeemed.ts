import { useCallback, useContext, useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ClientContext } from 'react-fetching-library';
import moment from 'moment';
import { BookmarkRecord } from 'rn-qp-nxg-player';
import {
    Category,
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
import { VODEntitlement, useUserData } from 'contexts/UserDataContextProvider';
import { ScreenOrigin } from 'utils/ReportingUtils';
import { useAuth } from 'contexts/AuthContextProvider';
import { getRedeemExpiringIn } from 'utils/RedeemedUtils';

interface State {
    hasMore: boolean;
    error: boolean;
    errorObject: any;
    loading: boolean;
    containers: ContainerVm[];
}

const initialState: State = {
    hasMore: false,
    error: false,
    errorObject: undefined,
    loading: true,
    containers: [],
};

const isExpiringIn = (asset: VODEntitlement, days: number) => {
    const end = moment(parseInt(asset.validityEndDate, 10));
    const now = moment();
    const expiresInHours = end.diff(now, 'hours');
    const expiresInDays = expiresInHours / 24;
    return expiresInDays <= days;
};

const sortByExpiringAscending = (a: VODEntitlement, b: VODEntitlement) => {
    return parseInt(a.validityEndDate, 10) - parseInt(b.validityEndDate, 10);
};

const sortByExpiringDescending = (a: VODEntitlement, b: VODEntitlement) => {
    return parseInt(b.validityEndDate, 10) - parseInt(a.validityEndDate, 10);
};

const mixin = (asset: VODEntitlement, bookmark: BookmarkRecord): VODEntitlement | undefined => {
    if (!asset) {
        return undefined;
    }

    return {
        ...asset,
        offset: bookmark.offset,
        updatedTimestamp: bookmark.updatedTimestamp,
    };
};
const mixinAllContents = (asset: VODEntitlement, bookmarks: any): VODEntitlement => {
    let assetOutput = asset;
    const filteredBookmark = bookmarks.filter(item => item.itemId === asset.serviceID);
    if (filteredBookmark.length > 0) {
        assetOutput = {
            ...asset,
            offset: filteredBookmark[0].offset,
            updatedTimestamp: filteredBookmark[0].updatedTimestamp,
        };
    }

    return assetOutput;
};

export const useFetchRedeemed = () => {
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
    const [continueWatchingAssets, setContinueWatchingAssets] = useState<VODEntitlement[]>([]);
    const [redeemedAssetsMap, setRedeemedAssetsMap] = useState<{ [key: string]: VODEntitlement }>({});

    const MAX_RECENTLY_REDEEMED_ITEMS = (appConfig && appConfig['mycontent.maxRecentlyRedeemed']) || 15;
    const MAX_YOUR_CONTENT_ITEMS = (appConfig && appConfig['mycontent.maxYourContent']) || 30;
    const EXPIRING_SOON_DAYS_THRESHOLD = (appConfig && appConfig['mycontent.expiringSoonThresholdDays']) || 5;
    const RESOURCES_PAGE_SIZE = (appConfig && appConfig['mycontent.pagingPageSize']) || 5;

    const showRecentlyRedeemed = appConfig && appConfig['mycontent.showRecentlyRedeemed'];
    const showContinueWatching = appConfig && appConfig['mycontent.showContinueWatching'];
    const showExpiringSoon = appConfig && appConfig['mycontent.showExpiringSoon'];
    const showYourMovies = appConfig && appConfig['mycontent.showYourMovies'];
    const showYourTV = appConfig && appConfig['mycontent.showYourTV'];
    const showYourShorts = appConfig && appConfig['mycontent.showYourShorts'];
    const { accountProfile } = useAuth();

    const expiresIn = useCallback(
        (asset?: VODEntitlement): string | undefined => {
            if (!asset) {
                return;
            }
            let expireDays = getRedeemExpiringIn(parseInt(asset.validityEndDate, 10), accountProfile);
            var stringToDisplay =
                expireDays !== 1
                    ? strings.formatString(strings['content_detail.redeem_btn.entitled_other'], expireDays)
                    : strings['my_content.expires_in_day'];
            return stringToDisplay.toString();
        },
        [accountProfile, strings],
    );

    const completedPercent = useCallback((asset?: VODEntitlement, runningTime?: number): number | undefined => {
        if (!asset || !asset.offset || !runningTime) {
            return 0;
        }
        const totalRunningTime = runningTime * 1000;

        return asset.offset >= 0 && totalRunningTime > 0 ? (asset.offset / totalRunningTime) * 100 : undefined;
    }, []);

    const fetchResources = useCallback(
        async (
            assetIds: string[],
            mixinContinueWatching?: boolean,
            assets?: VODEntitlement[],
            containerName?: string,
            showFooterTitle?: boolean,
            showPlayerIcon?: boolean,
            containerTypeName?: string,
        ) => {
            const action = fetchContentIdsLookup(assetIds);
            const { payload, error, errorObject } = await query<ResourceResponse>(action);
            const resources =
                payload &&
                payload.data &&
                payload.data
                    .filter(content => {
                        const asset = (assets ? assets : continueWatchingAssets).find(a => a.serviceID === content.id);
                        const completedPercentVal = completedPercent(asset, content.rt);

                        return (
                            containerTypeName === undefined ||
                            containerTypeName === '' ||
                            (containerTypeName === 'continueWatching' &&
                                completedPercentVal &&
                                completedPercentVal < 98 &&
                                completedPercentVal > 1)
                        );
                    })
                    .map(content => {
                        const asset = (assets ? assets : continueWatchingAssets).find(a => a.serviceID === content.id);
                        return {
                            ...metaDataResourceAdapter(content),
                            aspectRatio: AspectRatio._16by9,
                            imageType: ImageType.Poster,
                            imageAspectRatio: `${ImageType.Poster}-${AspectRatio._16by9}`,
                            size: 'regular',
                            expiresIn: expiresIn(asset ? asset : redeemedAssetsMap[content.id]),
                            watchedOffset: asset && asset.offset,
                            completedPercent: mixinContinueWatching && completedPercent(asset, content.rt),
                            //completedPercent: completedPercent(asset, content.rt),
                            showPlayerIcon: showPlayerIcon,
                            containerTypeName: containerTypeName,
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [query, expiresIn, continueWatchingAssets, redeemedAssetsMap, completedPercent],
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
            showPlayerIcon = false,
            containerTypeName = '',
        }: {
            assets: VODEntitlement[];
            id: string;
            name: string;
            maxResources: number;
            continueWatching?: boolean;
            showContainer?: boolean;
            showFooterTitle?: boolean;
            showPlayerIcon?: boolean;
            containerTypeName?: string;
        }): Promise<ContainerVm | undefined> => {
            if (showContainer === false) {
                return undefined;
            }

            const assetIds = assets.map(a => a.serviceID);
            if (assetIds.length <= 0) {
                return undefined;
            }

            const resources = await fetchResources(
                assetIds.slice(0, Math.min(maxResources, RESOURCES_PAGE_SIZE)),
                continueWatching,
                assets,
                name,
                showFooterTitle,
                showPlayerIcon,
                containerTypeName,
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
                viewAll: false,
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

        const _redeemedAssetsMap = redeemedAssets.reduce(
            (acc: { [key: string]: VODEntitlement }, val: VODEntitlement) => {
                acc[val.serviceID] = val;
                return acc;
            },
            {},
        );

        // Curate assets for all the my_content carousels
        const recentlyRedeemedAssets = redeemedAssets;
        const bookmarkAssets = bookmarks
            .map(bmk => mixin(_redeemedAssetsMap[bmk.itemId], bmk))
            .filter(Boolean) as VODEntitlement[];
        const expiringSoonAssets = redeemedAssets
            .filter(asset => isExpiringIn(asset, EXPIRING_SOON_DAYS_THRESHOLD))
            .map(asset => mixinAllContents(asset, bookmarks))
            .sort(sortByExpiringAscending);
        // const expiringSoonAssets = redeemedAssets
        //     .filter(asset => isExpiringIn(asset, EXPIRING_SOON_DAYS_THRESHOLD))
        //     .sort(sortByExpiringAscending);
        // const redeemedMovies = redeemedAssets.filter(asset => asset.assetType === Category.Movie);
        // const redeemedShows = redeemedAssets
        //     .filter(asset => asset.assetType === Category.TVEpisode)
        //     .sort(sortByExpiringDescending);
        // const redeemedShorts = redeemedAssets
        // .filter(asset => asset.assetType === Category.Short);
        const redeemedMovies = redeemedAssets
            .filter(asset => asset.assetType === Category.Movie)
            .map(asset => mixinAllContents(asset, bookmarks));
        const redeemedShows = redeemedAssets
            .filter(asset => asset.assetType === Category.TVEpisode)
            .map(asset => mixinAllContents(asset, bookmarks))
            .sort(sortByExpiringDescending);
        const redeemedShorts = redeemedAssets
            .filter(asset => asset.assetType === Category.Short)
            .map(asset => mixinAllContents(asset, bookmarks));

        setContinueWatchingAssets(bookmarkAssets);
        setRedeemedAssetsMap(_redeemedAssetsMap);

        // Fetch meta-data for all the carousel items
        const containers: (ContainerVm | undefined)[] = await Promise.all([
            containerForAssets({
                assets: recentlyRedeemedAssets,
                name: strings['my_content.recently_redeemed'],
                id: '0',
                maxResources: MAX_RECENTLY_REDEEMED_ITEMS,
                showContainer: showRecentlyRedeemed,
                showFooterTitle: true,
            }),
            containerForAssets({
                assets: bookmarkAssets,
                name: strings['my_content.continue_watching'],
                id: '1',
                maxResources: bookmarkAssets.length,
                continueWatching: true,
                containerTypeName: 'continueWatching',
                showContainer: showContinueWatching,
                showFooterTitle: true,
                showPlayerIcon: true,
            }),
            containerForAssets({
                assets: expiringSoonAssets,
                name: strings['my_content.exipiring_soon'],
                id: '2',
                maxResources: expiringSoonAssets.length,
                continueWatching: true,
                showContainer: showExpiringSoon,
                showFooterTitle: true,
            }),
            containerForAssets({
                assets: redeemedMovies,
                name: strings['my_content.redeemed_movies'],
                id: '3',
                maxResources: MAX_YOUR_CONTENT_ITEMS,
                continueWatching: true,
                showContainer: showYourMovies,
            }),
            containerForAssets({
                assets: redeemedShows,
                name: strings['my_content.redeemed_shows'],
                id: '4',
                maxResources: MAX_YOUR_CONTENT_ITEMS,
                continueWatching: true,
                showContainer: showYourTV,
            }),
            containerForAssets({
                assets: redeemedShorts,
                name: strings['my_content.redeemed_shorts'],
                id: '5',
                maxResources: MAX_YOUR_CONTENT_ITEMS,
                continueWatching: true,
                showContainer: showYourShorts,
            }),
        ]);

        // Filter empty containers
        const filteredContainers: ContainerVm[] = containers.filter(
            c => c && c.resources && c.resources.length > 0,
        ) as ContainerVm[];

        if (!isMounted.current) {
            return;
        }

        setState({
            ...state,
            loading: false,
            containers: filteredContainers,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containerForAssets, strings, state, bookmarks, redeemedAssets]);

    useFocusEffect(
        useCallback(() => {
            if (!loadingUserData) {
                fetchMyContent();
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [loadingUserData, redeemedAssets.length, bookmarks]),
    );

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
            const showPlayerIcon =
                container.resources && container.resources.length > 0 ? container.resources[0].showPlayerIcon : true;
            const containerTypeName =
                container.resources && container.resources.length > 0 ? container.resources[0].containerTypeName : '';
            const resources = await fetchResources(
                assetIds,
                container.continueWatching,
                undefined,
                container.name,
                container.size === 'large',
                showPlayerIcon,
                containerTypeName,
            );
            if (!resources) {
                return;
            }

            if (!isMounted.current) {
                return;
            }

            setState({
                ...state,
                containers: state.containers.map(c => {
                    if (c.id === container.id) {
                        return {
                            ...container,
                            lazyLoading: false,
                            pageNumber: container.pageNumber ? container.pageNumber + 1 : 1,
                            resources: [
                                ...(container.resources ? container.resources : []),
                                ...(resources ? resources : []),
                            ],
                        };
                    } else {
                        return c;
                    }
                }),
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [fetchResources, state],
    );
    return { ...state, reload, reset, loadMoreResources };
};
