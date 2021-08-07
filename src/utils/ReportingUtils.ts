import { ResourceVm } from 'qp-discovery-ui';
import { PlatformError, PlayerConfig } from 'rn-qp-nxg-player';
import { ProductsResponseMessage } from 'screens/hooks/useGetProducts';
import { errorCode, EvergentEndpoints } from './EvergentAPIUtil';

export enum RN_INTERACTION {
    RECORD_INTERACTION = 'ScreenTracking',
}

export enum TABLE {
    TVPASS = 'TvPass',
    ERROR = 'Error',
    INTERACTION = 'Interaction',
}

export enum ScreenOrigin {
    BROWSE = 'Browse',
    SEARCH = 'Search',
    COLLECTION = 'Collection',
    MY_CONTENT = 'MyContent',
    RELATED_RESOURCE = 'RelatedResource',
}

export enum ScreenTabs {
    BROWSE = 'Browse',
    MY_CONTENT = 'MyContent',
    USAGE = 'Usage',
    SETTINGS = 'Settings',
}

export enum AppEvents {
    //Application Events
    SIGN_UP = 'Signed Up',
    LOGIN = 'Login',
    LOGOUT = 'Logout',
    SHARED = 'Shared',
    PAGE_VIEW = 'Page View',
    DEVICE_DEACTIVATE = 'Device activate',
    APP_LAUNCHED = 'App launched ',
    APP_INSTALLED = 'App installed',

    //Search
    SEARCHED = 'Searched',

    //Watchlist
    ADD_TO_WATCHLIST = 'Added to Watchlist',
    REMOVED_FROM_WATCHLIST = 'Removed From Watchlist',

    //Player
    WATCHED = 'Watched',
    PLAY_STARTED = 'Play Started',
    PLAYER_BITRATE_CHANGED = 'Player BitRate changed',

    //Subscription
    VIEW_PLANS = 'View Plans',
    SUBSCRIPTION_INITIATED = 'Subscription Initiated',
    SUBSCRIPTION_PLAN_SUCCESS = 'Subscription Plan Status Success',
    SUBSCRIPTION_PLAN_FAILURE = 'Subscription Plan Status Failure',
    SUBSCRIPTION_END = 'Subscription End',

