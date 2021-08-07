import { useMemo } from 'react';
import { useQuery } from 'react-fetching-library';
import { ResourceVm } from '../models/ViewModels';
import { ResourceResponse } from '../models/Storefront.types';
import { fetchTVSeriesMetadata } from '../api/actions/fetchDiscoveryResource';
import { metaDataResourceAdapter } from 'qp-discovery-ui/src/models/Adapters';

export interface TVSeriesHookResponse {
    loading: boolean;
    error: boolean;
    errorObject?: any;
    seasons: ResourceVm[];
}

/**
 * Custom Hook to fetch tv series
 *
 * @param  {string} resourceId Id for which the resource details to be displayed
 * @param  {string} resourceType Type for which the resource details to be displayed
 * @param  {string} pageSize Page size for which the resource details to be displayed
 * @param  {string} pageNumber Page number for which the resource details to be displayed
 * @returns {TVSeriesHookResponse} The processed response for the custom hook.
 */
export const useFetchTVSeriesQuery = (
    resourceId: string,
    resourceType: string,
    screenOrigin?: string,
    pageSize?: number,
    pageNumber?: number,
): TVSeriesHookResponse => {
    const action = useMemo(
        () => fetchTVSeriesMetadata(resourceId, resourceType, { pageSize: pageSize, pageNumber: pageNumber }),
        [pageNumber, pageSize, resourceId, resourceType],
    );
    const { payload, loading, error, errorObject } = useQuery<ResourceResponse>(action);
    const seasons =
        payload &&
        payload.data &&
        payload.data
            .map(season => {
                return metaDataResourceAdapter(season, screenOrigin);
            })
            .sort((a: ResourceVm, b: ResourceVm) => {
                return a.seasonNumber! - b.seasonNumber!;
            });
    return {
        loading: loading,
        error: error,
        errorObject: errorObject,
        seasons: seasons || [],
    };
};
