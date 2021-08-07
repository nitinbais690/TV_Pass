import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';

import { useFetchTVEpisodesQuery, TVEpisodesHookResponse } from '../../../src/hooks/useFetchTVEpisodesQuery';
import * as successResponse from '../__mocks__/tvEpisodes_success.json';

import { QueryResponse, ClientContextProvider, createAPIClient } from '../../../index';

describe('useFetchTVEpisodesQuery', () => {
    it('fetches tvseries resource and returns proper data on success', async () => {
        const seriesId = '7d726fbaee30487fb179674ec994bec3';
        const seasonId = '';
        const resourceType = 'episodes';
        const fetchFunction: () => Promise<QueryResponse> = async () => ({
            error: false,
            status: 200,
            payload: successResponse,
        });

        const Client = createAPIClient({
            discovery: { host: 'https://mockHost', basePath: 'mockPath', defaultQueryParams: {} },
        });
        Client.query = fetchFunction;

        const wrapper = ({ children }: any): any => (
            <ClientContextProvider client={Client}>{children}</ClientContextProvider>
        );

        jest.useFakeTimers();

        const { result } = renderHook<void, TVEpisodesHookResponse>(
            () => useFetchTVEpisodesQuery(seriesId, resourceType, seasonId),
            {
                wrapper: wrapper,
            },
        );

        expect(result.current.loading).toEqual(true);
        expect(result.current.error).toEqual(false);
        expect(result.current.episodes).toEqual([]);

        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.loading).toEqual(false);
        expect(result.current.error).toEqual(false);
        expect(result.current.errorObject).toBeUndefined();
        expect(Object.keys(result.current.episodes)).toHaveLength(2);
        let values = result.current.episodes;
        expect(values[0].id).toEqual('968B483B-004E-42C1-BDC7-2587175F076E');
        expect(values[1].episodeNumber).toEqual(1);
    });

    it('fetches tvseries resource and proper error when request fails', async () => {
        const seriesId = '7d726fbaee30487fb179674ec994bec3';
        const seasonId = '';
        const resourceType = 'episodes';
        const fetchFunction: () => Promise<QueryResponse> = async () => ({
            error: true,
            errorObject: { mockerror: true },
            status: 500,
            payload: null,
        });

        const Client = createAPIClient({
            discovery: { host: 'https://mockHost', basePath: 'mockPath', defaultQueryParams: {} },
        });
        Client.query = fetchFunction;

        const wrapper = ({ children }: any): any => (
            <ClientContextProvider client={Client}>{children}</ClientContextProvider>
        );

        jest.useFakeTimers();

        const { result } = renderHook<void, TVEpisodesHookResponse>(
            () => useFetchTVEpisodesQuery(seriesId, resourceType, seasonId),
            {
                wrapper: wrapper,
            },
        );

        expect(result.current.loading).toEqual(true);
        expect(result.current.error).toEqual(false);
        expect(result.current.episodes).toEqual([]);

        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.loading).toEqual(false);
        expect(result.current.error).toEqual(true);
        expect(result.current.errorObject).toBeDefined();
        expect(result.current.episodes).toEqual([]);
    });
});
