import { Platform } from 'react-native';
import {
    PlatformAsset,
    contentAuthorizer,
    PlatformError,
    PlayerConfig,
    DownloadRequest,
    Download,
    MediaTypeValue,
    DrmTypeValue,
    ContentAuthToken,
    DeliveryTypeValue,
    BookmarkerConfig,
    StreamConcurrencyConfig,
} from 'rn-qp-nxg-player';
import DeviceInfo from 'react-native-device-info';
import { ResourceVm } from 'qp-discovery-ui';
import { AppConfig } from 'utils/AppPreferencesContext';
import { AccountProfile } from './EvergentAPIUtil';
import { DEFAULT_DOWNLOAD_QUALITY, DownloadQuality, getDownloadQuality } from 'utils/UserPreferenceUtils';

const DEFAULT_BOOKMARK_SYNC_INTERVAL_MS = 5000;
const DEFAULT_BOOKMARK_DELETE_THRESHOLD = 0.95;
const DEFAULT_STREAM_CONCURRENCY_SYNC_INTERVAL_MS = 3000;

export type AssetMetadata = {
    mediaURL: string; //Needed to check if the URL has changed, in the future
    mediaType: MediaTypeValue; //Needed to build the Player for Downloaded Playback
    drmLicenseURL?: string; //Needed to build the Player for Downloaded Playback
    drmType?: DrmTypeValue; //Needed to build the Player for Downloaded Playback
    skd?: string; //Needed to build the Player for Downloaded Playback
    fairplayCertificate?: string; //Needed for iOS DRM content playback
    rentalExpiryTime?: number; //Needed for checking expired content
    deliveryType?: DeliveryTypeValue; //Needed for checking playback or download
} & ResourceVm;

export const resourceToPlatformAsset: (resource: ResourceVm, deliveryType: DeliveryTypeValue) => PlatformAsset = (
    resource: ResourceVm,
    deliveryType: DeliveryTypeValue,
): PlatformAsset => {
    return {
        mediaID: resource.id,
        mediaType: Platform.OS === 'android' ? 'DASH' : 'HLS',
        catalogType: resource.type,
        consumptionType: resource.type === 'channel' ? 'LIVE' : 'VOD',
        drmType: Platform.OS === 'android' ? 'WIDEVINE' : 'FAIRPLAY',
        deliveryType: deliveryType,
        quality: 'HIGH',
    };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const platformAssetToPlayerConfig: (
    platformAsset: PlatformAsset,
    resource: ResourceVm,
    tvodToken: string,
    appConfig?: AppConfig,
    initialPlaybackTime?: number,
    accountProfile?: AccountProfile,
) => Promise<PlayerConfig> = async (
    platformAsset: PlatformAsset,
    resource: ResourceVm,
    tvodToken: string,
    appConfig?: AppConfig,
    initialPlaybackTime?: number,
): Promise<PlayerConfig> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    // const appReleaseVersion = `${DeviceInfo.getVersion()}(${DeviceInfo.getBuildNumber()})`;
    // const sessionId: string = await newRelic.getSessionId();
    //NOTE: using authorize playback for now.
    //Have to change to authorize download.

    const headers = {
        'X-Tvod-Authorization': tvodToken,
    };

    const authToken = await contentAuthorizer.authorizePlayback(platformAsset, headers);
    const bookmarkConfig: BookmarkerConfig = {
        bookmarkAssetID: resource.id,
        bookmarkSyncIntervalMs: (appConfig && appConfig.bookmarkSyncIntervalMs) || DEFAULT_BOOKMARK_SYNC_INTERVAL_MS,
        bookmarkDeleteThreshold: (appConfig && appConfig.bookmarkDeleteThreshold) || DEFAULT_BOOKMARK_DELETE_THRESHOLD,
        bookmarkServiceEndpoint: appConfig && appConfig.bookmarkURL,
    };

    const streamConcurrencyConfig: StreamConcurrencyConfig = {
        streamConcurrencySyncIntervalMs:
            (appConfig && appConfig.streamConcurrencySyncIntervalMs) || DEFAULT_STREAM_CONCURRENCY_SYNC_INTERVAL_MS,
        streamConcurrencyServiceEndpoint: appConfig && appConfig.strConcurrencyURL,
        platformClient: {
            id: DeviceInfo.getUniqueId(),
            type: Platform.OS === 'ios' ? 'iosmobile' : 'androidmobile',
        },
    };

    return {
        mediaURL: authToken.contentURL,
        mediaType: authToken.mediaType,
        drmLicenseURL: authToken.licenseURL,
        drmType: authToken.drmType,
        skd: authToken.skd,
        fairplayCertificate: authToken.fpCertificateUrl ? authToken.fpCertificateUrl : 'fairplayCertificate',
        contentType: platformAsset.consumptionType,
        bookmarkConfig: bookmarkConfig,
        streamConcurrencyConfig: streamConcurrencyConfig,
        playbackProperties: {
            initialStartTimeMillis: initialPlaybackTime,
        },
    };
};

