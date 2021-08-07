import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
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
    BookmarkerConfig,
    StreamConcurrencyConfig,
    DeliveryTypeValue,
} from 'rn-qp-nxg-player';
import { ResourceVm } from 'qp-discovery-ui';
import { AppConfig } from 'utils/AppPreferencesContext';
//import { name as appName } from '../../app.json';
//import { AccountProfile } from './EvergentAPIUtil';
import { getDownloadQuality } from 'utils/UserPreferenceUtils';
//import { default as newRelic } from 'rn-qp-nxg-newrelic';

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
        quality: 'LOW',
    };
};

export const platformAssetToPlayerConfig: (
    platformAsset: PlatformAsset,
    resource: ResourceVm,
    tvodToken: string,
    liveStreamUrl: string, //fetching the livestream url from environment config
    appConfig?: AppConfig,
) => //accountProfile?: AccountProfile,
Promise<PlayerConfig> = async (
    platformAsset: PlatformAsset,
    resource: ResourceVm,
    tvodToken: string,
    liveStreamUrl: string,
    appConfig?: AppConfig,
    //accountProfile?: AccountProfile,
): Promise<PlayerConfig> => {
    console.log('authorizing playback...');
    // const appReleaseVersion = `${DeviceInfo.getVersion()}(${DeviceInfo.getBuildNumber()})`;
    // const sessionId: string = await newRelic.getSessionId();
    //NOTE: using authorize playback for now.
    //Have to change to authorize download.
    if (platformAsset.consumptionType === 'VOD') {
        //  const authToken = await contentAuthorizer.authorizePlayback(platformAsset);
        const headers = {
            'X-Tvod-Authorization': tvodToken,
        };
        const authToken = await contentAuthorizer.authorizePlayback(platformAsset, headers);
        const bookmarkConfig: BookmarkerConfig = {
            bookmarkAssetID: resource.id,
            bookmarkSyncIntervalMs:
                (appConfig && appConfig.bookmarkSyncIntervalMs) || DEFAULT_BOOKMARK_SYNC_INTERVAL_MS,
            bookmarkDeleteThreshold:
                (appConfig && appConfig.bookmarkDeleteThreshold) || DEFAULT_BOOKMARK_DELETE_THRESHOLD,
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
        const initialPlaybackTime = resource && resource.watchedOffset ? resource.watchedOffset / 1000 : 0;

        return {
            mediaURL: authToken.contentURL,
            mediaType: authToken.mediaType,
            drmLicenseURL: authToken.licenseURL,
            drmType: authToken.drmType,
            skd: authToken.skd,
            // TODO: fallback cert should be from app-config
            fairplayCertificate: authToken.fpCertificateUrl ? authToken.fpCertificateUrl : '',
            contentType: platformAsset.consumptionType,
            bookmarkConfig: bookmarkConfig,
            streamConcurrencyConfig: streamConcurrencyConfig,
            playbackProperties: {
                initialStartTimeMillis: initialPlaybackTime * 1000,
            },
        };
    } else {
        return {
            mediaURL: liveStreamUrl,
            mediaType: 'HLS',
            drmLicenseURL: 'NONE',
            drmType: 'NONE',
            skd: '',
            fairplayCertificate: '',
            contentType: 'LIVE',
        };
    }
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
        deliveryType: assetMetadata.deliveryType,
    };
};

const preferredDownloadBitrate = async (appConfig?: AppConfig) => {
    const preferredDownloadQuality = await getDownloadQuality();
    const preferredDownloadQualityKey = `downloadBitRate_${preferredDownloadQuality}`;
    let preferredBitRate = 0;
    if (appConfig) {
        preferredBitRate = (appConfig as any)[preferredDownloadQualityKey] || 0;
    }
    return preferredBitRate;
};

export const platformAssetToDownloadRequest: (
    platformAsset: PlatformAsset,
    tvodToken: string,
    appConfig?: AppConfig,
) => Promise<DownloadRequest> = async (
    platformAsset: PlatformAsset,
    tvodToken: string,
    appConfig?: AppConfig,
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
            preferredVideoBitrate: await preferredDownloadBitrate(appConfig),
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
