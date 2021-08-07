import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';

import { useFetchContainerQuery } from '../../../src/hooks/useFetchContainerQuery';
import { ContainerHookResponse } from '../../../src/hooks/ContainerHookResponse';
import * as rootContainerResponse from '../__mocks__/home_container_success.json';

import { QueryResponse, ClientContextProvider, createAPIClient } from '../../../index';

describe('useFetchContainerQuery', () => {
    it('fetches resource and returns proper data on success', async () => {
        const storefrontId = '01245';
        const tabId = '044545';
        const pageSize = 1;
        const fetchFunction: () => Promise<QueryResponse> = async () => ({
            error: false,
            status: 200,
            payload: rootContainerResponse,
        });

        const Client = createAPIClient({
            discovery: { host: 'https://mockHost', basePath: 'mockPath', defaultQueryParams: {} },
        });
        Client.query = fetchFunction;

        const wrapper = ({ children }: any): any => (
            <ClientContextProvider client={Client}>{children}</ClientContextProvider>
        );
        jest.useFakeTimers();
        const { result } = renderHook<void, ContainerHookResponse>(
            () => useFetchContainerQuery(storefrontId, tabId, pageSize),
            {
                wrapper: wrapper,
            },
        );

        expect(result.current.loading).toEqual(true);
        expect(result.current.error).toEqual(false);
        expect(result.current.containers).toEqual([]);

        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.loading).toEqual(false);
        expect(result.current.error).toEqual(false);
        expect(Object.keys(result.current.containers)).toHaveLength(1);
        let values = result.current.containers;
        expect(values[0].id).toEqual('C2F99F1B-58E6-4F00-8902-BD4FF7778F63');
        expect(values[0].resources && values[0].resources[1].name).toEqual('Once Upon a Time in Mexico');
    });

    it('reloads on calling reload function', async () => {
        const storefrontId = '01245';
        const tabId = '044545';
        const pageSize = 1;
        const fetchFunction: () => Promise<QueryResponse> = async () => ({
            error: false,
            status: 200,
            payload: rootContainerResponse,
        });

        const Client = createAPIClient({
            discovery: { host: 'https://mockHost', basePath: 'mockPath', defaultQueryParams: {} },
        });
        Client.query = fetchFunction;

        const wrapper = ({ children }: any): any => (
            <ClientContextProvider client={Client}>{children}</ClientContextProvider>
        );
        jest.useFakeTimers();
        const { result } = renderHook<void, ContainerHookResponse>(
            () => useFetchContainerQuery(storefrontId, tabId, pageSize),
            {
                wrapper: wrapper,
            },
        );

        expect(result.current.loading).toEqual(true);
        expect(result.current.error).toEqual(false);
        expect(result.current.containers).toEqual([]);

        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.loading).toEqual(false);
        expect(result.current.error).toEqual(false);
        expect(Object.keys(result.current.containers)).toHaveLength(1);
        let values = result.current.containers;
        expect(values[0].id).toEqual('C2F99F1B-58E6-4F00-8902-BD4FF7778F63');
        expect(values[0].resources && values[0].resources[1].name).toEqual('Once Upon a Time in Mexico');

        result.current.reload && result.current.reload();
        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.loading).toEqual(false);
        expect(result.current.error).toEqual(false);
        expect(Object.keys(result.current.containers)).toHaveLength(1);
        let reloadedValues = result.current.containers;
        expect(reloadedValues[0].id).toEqual('C2F99F1B-58E6-4F00-8902-BD4FF7778F63');
        expect(reloadedValues[0].resources && reloadedValues[0].resources[1].name).toEqual(
            'Once Upon a Time in Mexico',
        );
    });

    it('loads more when calling the load more function', async () => {
        const storefrontId = '01245';
        const tabId = '044545';
        const pageSize = 1;
        const fetchFunction: () => Promise<QueryResponse> = async () => ({
            error: false,
            status: 200,
            payload: rootContainerResponse,
        });

        const Client = createAPIClient({
            discovery: { host: 'https://mockHost', basePath: 'mockPath', defaultQueryParams: {} },
        });
        Client.query = fetchFunction;

        const wrapper = ({ children }: any): any => (
            <ClientContextProvider client={Client}>{children}</ClientContextProvider>
        );
        jest.useFakeTimers();
        const { result } = renderHook<void, ContainerHookResponse>(
            () => useFetchContainerQuery(storefrontId, tabId, pageSize),
            {
                wrapper: wrapper,
            },
        );

        expect(result.current.loading).toEqual(true);
        expect(result.current.error).toEqual(false);
        expect(result.current.containers).toEqual([]);

        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.loading).toEqual(false);
        expect(result.current.error).toEqual(false);
        expect(Object.keys(result.current.containers)).toHaveLength(1);
        let values = result.current.containers;
        expect(values[0].id).toEqual('C2F99F1B-58E6-4F00-8902-BD4FF7778F63');
        expect(values[0].resources && values[0].resources[1].name).toEqual('Once Upon a Time in Mexico');

        result.current.loadMore && result.current.loadMore(2);
        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.loading).toEqual(false);
        expect(result.current.error).toEqual(false);
    });

    it('fetches tvseries resource and proper error when request fails', async () => {
        const storefrontId = '02312';
        const tabId = '3244';
        const pageSize = 2;
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

        const { result } = renderHook<void, ContainerHookResponse>(
            () => useFetchContainerQuery(storefrontId, tabId, pageSize),
            {
                wrapper: wrapper,
            },
        );

        expect(result.current.loading).toEqual(true);
        expect(result.current.error).toEqual(false);
        expect(result.current.containers).toEqual([]);

        act(() => {
            jest.runAllTimers();
        });
        expect(result.current.loading).toEqual(false);
        expect(result.current.error).toEqual(true);
        expect(result.current.errorObject).toBeDefined();
        expect(result.current.containers).toEqual([]);
    });
});

export {};
