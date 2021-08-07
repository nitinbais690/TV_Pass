import { DiscoveryActionExt } from 'components/qp-discovery-ui';
import React, { Context, useCallback, useContext, useEffect, useRef } from 'react';
import { ClientContext } from 'react-fetching-library';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';

interface GeoDataState {
    loading: boolean;
    error: boolean;
    errorObject: Error | undefined;
    isRestricted: boolean;
    region: string;
    countryCode: string;
}

const initialState: GeoDataState = {
    loading: true,
    error: false,
    errorObject: undefined,
    isRestricted: false,
    region: '',
    countryCode: '',
};

const GeoDataContext: Context<GeoDataState> = React.createContext({
    ...initialState,
});

const GeoDataContextProvider = ({ children }: { children: React.ReactNode }) => {
    const isMounted = useRef(true);
    const { appConfig } = useAppPreferencesState();
    const { query } = useContext(ClientContext);

    const [state, dispatch] = React.useReducer((prevState, action) => {
        switch (action.type) {
            case 'UPDATE_GEO_DATA':
                return {
                    ...prevState,
                    loading: false,
                    isRestricted: action.isRestricted,
                    region: action.region,
                    countryCode: action.countryCode,
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

    const fetchGeoData = useCallback(async () => {
        // Fetch all bookmarks and redeemed assets
        const allowedRegions = appConfig && appConfig.allowedRegions.toLowerCase().split(',');
        const action: DiscoveryActionExt = {
            method: 'GET',
            endpoint: 'json',
            clientIdentifier: 'geo',
        };
        const response = await query(action);
        const countryDetected = response.payload && response.payload.countryCode;
        const region = response.payload && response.payload.region;
        const countryCode = response.payload.countryCode;

        let isRestricted = false;

        if (!countryDetected) {
            console.error(`[GeoChecker] failed to determine country: ${countryDetected}`);
            isRestricted = false;
        }

        if (!allowedRegions.includes(countryDetected.toLowerCase())) {
            console.debug(
                `[GeoChecker] User detected to be in ${countryDetected}, but allowedRegions: ${allowedRegions}`,
            );
            isRestricted = true;
        }

        try {
            dispatch({ type: 'UPDATE_GEO_DATA', isRestricted, region, countryCode });
        } catch (e) {
            if (!isMounted.current) {
                return;
            }
            dispatch({ type: 'ERROR', value: e });
            return;
        }
    }, [appConfig, query]);

    useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (!appConfig) {
            return;
        }

        fetchGeoData();
    }, [appConfig, fetchGeoData]);

    return <GeoDataContext.Provider value={{ ...state }}>{children}</GeoDataContext.Provider>;
};

export { GeoDataContextProvider, GeoDataContext };

export const useGeoData = () => {
    const context = useContext(GeoDataContext);
    if (context === undefined) {
        throw new Error('useGeoData must be used within a GeoDataContext');
    }
    return context;
};
