import { useEffect, useRef, useContext, useState } from 'react';
import { ClientContext, Action } from 'react-fetching-library';

type FavoriteFetchType = 'InitFetch' | 'Like' | 'Unlike';

export interface FavoriteResponse {
    loading: boolean;
    liked: boolean;
    like: () => Promise<void>;
    unlike: () => Promise<void>;
}

/**
 * Custom hook to fetch the favorite status for the given resourceId and corresponding ovat token.
 *
 * @param resourceId The resourceId for which to verify the favorite status
 * @param ovatToken The session `ovat` token.
 */
export const useFavorite = (resourceId: string, ovatToken: string | undefined): FavoriteResponse => {
    const [loading, setLoading] = useState(false);
    const [liked, setLiked] = useState<boolean>(false);
    const { query } = useContext(ClientContext);
    const isMounted = useRef(true);

    const handleQuery = async (type: FavoriteFetchType): Promise<void> => {
        if (!isMounted.current) {
            return;
        }

        setLoading(true);
        const action = actionForType(type, resourceId, ovatToken!);
        const response = await query(action);
        if (isMounted.current) {
            setLoading(false);
            setLiked(type === 'Unlike' ? response.status !== 200 : response.status === 200);
        }
    };

    const like = (): Promise<void> => handleQuery('Like');
    const unlike = (): Promise<void> => handleQuery('Unlike');
    const initFetch = (): Promise<void> => handleQuery('InitFetch');

    useEffect(() => {
        isMounted.current = true;

        if (ovatToken && resourceId) {
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
    };
};

// Actions

const actionForType = (type: FavoriteFetchType, resourceId: string, ovatToken: string): Action => {
    switch (type) {
        case 'Like':
            return putFavorite(resourceId, ovatToken);
        case 'Unlike':
            return deleteFavorite(resourceId, ovatToken);
        case 'InitFetch':
            return fetchFavorite(resourceId, ovatToken);
    }
};

const fetchFavorite = (resourceId: string, ovatToken: string): Action => {
    return favAction({ method: 'GET', endpoint: 'favorites/' + resourceId, ovatToken: ovatToken });
};

const putFavorite = (resourceId: string, ovatToken: string): Action => {
    return favAction({ method: 'PUT', endpoint: 'favorites/', body: { contentId: resourceId }, ovatToken: ovatToken });
};

const deleteFavorite = (resourceId: string, ovatToken: string): Action => {
    return favAction({ method: 'DELETE', endpoint: 'favorites/' + resourceId, ovatToken: ovatToken });
};

const favAction = ({
    method,
    endpoint,
    body,
    ovatToken,
}: {
    method: string;
    endpoint: string;
    body?: { [key: string]: string };
    ovatToken: string;
}): Action => {
    return {
        method: method,
        endpoint: endpoint,
        body: body,
        headers: { 'X-Authorization': ovatToken },
        clientIdentifier: 'personalization',
    };
};
