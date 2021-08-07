//TODO :Revisit when Storefront Schema is confirmed
//import React from 'react';
// import { act, renderHook } from '@testing-library/react-hooks';
// import { QueryResponse, ClientContextProvider, createAPIClient } from '../../../index';
// import { useFetchRelatedItemsQuery, RelatedItemsHookResponse } from '../../../src/hooks/useFetchRelatedItemsQuery';
// import * as successResponse from '../__mocks__/relatedItems_success.json';

// describe('useFetchRelatedItemsQuery', () => {
//     it('fetches related items and returns proper data on success', async () => {
//         const relatedItemLink =
//             '/relatedContent?resourceType=movies&resourceId=FNGMovieP384956zzPH0211992&contentGenre=%28Ciencia+Ficcion+Acci%C3%B3n+Aventura+Drama+Romance+Suspenso+%29&originalCountry=US&originalLanguage=eng&brandingChannel=%28FOX+PREMIUM+%29&defaultRatingCodes=%284+%29&releaseYear=2018&castCrew=%28Gwendoline+Christie+FNGPersonGwendolinezzChristie+Bradley+Whitford+FNGPersonBradleyzzWhitford+Amandla+Stenberg+FNGPersonAmandlazzStenberg+Skylan+Brooks+FNGPersonSkylanzzBrooks+Mandy+Moore+FNGPersonMandyzzMoore+Jennifer+Yuh+Nelson+FNGPersonJenniferYuhzzNelson+%29&disableResourceIdFilter=true';
//         const fetchFunction: () => Promise<QueryResponse> = async () => ({
//             error: false,
//             status: 200,
//             payload: successResponse,
//         });

//         const Client = createAPIClient({
//             discovery: { host: 'https://mockHost', basePath: 'mockPath', defaultQueryParams: {} },
//         });
//         Client.query = fetchFunction;

//         const wrapper = ({ children }: any): any => (
//             <ClientContextProvider client={Client}>{children}</ClientContextProvider>
//         );

//         jest.useFakeTimers();

//         const { result } = renderHook<void, RelatedItemsHookResponse>(
//             () => useFetchRelatedItemsQuery(relatedItemLink),
//             {
//                 wrapper: wrapper,
//             },
//         );

//         expect(result.current.loading).toEqual(true);
//         expect(result.current.error).toEqual(false);
//         expect(result.current.relatedItems).toBeUndefined();

//         act(() => {
//             jest.runAllTimers();
//         });

//         expect(result.current.loading).toEqual(false);
//         expect(result.current.error).toEqual(false);
//         expect(result.current.errorObject).toBeUndefined();
//         expect(result.current.relatedItems && result.current.relatedItems[0].type).toEqual('movies');
//         expect(result.current.relatedItems && result.current.relatedItems[0].id).toEqual('FNGMovieP380906zzPH0154817');
//     });

//     it('fetches related items and proper error when request fails', async () => {
//         const relatedItemLink =
//             '/relatedContent?resourceType=movies&resourceId=FNGMovieP384956zzPH0211992&contentGenre=%28Ciencia+Ficcion+Acci%C3%B3n+Aventura+Drama+Romance+Suspenso+%29&originalCountry=US&originalLanguage=eng&brandingChannel=%28FOX+PREMIUM+%29&defaultRatingCodes=%284+%29&releaseYear=2018&castCrew=%28Gwendoline+Christie+FNGPersonGwendolinezzChristie+Bradley+Whitford+FNGPersonBradleyzzWhitford+Amandla+Stenberg+FNGPersonAmandlazzStenberg+Skylan+Brooks+FNGPersonSkylanzzBrooks+Mandy+Moore+FNGPersonMandyzzMoore+Jennifer+Yuh+Nelson+FNGPersonJenniferYuhzzNelson+%29&disableResourceIdFilter=true';
//         const fetchFunction: () => Promise<QueryResponse> = async () => ({
//             error: true,
//             errorObject: { mockerror: true },
//             status: 500,
//             payload: null,
//         });

//         const Client = createAPIClient({
//             discovery: { host: 'https://mockHost', basePath: 'mockPath', defaultQueryParams: {} },
//         });
//         Client.query = fetchFunction;

//         const wrapper = ({ children }: any): any => (
//             <ClientContextProvider client={Client}>{children}</ClientContextProvider>
//         );

//         jest.useFakeTimers();

//         const { result } = renderHook<void, RelatedItemsHookResponse>(
//             () => useFetchRelatedItemsQuery(relatedItemLink),
//             {
//                 wrapper: wrapper,
//             },
//         );

//         expect(result.current.loading).toEqual(true);
//         expect(result.current.error).toEqual(false);
//         expect(result.current.relatedItems).toBeUndefined();

//         act(() => {
//             jest.runAllTimers();
//         });

//         expect(result.current.loading).toEqual(false);
//         expect(result.current.error).toEqual(true);
//         expect(result.current.errorObject).toBeDefined();
//         expect(result.current.relatedItems).toBeNull();
//     });
// });
describe('Sample test function', () => {
    test('This is a sample test', () => {});
});
export {};
