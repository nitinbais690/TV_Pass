import { useCallback, useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ResourceVm } from 'qp-discovery-ui';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import { useAuth } from 'contexts/AuthContextProvider';
import { useEntitlements } from 'contexts/EntitlementsContextProvider';
import diContainer from 'di/di-config';
import { FetchWatchList, FetchWatchListParams } from 'features/watch-list/domain/use-cases/fetch-watch-list';
import { WATCHLIST_DI_TYPES } from 'features/watch-list/di/watchlist-di-types';
import {
    RemoveAllWatchList,
    RemoveAllWatchListParams,
} from 'features/watch-list/domain/use-cases/remove-all-watch-list';
import {
    RemoveSingleWatchList,
    RemoveSingleWatchListParams,
} from 'features/watch-list/domain/use-cases/remove-single-watch-list';

export interface State {
    hasMore: boolean;
    error: boolean;
    errorObject: any;
    loading: boolean;
    resources: ResourceVm[] | undefined;
}

const initialState: State = {
    hasMore: false,
    error: false,
    errorObject: undefined,
    loading: true,
    resources: [],
};

export const useFetchWatchList = () => {
    const isMounted = useRef(true);
    const pageNumber = useRef(1);
    const resources = useRef<ResourceVm[]>();
    const { isInternetReachable } = useNetworkStatus();
    const { flAuthToken } = useAuth();
    const { xAuthToken } = useEntitlements();

    const [state, setState] = useState<State>(initialState);
    const RESOURCES_PAGE_SIZE = 12;

    const setLoading = useCallback(
        (isLoading: boolean) => {
            setState({
                ...state,
                loading: isLoading,
            });
        },
        [state], //state
    );

    const fetchResources = useCallback(async () => {
        if (flAuthToken && xAuthToken) {
            setLoading(true);
            let fetchWatchList = diContainer.get<FetchWatchList>(WATCHLIST_DI_TYPES.FetchWatchList);
            const response = await fetchWatchList.execute(
                new FetchWatchListParams(flAuthToken, xAuthToken, pageNumber.current, RESOURCES_PAGE_SIZE),
            );
            const prev = resources.current ? resources.current : [];
            if (response && response.length > 0) {
                const hasMore = response.length === RESOURCES_PAGE_SIZE;
                resources.current = [...prev, ...response];

                setState({
                    ...state,
                    loading: false,
                    resources: resources.current,
                    hasMore: hasMore,
                });
            } else {
                setState({
                    ...state,
                    loading: false,
                    hasMore: false,
                });
                const pageNo = pageNumber.current > 1 ? pageNumber.current - 1 : 1;
                pageNumber.current = pageNo;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // setLoading, state,pageNumber.current , fetchResources,

    // useEffect(() => {
    //     fetchResources();
    // }, [fetchResources]); // flAuthToken, xAuthToken

    const removeAllResource = useCallback(async () => {
        if (flAuthToken && xAuthToken) {
            setLoading(true);
            let removeAllWatchList = diContainer.get<RemoveAllWatchList>(WATCHLIST_DI_TYPES.RemoveAllWatchList);
            await removeAllWatchList.execute(new RemoveAllWatchListParams(flAuthToken, xAuthToken));
            setState({
                ...state,
                resources: [],
                loading: false,
            });
        }
    }, [flAuthToken, setLoading, state, xAuthToken]);

    const removeSingleResource = useCallback(
        async (resouceId: string) => {
            if (flAuthToken && xAuthToken && resouceId) {
                if (resources.current) {
                    const index = resources.current.findIndex(res => res.id === resouceId);
                    if (index !== undefined && index > -1) {
                        const resList = resources.current;
                        if (resList) {
                            resList.splice(index, 1);
                            setState({ ...state, loading: false, resources: resList, hasMore: false });
                        }
                    } else {
                        console.debug('Resource id not found');
                    }
                }

                let removeSingleWatchList = diContainer.get<RemoveSingleWatchList>(
                    WATCHLIST_DI_TYPES.RemoveSingleWatchList,
                );
                await removeSingleWatchList.execute(
                    new RemoveSingleWatchListParams(flAuthToken, xAuthToken, resouceId),
                );
            }
        },
        [flAuthToken, state, xAuthToken],
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

            reload();

            return () => {
                isMounted.current = false;
            };

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [isInternetReachable]),
    );

    const reload = async () => {
        setState({
            ...initialState,
        });
        pageNumber.current = 1;
        resources.current = [];
        fetchResources();
    };
    const reset = async () => {
        setState({
            ...initialState,
            error: isInternetReachable === false,
        });
    };

    const loadMoreResources = useCallback(
        async () => {
            let nextPage = pageNumber.current;
            pageNumber.current = ++nextPage;
            fetchResources();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [fetchResources, state],
    );
    return { ...state, reload, reset, loadMoreResources, removeAllResource, removeSingleResource };
};
