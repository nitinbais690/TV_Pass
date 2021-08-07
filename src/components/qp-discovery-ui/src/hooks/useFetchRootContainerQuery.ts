import { useMemo } from 'react';
import { useQuery } from 'react-fetching-library';
import { fetchStorefrontTabs } from '../api/actions/fetchDiscoveryResource';
import { tabAdapter } from '../models/Adapters';
import { StorefrontTabResponse } from '../models/Storefront.types';
import { TabVm } from '../models/ViewModels';

export interface TabHookResponse {
    loading: boolean;
    error: boolean;
    errorObject?: any;
    containers: TabVm[];
    reload: () => Promise<any>;
    reset: () => void;
}

/**
 * Custom Hook to fetch catalog container.
 *
 * @param  {string} containerId The navigation container for which the catalog must be fetched.
 * @returns {ContainerHookResponse} The processed response for the custom hook.
 */
export const useFetchRootContainerQuery = (containerId: string): TabHookResponse => {
    const action = useMemo(() => fetchStorefrontTabs(containerId), [containerId]);
    const { loading, error, errorObject, payload, query, reset } = useQuery<StorefrontTabResponse>(action);

    const containers =
        payload &&
        payload.data &&
        payload.data.map(tab => {
            return tabAdapter(tab);
        });

    return {
        loading: loading,
        error: error,
        errorObject: errorObject,
        containers: containers || [],
        reload: query,
        reset: reset,
    };
};
