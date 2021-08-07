import { useState, useRef, useContext, useEffect, useCallback } from 'react';
import { ClientContext } from 'react-fetching-library';
import useDebounce from './useDebounce';
import { ResourceVm } from '../models/ViewModels';
import { fetchDiscoverySearch } from '../api/actions/fetchDiscoveryResource';
import { ResourceResponse } from 'qp-discovery-ui/src/models/Storefront.types';
import { metaDataResourceAdapter } from 'qp-discovery-ui/src/models/Adapters';
import { ScreenOrigin } from 'utils/ReportingUtils';

export interface DiscoverySearchHookResponse {
    /**
     * Indicates whether the search is still processing
     */
    loading: boolean;
    /**
     * Indicates an error has occurred, if true
     */
    error: boolean;
    /**
     * The actual error, when in error state
     */
    errorObject?: any;
    /**
     * The list of matching resources found for the search query
     */
    resources: ResourceVm[];
    /**
     * The list of default resources to return incase of no results found for user search key
     */
    noSearchResources: ResourceVm[];
    /**
     * Indicates if more matching results are available
     */
    hasMore?: boolean;
    /**
     * A function that allows loading subsequent pages of the matching search results
     */
    loadMore?: () => Promise<void>;
    /**
     * The total number of matching resources found
     */
    totalSearchResults?: number;
    /**
     * Indicates there is no search result available for search key
     */
    isSearchNotFound?: boolean;
}

/**
 * A custom hook that queries CDS to fetch matching results for the given search query.
 * The hooks also supports pagination.
 *
 * @param searchTerm The search term user is looking for.
 * @param debounceDelay Time in millis, by which the search should be debounced. Default: 300.
 * @param pageSize The number of results to fetch for each iteration/page.
 */
export const useDiscoverySearch = (
    searchMode: string,
    searchUrl: string,
    noSearchResultsURL: string,
    searchTerm: string,
    debounceDelay: number = 300,
    pageSize: number,
): DiscoverySearchHookResponse => {
    var pageNumber = useRef(0);
    const [error, setError] = useState(false);
    const [errorObject, setErrorObject] = useState();
    const [loading, setLoading] = useState(true);
    const [isSearchNotFound, setIsSearchNotFound] = useState(false);
    const [resources, setResources] = useState<ResourceVm[]>([]);
    const [noSearchResources, setNoSearchResources] = useState<ResourceVm[]>([]);
    const [hasMore, setHasMore] = useState(false);
    const { query } = useContext(ClientContext);
    const isMounted = useRef(true);
    const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

    const noSearchResultsQuery = useCallback(async (): Promise<void> => {
        const { payload, error: err, errorObject: errObj } = await query<ResourceResponse>({
            method: 'GET',
            endpoint: noSearchResultsURL,
        });
        setNoSearchResources([]);
        const defaultResource =
            payload &&
            payload.data &&
            payload.data.map(content => {
                return metaDataResourceAdapter(content, ScreenOrigin.SEARCH);
            });

        if (isMounted.current) {
            const totalSearchResults = payload && payload.header.count;
            if (totalSearchResults) {
                setHasMore(pageSize * pageNumber.current < totalSearchResults);
            }

            setLoading(false);
            setError(err);
            setErrorObject(errObj);

            if (defaultResource) {
                setNoSearchResources(prev => [...prev, ...defaultResource]);
            }
        }
    }, [noSearchResultsURL, pageSize, query]);

    const handleQuery = useCallback(async (): Promise<void> => {
        if (!isMounted.current) {
            return;
        }
        pageNumber.current++;
        const action = fetchDiscoverySearch(debouncedSearchTerm, pageNumber.current, pageSize);
        const { payload, error: err, errorObject: errObj } = await query<ResourceResponse>(action);
        const resource =
            payload &&
            payload.data &&
            payload.data.map(content => {
                return metaDataResourceAdapter(content, ScreenOrigin.SEARCH);
            });

        if (resource) {
            if (isMounted.current) {
                const totalSearchResults = payload && payload.header.count;
                if (totalSearchResults) {
                    setHasMore(pageSize * pageNumber.current < totalSearchResults);
                }
                setLoading(false);
                setError(err);
                setErrorObject(errObj);
                if (resource) {
                    setResources(prev => [...prev, ...resource]);
                    setIsSearchNotFound(false);
                }
            }
        } else {
            setIsSearchNotFound(true);
            noSearchResultsQuery();
        }
    }, [debouncedSearchTerm, noSearchResultsQuery, pageSize, query]);

    useEffect(() => {
        isMounted.current = true;
        resources.length = 0;
        pageNumber.current = 0;
        setHasMore(false);
        setIsSearchNotFound(false);

        if (searchMode === 'recommended') {
            if (noSearchResources.length === 0) {
                setLoading(true);
                pageNumber.current++;
                noSearchResultsQuery();
            } else {
                setLoading(false);
            }
        } else {
            setLoading(true);
            handleQuery();
        }
        return () => {
            isMounted.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, searchUrl]);

    const loadMore = (): Promise<void> => {
        if (searchMode === 'recommended') {
            pageNumber.current++;
            return noSearchResultsQuery();
        } else {
            return handleQuery();
        }
    };

    return {
        loading: loading,
        error: error,
        errorObject: errorObject,
        resources: resources || [],
        noSearchResources: noSearchResources || [],
        hasMore: hasMore,
        loadMore: loadMore,
        isSearchNotFound: isSearchNotFound,
    };
};
