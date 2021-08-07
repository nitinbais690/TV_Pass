import React, { Context, useEffect, useContext } from 'react';
import { ClientContext } from 'react-fetching-library';
import { DiscoveryActionExt } from 'qp-discovery-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useAuth } from 'contexts/AuthContextProvider';
import { EvergentEndpoints, requestBody, isSuccess, errorCode, responsePayload } from 'utils/EvergentAPIUtil';

const DEFAULT_REFRESH_INTERVAL_MS = 30 * 1000; // 30s

interface CreditsActions {
    fetchCredits: () => Promise<void>;
    pauseRefresh: () => Promise<void>;
    resumeRefresh: () => Promise<void>;
}

interface CreditsState extends CreditsActions {
    loading: boolean;
    credits: number | null;
    refreshIntervalState: 'active' | 'paused';
}

const initialState: CreditsState = {
    loading: true,
    credits: 0,
    refreshIntervalState: 'active',
    fetchCredits: async () => {},
    pauseRefresh: async () => {},
    resumeRefresh: async () => {},
};

const CreditsContext: Context<CreditsState> = React.createContext({
    ...initialState,
});

/**
 * Custom hook that sets up periodic refresh of credits
 *
 * @param state The credits state
 * @param actions The available credit actions
 * @param refreshTimeInterval The time interval to auto-refresh the credits
 */
const useCreditsRefresh = (state: CreditsState, actions: CreditsActions, refreshTimeInterval: number) => {
    useEffect(() => {
        let refreshInterval = setInterval(() => {
            actions.fetchCredits && actions.fetchCredits();
        }, refreshTimeInterval);

        const clearInterval = () => {
            if (refreshInterval) {
                clearTimeout(refreshInterval);
            }
        };

        if (state.refreshIntervalState === 'paused') {
            clearInterval();
        }

        return () => clearInterval();
    }, [actions, refreshTimeInterval, state]);
};

/**
 * CreditsContext manages User's credit points. It performs the following:
 *
 * - Fetches credits on init (children can use the available credit points from state)
 * - Sets up periodic background refresh of credits points
 * - exposes interfaces to:
 *   - fetchCredits
 *   - pauseRefresh (pause auto refresh). e.g., pause background refresh when we have active playback
 *   - resumeRefresh (resume auto refresh). e.g., resume background refresh when active playback has ended
 *
 * ┌──────────────────────┐       ┌────────────────────────────┐        ┌─────────────────────┐
 * │                      │       │                            │        │                     │
 * │                      │       │┌────────┐       ┌ ─ ─ ─ ─ ┐│        │                     │
 * │                      │       ││On Load │         Every x  │        │                     │
 * │                      │       │└────────┘       │ Seconds ││        │                     │
 * │                      │       │     │            ─ ─ ─ ─ ─ │        │                     │
 * │                      │       │     │                │     │        │                     │
 * │                      │       │     │                      │        │                     │
 * │                      │       │     │                │     │        │                     │
 * │                      │       │     │                      │        │                     │
 * │                      │       │     │                │     │        │                     │
 * │                      │       │     │                      │        │                     │
 * │         App          │       │     │ CreditsContext │     │        │    Wallet Server    │
 * │                      │       │     │                      │        │                     │
 * │                      │       │     ▼                │     │        │                     │
 * │  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │      ┌┴───────────┐                │        │                     │
 * │    Page Navigation  ─│─ ─ ─▶│fetchCredits│◀ ─ ─ ─ ─ ┘     │        │                     │
 * │  └ ─ ─ ─ ─ ─ ─ ─ ─ ┘ │      └┬───────────┴ ─ ─ request credits ─ ─ ▶                     │
 * │    ┌────────────┐    │      ┌┴───────────┐                │        │                     │
 * │    │ Play Start │────┼─────▶│pauseRefresh│                │        │                     │
 * │    └────────────┘    │      └┬───────────┘                │        │                     │
 * │    ┌────────────┐    │      ┌┴─────────────┐              │        │                     │
 * │    │  Play End  │────┼─────▶│resumeRefresh │              │        │                     │
 * │    └────────────┘    │      └┬─────────────┘              │        │                     │
 * └──────────────────────┘       └────────────────────────────┘        └─────────────────────┘
 */
const CreditsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { appConfig } = useAppPreferencesState();
    const { query } = useContext(ClientContext);
    const creditsEndpoint = EvergentEndpoints.CreditsEndpoint;
    const { accessToken } = useAuth();

    const body = requestBody(creditsEndpoint, appConfig);
    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };
    const creditsAction: DiscoveryActionExt = {
        method: 'POST',
        endpoint: creditsEndpoint,
        body: body,
        headers: headers,
        clientIdentifier: 'ums',
    };

    const [state, dispatch] = React.useReducer((prevState, action) => {
        switch (action.type) {
            case 'UPDATE_CREDITS':
                return {
                    ...prevState,
                    loading: false,
                    credits: action.credits,
                };
            case 'PAUSE_REFRESH':
                return {
                    ...prevState,
                    loading: false,
                    refreshIntervalState: 'paused',
                };
            case 'RESUME_REFRESH':
                return {
                    ...prevState,
                    loading: false,
                    refreshIntervalState: 'active',
                };
            default:
                return prevState;
        }
    }, initialState);

    const creditsContext = React.useMemo(
        () => ({
            fetchCredits: async () => {
                if (!query || !appConfig || !accessToken) {
                    return;
                }

                const { errorObject, payload } = await query(creditsAction);
                if (isSuccess(creditsEndpoint, payload)) {
                    const { accountCreditPoints } = responsePayload(creditsEndpoint, payload);
                    if (accountCreditPoints >= 0) {
                        dispatch({ type: 'UPDATE_CREDITS', credits: accountCreditPoints });
                    } else {
                        console.debug('[CreditsContext] recorded negative credits ', accountCreditPoints);
                    }
                } else {
                    console.log(
                        '[CreditsContext] Wallet response unsuccessful ',
                        errorObject,
                        errorCode(creditsEndpoint, payload),
                    );
                }
            },
            pauseRefresh: async () => dispatch({ type: 'PAUSE_REFRESH' }),
            resumeRefresh: async () => dispatch({ type: 'RESUME_REFRESH' }),
        }),
        [creditsAction, creditsEndpoint, query, appConfig, accessToken],
    );

    // Setup initial credits fetch
    useEffect(() => {
        creditsContext.fetchCredits();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken]);

    // Setup auto background refresh of credits
    const creditsRefreshInterval = (appConfig && appConfig.creditsRefreshIntervalMs) || DEFAULT_REFRESH_INTERVAL_MS;
    useCreditsRefresh(state, creditsContext, creditsRefreshInterval);

    return (
        <CreditsContext.Provider
            value={{
                ...state,
                ...creditsContext,
            }}>
            {children}
        </CreditsContext.Provider>
    );
};

export { CreditsContextProvider, CreditsContext };

export const useCredits = () => {
    const context = useContext(CreditsContext);
    if (context === undefined) {
        throw new Error('useCredits must be used within a CreditsContext');
    }
    return context;
};