    //Application Events
    APP_START = 'APP_START',
    APP_FOREGROUND = 'APP_FOREGROUND',
    APP_BACKGROUND = 'APP_BACKGROUND',
    TNC = 'TNC',
    SEARCH = 'SEARCH',
    PURCHASE_SUBSCRIPTION = 'PURCHASE_SUBSCRIPTION',
    PURCHASE_TOPUP = 'PURCHASE_TOPUP',
    CREATE_PROFILE = 'CREATE_PROFILE',
    UPDATE_PROFILE = 'UPDATE_PROFILE',
    FORGOT_PASSWORD = 'FORGOT_PASSWORD',
    SET_USER_PREFERENCES = 'SET_USER_PREFERENCES',
    UPDATE_USER_PREFERENCES = 'UPDATE_USER_PREFERENCES',
    REMOVE_DEVICE = 'REMOVE_DEVICE',
    INTRO_WALKTHROUGH_SKIPPED = 'INTRO_WALKTHROUGH_SKIPPED',
    INTRO_WALKTHROUGH_COMPLETED = 'INTRO_WALKTHROUGH_COMPLETED',
    VIEW_CONTENT_DETAILS = 'VIEW_CONTENT_DETAILS',
    VIEW_COLLECTION_DETAILS = 'VIEW_COLLECTION_DETAILS',
    MENU_TAB_CHANGE = 'MENU_TAB_CHANGE',
    STOREFRONT_TAB_CHANGE = 'STOREFRONT_TAB_CHANGE',
    RENT_CONTENT = 'RENT_CONTENT',
    PP_UPDATE = 'PP_UPDATE',
    FAVORITE_CONTENT = 'FAVORITE_CONTENT',
    UPDATE_USER_PREFRENCES = 'UPDATE_USER_PREFRENCES',
    //Playback
    PLAYBACK_START = 'PLAYBACK_START',
    PLAYBACK_PREPARED = 'PLAYBACK_PREPARED',
    PLAYBACK_STARTED = 'PLAYBACK_STARTED',
    PLAYBACK_INPROGRESS = 'PLAYBACK_INPROGRESS',
    PLAYBACK_BUFFERING_START = 'PLAYBACK_BUFFERING_START',
    PLAYBACK_BUFFERING_END = 'PLAYBACK_BUFFERING_END',
    PLAYBACK_SEEK_START = 'PLAYBACK_SEEK_START',
    PLAYBACK_SEEK_COMPLETE = 'PLAYBACK_SEEK_COMPLETE',
    PLAYBACK_PAUSED = 'PLAYBACK_PAUSED',
    PLAYBACK_RESUMED = 'PLAYBACK_RESUMED',
    PLAYBACK_STOPPED = 'PLAYBACK_STOPPED',
    PLAYBACK_COMPLETE = 'PLAYBACK_COMPLETE',
    PLAYBACK_VARIANT_CHANGE = 'PLAYBACK_VARIANT_CHANGE',
    PLAYBACK_AUDIO_LANGUAGE_CHANGE = 'PLAYBACK_AUDIO_LANGUAGE_CHANGE',
    PLAYBACK_SUBTITLE_LANGUAGE_CHANGE = 'PLAYBACK_SUBTITLE_LANGUAGE_CHANGE',
    PLAYBACK_ERROR = 'PLAYBACK_ERROR',
    NETWORK_CHANGE = 'NETWORK_CHANGE',
    ERROR = 'ERROR',
    //Download
    DOWNLOAD_START = 'DOWNLOAD_START',
    DOWNLOAD_PREPARED = 'DOWNLOAD_PREPARED',
    DOWNLOAD_STARTED = 'DOWNLOAD_STARTED',
    DOWNLOAD_INPROGRESS = 'DOWNLOAD_INPROGRESS',
    DOWNLOAD_PAUSED = 'DOWNLOAD_PAUSED',
    DOWNLOAD_RESUMED = 'DOWNLOAD_RESUMED',
    DOWNLOAD_STOPPED = 'DOWNLOAD_STOPPED',
    DOWNLOAD_COMPLETED = 'DOWNLOAD_COMPLETED',
    DOWNLOAD_DELETED = 'DOWNLOAD_DELETED',
    DOWNLOAD_LICENSE_RENEWED = 'DOWNLOAD_LICENSE_RENEWED',
    //Errors
    ENTITLEMENTS_ERROR = 'ENTITLEMENTS_FETCH_ERROR',
    PLATFORM_CONFIGURATION_ERROR = 'PLATFORM_CONFIGURATION_ERROR',
    PROFILE_ERROR = 'PROFILE_ERROR',
    LANGUAGE_ERROR = 'LANGUAGE_ERROR',
    PURCHASE_FAILURE = 'SUBSCRIPTION_PURCHASE_FAILURE',
    DISCOVERY_FAILURE = 'DISCOVERY_SEARCH_ERROR',
    TVOD_ERROR = 'TVOD_ENTITLEMENT_ERROR',
    TOP_UP_FAILURE = 'PURCHASE_TOPUP_FAILURE',
}

export enum ErrorEvents {
    //Events for Developers
    MEDIA_ERROR = 'Media Error',
    ACKNOWLEDGEMENT_FAILURE = 'ACKNOWLEDGEMENT_FAILURE',
    ONBOARD_RESOURCE_ERROR = 'ONBOARD_RESOURCE_ERROR',
    SPLASH_ERROR = 'SPLASH_SCREEN_ERROR',
    BROWSE_ERROR = 'BROWSE_ERROR',
    COLLECTION_FETCH_ERROR = 'COLLECTION_FETCH_ERROR',
    CONTAINER_FETCH_ERROR = 'CONTAINER_FETCH_ERROR',
    LOCALIZATION_FAILURE = 'LOCALIZATION_ERROR',
    KEY_CHAIN_ERROR = 'KEY_CHAIN_TOKEN_ERROR',
    SEARCH_FAILURE = 'SEARCH_FETCH_ERROR',
}

