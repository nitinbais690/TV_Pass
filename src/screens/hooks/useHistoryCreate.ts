import { useEffect, useRef, useContext } from 'react';
import { ClientContext } from 'react-fetching-library';
import { DiscoveryActionExt, ResourceVm } from 'qp-discovery-ui';
import { isSuccess as isFLMSuccess, error as flmError } from 'utils/FirstlightAPIUtils';
import { useFLPlatform } from 'platform/PlatformContextProvider';
import { AuthorizationToken } from 'rn-qp-nxg-player';
import { useEntitlements } from 'contexts/EntitlementsContextProvider';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';

export const useHistoryCreate = (currentPosition: number, duration: number, resource?: ResourceVm | null) => {
    const isMounted = useRef(true);
    const { isInternetReachable } = useNetworkStatus();
    const { appConfig } = useAppPreferencesState();
    const { query } = useContext(ClientContext);
    const { state: platformState } = useFLPlatform();
    const { platformAuthorizer } = platformState;
    const platformAuth = useRef(platformAuthorizer);
    let { xAuthToken } = useEntitlements();
    const historyAddedRef = useRef(false);
    const watchedPercentage = (appConfig && appConfig.historyWatchedPercentageThreshold) || 30;

    useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        const handleHistory = async () => {
            if (historyAddedRef.current) {
                return;
            }

            const watchedPercentageVal = (currentPosition / duration) * 100;
            if (!isNaN(watchedPercentageVal)) {
                if (Math.round(watchedPercentageVal) > watchedPercentage && resource) {
                    try {
                        historyAddedRef.current = true;
                        await CreateHistory(resource.id);
                    } catch (error) {
                        console.error('Create History Error - ' + error);
                    }
                }
            }
        };

        if (isInternetReachable) {
            handleHistory();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPosition, isInternetReachable]);

    const CreateHistory = async (itemId: string) => {
        if (!platformAuth.current) {
            return null;
        }
        const authToken: AuthorizationToken = await platformAuth.current.ensureAuthorization();

        const headers = {
            Authorization: `Bearer ${authToken.accessToken}`,
            'X-Authorization': xAuthToken || '',
        };
        const body = { itemId: itemId };

        const action: DiscoveryActionExt = {
            method: 'PUT',
            endpoint: 'create',
            headers: headers,
            body: body,
            clientIdentifier: 'history',
        };

        const { payload, errorObject } = await query(action);
        if (errorObject) {
            throw errorObject;
        }

        if (!isFLMSuccess(payload)) {
            throw flmError(payload);
        }

        return payload;
    };
};
