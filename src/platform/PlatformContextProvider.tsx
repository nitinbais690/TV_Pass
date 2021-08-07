import React, { useEffect, Context, useContext } from 'react';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
    platformAuthorizer,
    contentAuthorizer,
    createError,
    PlatformAuthorizer,
    ContentAuthorizer,
    PlatformError,
    PlatformAuthConfig,
    ContentAuthConfig,
    bookmarkService,
    BookmarkService,
} from 'rn-qp-nxg-player';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useEntitlements } from 'contexts/EntitlementsContextProvider';
import decrypt from 'utils/SecurityUtil';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { AppEvents, condenseErrorObject } from 'utils/ReportingUtils';

const MAX_PLATFORM_SETUP_RETRY_ATTEMPTS = 3;

type PlatformProviderChildren = { children: React.ReactNode };

export interface PlatformState {
    isConfiguring: boolean;
    isConfigured: boolean;
    platformAuthorizer: PlatformAuthorizer | null;
    contentAuthorizer: ContentAuthorizer | null;
    bookmarkService: BookmarkService | null;
    error: PlatformError | null;
    retryAttempts: number;
}

const initialState: PlatformState = {
    isConfiguring: false,
    isConfigured: false,
    platformAuthorizer: null,
    contentAuthorizer: null,
    bookmarkService: null,
    error: null,
    retryAttempts: 0,
};

const pltfmReducer = (state: any, action: any): any => {
    switch (action.type) {
        case 'CONFIGURING': {
            return {
                ...state,
                isConfiguring: true,
            };
        }
        case 'CONFIGURED': {
            return {
                ...state,
                isConfigured: true,
                isConfiguring: false,
                error: null,
                ...action.payload,
            };
        }
        case 'ERROR': {
            return {
                ...state,
                isConfigured: false,
                isConfiguring: false,
                error: action.payload,
                platformAuthorizer: null,
                contentAuthorizer: null,
                bookmarkService: null,
                retryAttempts: state.retryAttempts + 1,
            };
        }
    }
};

const PlatformContext: Context<{ state: PlatformState; dispatch: any }> = React.createContext({
    state: initialState,
    dispatch: null as any,
});

const PlatformContextProvider = ({ children }: PlatformProviderChildren) => {
    const [state, dispatch] = React.useReducer(pltfmReducer, initialState);
    let { xAuthToken, userAuthDelegate } = useEntitlements();
    const prefs = useAppPreferencesState();
    const { appConfig } = prefs;
    const { recordEvent } = useAnalytics();

    const platformAuthConfig: PlatformAuthConfig = {
        clientID: appConfig && appConfig.clientID,
        clientSecret: (appConfig && decrypt(appConfig.clientSecret)) || '',
        xClientID: appConfig && appConfig.xClientId,
        endpointURL: appConfig && appConfig.oAuthURL,
    };

    const configureTv = appConfig && appConfig.configureTvClient;

    const contentAuthConfig: ContentAuthConfig = {
        clientRegistrationEndpointURL: appConfig && appConfig.clientRegURL,
        contentAuthEndpointURL: appConfig && appConfig.contentAuthURL,
        platformClient: {
            id: DeviceInfo.getUniqueId(),
            type:
                Platform.OS === 'ios'
                    ? 'iosmobile'
                    : Platform.isTV
                    ? configureTv
                        ? 'androidtv'
                        : 'androidmobile'
                    : 'androidmobile',
        },
    };

    useEffect((): any => {
        return async function cleanup() {
            await platformAuthorizer.dispose();
            await contentAuthorizer.invalidateClientToken();
            await contentAuthorizer.dispose();
        };
    }, []);

    useEffect((): any => {
        async function configureQpNxgLib() {
            console.log('>>>>>>>>> configureQpNxgLib <<<<<<<<<<<');
            try {
                if (!platformAuthorizer || !contentAuthorizer) {
                    console.log(
                        `no platformAuthorizer(${platformAuthorizer}) or contentAuthorizer(${contentAuthorizer})`,
                    );
                    dispatch({
                        type: 'ERROR',
                        payload: createError(0x00, 'No Platfrom Authorizer (or) Content Authorizer'),
                    });
                    return;
                }
                if (!(await platformAuthorizer.isConfigured())) {
                    await platformAuthorizer.initWithConfig(platformAuthConfig);
                }
                platformAuthorizer.setUserAuthDelegate(userAuthDelegate);
                await platformAuthorizer.ensureAuthorization();

                if (!(await contentAuthorizer.isConfigured())) {
                    await contentAuthorizer.initWithConfig(contentAuthConfig);
                }
                if (!Platform.isTV) {
                    await contentAuthorizer.ensureClientRegistration();
                }

                await bookmarkService.initializeBookmarkService({
                    bookmarkServiceEndpoint: appConfig && appConfig.bookmarkURL,
                });

                dispatch({
                    type: 'CONFIGURED',
                    payload: {
                        platformAuthorizer,
                        contentAuthorizer,
                        bookmarkService,
                    },
                });
                console.log('platform configuration done!');
            } catch (e) {
                recordEvent(AppEvents.ERROR, condenseErrorObject(e, AppEvents.PLATFORM_CONFIGURATION_ERROR));
                console.debug(`state.retryAttempts: ${state.retryAttempts}, error: ${JSON.stringify(e, null, 2)}`);
                dispatch({
                    type: 'ERROR',
                    payload: createError(0x00, 'Configuration Failed', JSON.stringify(e, null, 2)),
                });
            }
        }

        if (
            xAuthToken &&
            !state.isConfiguring &&
            !state.isConfigured &&
            state.retryAttempts < MAX_PLATFORM_SETUP_RETRY_ATTEMPTS
        ) {
            dispatch({ type: 'CONFIGURING' });
            configureQpNxgLib();
        }

        // Note: Update userAuthDelegate when `xAuthToken` changes
        if (xAuthToken && state.isConfigured && platformAuthorizer) {
            platformAuthorizer.setUserAuthDelegate(userAuthDelegate);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [xAuthToken, state.error, state.retryAttempts]);

    return (
        <>
            <PlatformContext.Provider value={{ state, dispatch }}>{children}</PlatformContext.Provider>
        </>
    );
};

export { PlatformContextProvider, PlatformContext };

export const useFLPlatform = () => {
    const context = useContext(PlatformContext);
    if (context === undefined) {
        throw new Error('useFLPlatform must be used within a PlatformContext');
    }
    return context;
};
