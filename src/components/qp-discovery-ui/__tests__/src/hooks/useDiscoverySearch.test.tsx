import React from 'react';
import { act, renderHook, RenderHookResult } from '@testing-library/react-hooks';

import { useDiscoverySearch, DiscoverySearchHookResponse } from '../../../src/hooks/useDiscoverySearch';
import * as successResponse from '../__mocks__/search_success.json';

import { QueryResponse, ClientContextProvider, createAPIClient } from '../../../index';

const renderCustomHook = (
    mockResponse: QueryResponse,
    searchTerm: string = 'breaking ',
): RenderHookResult<any, DiscoverySearchHookResponse> => {
    const fetchFunction: () => Promise<QueryResponse> = async () => mockResponse;

    const Client = createAPIClient({
        discovery: { host: 'https://mockHost', basePath: 'mockPath', defaultQueryParams: {} },
    });
    Client.query = fetchFunction;

    const wrapper = ({ children }: any): any => (
        <ClientContextProvider client={Client}>{children}</ClientContextProvider>
    );

    return renderHook<string, DiscoverySearchHookResponse>(() => useDiscoverySearch(searchTerm, '', '', '', 300, 10), {
        wrapper: wrapper,
    });
};

describe('useDiscoverySearch', () => {
    it('fetches resource and returns proper data on success', async () => {
        jest.useFakeTimers();

        const { result } = renderCustomHook({
            error: false,
            status: 200,
            payload: successResponse,
        });

        expect(result.current.loading).toEqual(true);
        expect(result.current.error).toEqual(false);
        expect(result.current.resources).toEqual([]);

        act(() => {
            jest.runAllTimers();
        });
        expect(result.current.loading).toEqual(false);
        expect(result.current.error).toEqual(false);
        expect(result.current.resources.length).toEqual(1);
    });

    it('fetches resource and returns proper error when request fails', async () => {
        jest.useFakeTimers();

        const { result } = renderCustomHook({
            error: true,
            status: 500,
            payload: null,
        });

        expect(result.current.loading).toEqual(true);
        expect(result.current.error).toEqual(false);
        expect(result.current.resources).toEqual([]);

        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.loading).toEqual(false);
        expect(result.current.error).toEqual(true);
        expect(result.current.resources.length).toEqual(0);
    });
});
export {};
