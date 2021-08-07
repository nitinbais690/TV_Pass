import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';

import { useFetchCollectionQuery, CollectionsHookResponse } from '../../../src/hooks/useFetchCollectionQuery';
import * as rootContainerResponse from '../__mocks__/collection_response.json';

import { QueryResponse, ClientContextProvider, createAPIClient } from '../../../index';

describe('useFetchCollectionQuery', () => {
    it('fetches collections and returns proper data on success', async () => {
        const collectionId = 'C53F223D-F8BE-49C2-BD57-FB947B2B3FA9';

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
        const { result } = renderHook<void, CollectionsHookResponse>(() => useFetchCollectionQuery(collectionId), {
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
        expect(Object.keys(result.current.containers)).toHaveLength(1);
        let values = result.current.containers;
        expect(values[0].id).toEqual('0E7DF04A-D7D0-461E-B405-335093FA0A8E');
        expect(values[0].resources && values[0].resources[1].name).toEqual('Immortal Beloved');
    });
});
