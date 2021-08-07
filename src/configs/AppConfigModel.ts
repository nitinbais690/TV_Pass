import { APIClient, ClientIdentifer } from 'qp-discovery-ui';
import decrypt from 'utils/SecurityUtil';

interface ServiceConfig {
    apiConfigs: { [key in ClientIdentifer]: APIClient };
}

export const createServiceConfig = (config: { [key: string]: any }): ServiceConfig => {
    return JSON.parse(JSON.stringify(config));
};

export type KeyValuePair = { [key: string]: any };

export enum AppConfigKeys {
    STORE_FRONT_ID_KEY = 'storefrontId',

    GEO_SERVICE_KEY = 'geoServiceURL',
    STOREFRONT_SERVICE_KEY = 'storefrontURL',
    CATALOG_SERVICE_KEY = 'catalogURL',
    UMS_SERVICE_KEY = 'UmsURL',
    SUBSCRIPTION_SERVICE_KEY = 'subscriptionURL',
    CREDITS_SERVICE_KEY = 'creditsURL',
    IMAGE_RESIZE_SERVICE_KEY = 'imageResizeURL',
    VOD_METADATA_SERVICE_KEY = 'vodMetaDataURL',
    PERSONALIZATION_SERVICE_KEY = 'personalizationURL',
    OAUTH_SERVICE_KEY = 'oAuthURL',
    CLIENT_REGISTRATION_SERVICE_KEY = 'clientRegURL',
    CONTENT_AUTH_SERVICE_KEY = 'contentAuthURL',
    BOOKMARK_SERVICE_KEY = 'bookmarkURL',
    STREAM_CONCURRENCY_SERVICE_KEY = 'strConcurrencyURL',
    FAVORITE_SERVICE_KEY = 'favoriteURL',
    FAIRPLAY_CERTIFICATE_SERVICE_KEY = 'fairPlayCertURL',
    HEARTBEAT_SERVICE_SERVICE_KEY = 'heartBeatURL',
    LOCALIZATION_SERVICE_KEY = 'localizationURL',
    CHECK_REDEEM_SERVICE_KEY = 'checkRedeemURL',
    CONTENT_USAGE_SERVICE_KEY = 'usageURL',
    CONTENT_HISTORY_SERVICE_KEY = 'historyURL',
    RECOMMENDATION_SERVICE_KEY = 'recommendationServiceURL',

    HELP_CENTER_URL_KEY = 'helpCenterURL',
    TERMS_AND_CONDITIONS_URL_KEY = 'termsAndConditionsURL',
    PRIVACY_POLICY_URL_KEY = 'privacyPolicyURL',
    FAQ_URL_KEY = 'faqURL',
    CONTENT_AVAILABILITY = 'contentAvailabilityURL',
    CONTACT = 'contactURL',

    MIN_MAX_USER_NAME_KEY = 'minMaxUsername',
    MIN_MAX_PWD_KEY = 'minMaxPwd',

    PREVIEW_MODE_AUTO_POP_INTERVAL_KEY = 'previewAutoPopIntervalMs',

    ALLOWED_REGIONS = 'allowedRegions',
    GEO_SERVICE_TOKEN = 'geoServiceToken',

    UMS_API_USER_KEY = 'umsApiUser',
    UMS_API_TOKEN_KEY = 'umsApiToken',
    CHANNEL_PARTNER_ID_KEY = 'channelPartnerID',

    FL_CLIENT_ID = 'clientID',
    FL_CLIENT_SECRET = 'clientSecret',
    FL_X_CLIENT_ID = 'xClientId',

    MARKETING_CAROUSEL_KEY = 'marketingCarousel',
    SUBSCRIPTION_CAROUSEL_KEY = 'subscriptionCarousel',
    PREVIEW_IMAGE_URL_KEY = 'previewImageUrl',
    SUBSCRIPTION_CONFIRM_KEY = 'subscriptionConfirmationImageUrl',
    CONTINUE_SUBSCRIPTION_IMAGE_URL_KEY = 'continueSubscriptionImageUrl',
    CONFIGURE_TV_CLIENT = 'configureTvClient',

    CREDITS_REFRESH_INTERVAL_KEY = 'creditsRefreshIntervalMs',

    ONBOARDING_RESOURCE_NEW_KEY = 'onboardingResourceNew',

    // CDS filter query template
    MORE_SERVICE_FILTER_TEMPLATE_KEY = 'moreFromServiceFilterTemplate',
    RECOMMENDED_FILTER_TEMPLATE_KEY = 'recommendedGenreFilterTemplate',
    RECOMMENDED_SERVICE_FILTER_TEMPLATE_KEY = 'recommendedServiceFilterTemplate',

    // recommendation service template
    RECOMMENDED_MORE_SERVICE_TEMPLATE_KEY = 'recommendedFromServiceTemplate',
    RECOMMENDED_TEMPLATE_KEY = 'recommendedTemplate',

    HISTORY_WATCHED_PERCENTAGE_THRESHHOLD = 'historyWatchedPercentageThreshold',

    PLAYER_PLAYBACK_REPORTING_INTERVAL_MS = 'playbackReportingIntervalMs',

