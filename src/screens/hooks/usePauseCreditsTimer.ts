import { useEffect, useRef } from 'react';
import { useCredits } from 'utils/CreditsContextProvider';

export const usePauseCreditsTimer = (playerState: any) => {
    const isMounted = useRef(true);
    const { refreshIntervalState, pauseRefresh, resumeRefresh } = useCredits();

    useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
            if (refreshIntervalState === 'paused') {
                resumeRefresh();
            }
        };
    }, [refreshIntervalState, resumeRefresh]);

    useEffect(() => {
        if (playerState === 'STARTED' && refreshIntervalState === 'active') {
            console.debug('[usePauseCreditsTimer] Pause credits timer', playerState);
            pauseRefresh();
        } else if (playerState === 'IDLE' && refreshIntervalState === 'paused') {
            console.debug('[usePauseCreditsTimer] Resume credits timer', playerState);
            resumeRefresh();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerState]);
};
