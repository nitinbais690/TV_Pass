import { ResourceVm, ContainerVm } from 'qp-discovery-ui';
import { PlatformError, PlayerConfig } from 'rn-qp-nxg-player';
import { ProductsResponseMessage } from 'screens/hooks/useGetProducts';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
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
    USAGE = 'Usage',
    RELATED_RESOURCE = 'RelatedResource',
}
export enum UsageScreenOrigin {
    ContenUsage = 'ContentUsage',
    ServicesUsage = 'ServicesUsage',
}

export enum ScreenTabs {
    BROWSE = 'Browse',
    MY_CONTENT = 'MyContent',
    USAGE = 'Usage',
    SETTINGS = 'Settings',
}

export enum ActionEvents {
    ACTION_APP_BACKGROUND = 'ACTION_APP_BACKGROUND',
    ACTION_APP_START = 'ACTION_APP_START',
    ACTION_SIGN_UP = 'ACTION_SIGN_UP',
    ACTION_PREVIEW_SCREEN = 'ACTION_PREVIEW_SCREEN',
    ACTION_LOGIN = 'ACTION_LOGIN',
    ACTION_PREVIOUS_SCREEN = 'ACTION_PREVIOUS_SCREEN',
    ACTION_CREATE_ACCOUNT = 'ACTION_CREATE_ACCOUNT',
    ACTION_USER_SETUP_INITIATED = 'ACTION_USER_SETUP_INITIATED',
    ACTION_USER_SETUP_COMPLETE = 'ACTION_USER_SETUP_COMPLETE',
    ACTION_USER_SETUP_FAILED = 'ACTION_USER_SETUP_FAILED',
}

export enum PageEvents {
    PAGE_APP_SPLASH = 'PAGE_APP_SPLASH',
    PAGE_APP_LANDING = 'PAGE_APP_LANDING',
    PAGE_SIGN_UP = 'PAGE_SIGN_UP',
    PAGE_PREVIEW_SCREEN = 'PAGE_PREVIEW_SCREEN',
    PAGE_PREVIEW_SCREEN_DETAIL = 'PAGE_PREVIEW_SCREEN_DETAIL',
    PAGE_CREATE_ACCOUNT = 'PAGE_CREATE_ACCOUNT',
}

export enum PageId {
    PAGE_APP_SPLASH = 'appSplash',
    PAGE_APP_LANDING = 'appLanding',
    PAGE_SIGN_UP = 'signUpIntro',
    PAGE_PREVIEW_SCREEN = 'previewScreen',
    PAGE_PREVIEW_SCREEN_DETAIL = 'previewScreenContentDetails',
    PAGE_CREATE_ACCOUNT = 'createAccount',
}

export const getPageEventFromPageNavigation: (navEvent: string) => PageEvents = (navEvent: string): PageEvents => {
    switch (navEvent) {
        case NAVIGATION_TYPE.LOADING:
            return PageEvents.PAGE_APP_SPLASH;
        case NAVIGATION_TYPE.AUTH_HOME:
            return PageEvents.PAGE_APP_LANDING;
        case NAVIGATION_TYPE.PLAN_INFO:
            return PageEvents.PAGE_SIGN_UP;
        case 'BrowseStackScreen':
            return PageEvents.PAGE_PREVIEW_SCREEN;
        case NAVIGATION_TYPE.CONTENT_DETAILS:
            return PageEvents.PAGE_PREVIEW_SCREEN_DETAIL;
        case NAVIGATION_TYPE.AUTH_SIGN_UP:
            return PageEvents.PAGE_CREATE_ACCOUNT;
        default:
            return PageEvents.PAGE_APP_SPLASH;
    }
};

export const getPageIdsFromPageEvents: (pageEvents: PageEvents) => string = (pageEvents: string): string => {
    switch (pageEvents) {
        case PageEvents.PAGE_APP_SPLASH:
            return PageId.PAGE_APP_SPLASH;
        case PageEvents.PAGE_APP_LANDING:
            return PageId.PAGE_APP_LANDING;
        case PageEvents.PAGE_SIGN_UP:
            return PageId.PAGE_SIGN_UP;
        case PageEvents.PAGE_PREVIEW_SCREEN:
            return PageId.PAGE_PREVIEW_SCREEN;
        case PageEvents.PAGE_PREVIEW_SCREEN_DETAIL:
            return PageId.PAGE_PREVIEW_SCREEN_DETAIL;
        case PageEvents.PAGE_CREATE_ACCOUNT:
            return PageId.PAGE_CREATE_ACCOUNT;
        default:
            return PageId.PAGE_APP_SPLASH;
    }
};

