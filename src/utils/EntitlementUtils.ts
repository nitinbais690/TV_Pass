import { DiscoveryActionExt } from 'qp-discovery-ui';
import { EvergentEndpoints, requestBody, isSuccess, responsePayload, errorCode } from 'utils/EvergentAPIUtil';
import { AppConfig } from 'utils/AppPreferencesContext';
import { Action, QueryResponse } from 'react-fetching-library';
import { createError } from 'utils/Error';

export const fetchTVODToken = async (
    assetId: string,
    accessToken: string | undefined,
    config: AppConfig | undefined,
    query: (actionInit: Action, skipCache?: boolean) => Promise<QueryResponse>,
): Promise<string | undefined> => {
    if (!config || !accessToken) {
        return undefined;
    }

    const entitlementEndpoint = EvergentEndpoints.GetEntitlements;
    const body = requestBody(entitlementEndpoint, config, { returnTVOD: 'T', assetID: assetId });
    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };
    const entitlementsAction: DiscoveryActionExt = {
        method: 'POST',
        endpoint: entitlementEndpoint,
        body: body,
        headers: headers,
        clientIdentifier: 'ums',
    };

    const { payload } = await query(entitlementsAction);
    if (isSuccess(entitlementEndpoint, payload)) {
        const { tvodToken } = responsePayload(entitlementEndpoint, payload);
        return tvodToken;
    }

    throw createError(errorCode(entitlementEndpoint, payload));
};
