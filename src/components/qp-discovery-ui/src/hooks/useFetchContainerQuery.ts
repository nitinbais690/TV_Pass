import { useEffect, useState, useRef, useContext } from 'react';
import { ClientContext } from 'react-fetching-library';
import { fetchStorefrontContainers as fetchStorefrontContainersAction } from '../api/actions/fetchDiscoveryResource';
import { containerAdapter } from '../models/Adapters';
import { CatalogDataResponse } from '../models/Storefront.types';
import { ContainerHookResponse } from './ContainerHookResponse';
import { ContainerVm } from '../models/ViewModels';
import { ScreenOrigin } from 'utils/ReportingUtils';

interface State {
    hasMore: boolean;
    error: boolean;
    errorObject: any;
    loading: boolean;
    pageNumber: number;
    containers: ContainerVm[] | undefined;
}

/**
 * Custom Hook to fetch catalog container.
 *
 * @param  {string} storefrontId The storefront id for which the catalog must be fetched.
 * @param  {string} tabId The tab id for which the catalog must be fetched.
 * @param  {number} pageSize The number of elements to be fetched in one page
 * @returns {ContainerHookResponse} The processed response for the custom hook.
 */
export const useFetchContainerQuery = (
    storefrontId: string,
    tabId: string,
    tabName: string,
    pageSize: number,
    isInternetReachable: boolean | null,
): ContainerHookResponse => {
    const isMounted = useRef(true);
    const { query } = useContext(ClientContext);

    const initialState: State = {
        hasMore: false,
        error: false,
        errorObject: undefined,
        loading: true,
        pageNumber: 1,
        containers: undefined,
    };
    const [state, setState] = useState<State>(initialState);

    const handleQuery = async (pageNumber: number): Promise<void> => {
        if (!isMounted.current) {
            return;
        }

        const action = fetchStorefrontContainersAction({
            sfid: storefrontId,
            tid: tabId,
            pageNumber: pageNumber,
            pageSize: pageSize,
        });
        const { error, errorObject, payload } = await query<CatalogDataResponse>(action);
        const containers =
            (payload &&
                payload.data &&
                payload.data.map(container => {
                    return containerAdapter(container, storefrontId, tabId, tabName, ScreenOrigin.BROWSE);
                })) ||
            // Note: Removing Personalized containers for now
            [];

        const totalContainers = (payload && payload.header && payload.header.count) || 0;
        let hasMore = false;
        if (totalContainers) {
            hasMore = pageSize * pageNumber < totalContainers;
        }

        if (isMounted.current) {
            setState({
                ...state,
                hasMore: hasMore,
                loading: false,
                error: error,
                errorObject: errorObject,
                containers: [...(pageNumber !== 1 && state.containers ? state.containers : []), ...containers],
                pageNumber: pageNumber + 1,
            });
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
    }, [storefrontId, tabId, pageSize, isInternetReachable]);

    const loadMore = (pn: number): Promise<void> => handleQuery(pn);
    const reload = (): Promise<void> => handleQuery(1);
    const reset = async () => {
        setState({
            ...initialState,
            error: isInternetReachable === false,
        });
    };

    return {
        loading: state.loading,
        error: state.error,
        errorObject: state.errorObject,
        containers: state.containers || [],
        pageOffset: state.pageNumber,
        hasMore: state.hasMore,
        loadMore: loadMore,
        reload: reload,
        reset: reset,
    };
};
