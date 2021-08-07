import { useCallback, useEffect, useState } from 'react';
import { getAppLanguage, getContentLanguage } from 'utils/UserPreferenceUtils';

export function useContentLanguage() {
    const [contentLanguage, setContentLanguage] = useState('');

    const fetchContentLanguage = useCallback(async () => {
        const status = await getContentLanguage();
        setContentLanguage(status);
    }, []);

    useEffect(() => {
        fetchContentLanguage();
    }, [fetchContentLanguage]);

    return contentLanguage;
}

export function useApplicationLanguage() {
    const [applicationLanguage, setApplicationLanguage] = useState('');

    const fetchApplicationLanguage = useCallback(async () => {
        const status = await getAppLanguage();
        setApplicationLanguage(status);
    }, []);

    useEffect(() => {
        fetchApplicationLanguage();
    }, [fetchApplicationLanguage]);

    return applicationLanguage;
}
