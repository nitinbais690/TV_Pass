import { useEffect, useState, useRef, useContext } from 'react';
import { ClientContext } from 'react-fetching-library';
import { DiscoveryActionExt } from 'qp-discovery-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useAuth } from 'contexts/AuthContextProvider';
import { EvergentEndpoints, requestBody, isSuccess } from 'utils/EvergentAPIUtil';

export const useTVODRecordPlayStart = (playerState: any, tvodToken: string) => {
    const isMounted = useRef(true);
    const { appConfig } = useAppPreferencesState();
    const { accessToken } = useAuth();
    const { query } = useContext(ClientContext);
    const [recordedPlayStart, setRecordedPlayStart] = useState<boolean>(false);

    useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        const recordPlayTime = async () => {
            const endpoint = EvergentEndpoints.RecordPlayTime;
            const body = requestBody(endpoint, appConfig, {
                playAuthToken: tvodToken,
            });
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
                console.debug('[useTVODRecordPlayStart] Successfully recorded play start');
                if (isMounted.current) {
                    setRecordedPlayStart(true);
                }
            }
        };

        if (playerState === 'STARTED' && !recordedPlayStart) {
            console.debug('[useTVODRecordPlayStart] Begin recording Play Start');
            recordPlayTime();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerState]);
};
