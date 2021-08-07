import { Action } from 'react-fetching-library';

export type Method = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

export interface DiscoveryActionExt extends Action {
    clientIdentifier?: string;
    endpoint: string;
    params?: { [key: string]: any };
}

export const createAction = ({
    clientIdentifier = 'discovery',
    method = 'GET',
    endpoint,
    params = {},
}: Partial<DiscoveryActionExt>): DiscoveryActionExt => {
    return {
        method: method,
        endpoint: endpoint || '',
        params: params,
        clientIdentifier: clientIdentifier,
    };
};

export const fetchStorefrontTabs = (containerId: string, params: { [key: string]: any } = {}): DiscoveryActionExt => {
    return createAction({
        endpoint: containerId + '/tabs',
        params: {
            policy_evaluate: 'false',
            ...params,
        },
    });
};

export const fetchStorefrontContainers = (params: { [key: string]: any } = {}): DiscoveryActionExt => {
    return createAction({
        clientIdentifier: 'catalog',
        endpoint: `storefront/${params.sfid}/${params.tid}/containers`,
        params: {
            policy_evaluate: 'false',
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
        },
    });
};

export const fetchStorefrontSearch = (params: { [key: string]: any } = {}): DiscoveryActionExt => {
    return createAction({
        clientIdentifier: 'discovery',
        endpoint: `${params.sfid}/${params.tid}/containers`,
        params: {
            policy_evaluate: 'false',
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
        },
    });
};

export const fetchStorefrontCollections = (
    collectionId: string,
    params: { [key: string]: any } = {},
): DiscoveryActionExt => {
    return createAction({
        clientIdentifier: 'catalog',
        endpoint: `collection/${collectionId}/containers`,
        params: { ...params },
    });
};

export const fetchContentMetadata = (
    resourceId: string,
    resourceType: string,
    clientIdentifier: string,
    params: { [key: string]: any } = {},
): Action => {
    if (resourceType === 'airing') {
        return createAction({
            clientIdentifier: 'epg',
            endpoint: '/program' + '/' + resourceId,
        });
    } else {
        const action = createAction({
            clientIdentifier: clientIdentifier,
            endpoint: `/urn/resource/catalog/${resourceType}/${resourceId}`,
            params: { ...params },
        });
        return action;
    }
};

export const fetchHighlights = (resourceIds: string[] = [], params: { [key: string]: any } = {}): Action => {
    return createAction({
        endpoint: 'contentHighlight',
        params: { ...params, resourceIds: resourceIds.join(' ') },
    });
};

export const fetchTVSeriesMetadata = (
    resourceId: string,
    resourceType: string,
    params: { [key: string]: any } = {},
): Action => {
    return createAction({
        clientIdentifier: 'metadata',
        endpoint: '/series' + '/' + resourceId + '/' + resourceType,
        params: { pageNumber: params.pageNumber, pageSize: params.pageSize },
    });
};

export const fetchTVEpisodesMetadata = (
    seriesId: string,
    resourceType: string,
    params: { [key: string]: any } = {},
): Action => {
    return createAction({
        clientIdentifier: 'metadata',
        endpoint: '/series' + '/' + seriesId + '/' + resourceType,
        params: { seasonId: params.seasonId, pageNumber: params.pageNumber, pageSize: params.pageSize },
    });
};
export const fetchDiscoveryResource = (
    resourceId: string = '',
    resourceType: string = '',
    params: { [key: string]: any } = {},
): Action => {
    return createAction({
        endpoint: resourceType + '/' + resourceId,
        params: params,
    });
};

export const fetchRelatedContents = (relatedContentsLink: string = ''): Action => {
    const extractedPath = relatedContentsLink.split('?')[0];
    const paramString = relatedContentsLink.split('?')[1];
    const extractedParams = JSON.parse('{"' + decodeURI(paramString.replace(/&/g, '","').replace(/\=/g, '":"')) + '"}');
    return createAction({
        endpoint: extractedPath,
        params: extractedParams,
    });
};

export const fetchDiscoverySearch = (search: string = '', pageNumber: number, pageSize: number): Action => {
    return createAction({
        endpoint: '/search',
        clientIdentifier: 'metadata',
        params: {
            term: search,
            mode: 'detail',
            st: 'published',
            pageNumber: pageNumber,
            pageSize: pageSize,
        },
    });
};

export const fetchContentLookup = (query: string = '', pageNumber?: number, pageSize?: number): Action => {
    return createAction({
        endpoint: '/lookup',
        clientIdentifier: 'metadata',
        params: {
            mode: 'detail',
            query: query,
            ...(pageNumber &&
                pageSize && {
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                }),
        },
    });
};

export const fetchContentIdsLookup = (ids: string[]): Action => {
    return createAction({
        endpoint: '',
        clientIdentifier: 'metadata',
        params: {
            mode: 'detail',
            st: 'published',
            pageSize: ids.length,
            ids: ids.join(','),
        },
    });
};

export const fetchChannels = (params: { [key: string]: any }): Action => {
    return createAction({
        clientIdentifier: 'channel',
        method: 'GET',
        endpoint: 'channel',
        params: params,
    });
};

export const fetchEpgGrid = (channelIds: string[], startDate: string, endDate: string): Action => {
    let params = {
        st: startDate,
        et: endDate,
    };

    return createAction({
        clientIdentifier: 'epg',
        method: 'GET',
        endpoint: 'lineups/test/grid',
        params: { ...params, cIds: channelIds.join(',') },
    });
};
