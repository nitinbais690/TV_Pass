import { useContext, useEffect, useState } from 'react';
import { ClientContext } from 'react-fetching-library';
import { AuthorizationToken } from 'rn-qp-nxg-player';
import {
    DiscoveryActionExt,
    fetchContentLookup,
    ResourceVm,
    metaDataResourceAdapter,
    ResourceResponse,
} from 'qp-discovery-ui';
import { ScreenOrigin } from 'utils/ReportingUtils';
import { useFLPlatform } from 'platform/PlatformContextProvider';

/**
 * Represents the custom hook reponse
 */
export interface RelatedResourcesResponse {
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
export const useRelatedResources = (
    query: string,
    pageNumber?: number,
    pageSize?: number,
    recommendation?: boolean,
): RelatedResourcesResponse => {
    const { state: platformState } = useFLPlatform();
    const { platformAuthorizer } = platformState;
    const { query: apiQuery } = useContext(ClientContext);
    const [state, setState] = useState({
        loading: true,
        error: false,
        errorObject: undefined,
        resources: [] as ResourceVm[],
    });

    useEffect(() => {
        const reccomendationAction = async (bodyString: string) => {
            if (!platformAuthorizer) {
                return {
                    method: 'POST',
                    endpoint: '/recommend',
                    clientIdentifier: 'recommendation',
                } as DiscoveryActionExt;
            }

            let body;
            try {
                body = JSON.parse(bodyString);
            } catch (e) {
                console.error('Failed to parse payload', e);
            }
            const authToken: AuthorizationToken = await platformAuthorizer.ensureAuthorization();
            const action: DiscoveryActionExt = {
                method: 'POST',
                endpoint: '/recommend',
                clientIdentifier: 'recommendation',
                headers: {
                    Authorization: `Bearer ${authToken.accessToken}`,
                },
                body: body,
            };
            return action;
        };

        const fetchData = async () => {
            const action = recommendation
                ? await reccomendationAction(query)
                : fetchContentLookup(query, pageNumber, pageSize);
            const { payload, error, errorObject } = await apiQuery<ResourceResponse>(action);
            const resources =
                payload &&
                payload.data &&
                payload.data.map(res => metaDataResourceAdapter(res, ScreenOrigin.RELATED_RESOURCE));
            setState({ loading: false, error, errorObject, resources: resources ? resources : [] });
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber, pageSize, platformAuthorizer, query, recommendation]);

    return {
        ...state,
    };
};