export interface Attributes {
    [key: string]: any;
}

export const condensePlayerData = (
    resource: ResourceVm,
    playerConfig?: PlayerConfig,
    isCast?: boolean,
    activeTextTrack?: string,
    activeAudioTrack?: string,
    attributes?: any,
) => {
    let playerAttributes: Attributes = {};
    const contentDetailsAttributes = getContentDetailsAttributes(resource);

    if (playerConfig) {
        if (playerConfig.contentType) {
            playerAttributes.contentType = playerConfig.contentType;
        }
        if (playerConfig.mediaURL) {
            playerAttributes.playbackURL = playerConfig.mediaURL;
        }
        if (playerConfig.drmType) {
            playerAttributes.drmName = playerConfig.drmType;
        }
    }
    if (isCast !== undefined) {
        playerAttributes.isCasting = isCast;
    }
    if (activeTextTrack) {
        playerAttributes.subtitleLanguage = activeTextTrack;
    }
    if (activeAudioTrack) {
        playerAttributes.audioLanguage = activeAudioTrack;
    }

    return {
        ...attributes,
        ...contentDetailsAttributes,
        ...playerAttributes,
    };
};

export const getContentDetailsAttributes = (resource: ResourceVm, searchPosition?: string): Attributes => {
    let detailsAttributes: Attributes = {};

    if (searchPosition) {
        detailsAttributes.searchItemPosition = searchPosition;
    }
    if (resource) {
        if (resource.credits) {
            detailsAttributes.priceCode = resource.credits;
        }
        if (resource.id) {
            detailsAttributes.contentId = resource.id;
        }
        if (resource.storeFrontId) {
            detailsAttributes.storeFrontId = resource.storeFrontId;
        }
        if (resource.tabId) {
            detailsAttributes.tabId = resource.tabId;
        }
        if (resource.tabName) {
            detailsAttributes.tabName = resource.tabName;
        }
        if (resource.containerName) {
            detailsAttributes.containerName = resource.containerName;
        }
        if (resource.collectionID) {
            detailsAttributes.collectionID = resource.collectionID;
        }
        if (resource.collectionName) {
            detailsAttributes.collectionName = resource.collectionName;
        }
        if (resource.containerId) {
            detailsAttributes.containerId = resource.containerId;
        }
        if (resource.key) {
            detailsAttributes.contentKey = resource.key;
        }
        if (resource.name) {
            detailsAttributes.contentName = resource.name;
        }
        if (resource.contentGenre && resource.contentGenre.en) {
            detailsAttributes.contentGenre = resource.contentGenre.en.join(', ');
        }
        if (resource.runningTime) {
            detailsAttributes.runningTime = resource.runningTime;
        }
        if (resource.seriesTitle) {
            detailsAttributes.seriesName = resource.seriesTitle;
        }
        if (resource.network) {
            detailsAttributes.networkId = resource.network;
        }
        if (resource.providerName) {
            detailsAttributes.providerId = resource.providerName;
        }
        if (resource.origin) {
            detailsAttributes.origin = resource.origin;
        }
        detailsAttributes.contentType = 'VOD';
    }
    return detailsAttributes;
};

export const condenseScreenTrackingData = (currentRouteName: string, previousRouteName: string | null) => {
    let screenAttributes: Attributes = {};
    if (currentRouteName) {
        screenAttributes.current_screen = currentRouteName;
    }
    if (previousRouteName && previousRouteName !== null) {
        screenAttributes.previous_screen = previousRouteName;
    }
    return screenAttributes;
};

