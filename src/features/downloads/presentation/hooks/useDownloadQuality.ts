import { useCallback, useEffect, useState } from 'react';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { DownloadQuality, getDownloadQuality } from 'utils/UserPreferenceUtils';

export function useDownloadQuality() {
    const { appConfig } = useAppPreferencesState();
    const [preferredQuality, setPreferredQuality] = useState('');
    const [qualities, setQualities] = useState<DownloadQuality[]>();

    const fetchPreferredQuality = useCallback(async () => {
        const quality = await getDownloadQuality();
        setPreferredQuality(quality);
    }, []);

    useEffect(() => {
        fetchPreferredQuality();
    }, [fetchPreferredQuality]);

    const fetchQualities = useCallback(() => {
        const appConfigQualities: DownloadQuality[] = [];
        if (appConfig.preferredPeakBitRate_High) {
            appConfigQualities.push('High');
        }
        if (appConfig.preferredPeakBitRate_Medium) {
            appConfigQualities.push('Medium');
        }
        if (appConfig.preferredPeakBitRate_Low) {
            appConfigQualities.push('Low');
        }
        setQualities(appConfigQualities);
    }, [appConfig]);

    useEffect(() => {
        fetchQualities();
    }, [fetchQualities]);

    return [preferredQuality, qualities] as const;
}
