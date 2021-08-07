import React, { Context, useRef, useEffect, useCallback, useContext } from 'react';
import { ClientContext } from 'react-fetching-library';
import { DiscoveryActionExt, Category } from 'qp-discovery-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useAuth } from 'contexts/AuthContextProvider';
import { EvergentEndpoints, requestBody, isSuccess, errorCode, responsePayload } from 'utils/EvergentAPIUtil';
import { BookmarkRecord, bookmarkService } from 'rn-qp-nxg-player';
import { promiseWithTimeout } from 'utils/PromiseUtils';
import { useFLPlatform } from 'platform/PlatformContextProvider';
import { createError } from 'utils/Error';
import { useCredits } from 'utils/CreditsContextProvider';

export interface VODEntitlement {
    /**
     * The `datetime` representing the purchase of the asset
     */
    startDate: string;
    /**
     * The type of the redeemed asset
     */
    assetType: Category;
    /**
     * The Stop status of the asset
     */
    validityEndDate: string;
    /**
     * The service name
     */
    serviceName: string;
    /**
     * The redeemed asset id
     * (Caveat: This should ideally be called assetId, but EV is unable to change this schema)
     */
    serviceID: string;
    /**
     * Playback start time
     */
    startTime?: string;
    /**
     * Playback offset time
     */
    offset?: number;
    /**
     * Timestamp of bookmark record
     */
    updatedTimestamp?: number;
}

interface UserDataState {
    loading: boolean;
    error: boolean;
    errorObject: Error | undefined;
    redeemedAssets: VODEntitlement[];
    bookmarks: BookmarkRecord[];
    reload: () => void;
}

const initialState: UserDataState = {
    loading: true,
    error: false,
    errorObject: undefined,
    redeemedAssets: [],
    bookmarks: [],
    reload: () => {},
};

const UserDataContext: Context<UserDataState> = React.createContext({
    ...initialState,
});

/**
 * UserDataContext manages accessing X-Authorization/ovat/FL access token from UMS system
 */
const UserDataContextProvider = ({ children }: { children: React.ReactNode }) => {
    const isMounted = useRef(true);
    const { appConfig } = useAppPreferencesState();
    const { accessToken } = useAuth();
    const { credits } = useCredits();
    const { state: platformState } = useFLPlatform();
    const { isConfigured: isPlatformConfigured, error: platformError } = platformState;
    const { query } = useContext(ClientContext);

    const BOOKMARK_FETCH_TIMEOUT_MS = (appConfig && appConfig['mycontent.bookmarkTimeoutMs']) || 10000;

    const [state, dispatch] = React.useReducer((prevState, action) => {
        switch (action.type) {
            case 'UPDATE_USER_DATA':
                return {
                    ...prevState,
                    loading: false,
                    bookmarks: action.bookmarks,
                    redeemedAssets: action.redeemedAssets,
                };
            case 'ERROR':
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

    /**
     * Fetch all bookmarks for the current user
     */
    const fetchBookmarks = useCallback(async (): Promise<BookmarkRecord[]> => {
        const totalBookmarks = (appConfig && appConfig.continueWatchMaxCount) || 50;
        try {
            const fetchBookmarkPromise = bookmarkService.getBookmarks({
                pageNumber: 1,
                pageSize: totalBookmarks,
                sortBy: 'ut',
                sortOrder: 'desc',
            });
            const bookmarks = await promiseWithTimeout<BookmarkRecord[]>(
                fetchBookmarkPromise,
                BOOKMARK_FETCH_TIMEOUT_MS,
                'Bookmark fetch timed-out',
            );
            return bookmarks;
        } catch (e) {
            console.debug('Error fetching bookmarks', e);
        }
        return [];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appConfig]);

    /**
     * Fetches all redeemed VOD assets for the current user
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fetchRedeemedAssets = useCallback(async (): Promise<VODEntitlement[]> => {
        const endpoint = EvergentEndpoints.GetVODEntitlements;
        const body = requestBody(endpoint, appConfig, { sortBy: 'serviceStartDate', sortOrder: 'descending' });
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        const action: DiscoveryActionExt = {
            method: 'POST',
            endpoint: endpoint,
            body: body,
            headers: headers,
            clientIdentifier: 'ums',
        };

        const { payload } = await query(action);
        if (isSuccess(endpoint, payload)) {
            const { VODDetailsMessage } = responsePayload(endpoint, payload);
            return VODDetailsMessage || [];
        } else {
            console.debug('[] fetchRedeemedAssets failed with error', errorCode(endpoint, payload));
            throw createError(errorCode(endpoint, payload));
        }
    }, [accessToken, appConfig, query]);

    const fetchUserData = useCallback(async () => {
        // Fetch all bookmarks and redeemed assets
        let bookmarks: BookmarkRecord[] = [];
        let redeemedAssets: VODEntitlement[] = [];

        try {
            [bookmarks /*redeemedAssets*/] = await Promise.all([fetchBookmarks() /*fetchRedeemedAssets()*/]);

            dispatch({ type: 'UPDATE_USER_DATA', bookmarks, redeemedAssets });
        } catch (e) {
            if (!isMounted.current) {
                return;
            }

            dispatch({ type: 'ERROR', value: e });
            return;
        }
    }, [fetchBookmarks /*fetchRedeemedAssets*/]);

    useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (isPlatformConfigured || platformError) {
            fetchUserData();
        }
    }, [isPlatformConfigured, platformError, fetchUserData, credits]);

    return <UserDataContext.Provider value={{ ...state, reload: fetchUserData }}>{children}</UserDataContext.Provider>;
};

export { UserDataContextProvider, UserDataContext };

export const useUserData = () => {
    const context = useContext(UserDataContext);
    if (context === undefined) {
        throw new Error('useUserData must be used within a UserDataContext');
    }
    return context;
};
