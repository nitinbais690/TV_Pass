import { useMemo } from 'react';
import { useQuery } from 'react-fetching-library';
import { ResourceVm } from '../models/ViewModels';
import { ResourceResponse } from '../models/Storefront.types';
import { fetchRelatedContents } from '../api/actions/fetchDiscoveryResource';
import { metaDataResourceAdapter } from 'qp-discovery-ui/src/models/Adapters';
import { ScreenOrigin } from 'utils/ReportingUtils';

export interface RelatedItemsHookResponse {
    loading: boolean;
    error?: boolean;
    errorObject?: any;
    relatedItems?: ResourceVm[];
}

/**
 * Custom Hook to fetch related items
 *
 * @param  {string} relatedItemLink The link which contains the realted items
 * @returns {RelatedItemLinksHookResponse} The processed response for the custom hook.
 */
export const useFetchRelatedItemsQuery = (relatedItemLink: string): RelatedItemsHookResponse => {
    const action = useMemo(() => fetchRelatedContents(relatedItemLink), [relatedItemLink]);
    const { payload, loading, error, errorObject } = useQuery<ResourceResponse>(action);

    const items =
        payload &&
        payload.data.map(episode => {
            return metaDataResourceAdapter(episode, ScreenOrigin.RELATED_RESOURCE);
        });
    return {
        loading: loading,
        error: error,
        errorObject: errorObject,
        relatedItems: items,
    };
};
