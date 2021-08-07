import React, { Context, useEffect, useContext } from 'react';
import { ClientContext } from 'react-fetching-library';
import { DiscoveryActionExt } from 'qp-discovery-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useAuth } from 'contexts/AuthContextProvider';
import { EvergentEndpoints, requestBody, isSuccess, errorCode, responsePayload } from 'utils/EvergentAPIUtil';
import { UserAuthDelegate } from 'rn-qp-nxg-player';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { AppEvents, condenseErrorObject } from 'utils/ReportingUtils';

interface EntitlementState {
    loading: boolean;
    xAuthToken: string | null;
    error: boolean;
    errorObject: Error | undefined;
    userAuthDelegate: UserAuthDelegate;
}

const initialState: EntitlementState = {
    loading: true,
    xAuthToken: null,
    error: false,
    errorObject: undefined,
    userAuthDelegate: {
        async fetchUserAuthorizationToken(): Promise<string> {
            return '';
        },
    },
};

const EntitlementsContext: Context<EntitlementState> = React.createContext({
    ...initialState,
});

/**
 * EntitlementsContext manages accessing X-Authorization/ovat/FL access token from UMS system
 */
const EntitlementsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { appConfig } = useAppPreferencesState();
    const { accessToken } = useAuth();
    const { query } = useContext(ClientContext);
    const { recordEvent } = useAnalytics();

    const [state, dispatch] = React.useReducer((prevState, action) => {
        switch (action.type) {
            case 'UPDATE_AUTH_TOKEN':
                return {
                    ...prevState,
                    loading: false,
                    xAuthToken: action.value,
                };
            case 'ENTITLEMENT_ERROR':
                return {
                    ...prevState,
                    loading: false,
                    error: true,
                    errorObject: action.value,
                };
            default:
                return prevState;
        }
    }, initialState);

    const userAuthDelegate = {
        async fetchUserAuthorizationToken(): Promise<string> {
            return state.xAuthToken;
        },
    };

    useEffect(() => {
        if (!appConfig || !accessToken) {
            return;
        }

        const entitlementEndpoint = EvergentEndpoints.GetEntitlements;
        const body = requestBody(entitlementEndpoint, appConfig, { returnTVOD: 'F' });
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

        const fetchEntitlements = async () => {
            const { errorObject, payload } = await query(entitlementsAction);
            if (isSuccess(entitlementEndpoint, payload)) {
                const { ovatToken } = responsePayload(entitlementEndpoint, payload);
                dispatch({ type: 'UPDATE_AUTH_TOKEN', value: ovatToken });
            } else {
                recordEvent(AppEvents.ERROR, condenseErrorObject(errorObject, AppEvents.ENTITLEMENTS_ERROR));
                console.error(
                    '[EntitlementsContext] Entitlements response unsuccessful ',
                    errorObject,
                    errorCode(entitlementEndpoint, payload),
                );
                dispatch({ type: 'ENTITLEMENT_ERROR', value: errorObject });
            }
        };

        fetchEntitlements();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appConfig, accessToken]);

    return (
        <EntitlementsContext.Provider value={{ ...state, userAuthDelegate: userAuthDelegate }}>
            {children}
        </EntitlementsContext.Provider>
    );
};

export { EntitlementsContextProvider, EntitlementsContext };

export const useEntitlements = () => {
    const context = useContext(EntitlementsContext);
    if (context === undefined) {
        throw new Error('useEntitlements must be used within a EntitlementsContext');
    }
    return context;
};
