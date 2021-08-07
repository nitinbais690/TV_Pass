import { useEffect, useContext, useState, useRef, useCallback } from 'react';
import { ClientContext } from 'react-fetching-library';
import _ from 'lodash';
import {
    ResourceResponse,
    metaDataResourceAdapter,
    createAction,
    DiscoveryActionExt,
    ResourceVm,
    Category,
} from 'qp-discovery-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { VODEntitlement, useUserData } from 'contexts/UserDataContextProvider';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import { useAuth } from 'contexts/AuthContextProvider';
import { getRedeemExpiringIn } from 'utils/RedeemedUtils';

interface State {
    error: boolean;
    errorObject: any;
    loading: boolean;
    upNext?: ResourceVm;
    somethingNew?: ResourceVm;
}

const initialState: State = {
    error: false,
    errorObject: undefined,
    loading: true,
    upNext: undefined,
    somethingNew: undefined,
};

export const useUpNextRecommendations = (resource: ResourceVm) => {
    const isMounted = useRef(true);
    const { isInternetReachable } = useNetworkStatus();
    const { strings, appLanguage } = useLocalization();
    const { appConfig } = useAppPreferencesState();
    const {
        loading: loadingUserData,
        error: userDataError,
        errorObject: userDataErrorObject,
        bookmarks,
        redeemedAssets,
        reload,
    } = useUserData();
    const { query } = useContext(ClientContext);
    const [state, setState] = useState<State>(initialState);
    const { accountProfile } = useAuth();

    type UpNextType = 'UpNext' | 'SomethingNew';

    const createUpNextAction = ({
        type,
        res,
        pageSize,
        excludes,
    }: {
        type: UpNextType;
        res: ResourceVm;
        pageSize: number;
        excludes?: [string];
    }): DiscoveryActionExt => {
        const genres = (res.contentGenre && res.contentGenre[appLanguage]) || [];
        return createAction({
            endpoint: '/upnext',
            clientIdentifier: 'metadata',
            params: {
                g: genres.join(','),
                cty: res.type,
                id: res.id,
                pageSize: pageSize,
                ...(type === 'UpNext' && {
                    pn: res.providerName,
                }),
                ...(res.type === Category.TVEpisode && {
                    id: res.seriesId,
                    snum: res.seasonNumber,
                    epnum: res.episodeNumber,
                    pageSize: 1,
                }),
                ...(excludes && {
                    exclude: excludes.join(','),
                }),
            },
        });
    };

    const expiresIn = useCallback(
        (asset?: VODEntitlement): string | undefined => {
            if (!asset) {
                return;
            }
            let expireDays = getRedeemExpiringIn(parseInt(asset.validityEndDate, 10), accountProfile);
            var stringToDisplay =
                expireDays != 1
                    ? strings.formatString(strings['content_detail.redeem_btn.entitled_other'], expireDays)
                    : strings['my_content.expires_in_day'];
            return stringToDisplay.toString();
        },
        [accountProfile, strings],
    );

    useEffect(() => {
        isMounted.current = true;

        const mixinRedeemed = (res?: ResourceVm) => {
            if (!res) {
                return undefined;
            }

            const asset = redeemedAssets.find(r => r.serviceID === res.id);
            return {
                ...res,
                expiresIn: expiresIn(asset),
            };
        };

        const fetchUpNextItem = async (res: ResourceVm) => {
            // Reload userData. Fetches fresh list of bookmarks
            reload();
            const MAX_UP_NEXT_ITEMS = (appConfig && appConfig.maxUpNextItems) || 30;
            const bookmarkDict = bookmarks.reduce(
                (bookmarkDict, bookmark) => ((bookmarkDict[bookmark.itemId] = bookmark.offset), bookmarkDict),
                {},
            );
            const MAX_UP_NEXT_WATCHED_LIMIT = (appConfig && appConfig.maxUpNextWatchLimit) || 0.75;
            const upNextAction = createUpNextAction({ type: 'UpNext', res: res, pageSize: MAX_UP_NEXT_ITEMS });
            const { payload, error, errorObject } = await query<ResourceResponse>(upNextAction);
            const resources =
                payload &&
                payload.data &&
                payload.data.map(content => {
                    return {
                        ...metaDataResourceAdapter(content),
                        get title() {
                            return this.seriesTitle ? this.seriesTitle : this.name;
                        },
                        get subtitle() {
                            return this.seasonNumber && this.episodeNumber
                                ? `S${this.seasonNumber} E${this.episodeNumber}: ${this.name}`
                                : undefined;
                        },
                    } as ResourceVm;
                });

            if (error) {
                console.debug('>>>>> error fetching resources', error, errorObject);
                return undefined;
            }

            if (resources) {
                if (resources.length === 1) {
                    return mixinRedeemed(resources[0]);
                }

                // Note: Contents that have bookmark over the 3/4 or specified limit of the runningTime of
                // the content shluld not be recommended in UpNext
                const filterPartiallyWatched = (resource: ResourceVm) => {
                    const watchedOffset = bookmarkDict[resource.id];
                    if (!watchedOffset) {
                        return false;
                    }
                    if (watchedOffset / 1000 / resource.runningTime < MAX_UP_NEXT_WATCHED_LIMIT) {
                        return resource.id;
                    }
                };
                const resourceBookmarks = resources.filter(resource => filterPartiallyWatched(resource));
                const resourceBookmarkIds = resourceBookmarks.map(r => r.id);
                const resourceIds = resources.map(r => r.id);
                const redeemedIds = redeemedAssets.map(r => r.serviceID);

                // find resource id from the resourceGroup consist of partiallywatched content ids, and redeemds content ids
                const resourceGroupIds = [...new Set([...resourceBookmarkIds, ...redeemedIds, ...resourceIds])];
                const preferredIds = _.intersection(resourceIds, resourceGroupIds);
                let preferredId = preferredIds[_.random(preferredIds.length - 1)];
                if (!preferredId) {
                    preferredId = resourceIds[_.random(resourceIds.length - 1)];
                }
                let prefferedResourse = resources.find(r => r.id === preferredId);
                if (!prefferedResourse) {
                    prefferedResourse = resources[0];
                }
                prefferedResourse.watchedOffset = bookmarkDict[prefferedResourse.id] || 0;
                return mixinRedeemed(prefferedResourse);
            }

            return undefined;
        };

        const fetchSomethingNewItem = async (res: ResourceVm, excludes?: [string]) => {
            const MAX_SOMETHING_NEW_ITEMS = (appConfig && appConfig.maxUpNextItems) || 30;
            const upNextAction = createUpNextAction({
                type: 'SomethingNew',
                res: res,
                pageSize: MAX_SOMETHING_NEW_ITEMS,
                excludes,
            });

            const { payload, error, errorObject } = await query<ResourceResponse>(upNextAction);
            const resources =
                payload &&
                payload.data &&
                payload.data.map(content => {
                    return {
                        ...metaDataResourceAdapter(content),
                        get title() {
                            return this.seriesTitle ? this.seriesTitle : this.name;
                        },
                        get subtitle() {
                            return this.seasonNumber && this.episodeNumber
                                ? `S${this.seasonNumber} E${this.episodeNumber}: ${this.name}`
                                : undefined;
                        },
                    } as ResourceVm;
                });

            if (error) {
                console.debug('>>>>> error fetching resources', error, errorObject);
                return undefined;
            }

            let somethingNewResources;
            const redeemedIds = redeemedAssets.map(r => r.serviceID);
            if (resources && resources.length >= 1) {
                somethingNewResources = resources.filter(res => !redeemedIds.includes(res.id));
                if (somethingNewResources.length > 0) {
                    somethingNewResources[0].watchedOffset = 0;
                    return mixinRedeemed(somethingNewResources[0]);
                }
            }
            return undefined;
        };

        const fetchUpNextItems = async (res: ResourceVm) => {
            const upNext = await fetchUpNextItem(res);
            const somethingNew = await fetchSomethingNewItem(
                res,
                upNext ? [upNext.seriesId ? upNext.seriesId : upNext.id] : undefined,
            );

            if (isMounted.current) {
                setState({
                    ...state,
                    loading: false,
                    upNext,
                    somethingNew,
                });
            }
        };

        if (!loadingUserData) {
            if (userDataError || !isInternetReachable) {
                setState({
                    ...state,
                    loading: false,
                    error: true,
                    errorObject: userDataErrorObject,
                });
            }

            if (isInternetReachable) {
                fetchUpNextItems(resource);
            }
        }

        return () => {
            isMounted.current = false;
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resource.id, loadingUserData, userDataError, isInternetReachable]);

    return { ...state };
};
