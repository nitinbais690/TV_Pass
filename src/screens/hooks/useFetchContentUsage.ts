import { useAuth } from 'contexts/AuthContextProvider';
import { useEntitlements } from 'contexts/EntitlementsContextProvider';
import { DiscoveryActionExt, ResourceVm, metaDataResourceAdapter, fetchContentIdsLookup } from 'qp-discovery-ui';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ClientContext } from 'react-fetching-library';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { isSuccess as isFLMSuccess, error as flmError } from 'utils/FirstlightAPIUtils';
import { useFocusEffect } from '@react-navigation/native';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import { useFLPlatform } from 'platform/PlatformContextProvider';
import { AuthorizationToken } from 'rn-qp-nxg-player';
import moment from 'moment';
import { fetchContentLookup } from 'qp-discovery-ui/src/api/actions/fetchDiscoveryResource';
import { relatedUsageQuery } from 'utils/RelatedUtils';

export interface UsageRecord {
    group: string;
    value: number;
}

interface State {
    hasMore: boolean;
    error: boolean;
    errorObject: any;
    loading: boolean;
    usageRecords: UsageRecord[];
    recommendedContent: ResourceVm[];
}

const initialState: State = {
    hasMore: false,
    error: false,
    errorObject: undefined,
    loading: true,
    usageRecords: [],
    recommendedContent: [],
};

export const useFetchContentUsage = () => {
    const isMounted = useRef(true);
    const { appConfig } = useAppPreferencesState();
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

    const fetchCreditsUsed = useCallback(async (): Promise<UsageRecord[]> => {
        const endPoint = 'aggregate/sum/credits';

        if (!platformAuth.current) {
            return [];
        }
        const authToken: AuthorizationToken = await platformAuth.current.ensureAuthorization();
        const date = moment()
            .subtract(1, 'months')
            .toISOString();
        const fromDate = date.replace(/\.\d+/, '');
        const headers = {
            Authorization: `Bearer ${authToken.accessToken}`,
            'X-Authorization': xAuthToken || '',
        };
        const params = {
            groupBy: 'genre',
            pageNumber: 1,
            fromDate: fromDate,
            period: 'm',
        };

        const action: DiscoveryActionExt = {
            method: 'GET',
            endpoint: endPoint,
            headers: headers,
            params: params,
            clientIdentifier: 'usage',
        };

        const { payload, errorObject } = await query(action);
        if (errorObject) {
            throw errorObject;
        }

        if (!isFLMSuccess(payload)) {
            throw flmError(payload);
        }

        return payload && payload.data.slice(0, 5);
    }, [query, xAuthToken]);

    const getDataByGenre = useCallback(
        async (genre: string) => {
            const finalQuery = relatedUsageQuery(appConfig, 1, genre);
            const action = fetchContentLookup(finalQuery, 1, 1);
            const { payload, error } = await query(action);
            if (error || !isFLMSuccess(payload)) {
                return [];
            }

            return payload && payload.data;
        },
        [appConfig, query],
    );

    const fetchRecommendedContent = useCallback(
        async (genre: string) => {
            const genereData = await getDataByGenre(genre);
            if (!genereData) {
                return [];
            }
            const assetIds = genereData.map(a => a.id);
            if (assetIds.length <= 0) {
                return [];
            }
            const action = fetchContentIdsLookup(assetIds);
            const { payload, error } = await query(action);
            if (error || !isFLMSuccess(payload)) {
                return [];
            }

            const resources = payload && payload.data && payload.data.map(res => metaDataResourceAdapter(res));
            return resources;
        },
        [getDataByGenre, query],
    );

    const fetchUsageContent = useCallback(async () => {
        let usageRecords: UsageRecord[] = [];
        let recommendedContent: ResourceVm[] = [];

        try {
            usageRecords = await fetchCreditsUsed();
            if (usageRecords.length > 0) {
                recommendedContent = await fetchRecommendedContent(usageRecords[0].group);
            }
        } catch (e) {
            if (!isMounted.current) {
                return;
            }

            setState({
                ...state,
                usageRecords: usageRecords,
                recommendedContent: recommendedContent,
                loading: false,
                error: true,
                errorObject: e,
            });
            return;
        }

        setState({
            ...state,
            loading: false,
            usageRecords: usageRecords,
            recommendedContent: recommendedContent,
        });
    }, [state, fetchCreditsUsed, fetchRecommendedContent]);

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
                fetchUsageContent();
            }

            return () => {
                isMounted.current = false;
            };

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [accessToken, isPlatformConfigured, platformError, isInternetReachable]),
    );

    return { ...state };
};
