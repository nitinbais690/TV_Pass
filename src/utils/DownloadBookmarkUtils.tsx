import { Download } from 'rn-qp-nxg-player';
import { getItem, setItem } from './UserPreferenceUtils';

export const DEFAULT_DOWNLOAD_CONTENT_BOOKMARK = '0';
export const DOWNLOAD_CONTENT_BOOKMARK = 'DOWNLOAD_CONTENT_BOOKMARK';

export const getDownloadsBookmark = async (resourceId?: string) => {
    let downloadList;
    let offSetValue;
    try {
        downloadList = await getItem(DOWNLOAD_CONTENT_BOOKMARK, DEFAULT_DOWNLOAD_CONTENT_BOOKMARK);
        downloadList = JSON.parse(downloadList);
        if (resourceId && downloadList !== undefined) {
            downloadList.filter((object: { [key: string]: number | undefined }) => {
                if (isOffsetUndefined(object[resourceId])) {
                    offSetValue = object[resourceId];
                }
            });
            if (offSetValue) {
                return offSetValue;
            } else {
                return 0;
            }
        } else {
            if (downloadList === 0) {
                return [];
            } else {
                return downloadList;
            }
        }
    } catch {
        console.debug('Unable to fetch DownloadBookmark from storage');
        if (resourceId) {
            return 0;
        } else {
            return [];
        }
    }
};

export const setDownloadsBookmark = async (id: string, value: number | undefined) => {
    let downloadsList: Array<{ [key: string]: number | undefined }> = [];
    try {
        downloadsList = await getDownloadsBookmark();
        downloadsList = downloadsList.filter(object => !object.hasOwnProperty(id));
        downloadsList.push({ [id]: value });
    } catch {
        console.debug('Unable to fetch DownloadBookmark from storage');
    }
    await setItem(DOWNLOAD_CONTENT_BOOKMARK, JSON.stringify(downloadsList));
};

export const isOffsetUndefined = (value: number | undefined | Download) => {
    return value !== undefined;
};
