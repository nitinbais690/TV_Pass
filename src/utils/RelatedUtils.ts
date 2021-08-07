import { ResourceVm } from 'qp-discovery-ui';
import { AppConfig } from 'utils/AppPreferencesContext';
import { Category } from 'qp-discovery-ui/src/models/Storefront.types';

export enum RelatedType {
    RelatedTypeService,
    RelatedTypeGenre,
}

const ID_PLACEHOLDER_KEY = '%id%';
const PROVIDER_NAME_PLACEHOLDER_KEY = '%pn%';
const CATEGORY_PLACEHOLDER_KEY = '%cty%';
const GENRE_PLACEHOLDER_KEY = '%log%';

export const relatedQuery = (
    appConfig: AppConfig | undefined,
    type: RelatedType,
    resource: ResourceVm,
    appLanguage: string,
) => {
    if (!appConfig) {
        return '';
    }

    let queryTemplate =
        type === RelatedType.RelatedTypeService
            ? appConfig.moreFromServiceFilterTemplate
            : appConfig.recommendedGenreFilterTemplate;

    let query = global.Buffer.from(queryTemplate, 'base64').toString('ascii');
    query = query.replace(ID_PLACEHOLDER_KEY, resource.id);
    if (resource.providerName) {
        query = query.replace(PROVIDER_NAME_PLACEHOLDER_KEY, resource.providerName);
    }
    query = query.replace(CATEGORY_PLACEHOLDER_KEY, resource.type);

    const genres = (resource.contentGenre && resource.contentGenre[appLanguage]) || [];
    query = query.replace(GENRE_PLACEHOLDER_KEY, genres.join(','));

    return global.Buffer.from(query).toString('base64');
};

export const relatedUsageQuery = (appConfig: AppConfig | undefined, type: RelatedType, qName: string) => {
    if (!appConfig) {
        return '';
    }

    let queryTemplate =
        type === RelatedType.RelatedTypeService
            ? appConfig.recommendedServiceFilterTemplate
            : appConfig.recommendedGenreFilterTemplate;
    const PlaceholderName =
        type === RelatedType.RelatedTypeService ? PROVIDER_NAME_PLACEHOLDER_KEY : GENRE_PLACEHOLDER_KEY;
    const catItems = Category.Movie + ',' + Category.Short + ',' + Category.TVEpisode;
    let query = global.Buffer.from(queryTemplate, 'base64').toString('ascii');
    query = query.replace(CATEGORY_PLACEHOLDER_KEY, catItems);
    query = query.replace(PlaceholderName, qName);
    return global.Buffer.from(query).toString('base64');
};
