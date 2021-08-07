import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { useFetchRootContainerQuery, TabHookResponse } from '../../../src/hooks/useFetchRootContainerQuery';
import * as rootNavigationSuccess from '../__mocks__/root_navigation_success.json';

import { QueryResponse, ClientContextProvider, createAPIClient } from '../../../index';

describe('useFetchRootContainerQuery', () => {
    it('fetches resource and returns proper data on success', async () => {
        const storefrontId = '012345';
        const fetchFunction: () => Promise<QueryResponse> = async () => ({
            error: false,
            status: 200,
            payload: rootNavigationSuccess,
        });

        const Client = createAPIClient({
            discovery: { host: 'https://mockHost', basePath: 'mockPath', defaultQueryParams: {} },
        });
        Client.query = fetchFunction;

        const wrapper = ({ children }: any): any => (
            <ClientContextProvider client={Client}>{children}</ClientContextProvider>
        );

        jest.useFakeTimers();

        const { result } = renderHook<void, TabHookResponse>(() => useFetchRootContainerQuery(storefrontId), {
            wrapper: wrapper,
        });

        expect(result.current.loading).toEqual(true);
        expect(result.current.error).toEqual(false);
        expect(result.current.containers).toEqual([]);

        act(() => {
            jest.runAllTimers();
        });
        expect(result.current.loading).toEqual(false);
        expect(result.current.error).toEqual(false);
        expect(result.current.containers.length).toEqual(2);
        expect(result.current.containers[0].id).toEqual('0CAF7A15-6A9F-433E-AFA3-02E1E0829736');
        expect(result.current.containers[1].name).toEqual('Movies');
    });

    it('fetches resource and returns proper error when request fails', async () => {
        const storefrontId = '012345';
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

        const { result } = renderHook<void, TabHookResponse>(() => useFetchRootContainerQuery(storefrontId), {
            wrapper: wrapper,
        });

        expect(result.current.loading).toEqual(true);
        expect(result.current.error).toEqual(false);
        expect(result.current.containers).toEqual([]);

        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.loading).toEqual(false);
        expect(result.current.error).toEqual(true);
        expect(result.current.errorObject).toEqual(undefined);
        expect(result.current.containers.length).toEqual(0);
    });
});
