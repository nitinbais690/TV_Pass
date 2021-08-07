import React, { useEffect, useCallback } from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useNetworkStatus } from '../../contexts/NetworkContextProvider';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import { useAlert } from 'contexts/AlertContext';

const OfflineScreen = (): JSX.Element => {
    const { strings } = useLocalization();
    const { retry, isInternetReachable } = useNetworkStatus();
    const { Alert, dismiss } = useAlert();

    useEffect(() => {
        if (isInternetReachable) {
            dismiss();
        } else {
            offlineAlert();
        }

        return () => {
            dismiss();
        };

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInternetReachable]);

    const offlineAlert = useCallback(async () => {
        Alert.alert(strings['offline.title'], strings['offline.err_msg'], [
            {
                text: strings['offline.retry_btn'],
                onPress: () => retry(),
            },
        ]);
    }, [Alert, retry, strings]);

    return <BackgroundGradient />;
};

export default OfflineScreen;
