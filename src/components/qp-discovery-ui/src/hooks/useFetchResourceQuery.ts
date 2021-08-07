import { useMemo } from 'react';
import { useQuery } from 'react-fetching-library';
import { EpgProgramResponse, MetaDataResponse } from '../models/Storefront.types';
import { ResourceVm } from '../models/ViewModels';
import { epgProgramAdapter, metaDataResourceAdapter } from '../models/Adapters';
import { fetchContentMetadata } from 'qp-discovery-ui/src/api/actions/fetchDiscoveryResource';

export interface ResourceHookResponse {
    loading: boolean;
    error?: boolean;
    errorObject?: any;
    mainResource?: ResourceVm;
}
/**
 * Custom Hook to fetch resource details as ResourceVm
 *
 * @param  {string} resourceId The resource id for which the details must be fetched.
 * @param  {string} resourceType The resource type for which the details must be fetched.
 * @param  {string} source The source identifier. Defaults to FL CDS service.
 * @returns {ResourceHookResponse} The processed response for the custom hook.
 */

export const useFetchResourceQuery = (
    resourceId: string,
    resourceType: string,
    clientIdentifier: string,
    source?: string,
): ResourceHookResponse => {
    const action = useMemo(
        () =>
            fetchContentMetadata(resourceId, resourceType, clientIdentifier, {
                ...(source && { ds: source }),
            }),
        [resourceId, resourceType, clientIdentifier, source],
    );

    let mainResource;
    let { payload, loading, error, errorObject } = useQuery(action);

    try {
        mainResource = payload && metaDataResourceAdapter((payload as MetaDataResponse).data);

        if (resourceType === 'airing') {
            mainResource = payload && epgProgramAdapter((payload as EpgProgramResponse).data);
        } else {
            mainResource = payload && metaDataResourceAdapter((payload as MetaDataResponse).data);
        }
    } catch (e) {
        error = true;
        errorObject = e;
    }

    return {
        loading: loading,
        error: error,
        errorObject: errorObject,
        mainResource: mainResource,
    };
};
