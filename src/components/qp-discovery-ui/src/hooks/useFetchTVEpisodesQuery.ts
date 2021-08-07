import { useMemo } from 'react';
import { useQuery } from 'react-fetching-library';
import { ResourceVm } from '../models/ViewModels';
import { ResourceResponse } from '../models/Storefront.types';
import { fetchTVEpisodesMetadata } from '../api/actions/fetchDiscoveryResource';
import { metaDataResourceAdapter } from '../models/Adapters';

export interface TVEpisodesHookResponse {
    loading: boolean;
    error: boolean;
    errorObject?: any;
    episodes: ResourceVm[];
}

/**
 * Custom Hook to fetch tv episodes
 *
 * @param {string} seriesId Id for which the tv seasons and episodes details to be be displayed
 * @param {string} seasonId Id for which the episodes details to be displayed
 * @param  {string} pageSize Page size for which the resource details to be displayed
 * @param  {string} pageNumber Page number for which the resource details to be displayed
 * @returns {TVEpisodesHookResponse} The processed response for the custom hook.
 */
export const useFetchTVEpisodesQuery = (
    seriesId: string,
    seasonId: string,
    screenName?: string,
    pageNumber?: number,
    pageSize?: number,
): TVEpisodesHookResponse => {
    const action = useMemo(
        () =>
            fetchTVEpisodesMetadata(seriesId, 'episodes', {
                seasonId: seasonId,
                pageNumber: pageNumber,
                pageSize: pageSize,
            }),
        [seriesId, seasonId, pageNumber, pageSize],
    );
    const { payload, loading, error, errorObject } = useQuery<ResourceResponse>(action);
    const episodes =
        payload &&
        payload.data &&
        payload.data
            .map(episode => {
                return metaDataResourceAdapter(episode, screenName);
            })
            .sort((a: ResourceVm, b: ResourceVm): number => {
                return a.episodeNumber! < b.episodeNumber! ? -1 : a.episodeNumber! > b.episodeNumber! ? 1 : 0;
            });
    return {
        loading: loading,
        error: error,
        errorObject: errorObject,
        episodes: episodes || [],
    };
};
