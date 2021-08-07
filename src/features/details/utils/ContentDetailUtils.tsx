import { ResourceVm } from 'qp-discovery-ui';

export const resourceMetadata = (appLanguage: string, resource?: ResourceVm) => {
    const metaInfo = [];
    if (resource) {
        if (resource.releaseYear) {
            metaInfo.push(resource.releaseYear);
        }
        if (resource.formattedRunningTime) {
            metaInfo.push(resource.formattedRunningTime);
        }
        if (resource.contentGenre && resource.contentGenre[appLanguage]) {
            metaInfo.push(resource.contentGenre[appLanguage].join(', '));
        }

        if (resource.videoQuality) {
            metaInfo.push(resource.videoQuality);
        }

        if (resource.audioQuality) {
            metaInfo.push(resource.audioQuality);
        }
    }
    return metaInfo.join(' . ');
};

export const ratingMetadata = (premium: string, resource?: ResourceVm) => {
    const metaInfo = [];
    if (resource) {
        if (!resource.isFreeContent) {
            metaInfo.push(premium);
        }
        const ratings = resource.allRatings && Object.values(resource.allRatings);
        if (ratings && ratings.length > 0 && ratings[0]) {
            metaInfo.push(ratings[0]);
        }
    }
    return metaInfo;
};

export const advisoryMeta = (strings: any, resource?: ResourceVm): string => {
    const metaInfo: string[] = [];
    if (resource && resource.adv) {
        resource.adv.forEach(adv => {
            metaInfo.push(strings[`content_detail.${adv}`]);
        });
    }
    return metaInfo.join(' . ');
};
