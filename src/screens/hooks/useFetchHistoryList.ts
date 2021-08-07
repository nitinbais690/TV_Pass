import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from 'contexts/AuthContextProvider';
import { useEntitlements } from 'contexts/EntitlementsContextProvider';
import { DiscoveryActionExt, metaDataResourceAdapter, fetchContentIdsLookup, Data, ResourceVm } from 'qp-discovery-ui';
import { ClientContext } from 'react-fetching-library';
import { isSuccess as isFLMSuccess, PlatformResponse } from 'utils/FirstlightAPIUtils';
import { useFocusEffect } from '@react-navigation/native';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import { useFLPlatform } from 'platform/PlatformContextProvider';
import { AuthorizationToken } from 'rn-qp-nxg-player';

export interface UsageServiceRecord {
    group: string;
    value: number;
}

interface State {
    hasMore: boolean;
    error: boolean;
    errorObject: any;
    loading: boolean;
    historyList: any[];
}

const initialState: State = {
    hasMore: false,
    error: false,
    errorObject: undefined,
    loading: true,
    historyList: [],
};

export const useFetchHistoryList = () => {
    const isMounted = useRef(true);
    const { isInternetReachable } = useNetworkStatus();
    const { state: platformState } = useFLPlatform();
    const { isConfigured: isPlatformConfigured, error: platformError, platformAuthorizer } = platformState;
    const { accessToken } = useAuth();
    let { xAuthToken } = useEntitlements();
    const { query } = useContext(ClientContext);
    const [state, setState] = useState<State>(initialState);
    const platformAuth = useRef(platformAuthorizer);

    useEffect(() => {
        platformAuth.current = platformAuthorizer;
    }, [platformAuthorizer]);

    const getHistoryList = useCallback(async (): Promise<any[]> => {
        if (!platformAuth.current) {
            return [];
        }
        const authToken: AuthorizationToken = await platformAuth.current.ensureAuthorization();
        const headers = {
            Authorization: `Bearer ${authToken.accessToken}`,
            'X-Authorization': xAuthToken || '',
        };

        const action: DiscoveryActionExt = {
            method: 'GET',
            endpoint: 'list',
            params: { pageSize: 25 },
            headers: headers,
            clientIdentifier: 'history',
        };

        const { payload, errorObject } = await query(action);

        if (errorObject || !isFLMSuccess(payload)) {
            return [];
        }

        return payload && payload.data;
    }, [query, xAuthToken]);

    const fetchHistory = useCallback(async (): Promise<any[]> => {
        const historyList = await getHistoryList();

        if (!historyList) {
            return [];
        }

        const assetIds = historyList.map(a => a.itemId);
        if (assetIds.length <= 0) {
            return [];
        }

        const action = fetchContentIdsLookup(assetIds);
        const { payload, error } = await query<PlatformResponse<Data[]>>(action);
        if (error || !isFLMSuccess(payload) || !payload) {
            return [];
        }
        const resources =
            payload.data &&
            payload.data.map(res => {
                return {
                    ...metaDataResourceAdapter(res),
                    showFooterTitles: true,
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

        return resources;
    }, [getHistoryList, query]);

    const fetchUsageHistory = useCallback(async () => {
        let historyList: any[] = [];

        try {
            historyList = await fetchHistory();
        } catch (e) {
            if (!isMounted.current) {
                return;
            }

            setState({
                ...state,
                historyList: historyList,
                loading: false,
                error: true,
                errorObject: e,
            });
            return;
        }

        setState({
            ...state,
            loading: false,
            historyList: historyList,
        });
    }, [state, fetchHistory]);

    useFocusEffect(
        useCallback(() => {
            isMounted.current = true;

            if (isInternetReachable === false) {
                setState({
                    ...state,
                    error: isInternetReachable === false,
                });
            }

            if (isPlatformConfigured || platformError) {
                fetchUsageHistory();
            }

            return () => {
                isMounted.current = false;
            };

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [accessToken, isPlatformConfigured, platformError, isInternetReachable]),
    );

    return { ...state };
};
