import { useRef, useEffect, useReducer, useContext } from 'react';
import { ClientContext } from 'react-fetching-library';
import DeviceInfo from 'react-native-device-info';
import { AuthorizationToken } from 'rn-qp-nxg-player';
import { DiscoveryActionExt, ResourceVm } from 'qp-discovery-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useAuth } from 'contexts/AuthContextProvider';
import { useEntitlements } from 'contexts/EntitlementsContextProvider';
import { useCredits } from 'utils/CreditsContextProvider';
import { useFLPlatform } from 'platform/PlatformContextProvider';
import { EvergentEndpoints, requestBody, isSuccess, responsePayload, errorCode } from 'utils/EvergentAPIUtil';
import { PlatformResponse, isSuccess as isFLMSuccess, error as flmError } from 'utils/FirstlightAPIUtils';
import { createError, Error } from 'utils/Error';
import { Platform } from 'react-native';

interface CheckRedeemData {
    token: string;
}

/**
 * Represents the entitlement issues by the UMS server for the asset
 */
export interface Entitlement {
    /**
     * FL defined unique id of the asset
     */
    contentId: string;
    /**
     * The `datetime` representing the purchase of the asset
     */
    startDate?: number;
    /**
     * The time till which the redemption is valid
     */
    validityTill: number;
    /**
     * The Stop status of the asset
     */
    status?: string;
    /**
     * The service name
     */
    serviceName?: string;
    /**
     * The service id
     */
    serviceID?: string;
}

/**
 * Represents the custom hook reponse
 */
export interface EntitlementResponse {
    /**
     * Indicates if TVOD entitlement check is still in progress
     */
    loading: boolean;
    /**
     * Indicates an error occured while validating entitlement check (e.g., server unreachable)
     */
    error?: Error;
    /**
     * Represents a TVOD redeem error
     */
    redeemError: boolean;
    /**
     * Indicates if the user is entitled for the given asset
     */
    entitled: boolean;
    /**
     * Represents the entitlement issued by the UMS server to the user for the asset
     */
    entitlement?: Entitlement;
    /**
     * A function which wraps asset redeem flow.
     * This should be called when the user does not have entitlement for the asset and was to purchase the asset
     */
    redeem: (resource: ResourceVm) => Promise<void>;

    tvodToken?: string;
}

const initialState: EntitlementResponse = {
    loading: false,
    error: undefined,
    redeemError: false,
    entitled: false,
    entitlement: undefined,
    tvodToken: undefined,
    redeem: async () => {},
};

/**
 * Custom hook that helps manage TVOD flow.
 *
 * Here's the sequence diagram for the TVOD flow:
 *
 *   ┌─────────────┐                 ┌───────────────────────────┐
 *   │Details Page │                 │ useTVODEntitlement(asset) │
 *   └─────────────┘                 └────────────┬──────────────┘
 *          │                                     │
 *          │                                     │
 *          │                                     ▼
 *          │                             ┌───────────────┐
 *          ├───────has entitlements?────▶│               │  - Check asset is part of local entitlement
 *          │                             │  has cached   │
 *          │                             │ entitlement?  │  - Check user is still entitled (validate
 *          │◀ ─ ─ ─ ─ ─Yes─ ─ ─ ─ ─ ─ ─ ─│               │  dates)
 *          │                             └───────┬───────┘
 *          │    entitlement, redeem()
 *          │                                     No
 *          │
 *          │                                     │
 *          │                                     ▼
 *          │                             ┌───────────────┐             ┌───────────────┐
 *          │                             │               │             │               │
 *          │                             │ fetch online  │             │               │
 *          │◀ ─ ─ ─ ─ ─ error ─ ─ ─ ─ ─ ─│ entitlements  │────────────▶│  UMS Server   │
 *          │                             │               │             │               │
 *          │                             └───────────────┘             │               │
 *          │                                     │                     └───────────────┘
 *          │                                  success
 *          │                                     │
 *          │
 *          │                                     ▼
 *          │                        ┌────────────────────────┐
 *          │                        │                        │
 *          │                        │  cache entitlements,   │
 *          │◀─ ─ ─ ─ ─ ─Yes─ ─ ─ ─ ─│validate entitlement for│
 *          │                        │         asset          │
 *          │ entitlement?, redeem() │                        │
 *          │                        └────────────────────────┘
 *          │
 *          │
 *          │                           ┌───────────────────┐           ┌───────────────┐
 *          │                           │                   │           │               │
 *          │                           │                   │           │               │
 *          │──────────────────────────▶│      redeem       │──────────▶│ Wallet Server │
 *          │                           │                   │           │               │
 *          │                           │                   │           │               │
 *          │                           └───────────────────┘           └───────────────┘
 *          │                                                                   │
 *          │                                                                   │
 *          │                           ┌───────────────────┐                   │
 *          │◀──────────────────────────│Update entitlements│◀──────────────────┘
 *          │                           └───────────────────┘
 *          │         entitlement
 *          ▼
 *
 * @param contentId The contentId for which to verify the favorite status
 */
