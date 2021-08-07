import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { ResourceHookResponse, useFetchResourceQuery } from '../../../src/hooks/useFetchResourceQuery';
import * as resourceSuccess from '../__mocks__/resource_success.json';
import { QueryResponse, ClientContextProvider, createAPIClient } from '../../../index';

describe('useFetchResourceQuery', () => {
    it('fetches resource and returns proper data on success', async () => {
        const resourceId = '012345';
        const resourceType = 'movies';
        const fetchFunction: () => Promise<QueryResponse> = async () => ({
            error: false,
            status: 200,
            payload: resourceSuccess,
        });

        const Client = createAPIClient({
            discovery: { host: 'https://mockHost', basePath: 'mockPath', defaultQueryParams: {} },
        });
        Client.query = fetchFunction;

        const wrapper = ({ children }: any): any => (
            <ClientContextProvider client={Client}>{children}</ClientContextProvider>
        );

        jest.useFakeTimers();

        const { result } = renderHook<void, ResourceHookResponse>(
            () => useFetchResourceQuery(resourceId, resourceType),
            {
                wrapper: wrapper,
            },
        );

        expect(result.current.loading).toEqual(true);
        expect(result.current.error).toEqual(false);
        expect(result.current.mainResource).toBeUndefined();

        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.loading).toEqual(false);
        expect(result.current.error).toEqual(false);
        expect(result.current.mainResource && result.current.mainResource.id).toEqual(
            '9352E2E9-D046-4541-B798-79BCE8648A8F',
        );
        expect(result.current.mainResource && result.current.mainResource.name).toEqual('Thor: Ragnarok');
        // result.current.subResources &&
        //     result.current.subResources.map(resource => {
        //         const id = resource.id;
        //         expect(id).toEqual('FNGTVEpisodeP435703zzPH0204132');
        //     });
    });

    it('fetches resource and returns proper error when request fails', async () => {
        const resourceId = '012345';
        const resourceType = 'movies';
        const fetchFunction: () => Promise<QueryResponse> = async () => ({
            error: true,
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

        const { result } = renderHook<void, ResourceHookResponse>(
            () => useFetchResourceQuery(resourceId, resourceType),
            {
                wrapper: wrapper,
            },
        );
        expect(result.current.loading).toEqual(true);
        expect(result.current.error).toEqual(false);
        expect(result.current.mainResource).toBeUndefined();

        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.loading).toEqual(false);
        expect(result.current.error).toEqual(true);
        expect(result.current.errorObject).toEqual(undefined);
        expect(result.current.mainResource).toEqual(undefined);
    });
});

export {};
