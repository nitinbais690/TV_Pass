import { NetInfoStateType } from '@react-native-community/netinfo';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import { useDownloads } from 'platform/hooks/useDownloads';
import React, { useCallback, useContext, useEffect, useReducer, useRef } from 'react';
import { Download, downloadManager } from 'rn-qp-nxg-player';
import { useInterval } from 'screens/hooks/usePlayerAnalytics';
import { useAnalytics } from './AnalyticsReporterContext';
import { useAppPreferencesState } from './AppPreferencesContext';
import { DOWNLOAD_CONTENT_BOOKMARK, getDownloadsBookmark, isOffsetUndefined } from './DownloadBookmarkUtils';
import { AppEvents, condenseDownloadData } from './ReportingUtils';
import { canDownloadOverCellular, canStreamOverCellular, setItem } from './UserPreferenceUtils';

/**
 * DownloadsContextProvider manages the deletion of expired and Stale items. It also handles the download actions according to
 * user network preference
 */
export enum PreferenceUpdates {
    init = 'Init',
    streamOverCellular = 'UpdateStreamOverWifi',
    downloadOverWifiOnly = 'UpdateDownloadOverWifi',
}
interface State {
    streamOverCellular?: boolean;
    downloadOverWifiOnly?: boolean;
}

const initialState: State = {
    streamOverCellular: undefined,
    downloadOverWifiOnly: undefined,
};
interface Action {
    type: string;
    streamOverCellular?: boolean;
    downloadOverWifiOnly?: boolean;
}

const StateHandlerReducer = (state: State, action: Action): any => {
    switch (action.type) {
        case PreferenceUpdates.init:
            return {
                ...state,
                streamOverCellular: action.streamOverCellular,
                downloadOverWifiOnly: action.downloadOverWifiOnly,
            };
        case PreferenceUpdates.downloadOverWifiOnly:
            return {
                ...state,
                downloadOverWifiOnly: action.downloadOverWifiOnly,
            };
        case PreferenceUpdates.streamOverCellular:
            return {
                ...state,
                streamOverCellular: action.streamOverCellular,
            };
    }
};

