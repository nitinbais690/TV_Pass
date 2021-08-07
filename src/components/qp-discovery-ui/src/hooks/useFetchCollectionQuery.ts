import { useEffect, useState, useRef, useContext } from 'react';
import { CatalogDataResponse, ResourceResponse } from '../models/Storefront.types';
import { ResourceVm, ContainerVm } from '../models/ViewModels';
import { containerAdapter, metaDataResourceAdapter } from '../models/Adapters';
import { fetchStorefrontCollections } from 'qp-discovery-ui/src/api/actions/fetchDiscoveryResource';
import { ClientContext } from 'react-fetching-library';
import { ContainerHookResponse } from './ContainerHookResponse';
import { queryString } from '../utils/URLBuilder';
import { ScreenOrigin } from 'utils/ReportingUtils';

interface State {
    hasMore: boolean;
    error: boolean;
    errorObject: any;
    loading: boolean;
    pageNumber: number;
    containers: ContainerVm[] | undefined;
    resources: ResourceVm[] | undefined;
}

/**
 * Supports fetching and paging storefront collections and grid style collections.
 *
 * For storefront collections paging:
 *    - supports paging through containers and load a fixed set of resources per container
 *
 * For grid style collections:
 *    - supports paging through the resources of the initial container
 *    - the contents of page 1 are fetched via Catalog Service (Storefront Facade)
 *    - Rest of the pages are fetched directly using the underying datasource
 *
 * @param  {string} storefrontId The storefront id for which the catalog must be fetched.
 * @param  {string} tabId The tab id for which the catalog must be fetched.
 * @param  {number} pageSize The number of elements to be fetched in one page
 * @returns {ContainerHookResponse} The processed response for the custom hook.
 */
export const useFetchCollectionQuery = (
    collectionId: string,
    collectionTitle: string,
    pageSize: number,
    isInternetReachable: boolean | null,
    gridMode?: boolean,
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
        resources: undefined,
    };

    const [state, setState] = useState<State>(initialState);

    const handleCollectionQuery = async (pageNumber: number): Promise<void> => {
        const action = fetchStorefrontCollections(collectionId, { pageNumber: pageNumber, pageSize: pageSize });
        const { error, errorObject, payload } = await query<CatalogDataResponse>(action);
        let resources: ResourceVm[] | undefined;
        const containers =
            (payload &&
                payload.data &&
                payload.data.map(container => {
                    return containerAdapter(
                        container,
                        undefined,
                        undefined,
                        undefined,
                        ScreenOrigin.COLLECTION,
                        collectionId,
                        collectionTitle,
                    );
                })) ||
            [];
        if (containers && containers.length > 0) {
            resources = containers[0].resources;
        }

        const totalContainers = (payload && payload.header && payload.header.count) || 0;
        let hasMore = false;
        if (gridMode && containers && containers.length > 0) {
            hasMore = containers[0].contentCount === 0;
        } else if (totalContainers) {
            hasMore = pageSize * pageNumber < totalContainers;
        }

        if (isMounted.current) {
            setState({
                ...state,
                hasMore: hasMore,
                loading: false,
                error: error,
                errorObject: errorObject,
                resources: resources,
                containers: [...(pageNumber !== 1 && state.containers ? state.containers : []), ...containers],
                pageNumber: pageNumber + 1,
            });
        }
    };

    const handleResourcePaginationQuery = async (pageNumber: number): Promise<void> => {
        const endpoint = state.containers && state.containers.length > 0 && state.containers[0].contentUrl;
        if (!endpoint) {
            return;
        }

        const ps = state.resources && state.resources.length / (pageNumber - 1);
        if (!ps) {
            return;
        }

        const queryParams = queryString({ pageNumber: pageNumber, pageSize: ps });
        const queryDelimiter = endpoint.includes('?') ? '&' : '?';
        const { payload, error, errorObject } = await query<ResourceResponse>({
            method: 'GET',
            endpoint: `${endpoint}${queryDelimiter}${queryParams}`,
        });

        const resources =
            (payload &&
                payload.data &&
                payload.data.map(content => {
                    return metaDataResourceAdapter(
                        content,
                        ScreenOrigin.COLLECTION,
                        state.containers && state.containers[0],
                    );
                })) ||
            [];

        let hasMore = false;
        if (payload && payload.header) {
            const header = payload.header;
            hasMore = header.start + header.rows < header.count;
        }

        if (isMounted.current) {
            setState({
                ...state,
                hasMore: hasMore,
                loading: false,
                error: error,
                errorObject: errorObject,
                resources: [...(pageNumber !== 1 && state.resources ? state.resources : []), ...resources],
                pageNumber: pageNumber + 1,
            });
        }
    };

    const handleQuery = async (pageNumber: number): Promise<void> => {
        if (!isMounted.current) {
            return;
        }

        if (gridMode && pageNumber > 1) {
            await handleResourcePaginationQuery(pageNumber);
        } else {
            await handleCollectionQuery(pageNumber);
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
    }, [collectionId, pageSize, isInternetReachable]);

    const loadMore = (pn: number): Promise<void> => handleQuery(pn);
    const reload = (): Promise<void> => handleQuery(1);

    return {
        loading: state.loading,
        error: state.error,
        errorObject: state.errorObject,
        containers: state.containers || [],
        resources: state.resources || [],
        pageOffset: state.pageNumber,
        hasMore: state.hasMore,
        loadMore: loadMore,
        reload: reload,
    };
};
