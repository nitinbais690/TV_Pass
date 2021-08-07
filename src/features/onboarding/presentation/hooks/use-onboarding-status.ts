import { useCallback, useEffect, useState } from 'react';
import { getOnBoardCompleteStatus } from 'utils/UserPreferenceUtils';

export function useOnBoardingStatus() {
    const [onboardingStatus, setOnBoardingStatus] = useState(false);

    const fetchOnBoardStatus = useCallback(async () => {
        const status = await getOnBoardCompleteStatus();
        setOnBoardingStatus(status);
    }, []);

    useEffect(() => {
        fetchOnBoardStatus();
    }, [fetchOnBoardStatus]);

    return onboardingStatus;
}