const DownloadsContext = React.createContext({
    ...initialState,
    updatePreference: async (_: PreferenceUpdates, _value: boolean) => {},
});
const DownloadsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(StateHandlerReducer, initialState);
    const { downloads } = useDownloads(downloadManager);
    const { type, isInternetReachable } = useNetworkStatus();
    const isOffline = isInternetReachable === false;
    const { appConfig } = useAppPreferencesState();
    const DEFAULT_PROGRESS_REPORT_INTERVAL_MS = 10 * 1000; // 10 secs
    const { recordEvent } = useAnalytics();
    const progressRecordInterval =
        appConfig && appConfig.playbackReportingIntervalMs
            ? appConfig.playbackReportingIntervalMs
            : DEFAULT_PROGRESS_REPORT_INTERVAL_MS;
    const completedDownloads = useRef(
        downloads.map(downlaod => {
            if (downlaod.state === 'COMPLETED') {
                return downlaod.id;
            }
        }),
    ).current;
    useEffect(() => {
        const init = async () => {
            const streamOverCellular = await canStreamOverCellular();
            const downloadOverCellular = await canDownloadOverCellular();
            if (streamOverCellular !== undefined && downloadOverCellular !== undefined) {
                dispatch({
                    type: PreferenceUpdates.init,
                    streamOverCellular: streamOverCellular,
                    downloadOverWifiOnly: downloadOverCellular,
                });
            }
        };
        init();
    }, []);
    const updatePreference = (event: PreferenceUpdates, value: boolean) => {
        dispatch({
            type: event,
            downloadOverWifiOnly: event === PreferenceUpdates.downloadOverWifiOnly ? value : state.downloadOverWifiOnly,
            streamOverCellular: event === PreferenceUpdates.streamOverCellular ? value : state.streamOverCellular,
        });
    };

    const recordPlaybackProgress = useCallback(() => {
        downloads.forEach(downloadItem => {
            if (downloadItem.state === 'DOWNLOADING') {
                recordEvent(
                    AppEvents.DOWNLOAD_INPROGRESS,
                    condenseDownloadData(JSON.parse(downloadItem.metadata), downloadItem.progressPercent),
                );
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [downloads]);

    useInterval(recordPlaybackProgress, progressRecordInterval);

    useEffect(() => {
        downloads.forEach(downloadItem => {
            switch (downloadItem.state) {
                case 'PAUSED':
                    // NOTE: Only for scenario where device goes offline
                    recordEvent(AppEvents.DOWNLOAD_PAUSED, condenseDownloadData(JSON.parse(downloadItem.metadata)));
                    break;
                case 'QUEUED':
                    recordEvent(AppEvents.DOWNLOAD_PAUSED, condenseDownloadData(JSON.parse(downloadItem.metadata)));
                    break;
                case 'COMPLETED':
                    if (!completedDownloads.includes(downloadItem.id)) {
                        recordEvent(
                            AppEvents.DOWNLOAD_COMPLETED,
                            condenseDownloadData(JSON.parse(downloadItem.metadata)),
                        );
                        completedDownloads.push(downloadItem.id);
                    }
                    break;
                case 'FAILED':
                    recordEvent(AppEvents.DOWNLOAD_STOPPED, condenseDownloadData(JSON.parse(downloadItem.metadata)));
                    break;
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [downloads]);
    const removeExpiredAndStaleDownloads = async (downloads: Download[]) => {
        const deletePromises = downloads
            .map(downloadItem => {
                const expiration = downloadItem.expiration ? downloadItem.expiration : 0;
                const downloadExpiryTime = new Date(expiration).getTime();
                const currentTime = new Date().getTime();
                const isDownloadedContentExpired = downloadExpiryTime < currentTime ? true : false;
                if (isDownloadedContentExpired || downloadItem.state === 'STALE') {
                    console.log('Deleting expired or stale items');
                    return downloadManager.purgeDownload(downloadItem.id);
                }
            })
            .filter(Boolean);
        await Promise.all(deletePromises);
    };

    const removeDownlaodsBookmarks = async (downloads: Download[]) => {
        let savedBookmarks = await getDownloadsBookmark();
        let newList: Array<{ [key: string]: number | undefined }> = [];
        savedBookmarks.forEach((object: { [x: string]: number | undefined }) => {
            downloads.forEach(value => {
                if (isOffsetUndefined(object[value.id])) {
                    newList.push(object);
                }
            });
        });

        if (newList !== [] && isOffsetUndefined(downloads[0]) && savedBookmarks !== []) {
            await setItem(DOWNLOAD_CONTENT_BOOKMARK, JSON.stringify(newList));
        }
    };

    useEffect(() => {
        const handleNetworkChange = async (networkType: NetInfoStateType) => {
            const networkPreference = !state.downloadOverWifiOnly;
            const pauseAllDownloads = async () => {
                const pausePromises = downloads.map(downloadItem => {
                    return downloadManager.pauseDownload(downloadItem.id);
                });
                await Promise.all(pausePromises);
            };
            const resumeAllDownloads = async () => {
                const resumePromises = downloads.map(downloadItem => {
                    return downloadManager.resumeDownload(downloadItem.id);
                });
                await Promise.all(resumePromises);
            };
            if ((networkType === NetInfoStateType.cellular && networkPreference === false) || isOffline) {
                pauseAllDownloads();
            } else {
                resumeAllDownloads();
            }
        };
        handleNetworkChange(type);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [downloads.length, type, isOffline, state.downloadOverWifiOnly]);

    useEffect(() => {
        removeExpiredAndStaleDownloads(downloads);
        removeDownlaodsBookmarks(downloads);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [downloads.length]);

    return (
        <DownloadsContext.Provider
            value={{
                ...state,
                updatePreference: updatePreference,
            }}>
            {children}
        </DownloadsContext.Provider>
    );
};

export const useDownloadsContext = () => {
    const context = useContext(DownloadsContext);
    if (context === undefined) {
        throw new Error('useDownloadsContextState must be used within a DownloadsContextProvider');
    }
    return context;
};

export { DownloadsContext, DownloadsContextProvider };
