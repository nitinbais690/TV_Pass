import { NetInfoStateType } from '@react-native-community/netinfo';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import { useDownloads } from 'platform/hooks/useDownloads';
import React, { useEffect } from 'react';
import { Download, downloadManager } from 'rn-qp-nxg-player';
import { canDownloadOverCellular } from './UserPreferenceUtils';

/**
 * DownloadsContextProvider manages the deletion of expired and Stale items. It also handles the download actions according to
 * user network preference
 */
const DownloadsContext = React.createContext({});
export const DownloadsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { downloads } = useDownloads(downloadManager);
    const { type, isInternetReachable } = useNetworkStatus();
    const isOffline = isInternetReachable === false;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    useEffect(() => {
        const handleNetworkChange = async (networkType: NetInfoStateType) => {
            const networkPreference = await canDownloadOverCellular();
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
    }, [downloads.length, type, isOffline]);

    useEffect(() => {
        //   removeExpiredAndStaleDownloads(downloads);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [downloads.length]);

    return <DownloadsContext.Provider value={{}}>{children}</DownloadsContext.Provider>;
};