    PLAYER_PREF_FWD_BUFFER_DURATION = 'preferredForwardBufferDuration',
    PLAYER_PREF_PEAK_BITRATE_LOW = 'preferredPeakBitRate_Low',
    PLAYER_PREF_PEAK_BITRATE_MEDIUM = 'preferredPeakBitRate_Medium',
    PLAYER_PREF_PEAK_BITRATE_HIGH = 'preferredPeakBitRate_High',
    PLAYER_PREF_PEAK_BITRATE_AUTO = 'preferredPeakBitRate_Auto',

    RECOMMENDED_SEARCH_STOREFRONT_ID = 'recommendSearchStorefrontId',
    RECOMMENDED_SEARCH_STOREFRONT_TAB_ID = 'recommendSearchStorefrontTabId',
    NO_SEARCH_RESULTS_URL = 'noSearchResultsURL',

    BOOKMARK_SYNC_INTERVAL_MS = 'bookmarkSyncIntervalMs',
    BOOKMARK_DELETE_THRESHOLD = 'bookmarkDeleteThreshold',
    STREAM_CONCURRENCY_SYNC_INTERVAL_MS = 'streamConcurrencySyncIntervalMs',

    CONTINUE_WATCHING_MAX_COUNT = 'continueWatchMaxCount',

    SUBSCRIPTION_GRACE_PERIOD_MS = 'subscriptionGracePeriodMs',

    // YOUBORA OPTIONS
    YOUBORA_ACCOUNT_CODE = 'youboraAccountCode',
    YOUBORA_ENABLED = 'youboraEnabled',
    YOUBORA_AUTO_DETECT_BG = 'youboraAutoDetectBackground',
    YOUBORA_LOG_LEVEL = 'youboraLoggerLevel',
    YOUBORA_HTTP_SECURE = 'youboraHttpSecure',

    // MY_CONTENT OPTIONS
    MY_CONTENT_SHOW_RECENTLY_REDEEMED = 'mycontent.showRecentlyRedeemed',
    MY_CONTENT_SHOW_CONTINUE_WATCHING = 'mycontent.showContinueWatching',
    MY_CONTENT_SHOW_EXPIRING_SOON = 'mycontent.showExpiringSoon',
    MY_CONTENT_SHOW_YOUR_MOVIES = 'mycontent.showYourMovies',
    MY_CONTENT_SHOW_YOUR_TV = 'mycontent.showYourTV',
    MY_CONTENT_SHOW_YOUR_SHORTS = 'mycontent.showYourShorts',

    MY_CONTENT_MAX_RECENTLY_REDEEMED_ITEMS = 'mycontent.maxRecentlyRedeemed',
    MY_CONTENT_MAX_YOUR_CONTENT_ITEMS = 'mycontent.maxYourContent',
    MY_CONTENT_EXPIRING_SOON_DAYS_THRESHOLD = 'mycontent.expiringSoonThresholdDays',
    MY_CONTENT_RESOURCES_PAGE_SIZE = 'mycontent.pagingPageSize',
    MY_CONTENT_BOOKMARK_FETCH_TIMEOUT_MS = 'mycontent.bookmarkTimeoutMs',

    UP_NEXT_PERCENTAGE_THRESHOLD = 'upNextPercentageThreshold',
    MAX_UP_NEXT_ITEMS = 'maxUpNextItems',
    VIEW_ALL_CHANNELS_IMAGE_TYPE = 'channelsImageType',
    VIEW_ALL_CHANNELS_ASPECT_RATIO = 'channelsAspectRatio',
    // Access token expiry
    ACCESS_TOKEN_EXP_TIMEOUT = 'accessTokenExpTimeout',

    STOREFRONT_PAGINATION_PAGE_SIZE = 'storefrontPageSize',
    SEARCH_PAGE_SIZE = 'searchPageSize',
    MIN_UPDATED_VERSION = 'minSupportedVersion',
}

export const getServiceConfig = (appConfig: any): ServiceConfig => {
    return {
        apiConfigs: {
            discovery: {
                host: appConfig[AppConfigKeys.STOREFRONT_SERVICE_KEY],
                basePath: '/storefront/',
            },
            catalog: {
                host: appConfig[AppConfigKeys.CATALOG_SERVICE_KEY],
                basePath: '/catalog/',
            },
            metadata: {
                host: appConfig[AppConfigKeys.VOD_METADATA_SERVICE_KEY],
                basePath: '/content',
            },
            checkRedeem: {
                host: appConfig[AppConfigKeys.CHECK_REDEEM_SERVICE_KEY],
                basePath: '/media/',
            },
            ums: {
                host: appConfig[AppConfigKeys.UMS_SERVICE_KEY],
                basePath: '/tvpass/',
            },
            usage: {
                host: appConfig[AppConfigKeys.CONTENT_USAGE_SERVICE_KEY],
                basePath: '/user/usage/',
            },
            history: {
                host: appConfig[AppConfigKeys.CONTENT_HISTORY_SERVICE_KEY],
                basePath: '/user/history/',
            },
            recommendation: {
                host: appConfig[AppConfigKeys.RECOMMENDATION_SERVICE_KEY],
                basePath: '',
            },
            geo: {
                host: appConfig[AppConfigKeys.GEO_SERVICE_KEY],
                basePath: '/',
                defaultQueryParams: {
                    key: decrypt(appConfig[AppConfigKeys.GEO_SERVICE_TOKEN]),
                    fields: 'countryCode',
                },
            },
        },
    };
};
