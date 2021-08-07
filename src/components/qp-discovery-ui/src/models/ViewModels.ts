import { ImageType, AspectRatio } from 'qp-common-ui';
import { FlatList } from 'react-native';

export interface TabVm {
    id: string;
    localizedName?: { [key: string]: string };
    name: string;
}

export type ResourceType =
    | 'urn:resource:catalog:movie'
    | 'urn:resource:catalog:tvseries'
    | 'urn:resource:catalog:tvepisodes'
    | 'urn:resource:live:linearlivechannel';

export type CardLayout = 'carousel' | 'banner';
export type CardSize = 'regular' | 'large' | 'xlarge';
export type CardStyle = 'regular' | 'rounded';
export type ContainerType = 'Collection';
export type CollectionLayoutType = 'banner' | 'carousel' | 'grid';
export type ContainerName = 'coming_soon' | 'aha_original' | 'trailer' | 'regular';
export type ContainerSourceType = 'continue_watching';

export interface ContainerVm {
    id: string;
    type?: string;
    name: string;
    localizedName?: { [key: string]: string };
    resources?: ResourceVm[];
    imageType: ImageType;
    aspectRatio: AspectRatio;
    imageAspectRatio?: string;
    layout: CardLayout;
    size?: CardSize;
    style?: CardStyle;
    source?: string;

    contentUrl?: string;
    contentCount?: number;
    continueWatching?: boolean;
    contentIds?: string[];
    lazyLoading?: boolean;
    pageNumber?: number;
    maxResources?: number;
    containerType?: ContainerName;
    soureType?: ContainerSourceType;
    /**
     * cardWidth is a first resource card width,
     * assumption all the card aspect ratio will be same in the list.
     */
    cardWidth?: number;
    /**
     * cardAspectRatio is a first resource card AspectRatio ,
     * assumption all the card aspect ratio will be same in the list.
     */
    cardAspectRatio?: AspectRatio;
    /**
     * containerListRef is the reference of list of resorces
     */
    containerListRef?: FlatList<ResourceVm> | null;
    /**
     * hasFocus to findout which container row item has focus
     */
    hasFocus?: boolean;
}

export interface ResourceVm {
    id: string;
    key: string;
    name: string;

    title?: string;
    subtitle?: string;
    episodes?: any[];
    seasons?: any[];
    colorLogo?: string;
    // contentType
    type: string;

    // format: { ISO-639 code: name }
    localizedName?: { [key: string]: string };
    shortDescription?: string;
    longDescription?: string;
    // format: { ISO-639 code: description }
    localizedDescription?: { [key: string]: string };

    // fallback image url
    image?: string;
    // format: { aspect_ratio_key:image_url }
    syndicationImages?: { [key: string]: string };
    // role: [(fistname, lastname), ...]
    cast?: { [key: string]: string[] | null };

    // Meta-info
    contentGenre?: { [key: string]: string[] };
    releaseYear?: number;
    //format:{ratingSystem:ratingValue}

    isFreeContent?: boolean;
    isOriginals: boolean;
    rating?: string;
    allRatings?: { [key: string]: string };
    audioQuality?: string;
    videoQuality?: string;

    formattedRunningTime?: string;
    runningTime?: number;
    originalLanguage?: string;

    relatedItemsUrl?: string;

    // playback info
    contentUrl?: string;
    licenseUrl?: string;

    // live program info
    programId?: string;
    endTime?: number;
    startTime?: number;
    licenseWindowStarTime?: string;
    enableUpcomingTag?: boolean;
    isProgramActive?: boolean;
    currentProgramProgress?: number;
    programHumanSchedule?: string;

    // tv series info
    seriesId?: string;
    seriesTitle?: string;
    // format: { ISO-639 code: description }
    localizedSeriesTitle?: { [key: string]: string };
    episodeNumber?: number;
    seasonNumber?: number;

    layout?: CardLayout;
    size?: CardSize;
    style?: CardStyle;
    imageType?: ImageType;
    aspectRatio?: AspectRatio;
    imageAspectRatio?: string;
    source?: string;

    collectionLayout?: CollectionLayoutType;
    containerType?: ContainerType;
    containers?: any[];
    publicationStatus?: string;
    network?: string;
    providerName?: string;
    ex_id?: string;
    callSign?: string;

    backgroundColor?: string;
    ia?: string[];

    // TVPass specific meta-data
    credits?: string;
    expiresIn?: string;
    watchedOffset?: number;
    completedPercent?: number;

    containerId?: string;
    storeFrontId?: string;
    tabId?: string;

    serachItemPositon?: number;
    containerName?: string;
    tabName?: string;
    collectionID?: string;
    collectionName?: string;
    serviceID?: string;

    // indicates parent screen name
    origin?: string;
    showFooter?: boolean;
    showFooterTitles?: boolean;
    adv?: string[];
}

//TODO:To include Schedules when EPG is available
export class Schedule {}