export enum AppEvents {
    //Application Events
    APP_START = 'APP_START',
    APP_FOREGROUND = 'APP_FOREGROUND',
    APP_BACKGROUND = 'APP_BACKGROUND',
    SIGN_UP = 'SIGN_UP',
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    TNC = 'TNC',
    SEARCH = 'SEARCH',
    VIEW_ALL = 'VIEW_ALL',
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
    PURCHASE_FAILURE = 'PURCHASE_SUBSCRIPTION_FAILURE',
    DISCOVERY_FAILURE = 'DISCOVERY_SEARCH_ERROR',
    TVOD_ERROR = 'TVOD_ENTITLEMENT_ERROR',
    TOP_UP_FAILURE = 'PURCHASE_TOPUP_FAILURE',
    SIGNUP_ERROR = 'SIGNUP_ERROR',
    SIGNIN_ERROR = 'SIGNIN_ERROR',
}

export enum ErrorEvents {
    //Events for Developers
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

export const getContentDetailsAttributes = (
    resource: ResourceVm,
    searchPosition?: string,
    recommendedSearchWord?: string,
    contentTabName?: string,
    usageTabName?: string,
): Attributes => {
    let detailsAttributes: Attributes = {};

    if (searchPosition) {
        detailsAttributes.searchItemPosition = searchPosition;
    }
    if (recommendedSearchWord) {
        detailsAttributes.searchWord = recommendedSearchWord;
    }
    if (contentTabName) {
        detailsAttributes.myContentTabName = contentTabName;
    }
    if (usageTabName) {
        detailsAttributes.usageTabName = usageTabName;
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
            detailsAttributes.collectionId = resource.collectionID;
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
            detailsAttributes.pageId = resource.origin;
        }
        if (resource.canDownload !== undefined) {
            detailsAttributes.canDownload = resource.canDownload;
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
    if (typeof error === 'string') {
        errorAttributes.errorCode = error;
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

export const condenseDownloadData = (resource: ResourceVm, downloadProgress?: number) => {
    let downloadAttributes: Attributes = {};
    if (downloadProgress) {
        downloadAttributes.downloadProgress = downloadProgress;
    }
    if (resource) {
        if (resource.credits) {
            downloadAttributes.priceCode = resource.credits;
        }
        if (resource.id) {
            downloadAttributes.contentId = resource.id;
        }
        if (resource.storeFrontId) {
            downloadAttributes.storeFrontId = resource.storeFrontId;
        }
        if (resource.tabId) {
            downloadAttributes.tabId = resource.tabId;
        }
        if (resource.tabName) {
            downloadAttributes.tabName = resource.tabName;
        }
        if (resource.containerName) {
            downloadAttributes.containerName = resource.containerName;
        }
        if (resource.collectionID) {
            downloadAttributes.collectionId = resource.collectionID;
        }
        if (resource.collectionName) {
            downloadAttributes.collectionName = resource.collectionName;
        }
        if (resource.containerId) {
            downloadAttributes.containerId = resource.containerId;
        }
        if (resource.key) {
            downloadAttributes.contentKey = resource.key;
        }
        if (resource.name) {
            downloadAttributes.contentName = resource.name;
        }
        if (resource.contentGenre && resource.contentGenre.en) {
            downloadAttributes.contentGenre = resource.contentGenre.en.join(', ');
        }
        if (resource.runningTime) {
            downloadAttributes.runningTime = resource.runningTime;
        }
        if (resource.seriesTitle) {
            downloadAttributes.seriesName = resource.seriesTitle;
        }
        if (resource.network) {
            downloadAttributes.networkId = resource.network;
        }
        if (resource.providerName) {
            downloadAttributes.providerId = resource.providerName;
        }
        if (resource.origin) {
            downloadAttributes.pageId = resource.origin;
        }
        downloadAttributes.contentType = 'VOD';
    }
    return downloadAttributes;
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

export const condenseViewAllData = (containerItem: ContainerVm) => {
    return {
        pageId: ScreenOrigin.BROWSE,
        containerName: containerItem.name,
        containerId: containerItem.id,
        contentCount: containerItem.contentCount,
        contentUrl: containerItem.contentUrl,
    };
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
        if (error.errorCode) {
            errorAttributes.errorCode = error.errorCode;
        }
        if (error.errorMessage) {
            errorAttributes.errorMessage = error.errorMessage;
        }
        if (error.internalError) {
            errorAttributes.internalError = error.internalError;
        }
        if (error.domain) {
            errorAttributes.domain = error.domain;
        }
        if (error.desc) {
            errorAttributes.description = error.desc;
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
