import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';

import { useFetchTVSeriesQuery, TVSeriesHookResponse } from '../../../src/hooks/useFetchTVSeriesQuery';
import * as successResponse from '../__mocks__/tvSeries_success.json';

import { QueryResponse, ClientContextProvider, createAPIClient } from '../../../index';

describe('useFetchTVSeriesQuery', () => {
    it('fetches tvseries resource and returns proper data on success', async () => {
        const resourceId = '0A6CDBF8-884C-493F-AD81-E172629A2C0A';
        const resourceType = 'seasons';
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

        const { result } = renderHook<void, TVSeriesHookResponse>(
            () => useFetchTVSeriesQuery(resourceId, resourceType),
            {
                wrapper: wrapper,
            },
        );
        expect(result.current.loading).toEqual(true);
        expect(result.current.error).toEqual(false);
        expect(result.current.seasons).toEqual([]);
        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.loading).toEqual(false);
        expect(result.current.error).toEqual(false);
        expect(result.current.errorObject).toBeUndefined();
        expect(Object.keys(result.current.seasons)).toHaveLength(2);
        let values = Object.keys(result.current.seasons).map((key: any) => result.current.seasons[key]);
        expect(values[0].id).toEqual('EFD45C9D-8598-4425-9D16-B833B8499747');
        expect(values[1].seasonNumber).toEqual(2);
    });

    it('fetches tvseries resource and proper error when request fails', async () => {
        const resourceId = '0A6CDBF8-884C-493F-AD81-E172629A2C0A';
        const resourceType = 'seasons';
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

        const { result } = renderHook<void, TVSeriesHookResponse>(
            () => useFetchTVSeriesQuery(resourceId, resourceType),
            {
                wrapper: wrapper,
            },
        );

        expect(result.current.loading).toEqual(true);
        expect(result.current.error).toEqual(false);
        expect(result.current.seasons).toEqual([]);

        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.loading).toEqual(false);
        expect(result.current.error).toEqual(true);
        expect(result.current.errorObject).toBeDefined();
        expect(result.current.seasons).toEqual([]);
    });
});
