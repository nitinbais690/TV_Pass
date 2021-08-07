import { useState, useEffect } from 'react';
import DeviceInfo from 'react-native-device-info';
import { DownloadManager, Download, DownloadListener } from 'rn-qp-nxg-player';

export const useDownloads = (downloadManager: DownloadManager): { loading: boolean; downloads: Array<Download> } => {
    const [loading, setLoading] = useState<boolean>(true);
    const [downloads, setDownloads] = useState<Array<Download>>([]);

    useEffect(() => {
        async function fetchAllDownloads() {
            console.log('fetching downloads...');
            try {
                const downloads = await downloadManager.getAllDownloads();
                setDownloads(downloads);
                setLoading(false);
            } catch (e) {
                setLoading(false);
            }
        }

        const downloadListener: DownloadListener = {
            onDownloadProgress(download: Download) {
                console.log(`download_progress: ${download.id} -> ${download.progressPercent}`);
                fetchAllDownloads();
            },
            onDownloadRemoved(download: Download) {
                console.log(`download_removed: ${download.id} -> ${download.state}`);
                fetchAllDownloads();
            },
            onDownloadStateChanged(download: Download) {
                console.log(`download_state_changed: ${download.id} -> ${download.state}`);
                fetchAllDownloads();
            },
            onDownloadFailed(download: Download) {
                console.log(`download_failed: ${download.id} -> ${download.state}`);
            },
        };

        (() => {
            if (!DeviceInfo.isEmulatorSync()) {
                downloadManager.addListener(downloadListener);
            }
        })();

        fetchAllDownloads();

        return function cleanup() {
            console.log('removing download listener');
            downloadManager.removeListener(downloadListener);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { loading, downloads };
};