export const platformDownloadToPlayerConfig: (download: Download) => PlayerConfig = (
    download: Download,
): PlayerConfig => {
    const assetMetadata: AssetMetadata = JSON.parse(download.metadata);
    const mediaURL = download.mediaURL;
    return {
        mediaURL: mediaURL,
        mediaType: assetMetadata.mediaType,
        skd: assetMetadata.skd,
        downloadID: assetMetadata.id,
        drmType: assetMetadata.drmType,
        drmLicenseURL: assetMetadata.drmLicenseURL ? assetMetadata.drmLicenseURL : '',
        deliveryType: assetMetadata.deliveryType,
    };
};

const preferredDownloadBitrate = async (appConfig?: AppConfig, quality?: DownloadQuality) => {
    let preferredDownloadQuality;
    if (quality) {
        preferredDownloadQuality = quality;
    }

    if (!quality) {
        preferredDownloadQuality = await getDownloadQuality();
        if (!preferredDownloadQuality) {
            preferredDownloadQuality = DEFAULT_DOWNLOAD_QUALITY;
        }
    }
    const preferredDownloadQualityKey = `preferredPeakBitRate_${preferredDownloadQuality}`;

    let preferredBitRate = 0;
    if (appConfig) {
        preferredBitRate = (appConfig as any)[preferredDownloadQualityKey] || 0;
    }
    return Number(preferredBitRate);
};

export const platformAssetToDownloadRequest: (
    platformAsset: PlatformAsset,
    tvodToken: string,
    appConfig?: AppConfig,
    quality?: DownloadQuality,
) => Promise<DownloadRequest> = async (
    platformAsset: PlatformAsset,
    tvodToken: string,
    appConfig?: AppConfig,
    quality?: DownloadQuality,
): Promise<DownloadRequest> => {
    //NOTE: using authorize playback for now.
    //Have to change to authorize download.
    const headers = {
        'X-Tvod-Authorization': tvodToken,
    };

    const authToken: ContentAuthToken = await contentAuthorizer.authorizePlayback(platformAsset, headers);
    const rentalExpiryTime = authToken.rentalExpiryTime;

    return {
        mediaURL: authToken.contentURL,
        mediaType: authToken.mediaType,
        drmLicenseURL: authToken.licenseURL || '',
        drmScheme: authToken.drmType || 'NONE',
        downloadStreamPreference: {
            preferredVideoBitrate: await preferredDownloadBitrate(appConfig, quality),
            preferredAudioVariants: [
                {
                    languageCode: 'en',
                    mimeType: '',
                    type: 'AUDIO',
                },
            ],
            preferredTextVariants: [
                {
                    languageCode: 'en',
                    mimeType: '',
                    type: 'TEXT',
                },
            ],
        },
        id: authToken.contentID,
        skd: authToken.skd,
        fairplayCertificate: authToken.fpCertificateUrl,
        expiration: rentalExpiryTime,
    };
};

export const isPlatformError: (object: any) => boolean = (object: any): boolean => {
    const platformError = object as PlatformError;
    if (platformError.errorCode) {
        return true;
    }
    return false;
};
