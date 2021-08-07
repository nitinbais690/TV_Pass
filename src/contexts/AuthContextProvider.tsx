import React, { createContext, useReducer, useContext, useEffect, useCallback, useRef } from 'react';
import { AppState } from 'react-native';
import { Method, DiscoveryActionExt } from 'qp-discovery-ui';
import { useAppPreferencesState, AppConfig } from 'utils/AppPreferencesContext';
import { ClientContext } from 'react-fetching-library';
import * as Keychain from 'react-native-keychain';
import DeviceInfo from 'react-native-device-info';
import {
    EvergentEndpoints,
    requestBody,
    isSuccess,
    errorCode,
    responsePayload,
    AccountProfile,
} from 'utils/EvergentAPIUtil';
import { getItem, setItem } from 'utils/UserPreferenceUtils';

type USER_TYPE = 'INIT' | 'NOT_LOGGED_IN' | 'LOGGED_IN' | 'SUBSCRIBED';

export interface UserState {
    userType: USER_TYPE;
    signedUpInSession: boolean;
    error?: Error;
    accessToken?: string;
    accountProfile?: AccountProfile;
    silentLogin?: boolean;
    setString: ({
        attributeName,
        attributeValue,
        objectTypeName,
    }: {
        attributeName: string;
        attributeValue: any;
        objectTypeName: string;
    }) => Promise<any>;
    signUp: ({
        email,
        password,
        region,
        sendEmailUpdates,
        signedUpInSession,
    }: {
        email: string;
        password: string;
        region: string;
        sendEmailUpdates: boolean;
        signedUpInSession: boolean;
    }) => Promise<any>;
    login: ({
        email,
        password,
        signedUpInSession,
        silentLogin,
    }: {
        email: string;
        password: string;
        signedUpInSession: boolean;
        silentLogin: boolean;
    }) => Promise<any>;
    refreshToken: (tokenData: any) => Promise<void>;
    logout: () => Promise<void>;
    updatedAccountProfile: () => Promise<void>;
}

export const initialState: UserState = {
    userType: 'INIT',
    signedUpInSession: false,
    error: undefined,
    accessToken: undefined,
    silentLogin: undefined,
    setString: async () => {},
    signUp: async () => {},
    login: async () => {},
    refreshToken: async () => {},
    logout: async () => {},
    updatedAccountProfile: async () => {},
};

/**
 * Determines if the user is currently in subscription grace-period
 *
 * @param subscriptionExpiryDate
 * @param gracePeriodInMs
 */
const isWithinGracePeriod = (subscriptionExpiryDate: number, gracePeriodInMs: number): boolean => {
    if (subscriptionExpiryDate === undefined || subscriptionExpiryDate <= 0 || gracePeriodInMs <= 0) {
        return false;
    }

    const currentTime = new Date().getTime();
    const gracePriodEndTime = subscriptionExpiryDate + gracePeriodInMs;
    return currentTime < gracePriodEndTime;
};

/**
 * Checks whether user has a valid subscription. The following conditions
 * describe a valid subscription:
 *
 * 1. `subscriptionStatus` is true
 * 2. `subscriptionStatus` is false, but `prevSubExpDateTime` is within grace-period
 * (grace-period is defined via app-config)
 *
 * @param accountProfile
 * @param appConfig
 */
const isSubscribed = (accountProfile?: AccountProfile, appConfig?: AppConfig) => {
    const time = new Date().getTime();
    if (!accountProfile) {
        return false;
    }

    if (accountProfile.subscriptionStatus) {
        return true;
    }

    if (accountProfile.hasSubCancelled && accountProfile.prevSubExpDateTime < time) {
        return false;
    }

    const gracePeriodInMs = (appConfig && appConfig.subscriptionGracePeriodMs) || 0;
    if (!accountProfile.subscriptionStatus && isWithinGracePeriod(accountProfile.prevSubExpDateTime, gracePeriodInMs)) {
        console.debug('[AuthContext] User is in grace period', accountProfile.prevSubExpDateTime, gracePeriodInMs);
        return true;
    }

    return false;
};