export const condenseErrorData = (error: PlatformError, errorType?: AppEvents) => {
    let errorAttributes: Attributes = {};
    if (errorType) {
        errorAttributes.errorType = errorType;
    }
    if (error) {
        if (error.errorCode) {
            errorAttributes.errorCode = error.hexErrorCode;
        }
        if (error.contextDescription) {
            errorAttributes.errorMessage = error.contextDescription;
        }
        if (error.errorDescription) {
            errorAttributes.errorMessage = error.errorDescription;
        }
        if (error.internalError) {
            errorAttributes.internalError = error.internalError.errorCode;
            errorAttributes.errorDescription = error.internalError;
        }
    }
    return errorAttributes;
};

export const condenseSearchData = (searchString: string, totalItems: number, position?: number) => {
    let searchAttributes: Attributes = {};
    if (searchString) {
        searchAttributes.searchString = searchString;
    }
    if (totalItems) {
        searchAttributes.totalItems = totalItems;
    }
    if (position) {
        searchAttributes.searchItemPosition = position;
    }
    return searchAttributes;
};

export const condensePreferanceData = ({
    qp,
    streamOverCellular,
    sendPushNotification,
    prefDownloadOnWifiOnly,
}: {
    qp?: string;
    streamOverCellular?: boolean;
    sendPushNotification?: boolean;
    prefDownloadOnWifiOnly?: boolean;
}) => {
    let preferanceAttributes: Attributes = {};
    if (qp) {
        preferanceAttributes.prefStreamQuality = qp;
    }
    if (streamOverCellular) {
        preferanceAttributes.prefStreamWithMobileData = !streamOverCellular;
    }
    if (sendPushNotification) {
        preferanceAttributes.prefEnablePushNotifications = sendPushNotification;
    }
    if (prefDownloadOnWifiOnly) {
        preferanceAttributes.prefDownloadOnWifiOnly = prefDownloadOnWifiOnly;
    }
    return preferanceAttributes;
};

export const condenseTopUpData = (credits: number | null) => {
    let topUpAttributes: Attributes = {};
    if (credits) {
        topUpAttributes.creditsAvailable = credits;
    }
    return topUpAttributes;
};

export const condenseSubscriptionData = (purchasedSubscription: ProductsResponseMessage) => {
    let subscriptionAttributes: Attributes = {};
    if (purchasedSubscription.appChannels && purchasedSubscription.appChannels.length > 0) {
        subscriptionAttributes.purchasedSubscription = purchasedSubscription.appChannels[0].appID;
    }
    return subscriptionAttributes;
};

export const condenseErrorObject = (error: any, errorType?: AppEvents) => {
    let errorAttributes: any = {};
    if (typeof error === 'string') {
        errorAttributes.errorDescription = error;
    }
    if (errorType) {
        errorAttributes.errorType = errorType;
    }
    if (error) {
        if (error.code) {
            errorAttributes.code = error.code;
        }
        if (error.AddSubscriptionResponseMessage) {
            errorAttributes.errorCode = errorCode(EvergentEndpoints.AddSubscription, error);
        }
        if (error.productId) {
            errorAttributes.productId = error.productId;
        }
        if (error.debugMessage) {
            errorAttributes.debugMessage = error.debugMessage;
        }
        if (error.message) {
            errorAttributes.message = error.message;
        }
        if (error.productId) {
            errorAttributes.productId = error.productId;
        }
        if (error.responseCode) {
            errorAttributes.responseCode = error.responseCode;
        }
        if (error.userInfo && error.userInfo.NSUnderlyingError) {
            const underlyingError = error.userInfo.NSUnderlyingError;
            const code = underlyingError.code;
            const domain = underlyingError.domain;
            const desc = underlyingError.userInfo && underlyingError.userInfo.NSLocalizedDescription;
            errorAttributes.debugMessage = `code: ${code}, domain: ${domain}, desc: ${desc}`;
        }
    }
    return errorAttributes;
};

export const removeUndefined = (attributes: any) => {
    Object.keys(attributes).forEach(key =>
        attributes[key] === undefined || attributes[key] === '' || attributes[key] === 0 ? delete attributes[key] : {},
    );
    return attributes;
};
