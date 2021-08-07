import { Method } from 'components/qp-discovery-ui';
import { useEffect, useRef, useContext, useState } from 'react';
import { ClientContext, Action, QueryResponse } from 'react-fetching-library';
import { DiscoveryActionExt } from '../api/actions/fetchDiscoveryResource';

type FavoriteFetchType = 'InitFetch' | 'Like' | 'Unlike' | 'FetchAll';

export interface FavoriteResponse {
    loading: boolean;
    liked: boolean;
    like: () => Promise<void>;
    unlike: () => Promise<void>;
    fetchAll: (
        pageNumber?: number,
        pageSize?: number,
        sort?: string,
        order?: string,
    ) => Promise<FetchAllFavoriteResponse[]>;
}

export interface FetchAllFavoriteResponse {
    itemIdId: string;
    updatedTimestamp: number;
}
/**
 * Custom hook to fetch the favorite status for the given resourceId and corresponding ovat token.
 *
 * @param resourceId The resourceId for which to verify the favorite status
 * @param ovatToken The session `ovat` token.
 */
export const useFavorite = (
    resourceId: string,
    ovatToken: string | undefined,
    accessToken: string | undefined,
): FavoriteResponse => {
    const [loading, setLoading] = useState(false);
    const [liked, setLiked] = useState<boolean>(false);
    const { query } = useContext(ClientContext);
    const isMounted = useRef(true);

    const handleQuery = async (type: FavoriteFetchType): Promise<void> => {
        if (!isMounted.current) {
            return;
        }
        setLoading(true);
        const action = actionForType(type, resourceId, ovatToken!, accessToken as string);
        const response = await query(action);
        if (isMounted.current) {
            setLoading(false);
            setLiked(isLiked(response, type));
        }
    };

    const isLiked = (response: QueryResponse<any>, type: string): boolean => {
        const success = response && response.status === 200 && response.payload.header.code === 0;
        if (type === 'InitFetch' || type === 'Like') {
            return success;
        } else {
            return !success;
        }
    };
    const handleFetchAllQuery = async (
        pageNumber?: number,
        pageSize?: number,
        sort?: string,
        order?: string,
    ): Promise<FetchAllFavoriteResponse[]> => {
        if (!isMounted.current) {
            return [];
        }
        setLoading(true);
        const action = fetchAllFavorite(ovatToken!, accessToken as string, pageNumber, pageSize, sort, order) as Action;
        const response = await query(action);
        if (isMounted.current) {
            setLoading(false);
            if (response.status === 200 && response.payload.header.code === 0) {
                return response.payload.data as FetchAllFavoriteResponse[];
            }
        }
        return [];
    };

    const like = (): Promise<void> => handleQuery('Like');
    const unlike = (): Promise<void> => handleQuery('Unlike');
    const initFetch = (): Promise<void> => handleQuery('InitFetch');
    const fetchAll = (
        pageNumber?: number,
        pageSize?: number,
        sort?: string,
        order?: string,
    ): Promise<FetchAllFavoriteResponse[]> => handleFetchAllQuery(pageNumber, pageSize, sort, order);

    useEffect(() => {
        isMounted.current = true;
        if (ovatToken && resourceId && accessToken) {
            initFetch();
        }

        return () => {
            isMounted.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ovatToken, resourceId]);

    return {
        liked: liked,
        loading: loading,
        like: like,
        unlike: unlike,
        fetchAll: fetchAll,
    };
};

// Actions

const actionForType = (type: FavoriteFetchType, resourceId: string, ovatToken: string, accessToken: string): Action => {
    switch (type) {
        case 'Like':
            return putFavorite(resourceId, ovatToken, accessToken);
        case 'Unlike':
            return deleteFavorite(resourceId, ovatToken, accessToken);
        case 'InitFetch':
            return fetchFavorite(resourceId, ovatToken, accessToken);
    }
};

const fetchFavorite = (resourceId: string, ovatToken: string, accessToken: string): Action => {
    return favAction({
        method: 'GET',
        endpoint: 'lookup/' + resourceId,
        ovatToken: ovatToken,
        accessToken: accessToken,
    });
};

const putFavorite = (resourceId: string, ovatToken: string, accessToken: string): Action => {
    return favAction({
        method: 'PUT',
        endpoint: 'create',
        body: { itemId: resourceId },
        ovatToken: ovatToken,
        accessToken: accessToken,
    });
};

const deleteFavorite = (resourceId: string, ovatToken: string, accessToken: string): Action => {
    return favAction({
        method: 'DELETE',
        endpoint: 'delete/' + resourceId,
        ovatToken: ovatToken,
        accessToken: accessToken,
    });
};

const fetchAllFavorite = (
    ovatToken: string,
    accessToken: string,
    pageNumber?: number,
    pageSize?: number,
    sort?: string,
    order?: string,
): Action => {
    let params = '';
    if (pageNumber) {
        params += '?pageNumber=' + pageNumber;
    }
    if (pageSize) {
        params += (params ? '&' : '?') + 'pageSize=' + pageSize;
    }

    if (sort) {
        params += (params ? '&' : '?') + 'sort=' + sort;
    }
    if (order) {
        params += (params ? '&' : '?') + 'order=' + order;
    }
    return favAction({ method: 'GET', endpoint: 'list' + params, ovatToken, accessToken });
};

const favAction = ({
    method,
    endpoint,
    body,
    ovatToken,
    accessToken,
}: {
    method: string;
    endpoint: string;
    body?: { [key: string]: string };
    ovatToken: string;
    accessToken: string;
}): DiscoveryActionExt => {
    return {
        method: method as Method,
        endpoint: endpoint,
        body: body,
        headers: { Authorization: `Bearer ${accessToken}`, 'X-Authorization': ovatToken || '' },
        clientIdentifier: 'favorite',
    };
};
