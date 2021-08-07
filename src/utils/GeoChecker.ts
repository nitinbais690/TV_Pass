import { AppConfig } from './AppPreferencesContext';
import { Action, QueryResponse } from 'react-fetching-library';
import { DiscoveryActionExt } from 'qp-discovery-ui';

/**
 * Verifies if the user is accessing the app from a restricted region.
 *
 * @param config Application config which defines the list of allowed regions
 * @param query react-fetch-lib's query
 */
export const isRegionRestricted = async (
    config: AppConfig,
    query: (actionInit: Action, skipCache?: boolean) => Promise<QueryResponse>,
) => {
    if (!config.allowedRegions) {
        return false;
    }

    const allowedRegions = config.allowedRegions.toLowerCase().split(',');
    const action: DiscoveryActionExt = {
        method: 'GET',
        endpoint: 'json',
        clientIdentifier: 'geo',
    };

    const response = await query(action);
    const countryDetected = response.payload && response.payload.countryCode;

    if (!countryDetected) {
        console.error(`[GeoChecker] failed to determine country: ${countryDetected}`);
        return false;
    }

    if (!allowedRegions.includes(countryDetected.toLowerCase())) {
        console.debug(`[GeoChecker] User detected to be in ${countryDetected}, but allowedRegions: ${allowedRegions}`);
        return true;
    }

    return false;
};
