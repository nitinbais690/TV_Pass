import React from 'react';
import { Text } from 'react-native';
import { act, renderHook, RenderHookResult } from '@testing-library/react-hooks';
import * as epgSuccessResponse from '../__mocks__/epgGrid_success.json';
import * as channelSuccessResponse from '../__mocks__/epg_channel_success.json';
import { QueryResponse, ClientContextProvider, createAPIClient } from '../../../index';
import { EpgHookResponse, useFetchEpgQuery } from '../../../src/hooks/useFetchEpgQuery';
import { QueryErrorBoundary, Action } from 'react-fetching-library';

describe('useFetchEpgQuery', () => {
    it('should not update state when the component is unmounted', async () => {
        jest.useFakeTimers();

        const { result, unmount } = renderCustomHook('success');

        expect(result.current.loading).toEqual(true);
        expect(result.current.error).toEqual(false);
        expect(result.current.containers.size).toEqual(0);
        expect(result.current.channels).toEqual([]);
        expect(result.current.timeSlotData).toEqual([]);

        await unmount();

        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.loading).toEqual(true);
        expect(result.current.error).toEqual(false);
        expect(result.current.containers.size).toEqual(0);
        expect(result.current.channels).toEqual([]);
        expect(result.current.timeSlotData).toEqual([]);
    });

    it('should not return channels when epgGrid API fails', async () => {
        jest.useFakeTimers();

        const { result } = renderCustomHook('failEpgGrid');

        expect(result.current.loading).toEqual(true);
        expect(result.current.error).toEqual(false);
        expect(result.current.containers.size).toEqual(0);
        expect(result.current.channels).toEqual([]);
        expect(result.current.timeSlotData).toEqual([]);

        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.loading).toEqual(false);
        expect(result.current.error).toEqual(false);
        expect(result.current.channels).toEqual([]);
        expect(result.current.containers.size).toEqual(0);
        expect(result.current.timeSlotData).toBeDefined();
    });

    it('should return error when epgGrid and channels API fails', async () => {
        jest.useFakeTimers();

        const { result } = renderCustomHook('failChannel');

        expect(result.current.loading).toEqual(true);
        expect(result.current.error).toEqual(false);
        expect(result.current.containers.size).toEqual(0);
        expect(result.current.channels).toEqual([]);
        expect(result.current.timeSlotData).toEqual([]);

        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.loading).toEqual(false);
        expect(result.current.error).toEqual(true);
        expect(result.current.containers.size).toEqual(0);
        expect(result.current.channels).toEqual([]);
        expect(result.current.timeSlotData).toBeDefined();
    });

    it('fetches channels and epg to return proper data on success', async () => {
        jest.useFakeTimers();

        const { result } = renderCustomHook('success');

        expect(result.current.loading).toEqual(true);
        expect(result.current.error).toEqual(false);
        expect(result.current.containers.size).toEqual(0);
        expect(result.current.channels).toEqual([]);
        expect(result.current.timeSlotData).toEqual([]);

        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.loading).toEqual(false);
        expect(result.current.error).toEqual(false);
        expect(result.current.containers.size).toEqual(8);
        expect(result.current.channels.length).toEqual(8); //Added 8 due to content issue in discovery
        expect(result.current.timeSlotData).toBeDefined();
    });
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////-------SETUP MOCKS-------///////////////////////////////
////////////////////////////////////////////////////////////////////////////////

type MockFetchType = 'success' | 'failChannel' | 'failEpgGrid';
const mockResponse: QueryResponse = {
    error: false,
    status: 200,
    payload: {},
};
const mockErrorResponse: QueryResponse = {
    error: true,
    errorObject: {},
    status: 500,
    payload: undefined,
};

const renderCustomHook = (type: MockFetchType): RenderHookResult<any, any> => {
    const fetchFunction: (action: Action) => Promise<QueryResponse> = async (action: Action) => {
        let response = mockResponse;
        if (action.endpoint.includes('channel')) {
            response.payload = channelSuccessResponse;
            if (type === 'failChannel') {
                response = mockErrorResponse;
            }
        } else if (action.endpoint.includes('grid')) {
            response.payload = epgSuccessResponse;
            if (type === 'failEpgGrid') {
                response.payload = mockErrorResponse;
            }
        }
        return response;
    };

    const Client = createAPIClient({
        discovery: { host: 'https://mockHost', basePath: 'mockPath', defaultQueryParams: {} },
    });
    Client.query = fetchFunction;
    const wrapper = ({ children }: any): any => (
        <ClientContextProvider client={Client}>
            <QueryErrorBoundary statuses={[200, 404]} fallback={() => <Text testID="error" />}>
                {children}
            </QueryErrorBoundary>
        </ClientContextProvider>
    );

    return renderHook<void, EpgHookResponse>(
        () => useFetchEpgQuery('2020-05-05T00:00:00+05:30', '2020-05-05T23:59:59+05:30', 1),
        {
            wrapper: wrapper,
        },
    );
};
