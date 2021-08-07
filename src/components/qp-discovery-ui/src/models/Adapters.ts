import {
    ContainerVm,
    ResourceVm,
    TabVm,
    CardLayout,
    CardStyle,
    CardSize,
    CollectionLayoutType,
    ContainerType,
    ContainerName,
    ContainerSourceType,
} from './ViewModels';
import {
    Airing,
    Channel,
    Data,
    Tab,
    Container,
    Resource,
    ProgramData,
    Rating,
    R,
    DataStoreImage,
    LocalizedField,
    Entitlements,
    //  Category,
} from './Storefront.types';
import { ImageType, AspectRatioUtil } from 'qp-common-ui';
import { getEpochTime, getCurrentTimeInEpoch, prettyTime } from '../utils/DateUtils';

const defaultLanguage = 'en';
const defaultRatingSystem = 'IMDB';

const capitalize = (s: string) => {
    if (typeof s !== 'string') {
        return '';
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
};

type StringMap = { [key: string]: any };
const adaptLocalizedValues = <T>(lon: LocalizedField<T>[], shouldcapitalize?: boolean): StringMap => {
    if (!lon) {
        return {};
    }
    const initialValue: StringMap = {};
    const kvmap = lon.reduce((acc: StringMap, val: LocalizedField<T>) => {
        if (shouldcapitalize) {
            if (Array.isArray(val.n)) {
                const updated = val.n.map(g =>
                    g
                        .split(' ')
                        .map((w: string) => capitalize(w))
                        .join(' '),
                );
                acc[val.lang] = updated;
            } else if (typeof val.n === 'string') {
                const updated = val.n
                    .split(' ')
                    .map((w: string) => capitalize(w))
                    .join(' ');
                acc[val.lang] = updated;
            } else {
                acc[val.lang] = val.n;
            }
        } else {
            acc[val.lang] = val.n;
        }
        return acc;
    }, initialValue);
    return kvmap;
};

const checkIsFreeContent = (entitlements: Entitlements[]): boolean => {
    for (const ent of entitlements) {
        if (ent.sp && ent.sp.includes('urn:package:aha:free')) {
            return true;
        }
    }
    return false;
};

const adaptRatingValues = (ratingArray: Rating[]): StringMap => {
    const initialValue: StringMap = {};
    const kvmap = ratingArray.reduce((acc: StringMap, val: Rating) => {
        acc[val.s] = val.v;
        return acc;
    }, initialValue);
    return kvmap;
};

export const tabAdapter = (tab: Tab, appLanguage?: string): TabVm => {
    const localizationLang = appLanguage ? appLanguage : defaultLanguage;
    const tabVm: TabVm = {
        id: tab.id,
        localizedName: adaptLocalizedValues(tab.lon),
        get name() {
            return (this.localizedName && this.localizedName[localizationLang]) || '';
        },
    };
    return tabVm;
};

const adaptProgramRatingValues = (ratingArray: R[]): StringMap => {
    const initialValue: StringMap = {};
    const kvmap = ratingArray.reduce((acc: StringMap, val: R) => {
        acc[val.b] = val.c;
        return acc;
    }, initialValue);
    return kvmap;
};
/* To adapt image url in { [key: string]: string } format
Eg:1-1x1 = https://fng-resizer-qp.foxplay.com/resizer/resizer?service=fng&surl=http://fng-vod-qp.foxplay.com/dl/vol1/s/FNG_CP/p5925/2019-07-30-23-30-00/branded_398007_hero_1x1_45626.png&h=2666A7BAAFDCE803FC51D34C1B2D807F00F576E134B943B619F186A5515B7324 */
const adaptDataStoreImage = (images: DataStoreImage[]): StringMap => {
    const initialValue: StringMap = {};
    const kvmap = images.reduce((acc: StringMap, val: DataStoreImage) => {
        acc[val.key] = val.url;
        return acc;
    }, initialValue);
    return kvmap;
};

const timestamp = (seconds: number, isFullString?: boolean) => {
    var h = Math.floor(seconds / 3600);
    var mm = Math.floor((seconds - h * 3600) / 60);
    // var ss = seconds - (h * 3600) - (mm * 60);

    let components = [];
    const hourString = isFullString ? 'hr' : 'h';
    const minuteString = isFullString ? ' mins' : 'm';
    if (h > 0) {
        components.push(`${h}${hourString}`);
    }
    components.push(`${mm}${minuteString}`);
    return components.join(' ');
};

export const containerAdapter = (
    container: Container,
    storefrontId?: string,
    tabId?: string,
    tabName?: string,
    originScreen?: string,
    collectionId?: string,
    collectionTitle?: string,
    appLanguage?: string,
): ContainerVm => {
    const localizationLang = appLanguage ? appLanguage : defaultLanguage;
    const containerVm: ContainerVm = {
        id: container.id,
        localizedName: container.lon && adaptLocalizedValues(container.lon),
        get name() {
            return (this.localizedName && this.localizedName[localizationLang]) || container.n;
        },
        layout: container.lo as CardLayout,
        style: container.stl as CardStyle,
        size: container.s as CardSize,
        imageType: Number(container.iar.split('-')[0]) as ImageType,
        aspectRatio: AspectRatioUtil.fromString(container.iar.split('-')[1]),
        imageAspectRatio: container.iar,
        source: container.src,
        containerType: container.con_ty as ContainerName,
        soureType: container.src_ty as ContainerSourceType,
        contentCount: container.i && container.i.length && container.i[0].count,
        get contentUrl() {
            return (container.i && container.i.length && container.i[0].cu) || undefined;
        },
        get resources() {
            return (
                (container.cd &&
                    container.cd.map(res =>
                        catalogResourceAdapter(
                            res,
                            this,
                            storefrontId,
                            tabId,
                            tabName,
                            originScreen,
                            collectionId,
                            collectionTitle,
                            appLanguage,
                        ),
                    )) ||
                []
            );
        },
    };
    return containerVm;
};

export const catalogResourceAdapter = (
    resource: Resource,
    container: ContainerVm,
    storefrontId?: string,
    tabId?: string,
    tabName?: string,
    originScreen?: string,
    collectionId?: string,
    collectionTitle?: string,
    appLanguage?: string,
): ResourceVm => {
    const localizationLang = appLanguage ? appLanguage : defaultLanguage;
    const resourceVm: ResourceVm = {
        id: resource.id,
        key: resource.key,
        localizedName: adaptLocalizedValues(resource.lon),
        get name() {
            return (this.localizedName && this.localizedName[localizationLang]) || '';
        },
        get title() {
            return (this.localizedName && this.localizedName[localizationLang]) || '';
        },
        get subtitle() {
            const metaInfo = [];
            if (this.releaseYear) {
                metaInfo.push(this.releaseYear);
            }

            const runningTime = this.runningTime ? timestamp(this.runningTime) : undefined;
            if (runningTime) {
                metaInfo.push(runningTime);
            }
            return metaInfo.join(' - ');
        },
        type: resource.cty,
        contentGenre: adaptLocalizedValues<string[]>([{ lang: localizationLang, n: resource.g }], true),
        syndicationImages: resource.ex_ia ? adaptDataStoreImage(resource.ex_ia) : undefined,
        style: container.style,
        size: container.size,
        imageType: container.imageType,
        aspectRatio: container.aspectRatio,
        imageAspectRatio: container.imageAspectRatio,
        layout: container.layout,
        source: container.source,
        containerId: container.id,
        containerName: container.name,
        image: resource.i,
        collectionLayout: resource.c_lo as CollectionLayoutType,
        containerType: resource.ty as ContainerType,
        containers: resource.c,
        ex_id: resource.ex_id,
        callSign: resource.cs,
        releaseYear: resource.r,
        runningTime: resource.rt,
        get formattedRunningTime() {
            return this.runningTime ? timestamp(this.runningTime) : undefined;
        },
        isFreeContent: checkIsFreeContent(resource.ent ? resource.ent : []),
        allRatings: resource.rat ? adaptRatingValues(resource.rat) : undefined,
        get rating() {
            return (this.allRatings && this.allRatings[defaultRatingSystem]) || '';
        },
        licenseWindowStarTime: resource.lws,
        enableUpcomingTag: container.containerType === 'coming_soon',
        backgroundColor: resource.bgc,
        ia: resource.ia,
        providerName: resource.pn,
        network: resource.net,
        //credits: resource.cre,
        credits: resource.ccty || 'free',
        storeFrontId: storefrontId,
        tabId: tabId,
        tabName: tabName,
        collectionID: collectionId,
        collectionName: collectionTitle,
        origin: originScreen,
        showFooter: !(container.layout === 'banner' || resource.ty === 'Collection'),
        showFooterTitles: true, //resource.cty === Category.TVEpisode,
        isOriginals: resource.ao && resource.ao === 'true' ? true : false,
    };
    return resourceVm;
};

export const epgChannelAdapter = (channel: Channel): ResourceVm => {
    let resourceVm: ResourceVm = {
        id: channel.cId,
        key: channel.cId,
        name: channel.cs,
        type: 'channel',
        colorLogo: channel.im.u,
    };
    return resourceVm;
};
export const epgAiringAdapter = (resource: Airing): ResourceVm => {
    let resourceVm: ResourceVm = {
        id: resource.id,
        key: resource.id,
        programId: resource.p.id,
        name: resource.p.t,
        title: resource.p.t,
        startTime: resource.st,
        endTime: resource.et,
        type: resource.cty,

        get isProgramActive(): boolean {
            const airingStartTimeInEpoch = getEpochTime(resource.st);
            const airingEndTimeInEpoch = getEpochTime(resource.et);
            const currentTimeInEpoch = getCurrentTimeInEpoch();

            if (!resource.et || !resource.st) {
                return false;
            }
            return currentTimeInEpoch < airingEndTimeInEpoch && currentTimeInEpoch > airingStartTimeInEpoch;
        },
        get currentProgramProgress(): number {
            const airingStartTimeInEpoch = getEpochTime(resource.st);
            const airingEndTimeInEpoch = getEpochTime(resource.et);
            const currentTimeInEpoch = getCurrentTimeInEpoch();

            if (!airingEndTimeInEpoch || !airingStartTimeInEpoch) {
                return 0;
            }

            const duration = airingEndTimeInEpoch - airingStartTimeInEpoch;
            const watched = currentTimeInEpoch - airingStartTimeInEpoch;
            return watched / duration;
        },
        get programHumanSchedule() {
            const startTimeInEpoch = getEpochTime(resource.st);
            const endTimeInEpoch = getEpochTime(resource.et);

            if (!endTimeInEpoch || !startTimeInEpoch) {
                return '';
            }
            return `${prettyTime(String(startTimeInEpoch))} - ${prettyTime(String(endTimeInEpoch))}`;
        },
    };
    return resourceVm;
};

export const epgProgramAdapter = (resource: ProgramData): ResourceVm => {
    let resourceVm: ResourceVm = {
        id: resource.id,
        key: resource.id,
        name: resource.t,
        type: resource.cty,
        originalLanguage: resource.tl,
        isFreeContent: checkIsFreeContent(resource.ent ? resource.ent : []),
        allRatings: resource.r ? adaptProgramRatingValues(resource.r) : undefined,
        get rating() {
            return (this.allRatings && this.allRatings[defaultRatingSystem]) || '';
        },
        title: resource.t,
        longDescription: resource.ldes,
        shortDescription: resource.sdes,
        releaseYear: resource.ry,
        seasonNumber: resource.sn,
        image: `https://${resource.im.u}`,
    };
    return resourceVm;
};

export const metaDataResourceAdapter = (
    resource: Data,
    parent?: string,
    container?: ContainerVm,
    appLanguage?: string,
): ResourceVm => {
    const localizationLang = appLanguage ? appLanguage : defaultLanguage;
    let resourceVm: ResourceVm = {
        id: resource.id,
        key: resource.key,
        type: resource.cty,
        licenseWindowStarTime: resource.lws,
        enableUpcomingTag: container && container.containerType === 'coming_soon',
        audioQuality: resource.qty && resource.qty.aq,
        videoQuality: resource.qty && resource.qty.vq,
        contentGenre: adaptLocalizedValues(resource.log),
        isFreeContent: checkIsFreeContent(resource.ent ? resource.ent : []),
        allRatings: resource.rat ? adaptRatingValues(resource.rat) : undefined,
        get rating() {
            return (this.allRatings && this.allRatings[defaultRatingSystem]) || '';
        },
        localizedName: adaptLocalizedValues(resource.lon),
        get name() {
            return (this.localizedName && this.localizedName[localizationLang]) || '';
        },
        localizedDescription: resource.lold
            ? adaptLocalizedValues(resource.lold)
            : resource.lod
            ? adaptLocalizedValues(resource.lod)
            : undefined,
        get shortDescription() {
            return (this.localizedDescription && this.localizedDescription[localizationLang]) || '';
        },
        releaseYear: resource.r,
        runningTime: resource.rt,
        get formattedRunningTime() {
            return this.runningTime && Number.isInteger(this.runningTime) ? timestamp(this.runningTime, true) + '' : '';
        },
        episodes: resource.episodes,
        seasons: resource.seasons,
        originalLanguage: '',
        syndicationImages: resource.ex_ia ? adaptDataStoreImage(resource.ex_ia) : undefined,
        image: resource.i,
        seriesId: resource.stl_id,
        localizedSeriesTitle: resource.lostl ? adaptLocalizedValues(resource.lostl) : undefined,
        get seriesTitle() {
            return (this.localizedSeriesTitle && this.localizedSeriesTitle[localizationLang]) || undefined;
        },
        seasonNumber: resource.snum,
        episodeNumber: resource.epnum,
        cast: {
            Actors: resource.cast,
            Director: resource.director,
        },
        publicationStatus: resource.st,
        providerName: resource.pn,
        network: resource.net,
        // credits: resource.cre,
        credits: resource.ccty || 'free',
        origin: parent,
        style: container && container.style,
        size: container && container.size,
        imageType: container && container.imageType,
        aspectRatio: container && container.aspectRatio,
        imageAspectRatio: container && container.imageAspectRatio,
        layout: container && container.layout,
        source: container && container.source,
        containerId: container && container.id,
        containerName: container && container.name,
        showFooter: true,
        showFooterTitles: true, //resource.cty === Category.TVEpisode,
        adv: resource.adv,
        get title() {
            return this.name;
        },
        get subtitle() {
            return `${this.releaseYear} - ${this.formattedRunningTime}`;
        },
    };
    return resourceVm;
};
