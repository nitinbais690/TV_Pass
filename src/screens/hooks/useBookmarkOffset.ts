import React, { useEffect, useState, useCallback } from 'react';
import { useFLPlatform } from 'platform/PlatformContextProvider';
import { BookmarkRecord, BookmarkService } from 'rn-qp-nxg-player';
import { promiseWithTimeout } from 'utils/PromiseUtils';
import { useFocusEffect } from '@react-navigation/native';
import { getDownloadsBookmark, isOffsetUndefined } from 'utils/DownloadBookmarkUtils';

const BOOKMARK_FETCH_TIMEOUT_MS = 5000;

export const useBookmarkOffset = (resourceId: string) => {
    const isMounted = React.useRef(true);
    const { state } = useFLPlatform();
    const { bookmarkService, isConfigured: isPlatformConfigured, error: platformError } = state;
    const [offset, setOffset] = useState<number | undefined>(undefined);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        // On app launch, when trying to fetch bookmark offset while
        // platform is still being configured, we want to fail after
        // the configured timeout
        const timeout = setTimeout(() => {
            if (isMounted.current) {
                setOffset(0);
            }
        }, BOOKMARK_FETCH_TIMEOUT_MS);

        if (isPlatformConfigured || platformError) {
            clearTimeout(timeout);
        }
    }, [isPlatformConfigured, platformError]);

    useFocusEffect(
        useCallback(() => {
            const fetchDownloadBookmarkOffset = async (bookmarkOffset?: number) => {
                try {
                    let downloadBookmark = await getDownloadsBookmark();
                    downloadBookmark = downloadBookmark.filter((bookmarks: { [key: string]: number | undefined }) => {
                        if (isOffsetUndefined(bookmarks[resourceId])) {
                            return bookmarks[resourceId];
                        }
                    });
                    if (isMounted.current && isOffsetUndefined(downloadBookmark && downloadBookmark[0][resourceId])) {
                        setOffset(downloadBookmark[0][resourceId]);
                    } else {
                        setOffset(bookmarkOffset);
                    }
                } catch (e) {
                    console.debug('[useBookmarkOffset] Failed to fetch bookmark from storage', e);
                    if (isMounted.current) {
                        bookmarkOffset ? setOffset(bookmarkOffset) : setOffset(0);
                    }
                }
            };

            const fetchBookmarkOffset = async (id: string, service: BookmarkService) => {
                try {
                    const bookmark = await promiseWithTimeout<BookmarkRecord>(
                        service.getBookmark(id),
                        BOOKMARK_FETCH_TIMEOUT_MS,
                        'Bookmark fetch timed-out',
                    );
                    //Note: Added for scenario where the user isOnline and watches a downloaded content
                    if (bookmark.offset) {
                        fetchDownloadBookmarkOffset(bookmark.offset);
                    }
                } catch (e) {
                    console.debug('[useBookmarkOffset] Failed to fetch bookmark', e);
                    fetchDownloadBookmarkOffset();
                }
            };

            if (resourceId) {
                if (platformError && isMounted.current) {
                    fetchDownloadBookmarkOffset();
                } else if (isPlatformConfigured && bookmarkService) {
                    fetchBookmarkOffset(resourceId, bookmarkService);
                }
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [resourceId, isPlatformConfigured, platformError, bookmarkService]),
    );

    return offset;
};
