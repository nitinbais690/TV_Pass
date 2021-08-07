import React, { Context, useEffect, useContext, useCallback } from 'react';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useAuth } from 'contexts/AuthContextProvider';
import { UserAuthDelegate } from 'rn-qp-nxg-player';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { AppEvents, condenseErrorObject } from 'utils/ReportingUtils';
import { FLFlatToken } from 'features/authentication/domain/use-cases/fl-flat-token';
import diContainer from 'di/di-config';
import { AUTH_DI_TYPES } from 'features/authentication/di/auth-di-types';
import {
    FetchEntitlements,
    FetchEntitlementsParams,
} from 'features/authentication/domain/use-cases/fetch-entitlements';
import { useProfiles } from './ProfilesContextProvider';

export interface EntitlementState {
    loading: boolean;
    xAuthToken: string | null;
    error: boolean;
    errorObject: Error | undefined;
    userAuthDelegate: UserAuthDelegate;
}

const initialState: EntitlementState = {
    loading: true,
    xAuthToken: '',
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
    const { accessToken, flAuthToken } = useAuth();
    const { recordEvent } = useAnalytics();
    const { activeProfile } = useProfiles();

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
            case 'GUEST_ENTITLEMENT_ERROR':
                return {
                    ...prevState,
                    loading: false,
                    error: true,
                    errorObject: action.value,
                };
            case 'reset': {
                return {
                    loading: false,
                    error: undefined,
                    xAuthToken: '',
                    userAuthDelegate: userAuthDelegate,
                };
            }
            default:
                return prevState;
        }
    }, initialState);

    const userAuthDelegate = {
        async fetchUserAuthorizationToken(): Promise<string> {
            return state.xAuthToken;
        },
    };

    const fetchFlFlatToken = useCallback(async () => {
        try {
            if (flAuthToken) {
                let flFlatToken = diContainer.get<FLFlatToken>(AUTH_DI_TYPES.FLFlatToken);
                const response = await flFlatToken.execute(flAuthToken);
                if (response) {
                    if (response.header.code === 0) {
                        dispatch({
                            type: 'UPDATE_AUTH_TOKEN',
                            value: response.data.token,
                        });
                    } else {
                        recordEvent(
                            AppEvents.ERROR,
                            condenseErrorObject(response.header, AppEvents.ENTITLEMENTS_ERROR),
                        );
                        dispatch({ type: 'ENTITLEMENT_ERROR', value: response.header });
                    }
                }
            }
        } catch (e) {
            recordEvent(AppEvents.ERROR, condenseErrorObject(e, AppEvents.ENTITLEMENTS_ERROR));
            dispatch({ type: 'ENTITLEMENT_ERROR', value: e });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flAuthToken]);

    const fetchFlatToken = useCallback(async () => {
        try {
            if (appConfig && accessToken && activeProfile && activeProfile.contactID) {
                let fetchFlatTokenUsecase = diContainer.get<FetchEntitlements>(AUTH_DI_TYPES.FetchEntitlements);
                const response = await fetchFlatTokenUsecase.execute(
                    new FetchEntitlementsParams(accessToken, activeProfile.contactID, appConfig),
                );
                if (response && response.ovatToken) {
                    dispatch({
                        type: 'UPDATE_AUTH_TOKEN',
                        value: response.ovatToken,
                    });
                }
            }
        } catch (e) {
            recordEvent(AppEvents.ERROR, condenseErrorObject(e, AppEvents.ENTITLEMENTS_ERROR));
            dispatch({ type: 'ENTITLEMENT_ERROR', value: e });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken, activeProfile, appConfig]);

    useEffect(() => {
        if (!appConfig) {
            return;
        }
        // Enable to once Evergent flat token API gets ready
        if (accessToken === undefined) {
            fetchFlFlatToken();
        } else {
            fetchFlatToken();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appConfig, accessToken, flAuthToken, activeProfile]);

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