export const useTVODEntitlement = (contentId?: string): EntitlementResponse => {
    const { fetchCredits } = useCredits();
    const { appConfig } = useAppPreferencesState();
    const { accessToken } = useAuth();
    const accessTokenRef = useRef(accessToken);
    let { xAuthToken } = useEntitlements();
    const { state: platformState } = useFLPlatform();
    const { platformAuthorizer } = platformState;
    const { query } = useContext(ClientContext);

    useEffect(() => {
        accessTokenRef.current = accessToken;
    }, [accessToken]);

    const [state, dispatch] = useReducer((prevState, action) => {
        switch (action.type) {
            case 'RESET':
                return {
                    ...initialState,
                    loading: true,
                };
            case 'REDEEM':
                return {
                    ...prevState,
                    error: undefined,
                    redeemError: false,
                    loading: true,
                };
            case 'REDEEM_ERROR':
                return {
                    ...prevState,
                    loading: false,
                    redeemError: true,
                    error: action.value,
                };
            case 'ENTITLEMENT_CHECK_ERROR':
                return {
                    ...prevState,
                    loading: false,
                    error: action.value,
                };
            case 'SET_ENTITLEMENT':
                return {
                    ...prevState,
                    error: undefined,
                    loading: false,
                    entitled: !!action.value.entitlement,
                    entitlement: action.value.entitlement,
                    tvodToken: action.value.tvodToken,
                };
            default:
                return prevState;
        }
    }, initialState);

    const isMounted = useRef(true);

    const fetchRedeemRequestToken = async (resource: ResourceVm): Promise<string | undefined> => {
        if (!platformAuthorizer) {
            return;
        }

        const authToken: AuthorizationToken = await platformAuthorizer.ensureAuthorization();
        const checkRedeemAction: DiscoveryActionExt = {
            method: 'POST',
            endpoint: 'content/checkredeem',
            body: {
                deviceId: DeviceInfo.getUniqueId(),
                contentId: resource.id,
                contentTypeId: 'vod',
                catalogType: resource.type,
                delivery: 'streaming',
            },
            headers: {
                'X-Authorization': xAuthToken || '',
                Authorization: `Bearer ${authToken.accessToken}`,
            },
            clientIdentifier: 'checkRedeem',
        };

        const { payload, errorObject } = await query<PlatformResponse<CheckRedeemData>>(checkRedeemAction);
        if (errorObject) {
            throw errorObject;
        }

        if (!isFLMSuccess(payload)) {
            throw flmError(payload);
        }

        return payload && payload.data.token;
    };

    const redeemResource = async (
        resource: ResourceVm,
        redeemRequestToken: string,
    ): Promise<[Entitlement | undefined, string | undefined]> => {
        const redeemEndpoint = EvergentEndpoints.AddTVODOrder;
        const body = requestBody(redeemEndpoint, appConfig, {
            redeemRequestToken: redeemRequestToken,
            mode: 'redeem',
            productID: 'TVPASSNRHD',
            orderAttributesInfo: {
                deviceType: Platform.OS,
            },
        });
        const headers = {
            Authorization: `Bearer ${accessTokenRef.current}`,
        };
        const action: DiscoveryActionExt = {
            method: 'POST',
            endpoint: redeemEndpoint,
            body: body,
            headers: headers,
            clientIdentifier: 'ums',
        };

        const { payload } = await query(action);
        if (isSuccess(redeemEndpoint, payload)) {
            const { tvodToken, validityTill } = responsePayload(redeemEndpoint, payload);
            return [{ contentId: resource.id, validityTill: validityTill }, tvodToken];
        }

        throw createError(errorCode(redeemEndpoint, payload));
    };

    const redeem = async (resource: ResourceVm): Promise<void> => {
        if (!appConfig || !accessTokenRef.current || !isMounted.current) {
            return;
        }

        console.debug(`Start redeeming for [${resource.id}] - ${resource.name}`);
        dispatch({ type: 'REDEEM' });

        try {
            const redeemRequestToken = await fetchRedeemRequestToken(resource);
            if (!redeemRequestToken) {
                dispatch({ type: 'REDEEM_ERROR' });
                return;
            }

            const [entitlement, tvodToken] = await redeemResource(resource, redeemRequestToken);
            if (isMounted.current) {
                dispatch({
                    type: 'SET_ENTITLEMENT',
                    value: { contentId: resource.id, entitlement: entitlement, tvodToken: tvodToken },
                });
                fetchCredits();
            }
        } catch (e) {
            console.debug(`[useTVODEntitlement] redeem for ${resource.id} failed with error`, e);
            if (isMounted.current) {
                dispatch({ type: 'REDEEM_ERROR', value: e });
            }
        }
    };

    useEffect(
        () => {
            isMounted.current = true;

            /**
             * Fetch all entitlements for the user
             */
            const fetchEntitlements = async (assetId: string): Promise<[Entitlement, string]> => {
                const entitlementEndpoint = EvergentEndpoints.GetEntitlements;
                const body = requestBody(entitlementEndpoint, appConfig, { returnTVOD: 'T', assetID: assetId });
                const headers = {
                    Authorization: `Bearer ${accessTokenRef.current}`,
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
                    const { AccountServiceMessage, tvodToken } = responsePayload(entitlementEndpoint, payload);
                    const entitlements = AccountServiceMessage as Entitlement[];
                    if (entitlements && entitlements.length > 0) {
                        return [entitlements[0], tvodToken];
                    }
                }
                console.log(`[useTVODEntitlement] ${assetId} is not entitled`);
                throw createError(errorCode(entitlementEndpoint, payload));
            };

            const handleTVODCheck = async (assetId: string) => {
                try {
                    const [entitlement, tvodToken] = await fetchEntitlements(assetId);
                    if (isMounted.current) {
                        dispatch({
                            type: 'SET_ENTITLEMENT',
                            value: { entitlement: entitlement, tvodToken: tvodToken },
                        });
                    }
                } catch (e) {
                    if (isMounted.current) {
                        dispatch({ type: 'ENTITLEMENT_CHECK_ERROR', value: e });
                    }
                    return;
                }
            };

            if (!contentId || !appConfig || !accessTokenRef.current) {
                return;
            }

            dispatch({ type: 'RESET' });
            handleTVODCheck(contentId);

            return () => {
                isMounted.current = false;
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [contentId],
    );

    return {
        ...state,
        redeem,
    };
};
