import { useRef, useEffect } from 'react';
import { setDownloadsBookmark } from 'utils/DownloadBookmarkUtils';

export const useSetDownloadBookmarks = (id: string | null | undefined, currentPosition: number) => {
    const currentPos = useRef(currentPosition);
    const isMounted = useRef(true);
    useEffect(() => {
        currentPos.current = currentPosition;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPosition]);
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);
    useEffect(() => {
        return () => {
            if (!isMounted.current) {
                setDownloadsBookmark(id, currentPosition);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted.current, currentPosition]);
};
