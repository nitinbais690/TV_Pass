import { Download } from 'rn-qp-nxg-player';
import { AssetMetadata } from 'utils/AssetConversionUtils';
import { DownloadQuality, setDownloadQuality } from 'utils/UserPreferenceUtils';

export const getDownloadTitleText = (strings: any, quality: DownloadQuality): string => {
    switch (quality) {
        case 'Low':
            return `${strings['download.settings.quality.low']}`;
        case 'Medium':
            return `${strings['download.settings.quality.medium']}`;
        case 'High':
            return `${strings['download.settings.quality.high']}`;
    }
};

export const getDownloadSecondaryText = (strings: any, quality: DownloadQuality): string => {
    switch (quality) {
        case 'Low':
            return `${strings['download.settings.quality.low_hint']}`;
        case 'Medium':
            return `${strings['download.settings.quality.medium_hint']}`;
        case 'High':
            return `${strings['download.settings.quality.high_hint']}`;
    }
};

export const updateDownloadQuality = async (quality: DownloadQuality) => {
    await setDownloadQuality(quality);
};

export const metadataFromDownload = (download: Download): AssetMetadata => {
    const stringifiedMetadata = download.metadata;
    return JSON.parse(stringifiedMetadata) as AssetMetadata;
};
