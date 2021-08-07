import { useMemo } from 'react';
import { useQuery } from 'react-fetching-library';
import { MetaDataResponse } from '../models/Storefront.types';
import { ResourceVm } from '../models/ViewModels';
import { metaDataResourceAdapter } from '../models/Adapters';
import { fetchContentMetadata } from 'qp-discovery-ui/src/api/actions/fetchDiscoveryResource';
// import { fetchTVSeriesMetadata } from '../api/actions/fetchDiscoveryResource';
// import { fetchTVEpisodesMetadata } from '../api/actions/fetchDiscoveryResource';
// import { Category } from 'qp-discovery-ui';
// import { ResourceResponse } from '../models/Storefront.types';

export interface ResourceHookResponse {
    loading: boolean;
    error?: boolean;
    errorObject?: any;
    mainResource?: ResourceVm;
    // seasons: ResourceVm[];
    // episodes: ResourceVm[];
}
/**
 * Custom Hook to fetch resource details as ResourceVm
 *
 * @param  {string} resourceId The resource id for which the details must be fetched.
 * @param  {string} resourceType The resource type for which the details must be fetched.
 * @param  {string} source The source identifier. Defaults to FL CDS service.
 * @returns {ResourceHookResponse} The processed response for the custom hook.
 */

//Note: Do not remove ScreenOrigin
export const useFetchResourceQuery = (
    resourceId: string,
    resourceType: string,
    clientIdentifier: string,
    source?: string,
    screenOrigin?: string,
    // screenName?: string,
    // pageSize?: number,
    // pageNumber?: number,
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
        mainResource = payload && metaDataResourceAdapter((payload as MetaDataResponse).data, screenOrigin);
    } catch (e) {
        error = true;
        errorObject = e;
    }
    //Commenting this for now since we need to show TV Series information on TV Series landing page
    // const { query } = useContext(ClientContext);
    // const [mainResource, setMainResource] = useState();
    // const [seasons, setSeasons] = useState<ResourceVm[]>([]);
    // // const [firstAvailableSeasonId, setFirstAvailableSeasonId] = useState();
    // const [episodes, setEpisodes] = useState<ResourceVm[]>([]);
    // // const [firstAvailableEpisode, setFirstAvailableEpisode] = useState<ResourceVm>();
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(false);
    // const [errorObject, setErrorObject] = useState();

    // const fetchContent = async (): Promise<void> => {
    //     const action = fetchContentMetadata(resourceId, resourceType, clientIdentifier, {
    //         ...(source && { ds: source }),
    //     });
    //     const { payload, error: errorContent, errorObject: errorObjectContent } = await query(action);
    //     const resource = payload && metaDataResourceAdapter((payload as MetaDataResponse).data);

    //     if (resource) {
    //         setMainResource(resource);
    //         setLoading(false);
    //     }
    //     if (errorContent) {
    //         setError(errorContent);
    //         setErrorObject(errorObjectContent);
    //         setLoading(false);
    //     }
    // };

    // const fetchTVSerie = async (): Promise<void> => {
    //     const action = fetchTVSeriesMetadata(resourceId, 'seasons', { pageSize: 25, pageNumber: 1 });
    //     const { payload: payloadTVSerie, error: errorTVSerie, errorObject: errorObjectTVSerie } = await query<
    //         ResourceResponse
    //     >(action);
    //     const seasonsResponse =
    //         payloadTVSerie &&
    //         payloadTVSerie.data &&
    //         payloadTVSerie.data
    //             .map(season => {
    //                 return metaDataResourceAdapter(season, screenOrigin);
    //             })
    //             .sort((a: ResourceVm, b: ResourceVm) => {
    //                 return a.seasonNumber! - b.seasonNumber!;
    //             });
    //     if (seasonsResponse) {
    //         setSeasons(seasonsResponse);
    //         const season = seasonsResponse.shift();
    //         if (season) {
    //             // setFirstAvailableSeasonId(season);
    //             fetchTVEpisodes(season.id);
    //         }
    //     }
    //     if (errorTVSerie) {
    //         setError(errorTVSerie);
    //         setErrorObject(errorObjectTVSerie);
    //         setLoading(false);
    //     }
    // };

    // const fetchTVEpisodes = async (seasonId): Promise<void> => {
    //     const action = fetchTVEpisodesMetadata(resourceId, 'episodes', {
    //         seasonId: seasonId,
    //         pageNumber: 1,
    //         pageSize: 25,
    //     });
    //     const { payload: payloadTVEpisodes, error: errorTVEpisodes, errorObject: errorObjectTVEpisodes } = await query<
    //         ResourceResponse
    //     >(action);
    //     const episodesResponse =
    //         payloadTVEpisodes &&
    //         payloadTVEpisodes.data &&
    //         payloadTVEpisodes.data
    //             .map(episode => {
    //                 return metaDataResourceAdapter(episode, screenName);
    //             })
    //             .sort((a: ResourceVm, b: ResourceVm): number => {
    //                 return a.episodeNumber! < b.episodeNumber! ? -1 : a.episodeNumber! > b.episodeNumber! ? 1 : 0;
    //             });
    //     if (episodesResponse) {
    //         setEpisodes(episodesResponse);
    //         const episode = episodesResponse.shift();
    //         if (episode) {
    //             fetchTVSingleEpisode(episode.id);
    //         }
    //     }
    //     if (errorTVEpisodes) {
    //         setError(errorTVEpisodes);
    //         setErrorObject(errorObjectTVEpisodes);
    //         setLoading(false);
    //     }
    // };

    // const fetchTVSingleEpisode = async (episodeId): Promise<void> => {
    //     const episodeAction = fetchContentMetadata(episodeId, Category.TVEpisode, 'metadata', {
    //         ...(source && { ds: source }),
    //     });
    //     const { payload: episodePayload, error: episodeError, errorObject: episodeErrorObject } = await query(
    //         episodeAction,
    //     );
    //     const episodeResource = episodePayload && metaDataResourceAdapter((episodePayload as MetaDataResponse).data);
    //     if (episodeResource) {
    //         setMainResource(episodeResource);
    //         setLoading(false);
    //     }
    //     if (episodeError) {
    //         setError(episodeError);
    //         setErrorObject(episodeErrorObject);
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     setLoading(true);
    //     if (resourceType === Category.TVSeries) {
    //         fetchTVSerie();
    //     } else if (resourceType === Category.TVEpisode) {
    //         fetchTVSingleEpisode(resourceId);
    //     } else {
    //         fetchContent();
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [pageNumber, pageSize, resourceId, resourceType, clientIdentifier, source]);

    return {
        loading: loading,
        error: error,
        errorObject: errorObject,
        mainResource: mainResource,
        // seasons: seasons || [],
        // episodes: episodes || [],
    };
};
