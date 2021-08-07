import React, { createContext, useReducer, useContext, useEffect, useCallback, useRef } from 'react';
import { AppState } from 'react-native';
import { Method, DiscoveryActionExt } from 'qp-discovery-ui';
import { useAppPreferencesState, AppConfig } from 'utils/AppPreferencesContext';
import { ClientContext } from 'react-fetching-library';
import * as Keychain from 'react-native-keychain';
import {
    EvergentEndpoints,
    requestBody,
    isSuccess,
    errorCode,
    AccountProfile,
    responsePayload,
} from 'utils/EvergentAPIUtil';
import { getItem, setItem } from 'utils/UserPreferenceUtils';
import { useEntitlements } from './EntitlementsContextProvider';
import crashlytics from '@react-native-firebase/crashlytics';
import diContainer from 'di/di-config';
import { AuthReponse } from 'features/authentication/domain/entities/auth-response';
import { Login, LoginParams } from 'features/authentication/domain/use-cases/login';
import { AUTH_DI_TYPES } from 'features/authentication/di/auth-di-types';
import { EmailSignup, EmailSignupParams } from 'features/authentication/domain/use-cases/email-signup';
import { ConfirmOTP, ConfirmOTPParams } from 'features/authentication/domain/use-cases/confirm-otp';
import { LogoutUser, LogoutUserParams } from 'features/authentication/domain/use-cases/logout';
import { FLOAuth2 } from 'features/authentication/domain/use-cases/fl-oauth2';

type USER_TYPE = 'INIT' | 'NOT_LOGGED_IN' | 'LOGGED_IN' | 'SUBSCRIBED';

