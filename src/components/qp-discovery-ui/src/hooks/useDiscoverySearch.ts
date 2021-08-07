import { useState, useRef, useContext, useEffect } from 'react';
import { ClientContext } from 'react-fetching-library';
import useDebounce from './useDebounce';
import { ResourceVm } from '../models/ViewModels';
import { fetchDiscoverySearch } from '../api/actions/fetchDiscoveryResource';
import { ResourceResponse } from 'qp-discovery-ui/src/models/Storefront.types';
import { metaDataResourceAdapter, storefrontResourceAdapter } from 'qp-discovery-ui/src/models/Adapters';
import { ScreenOrigin } from 'utils/ReportingUtils';
import { queryString } from '../utils/URLBuilder';
import { AuthorizationToken } from 'rn-qp-nxg-player';
import { useFLPlatform } from 'platform/PlatformContextProvider';

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
    const [resources, setResources] = useState<ResourceVm[]>([]);
    const [noSearchResources, setNoSearchResources] = useState<ResourceVm[]>([]);
    const [hasMore, setHasMore] = useState(false);
    const { query } = useContext(ClientContext);
    const isMounted = useRef(true);
    const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);
    const { state: platformState } = useFLPlatform();
    const { platformAuthorizer } = platformState;
    const platformAuth = useRef(platformAuthorizer);

    const handleQuery = async (): Promise<void> => {
        if (!isMounted.current) {
            return;
        }
        // Reset, when user clears the text
        if (searchTerm === '') {
            setLoading(false);
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
                    if (pageNumber.current > 1) {
                        setResources(prev => [...prev, ...resource]);
                    } else {
                        setResources(resource);
                    }
                }
            }
        } else {
            if (!noSearchResultsURL) {
                setLoading(false);
                return;
            }
            noSearchResultsURL = noSearchResultsURL.toString();
            const queryParams = queryString({ pageNumber: pageNumber.current, pageSize: pageSize });
            const queryDelimiter = noSearchResultsURL.includes('?') ? '&' : '?';
            const { payload, error: err, errorObject: errObj } = await query<ResourceResponse>({
                method: 'GET',
                endpoint: `${noSearchResultsURL}${queryDelimiter}${queryParams}`,
            });

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
                    if (pageNumber.current > 1) {
                        setNoSearchResources(prev => [...prev, ...defaultResource]);
                    } else {
                        setNoSearchResources(defaultResource);
                    }
                }
            }
        }
    };

    const handleRecommendedQuery = async (): Promise<void> => {
        if (!searchUrl) {
            setLoading(false);
            return;
        }
        const channelResourceUrl = searchUrl.includes('storefront');
        pageNumber.current++;
        if (channelResourceUrl) {
            handleChannelResourceQuery(searchUrl, pageNumber.current);
        } else {
            const queryParams = queryString({ pageNumber: pageNumber.current, pageSize: pageSize });
            const queryDelimiter = searchUrl.includes('?') ? '&' : '?';
            const { payload, error: err, errorObject: errObj } = await query<ResourceResponse>({
                method: 'GET',
                endpoint: `${searchUrl}${queryDelimiter}${queryParams}`,
            });

            const resource =
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
                if (resource) {
                    if (pageNumber.current > 1) {
                        setResources(prev => [...prev, ...resource]);
                    } else {
                        setResources(resource);
                    }
                }
            }
        }
    };

    const handleChannelResourceQuery = async (url: string, pageNumber: number) => {
        if (!platformAuth.current) {
            setLoading(false);
            return;
        }
        const queryParams = queryString({ pageNumber: pageNumber, pageSize: pageSize });
        const queryDelimiter = searchUrl.includes('?') ? '&' : '?';
        const authToken: AuthorizationToken = await platformAuth.current.ensureAuthorization();
        const headers = {
            Authorization: `Bearer ${authToken.accessToken}`,
        };
        const { payload, error: err, errorObject: errObj } = await query<ResourceResponse>({
            method: 'GET',
            endpoint: `${url}${queryDelimiter}${queryParams}`,
            headers: headers,
        });
        const resource =
            payload &&
            payload.data &&
            payload.data.map(content => {
                return storefrontResourceAdapter(content, ScreenOrigin.SEARCH);
            });
        if (isMounted.current) {
            const totalSearchResults = payload && payload.header.count;
            if (totalSearchResults) {
                setHasMore(pageSize * pageNumber < totalSearchResults);
            }
            setLoading(false);
            setError(err);
            setErrorObject(errObj);
            if (resource) {
                if (pageNumber > 1) {
                    setResources(prev => [...prev, ...resource]);
                } else {
                    setResources(resource);
                }
            }
        }
    };

    useEffect(() => {
        isMounted.current = true;
        resources.length = 0;
        noSearchResources.length = 0;
        pageNumber.current = 0;
        setHasMore(false);
        setLoading(true);
        if (searchMode === 'recommended') {
            handleRecommendedQuery();
        } else {
            handleQuery();
        }
        return () => {
            isMounted.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, searchMode, searchUrl]);

    const loadMore = (): Promise<void> => {
        if (searchMode === 'recommended') {
            return handleRecommendedQuery();
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
    };
};
