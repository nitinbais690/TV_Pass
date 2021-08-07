import {
    fetchContentMetadata,
    fetchHighlights,
    fetchDiscoveryResource,
    fetchRelatedContents,
} from '../../../src/api/actions/fetchDiscoveryResource';

describe('fetchDiscoveryResource', function() {
    it('Action to fetch content metadata', async function() {
        const resourceId: string = '12345';
        let resourceType: string = 'airing';
        let contentMetadata = fetchContentMetadata(resourceId, resourceType, 'metadata');
        expect(contentMetadata.clientIdentifier).toBe('epg');
        resourceType = 'movies';
        contentMetadata = fetchContentMetadata(resourceId, resourceType, 'metadata');
        expect(contentMetadata.clientIdentifier).toBe('metadata');
    });

    it('Action to fetch highlights', async function() {
        const resourceId: string[] = ['123', '456'];
        const highlights = fetchHighlights(resourceId);
        expect(highlights.clientIdentifier).toBe('discovery');
    });

    it('Action to fetch discovery resource', async function() {
        const resourceId: string = '12345';
        const resourceType: string = 'airing';
        const params = {
            key: 'value',
        };
        const discoveryResource = fetchDiscoveryResource(resourceId, resourceType, params);
        expect(discoveryResource.clientIdentifier).toBe('discovery');
    });

    it('Action to fetch related contents', async function() {
        const relatedItemLink =
            '/relatedContent?resourceType=movies&resourceId=FNGMovieP384956zzPH0211992&contentGenre=%28Ciencia+Ficcion+Acci%C3%B3n+Aventura+Drama+Romance+Suspenso+%29&originalCountry=US&originalLanguage=eng&brandingChannel=%28FOX+PREMIUM+%29&defaultRatingCodes=%284+%29&releaseYear=2018&castCrew=%28Gwendoline+Christie+FNGPersonGwendolinezzChristie+Bradley+Whitford+FNGPersonBradleyzzWhitford+Amandla+Stenberg+FNGPersonAmandlazzStenberg+Skylan+Brooks+FNGPersonSkylanzzBrooks+Mandy+Moore+FNGPersonMandyzzMoore+Jennifer+Yuh+Nelson+FNGPersonJenniferYuhzzNelson+%29&disableResourceIdFilter=true';
        const relatedContents = fetchRelatedContents(relatedItemLink);
        expect(relatedContents.clientIdentifier).toBe('discovery');
    });
});
