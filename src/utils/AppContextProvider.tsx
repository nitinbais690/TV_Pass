import React, { Context, useEffect, useContext, useState } from 'react';
import { ClientContext } from 'react-fetching-library';
import { useAppPreferencesState, AppConfig } from './AppPreferencesContext';
import { useAuth } from '../contexts/AuthContextProvider';
import { useNetworkStatus } from '../contexts/NetworkContextProvider';
import { isRegionRestricted } from './GeoChecker';
import { Platform } from 'react-native';

export type AppNavigationState =
    | 'INIT'
    | 'AUTH'
    | 'PURCHASE_SUBSCRIPTION'
    | 'BROWSE_APP'
    | 'OFFLINE'
    | 'PREVIEW_APP'
    | 'FORCE_UPDATE'
    | 'REGION_LOCK';

interface AppState {
    appNavigationState: AppNavigationState;
    routeToDownloads: boolean;
    signedUpInSession: boolean;
}

interface AppActions {
    splashLoaded: () => Promise<void>;
    previewApp: () => Promise<void>;
    triggerSubscribedFlow: () => Promise<void>;
    triggerAuthFlow: () => Promise<void>;
}

const initialState: AppState = {
    appNavigationState: 'INIT',
    routeToDownloads: false,
    signedUpInSession: false,
};

const AppContext: Context<AppState & AppActions> = React.createContext({
    ...initialState,
    splashLoaded: async () => {},
    previewApp: async () => {},
    triggerSubscribedFlow: async () => {},
    triggerAuthFlow: async () => {},
});

/**
 * AppContextProvider manages App Startup sequence & App Navigation states.
 *
 *                    │
 *                    │
 *                    ▼
 *         ┌───────────────────┐
 *         │       INIT        │◀ ─── ─ ─── ─ ─── ─ ─── ─ ─── ┬ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
 *         └───────────────────┘                                                 │                │
 *                    │
 *                    ├────────────┬─────────────────┬─────────┼────────┬─────────┼──────┐        │
 *                    │            │                 │                  │                │
 *┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┼            ▼                 ▼                  ▼         │      ▼        │
 *   ┌─────────────┐  ││   ┌──────────────┐  ┌──────────────┐  │┌──────────────┐   ┌───────────┐
 *└ ▶│ APP_PREVIEW │──┼───▶│     AUTH     │  │  SUBSCRIBE   │─  │  BROWSE_APP  │─ ┘│  OFFLINE  │─ ┘
 *   └─────────────┘  │    └──────────────┘  └──────────────┘   └──────────────┘   └───────────┘
 *                    │            │                 │                  ▲
 *                    │                                                 │
 *                    │            └ ─ ─ ─ ─ ─ ─ ─ ─ ┴ ─ ─ ─ ─ ─ ─ ─ ─ ─
 *                    │    ┌──────────────┐
 *                    ├───▶│ FORCE_UPDATE │
 *                    │    └──────────────┘
 *                    │    ┌───────────┐
 *                    └───▶│REGION_LOCK│
 *                         └───────────┘
 *
 *
 *  ─ ─ ▶  User Initiated
 *  ────▶  Hot Path (Needs to be determined at app startup)
 *  ────▶  Lazy Loaded (Auto initiated)
 *
 */
