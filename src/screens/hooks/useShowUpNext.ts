import { useEffect, useState } from 'react';
import { PlaybackStateValue } from 'rn-qp-nxg-player';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';

export const useShowUpNext = (
    state: PlaybackStateValue,
    currentPosition: number,
    duration: number,
    contentId?: string | null,
) => {
    const { isInternetReachable } = useNetworkStatus();
    const [showUpNextOverlay, setShowUpNextOverlay] = useState<boolean>(false);
    const { appConfig } = useAppPreferencesState();
    const watchedPercentage = (appConfig && appConfig.upNextPercentageThreshold) || 98;

    useEffect(() => {
        setShowUpNextOverlay(false);
    }, [contentId]);

    useEffect(() => {
        if (!isInternetReachable || duration <= 0) {
            return;
        }

        if (state === 'STARTED') {
            const watchedPercentageVal = (currentPosition / duration) * 100;
            if (!isNaN(watchedPercentageVal)) {
                if (Math.round(watchedPercentageVal) > watchedPercentage) {
                    setShowUpNextOverlay(true);
                } else {
                    setShowUpNextOverlay(false);
                }
            }
        } else if (currentPosition >= Math.floor(duration)) {
            setShowUpNextOverlay(true);
        } else {
            setShowUpNextOverlay(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, currentPosition, isInternetReachable]);

    return showUpNextOverlay;
};
