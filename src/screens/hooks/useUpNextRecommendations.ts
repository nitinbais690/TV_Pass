import { useEffect, useContext, useState, useRef, useCallback } from 'react';
import { ClientContext } from 'react-fetching-library';
import _ from 'lodash';
import moment from 'moment';
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
    } = useUserData();
    const { query } = useContext(ClientContext);
    const [state, setState] = useState<State>(initialState);

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

            const end = moment(parseInt(asset.validityEndDate, 10));
            const now = moment();
            const expiresInHours = end.diff(now, 'hours');
            const expiresInDays = expiresInHours / 24;
            const days = Math.max(Math.ceil(expiresInDays), 1);
            let key = strings.formatString(strings['my_content.expires_in_days'], days);
            if (days === 1) {
                key = strings['my_content.expires_in_day'];
            }
            return key as string;
        },
        [strings],
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
            const MAX_UP_NEXT_ITEMS = (appConfig && appConfig.maxUpNextItems) || 30;
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

                const resourceIds = resources.map(r => r.id);
                const bookmarkIds = bookmarks.map(b => b.itemId);
                const redeemedIds = redeemedAssets.map(r => r.serviceID);

                // 1. Find already redeemed but not watched contents
                // 2. Prefer already redeemed and not watched contents over other up next recommendations
                const preferredIds = _.intersection(resourceIds, _.difference(redeemedIds, bookmarkIds));
                if (preferredIds.length > 0) {
                    return mixinRedeemed(resources.find(r => r.id === preferredIds[0]));
                }

                // If none of the up-next recommendations matched already redeemed contents,
                // then pick one of the recommendations
                return mixinRedeemed(resources[0]);
            }

            return undefined;
        };

        // const fetchSomethingNewItem = async (res: ResourceVm, excludes?: [string]) => {
        //     const upNextAction = createUpNextAction({ type: 'SomethingNew', res: res, pageSize: 1, excludes });
        //     const { payload, error, errorObject } = await query<ResourceResponse>(upNextAction);
        //     const resources =
        //         payload &&
        //         payload.data &&
        //         payload.data.map(content => {
        //             return {
        //                 ...metaDataResourceAdapter(content),
        //                 get title() {
        //                     return this.seriesTitle ? this.seriesTitle : this.name;
        //                 },
        //                 get subtitle() {
        //                     return this.seasonNumber && this.episodeNumber
        //                         ? `S${this.seasonNumber} E${this.episodeNumber}: ${this.name}`
        //                         : undefined;
        //                 },
        //             } as ResourceVm;
        //         });

        //     if (error) {
        //         console.debug('>>>>> error fetching resources', error, errorObject);
        //         return undefined;
        //     }

        //     if (resources && resources.length >= 1) {
        //         return mixinRedeemed(resources[0]);
        //     }

        //     return undefined;
        // };

        const fetchUpNextItems = async (res: ResourceVm) => {
            const upNext = await fetchUpNextItem(res);
            // const somethingNew = await fetchSomethingNewItem(
            //     res,
            //     upNext ? [upNext.seriesId ? upNext.seriesId : upNext.id] : undefined,
            // );

            if (isMounted.current) {
                setState({
                    ...state,
                    loading: false,
                    upNext,
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