const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [splashLoaded, setSplashLoaded] = useState<boolean>(false);
    const { appConfig } = useAppPreferencesState();
    const { type, isInternetReachable } = useNetworkStatus();
    const { query } = useContext(ClientContext);
    const userState = useAuth();
    const { userType, accessToken } = userState;

    const [state, dispatch] = React.useReducer((prevState, action) => {
        console.log('ACTION TYPE', action.type);
        switch (action.type) {
            case 'INIT':
                return {
                    ...prevState,
                    appNavigationState: 'INIT',
                };
            case 'NOT_LOGGED_IN':
                return {
                    ...prevState,
                    appNavigationState: 'AUTH',
                };
            case 'LOGGED_IN':
                return {
                    ...prevState,
                    appNavigationState: 'PURCHASE_SUBSCRIPTION',
                    accessToken: action.payload.accessToken,
                    signedUpInSession: userState.signedUpInSession,
                };
            case 'SUBSCRIBED':
                return {
                    ...prevState,
                    appNavigationState: 'BROWSE_APP',
                    accessToken: action.payload.accessToken,
                    routeToDownloads: action.payload.routeToDownloads,
                };
            case 'OFFLINE':
                return {
                    ...prevState,
                    appNavigationState: action.type,
                };
            case 'PREVIEW_APP':
                return {
                    ...prevState,
                    appNavigationState: action.type,
                };
            case 'FORCE_UPDATE':
                return {
                    ...prevState,
                    appNavigationState: action.type,
                };
            case 'REGION_LOCK':
                return {
                    ...prevState,
                    appNavigationState: action.type,
                };
        }
    }, initialState);

    const appContext = React.useMemo(
        () => ({
            splashLoaded: async () => {
                setSplashLoaded(true);
            },
            previewApp: async () => {
                dispatch({ type: 'PREVIEW_APP' });
            },
            triggerAuthFlow: async () => {
                dispatch({ type: 'NOT_LOGGED_IN' });
            },
            triggerSubscribedFlow: async () => {
                dispatch({
                    type: 'SUBSCRIBED',
                    payload: { accessToken: accessToken, routeToDownloads: false },
                });
            },
        }),
        [accessToken],
    );

    useEffect(() => {
        if (!appConfig) {
            return;
        }
        const hasDownloads = async () => {
            if (!Platform.isTV) {
                try {
                    const downloadManager = require('rn-qp-nxg-player');
                    const downloads = await downloadManager.getAllDownloads();
                    return downloads.length > 0;
                } catch (e) {
                    return false;
                }
            }
        };

        const manageAppContext = async () => {
            // Still determining internet connectivity
            // or
            // Struum logo still loading
            if (type === 'unknown' || !splashLoaded) {
                return;
            }

            // When user is already browsing, when losing network, remain in browse mode
            if (
                isInternetReachable === false &&
                (state.appNavigationState === 'BROWSE_APP' || state.appNavigationState === 'APP_PREVIEW')
            ) {
                return;
            }
            if (!Platform.isTV) {
                const hasOfflineDownloads = await hasDownloads();
                const routeToOffline = isInternetReachable === false && !hasOfflineDownloads;
                const routeToDownloads = isInternetReachable === false && hasOfflineDownloads;

                // user is offline and does not have any offline downloads,
                // route user to offline screen
                if (routeToOffline) {
                    dispatch({ type: 'OFFLINE' });
                    return;
                }

                // user is offline with local downloads
                // route user to browse experience
                if (routeToDownloads) {
                    dispatch({
                        type: 'SUBSCRIBED',
                        payload: { accessToken: accessToken, routeToDownloads: true },
                    });
                    return;
                }
            }

            // user is online, route based on user state
            if (userType !== 'INIT') {
                dispatch({
                    type: userType,
                    payload: { accessToken: accessToken, routeToDownloads: false },
                });
            }
        };

        manageAppContext();

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appConfig, userType, splashLoaded, isInternetReachable]);

    useEffect(() => {
        if (!appConfig) {
            return;
        }

        const regionCheck = async (config: AppConfig) => {
            if (!config) {
                return;
            }

            const isRestricted = await isRegionRestricted(config, query);
            if (isRestricted) {
                dispatch({ type: 'REGION_LOCK' });
            }
        };

        regionCheck(appConfig);

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appConfig]);

    return (
        <AppContext.Provider
            value={{
                ...state,
                ...userState,
                ...appContext,
            }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContextProvider, AppContext };

export const useAppState = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppState must be used within a AppContext');
    }
    return context;
};