export interface UserState {
    userType: USER_TYPE;
    signedUpInSession: boolean;
    error?: Error;
    accessToken?: string;
    accountProfile?: AccountProfile;
    silentLogin?: boolean;
    flAuthToken?: string;
    setString: ({
        attributeName,
        attributeValue,
        objectTypeName,
    }: {
        attributeName: string;
        attributeValue: string;
        objectTypeName: string;
    }) => Promise<any>;
    signUp: ({ email, password }: { email: string; password: string }) => Promise<any>;
    confirmOTP: ({
        mobileNumber,
        country,
        otp,
    }: {
        mobileNumber: string;
        country: string;
        otp: string;
    }) => Promise<any>;
    login: ({
        email,
        password,
        socialLoginId,
        socialLoginType,
    }: {
        email?: string;
        password?: string;
        socialLoginId?: string;
        socialLoginType?: string;
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
    confirmOTP: async () => {},
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
    if (!accountProfile) {
        return true;
    }

    if (accountProfile.subscriptionStatus) {
        return true;
    }

    const gracePeriodInMs = (appConfig && appConfig.subscriptionGracePeriodMs) || 0;
    if (!accountProfile.subscriptionStatus && isWithinGracePeriod(accountProfile.prevSubExpDateTime, gracePeriodInMs)) {
        console.debug('[AuthContext] User is in grace period', accountProfile.prevSubExpDateTime, gracePeriodInMs);
        return true;
    }

    return true;
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
                    accessToken: undefined,
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
            case 'UPDATE_FL_OAUTH': {
                return {
                    ..._state,
                    flAuthToken: action.value,
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
    const { xAuthToken } = useEntitlements();

    const setStringEndpoint = EvergentEndpoints.SetString;
    const createUserEndpoint = EvergentEndpoints.CreateUser;
    const loginEndpoint = EvergentEndpoints.LoginUser;
    const confirmOTPEndPoint = EvergentEndpoints.ConfirmOTP;
    const refreshTokenEndpoint = EvergentEndpoints.RefreshToken;
    //  const logoutEndpoint = EvergentEndpoints.LogOutUser;
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

                if (tokenData !== undefined && tokenData !== null && tokenData.refreshToken) {
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
            fetchFLAuthToken();
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

    const fetchFLAuthToken = async () => {
        if (appConfig) {
            let flOAuth2 = diContainer.get<FLOAuth2>(AUTH_DI_TYPES.FLOAuth2);
            const response = await flOAuth2.execute(appConfig);
            if (response) {
                dispatch({
                    name: 'UPDATE_FL_OAUTH',
                    value: response.access_token,
                });
            }
        } else {
            throw new Error('App Config not found');
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
        response: AuthReponse;
        email?: string;
        signedUpInSession?: boolean;
        silentLogin?: boolean;
        dispatchState?: boolean;
    }): Promise<string> => {
        return new Promise(async resolve => {
            let accessToken = response.accessToken;
            let refreshToken = response.refreshToken;
            let payload = JSON.stringify({ accessToken, refreshToken, email });
            await Keychain.setGenericPassword(accessToken, payload);
            await setItem('isTokenGenerated', 'generated');
            let accountProfile;
            email && crashlytics().setUserId(email);
            try {
                //  accountProfile = await getAccountProfile({ accessToken }); TODO: check here for account profile
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
            resolve(accessToken);
        });
    };

    const doLogout = useCallback(async () => {
        await Keychain.resetGenericPassword();
        dispatch({ name: 'LOG_OUT' });
    }, []);

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

            const headers = {
                Authorization: `Basic ${accessToken}`,
                'X-Oauth2': `${xAuthToken}`,
            };
            // let action = authAction({
            //     method: 'POST',
            //     endpoint: endpoint,
            //     body,
            //     accessToken,
            // });

            const action: DiscoveryActionExt = {
                method: 'GET',
                endpoint: '',
                clientIdentifier: 'profile',
                headers: headers,
            };

            const { payload } = await query(action);
            if (payload && payload.data) {
                apErrRepeat.current = 0;
                const response = payload.data; //responsePayload(endpoint, payload);
                return response;
            } else {
                // throw errorCode(endpoint, payload);
                apErrRepeat.current = apErrRepeat.current + 1;
                handleAccountProfileErrorRes({ accessToken, endpoint, payload });
            }
        },
        [handleAccountProfileErrorRes, query, xAuthToken],
    ); // eslint-disable-line react-hooks/exhaustive-deps

    const authActions = React.useMemo(
        () => ({
            setString: async ({
                attributeName,
                attributeValue,
                objectTypeName,
            }: {
                attributeName: string;
                attributeValue: string;
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
                socialLoginId,
                socialLoginType,
            }: {
                email?: string;
                password?: string;
                socialLoginId?: string;
                socialLoginType?: string;
            }) => {
                if (appConfig) {
                    let login = diContainer.get<Login>(AUTH_DI_TYPES.EmailLogin);
                    const response = await login.execute(
                        new LoginParams(appConfig, email, password, socialLoginId, socialLoginType),
                    );
                    await doLogin({ response, email });
                    return response;
                } else {
                    throw new Error('App Config not found');
                }
            },

            confirmOTP: async ({
                mobileNumber,
                country,
                otp,
            }: {
                mobileNumber: string;
                country: string;
                otp: string;
            }) => {
                if (appConfig) {
                    let confirmOTP = diContainer.get<ConfirmOTP>(AUTH_DI_TYPES.ConfirmOTP);
                    const response = await confirmOTP.execute(
                        new ConfirmOTPParams(mobileNumber, country, otp, appConfig),
                    );
                    await doLogin({ response });
                    return response;
                } else {
                    throw new Error('App Config not found');
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
                if (payload) {
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
            signUp: async ({ email, password }: { email: string; password: string }) => {
                if (appConfig) {
                    let emailSignUp = diContainer.get<EmailSignup>(AUTH_DI_TYPES.EmailSignup);
                    const response = await emailSignUp.execute(new EmailSignupParams(email, password, appConfig));
                    await doLogin({ response, email });
                    return response;
                } else {
                    throw new Error('App Config not found');
                }
            },
            logout: async () => {
                if (appConfig) {
                    let tokenData = await getKeychainToken();
                    const accessToken = tokenData && tokenData.accessToken;
                    let logout = diContainer.get<LogoutUser>(AUTH_DI_TYPES.Logout);
                    await logout.execute(new LogoutUserParams(accessToken, appConfig));
                    await doLogout();
                } else {
                    throw new Error('App Config not found');
                }
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
        [
            appConfig,
            createUserEndpoint,
            doLogout,
            loginEndpoint,
            confirmOTPEndPoint,
            query,
            refreshTokenEndpoint,
            state.accessToken,
        ],
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
