import { useQuery } from 'react-fetching-library';
import { ResourceVm } from '../models/ViewModels';
import { ResourceResponse } from 'qp-discovery-ui/src/models/Storefront.types';
import { metaDataResourceAdapter } from 'qp-discovery-ui/src/models/Adapters';
import { fetchContentLookup } from '../api/actions/fetchDiscoveryResource';
import { ScreenOrigin } from 'utils/ReportingUtils';

/**
 * Represents the custom hook reponse
 */
export interface ContentLookupResponse {
    /**
     * Indicates if TVOD entitlement check is still in progress
     */
    loading: boolean;
    /**
     * Indicates an error occured while fetching content
     */
    error?: boolean;
    /**
     *
     */
    errorObject?: Error;
    /**
     *
     */
    resources: ResourceVm[];
}

/**
 *
 * @param query The base64 encoded filter query
 * @param pageNumber Optional. Page number to be the page request
 * @param pageSize The number of items to return per page
 */
export const useContentLookup = (query: string, pageNumber?: number, pageSize?: number): ContentLookupResponse => {
    const action = fetchContentLookup(query, pageNumber, pageSize);
    const { payload, loading, error, errorObject } = useQuery<ResourceResponse>(action);
    const resources =
        payload && payload.data && payload.data.map(res => metaDataResourceAdapter(res, ScreenOrigin.RELATED_RESOURCE));
    return {
        loading: loading,
        error: error,
        errorObject: errorObject,
        resources: resources || [],
    };
};