export const AuthContext = createContext(initialState);
/**
 * AuthContextProvider manages user's authentication flows (sign-up, explicit login and implicit login and logout)
 *
 *
 * State Machine for User states:
 *
 *                                 │
 *                                 │
 *                                 ▼
 *                         ┌───────────────────┐
 *                         │       INIT        │
 *                         └───────────────────┘
 *                                 │
 *               ┌─────────────────┼──────────────────┐
 *               │                 │                  │
 *               ▼                 ▼                  ▼
 *       ┌────────────────┐   ┌───────────┐    ┌──────────────┐
 *       │ NOT_LOGGED_IN  │   │ LOGGED_IN │◀───│  SUBSCRIBED  │
 *       └────────────────┘   └───────────┘    └──────────────┘
 *               │                 ▲                  ▲
 *               │                 │                  │
 *               └─────────────────┴──────────────────┘
 *
 */
export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { appConfig } = useAppPreferencesState();

    const controlReducer = (_state: UserState, action: any): UserState => {
        switch (action.name) {
            case 'LOG_IN':
                return {
                    ..._state,
                    userType: isSubscribed(action.accountProfile, appConfig) ? 'SUBSCRIBED' : 'LOGGED_IN',
                    error: undefined,
                    accessToken: action.value,
                    signedUpInSession: action.signedUpInSession,
                    accountProfile: action.accountProfile,
                    silentLogin: action.silentLogin,
                };
            case 'LOG_IN_ERROR':
                return {
                    ..._state,
                    userType: 'INIT',
                    error: action.value,
                };
            case 'LOG_OUT': {
                return {
                    ..._state,
                    userType: 'NOT_LOGGED_IN',
                    error: undefined,
                };
            }
            case 'UPDATE_ACCOUNT_PROFILE': {
                return {
                    ..._state,
                    accountProfile: action.accountProfile,
                };
            }
            default:
                return {
                    ..._state,
                };
        }
    };

    const [state, dispatch] = useReducer(controlReducer, initialState);
    const { query } = useContext(ClientContext);
    const appState = useRef(AppState.currentState);
    const apErrRepeat = useRef(0);
    const tokenIntRef = useRef<any>();

    const setStringEndpoint = EvergentEndpoints.SetString;
    const createUserEndpoint = EvergentEndpoints.CreateUser;
    const loginEndpoint = EvergentEndpoints.LoginUser;
    const refreshTokenEndpoint = EvergentEndpoints.RefreshToken;
    const logoutEndpoint = EvergentEndpoints.LogOutUser;
    const accessTokenExpTimeout = (appConfig && appConfig.accessTokenExpTimeout) || 60 * 1000 * 50;

    useEffect(() => {
        const handleAppStateChange = (nextAppState: any) => {
            if (appState.current.match(/background/) && nextAppState === 'active') {
                clearInterval(tokenIntRef.current);
                tokenIntRef.current = setInterval(handleTokenExp, accessTokenExpTimeout);
                handleTokenExp();
            }

            appState.current = nextAppState;
        };

        AppState.addEventListener('change', handleAppStateChange);

        return () => {
            AppState.removeEventListener('change', handleAppStateChange);
        };

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        tokenIntRef.current = setInterval(handleTokenExp, accessTokenExpTimeout);

        return () => {
            clearInterval(tokenIntRef.current);
        };

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const tokenSetup = async () => {
            const isTokenGenerated = await getItem('isTokenGenerated', '');
            if (isTokenGenerated === undefined || isTokenGenerated === null || isTokenGenerated === '') {
                await Keychain.resetGenericPassword();
            }
        };
        tokenSetup();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        const bootstrapAsync = async () => {
            try {
                let tokenData = await getKeychainToken();
                if (tokenData !== undefined && tokenData !== null) {
                    await authActions.refreshToken(tokenData);
                } else {
                    await doLogout();
                }
            } catch {
                await doLogout();
            }
        };
        if (appConfig !== undefined) {
            bootstrapAsync();
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appConfig]);

    const handleTokenExp = async () => {
        try {
            let tokenData = await getKeychainToken();
            if (tokenData !== undefined && tokenData !== null) {
                await authActions.refreshToken(tokenData);
            }
        } catch (err) {
            console.error(err);
        }
    };

    //eslint-disable-next-line react-hooks/exhaustive-deps
    const getKeychainToken = async () => {
        let kcToken = null;
        let output = null;
        try {
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                kcToken = credentials.password;
            }
            if (kcToken) {
                output = JSON.parse(kcToken);
            }
        } catch (error) {
            console.error(error);
        }
        return output;
    };

    const doLogin = async ({
        response,
        email,
        signedUpInSession,
        silentLogin,
    }: {
        response: any;
        email: string;
        signedUpInSession?: boolean;
        silentLogin?: boolean;
    }) => {
        let accessToken = response.accessToken;
        let refreshToken = response.refreshToken;
        let payload = JSON.stringify({ accessToken, refreshToken, email });
        await Keychain.setGenericPassword(accessToken, payload);
        await setItem('isTokenGenerated', 'generated');
        let accountProfile;
        try {
            accountProfile = await getAccountProfile({ accessToken });
        } catch (e) {
            console.error('[AuthContext] Error fetching account profile', e);
        }
        dispatch({
            name: 'LOG_IN',
            value: accessToken,
            signedUpInSession: signedUpInSession,
            accountProfile: accountProfile,
            silentLogin: silentLogin,
        });
    };

    const doLogout = useCallback(async () => {
        let tokenData = await getKeychainToken();
        if (tokenData !== undefined && tokenData !== null) {
            const body = requestBody(logoutEndpoint, appConfig);
            let action = authAction({
                method: 'POST',
                endpoint: logoutEndpoint,
                body,
                accessToken: tokenData.accessToken,
            });
            await query(action);
        }
        await Keychain.resetGenericPassword();
        dispatch({ name: 'LOG_OUT' });
    }, [appConfig, logoutEndpoint, query]);

    // Retry account profile for 2 more times foe failure cases
    const handleAccountProfileErrorRes = useCallback(async ({ accessToken, endpoint, payload }: any) => {
        if (apErrRepeat.current >= 2) {
            throw errorCode(endpoint, payload);
        } else {
            await getAccountProfile({ accessToken });
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const getAccountProfile = useCallback(
        async ({ accessToken }: { accessToken?: string }) => {
            const endpoint = EvergentEndpoints.GetAccountProfile;
            const body = requestBody(endpoint, appConfig, {
                returnAssetTxnHistory: false,
                returnActivationCodes: false,
                returnPaymentMethod: false,
                returnAttributes: true,
                returnHardwareOps: false,
                returnAccountRole: false,
                returnProdCodes: false,
                returnContactProfiles: true,
            });

            let action = authAction({
                method: 'POST',
                endpoint: endpoint,
                body,
                accessToken,
            });

            const { payload } = await query(action);
            if (isSuccess(endpoint, payload)) {
                apErrRepeat.current = 0;
                const response = responsePayload(endpoint, payload);
                return response;
            } else {
                // throw errorCode(endpoint, payload);
                apErrRepeat.current = apErrRepeat.current + 1;
                handleAccountProfileErrorRes({ accessToken, endpoint, payload });
            }
        },
        [appConfig, handleAccountProfileErrorRes, query],
    ); // eslint-disable-line react-hooks/exhaustive-deps

    const authActions = React.useMemo(
        () => ({
            setString: async ({
                attributeName,
                attributeValue,
                objectTypeName,
            }: {
                attributeName: string;
                attributeValue: any;
                objectTypeName: string;
            }) => {
                let tokenData = await getKeychainToken();
                const body = requestBody(setStringEndpoint, appConfig, {
                    attributeName,
                    attributeValue,
                    objectTypeName,
                });

                let action = authAction({
                    method: 'POST',
                    endpoint: setStringEndpoint,
                    body,
                    accessToken: tokenData && tokenData.accessToken,
                });
                const { payload } = await query(action);
                if (isSuccess(setStringEndpoint, payload)) {
                    await authActions.updatedAccountProfile();
                } else {
                    throw errorCode(setStringEndpoint, payload);
                }
            },

            login: async ({
                email,
                password,
                signedUpInSession,
                silentLogin,
            }: {
                email: string;
                password: string;
                signedUpInSession: boolean;
                silentLogin: boolean;
            }) => {
                const body = requestBody(loginEndpoint, appConfig, {
                    contactUserName: email,
                    contactPassword: password,
                    deviceMessage: {
                        deviceName: (await DeviceInfo.getDeviceName()) || '',
                        deviceType: DeviceInfo.getDeviceType() || '',
                        modelNo: DeviceInfo.getModel() || '',
                        serialNo: DeviceInfo.getUniqueId() || '',
                    },
                });
                let action = authAction({
                    method: 'POST',
                    endpoint: loginEndpoint,
                    body,
                });

                const { payload } = await query(action);
                if (isSuccess(loginEndpoint, payload)) {
                    const response = responsePayload(loginEndpoint, payload);
                    await doLogin({ response, email, signedUpInSession, silentLogin });
                } else {
                    throw errorCode(loginEndpoint, payload);
                }
            },
            refreshToken: async (tokenData: any) => {
                const body = requestBody(refreshTokenEndpoint, appConfig, {
                    refreshToken: tokenData.refreshToken,
                });
                let action = authAction({
                    method: 'POST',
                    endpoint: refreshTokenEndpoint,
                    body,
                });

                const { payload } = await query(action);
                if (isSuccess(refreshTokenEndpoint, payload)) {
                    const response = responsePayload(refreshTokenEndpoint, payload);
                    await doLogin({
                        response,
                        email: tokenData.email,
                        signedUpInSession: false,
                        silentLogin: true,
                    });
                } else if (errorCode(refreshTokenEndpoint, payload)) {
                    // Note: We shouldn't logout for n/w errors (e.g., offline) and
                    // do it only when refresh token API actually fails
                    await doLogout();
                }
            },
            signUp: async ({
                email,
                password,
                region,
                sendEmailUpdates,
                signedUpInSession,
            }: {
                email: string;
                password: string;
                region: string;
                sendEmailUpdates: boolean;
                signedUpInSession: boolean;
            }) => {
                const body = requestBody(createUserEndpoint, appConfig, {
                    customerUsername: email,
                    customerPassword: password,
                    email: email,
                    region: region,
                    accountAttributes: [
                        {
                            type: 'String',
                            attributeName: 'emailUpdates',
                            value: sendEmailUpdates ? 'Yes' : 'No',
                        },
                    ],
                });
                let action = authAction({
                    method: 'POST',
                    endpoint: createUserEndpoint,
                    body,
                });
                const { payload } = await query(action);
                if (isSuccess(createUserEndpoint, payload)) {
                    await authActions.login({
                        email: email,
                        password: password,
                        signedUpInSession,
                        silentLogin: false,
                    });
                } else {
                    throw errorCode(createUserEndpoint, payload);
                }
            },
            logout: async () => {
                await doLogout();
            },
            updatedAccountProfile: async () => {
                try {
                    const accountProfile = await getAccountProfile({ accessToken: state.accessToken });
                    dispatch({
                        name: 'UPDATE_ACCOUNT_PROFILE',
                        accountProfile: accountProfile,
                    });
                } catch (e) {
                    console.error('[AuthContext] Error fetching account profile', e);
                }
            },
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [appConfig, createUserEndpoint, doLogout, loginEndpoint, query, refreshTokenEndpoint, state.accessToken],
    );

    return (
        <AuthContext.Provider
            value={{
                ...state,
                ...authActions,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthContext');
    }
    return context;
};

export const authAction = ({
    method,
    endpoint,
    body,
    accessToken,
}: {
    method: Method;
    endpoint: string;
    body?: { [key: string]: any };
    accessToken?: string;
}): DiscoveryActionExt => {
    return {
        method: method,
        endpoint: endpoint,
        body: body,
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        clientIdentifier: 'ums',
    };
};
