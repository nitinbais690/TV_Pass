import React from 'react';
import { act, renderHook, RenderHookResult } from '@testing-library/react-hooks';
import { useFavorite, FavoriteResponse } from '../../../src/hooks/useFavorites';
import { QueryResponse, ClientContextProvider, createAPIClient } from '../../../index';

describe('useFavorite', () => {
    it('should not fetch when token in not defined', async () => {
        jest.useFakeTimers();

        const { result, rerender } = renderCustomHook('12', undefined, undefined, {
            error: false,
            status: 200,
            payload: {},
        });

        expect(result.current.loading).toEqual(false);
        expect(result.current.liked).toEqual(false);

        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.loading).toEqual(false);
        expect(result.current.liked).toEqual(false);

        rerender({ resId: '12', tokenValue: 'token', accessToken: 'accessToken' });

        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.loading).toEqual(false);
        expect(result.current.liked).toEqual(false);
    });

    it('fetches already liked favorite', async () => {
        jest.useFakeTimers();

        const { result } = renderCustomHook('12', 'token', 'accessToken', {
            error: false,
            status: 200,
            payload: {},
        });

        expect(result.current.loading).toEqual(true);
        expect(result.current.liked).toEqual(false);

        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.loading).toEqual(false);
        expect(result.current.liked).toEqual(false);
        expect(result.current.like).not.toBeNull();
        expect(result.current.unlike).not.toBeNull();

        act(() => {
            result.current.unlike();
            jest.runAllTimers();
        });

        expect(result.current.loading).toEqual(false);
        expect(result.current.liked).toEqual(false);
        expect(result.current.like).not.toBeNull();
        expect(result.current.unlike).not.toBeNull();

        act(() => {
            result.current.like();
            jest.runAllTimers();
        });

        expect(result.current.loading).toEqual(false);
        expect(result.current.liked).toEqual(false);
        expect(result.current.like).not.toBeNull();
        expect(result.current.unlike).not.toBeNull();
    });

    it('fetches non-liked favorite', async () => {
        jest.useFakeTimers();

        const { result } = renderCustomHook('12', 'token', 'accessToken', {
            error: false,
            status: 404,
            payload: {},
        });

        expect(result.current.loading).toEqual(true);
        expect(result.current.liked).toEqual(false);

        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.loading).toEqual(false);
        expect(result.current.liked).toEqual(false);
        expect(result.current.like).not.toBeNull();
        expect(result.current.unlike).not.toBeNull();
    });

    it('should not update state when the component unmounts', async () => {
        jest.useFakeTimers();

        const { result, unmount } = renderCustomHook('12', 'token', 'accessToken', {
            error: false,
            status: 404,
            payload: {},
        });

        expect(result.current.loading).toEqual(true);
        expect(result.current.liked).toEqual(false);

        act(() => {
            unmount();
            jest.runAllTimers();
        });

        result.current.like();

        expect(result.current.loading).toEqual(true);
        expect(result.current.liked).toEqual(false);
    });
});

const renderCustomHook = (
    resourceId: string,
    token: string | undefined,
    accessToken: string | undefined,
    mockResponse: QueryResponse,
): RenderHookResult<any, FavoriteResponse> => {
    const fetchFunction: () => Promise<QueryResponse> = async () => mockResponse;

    const Client = createAPIClient({
        personalization: { host: 'https://mockHost', basePath: 'mockPath', defaultQueryParams: {} },
    });
    Client.query = fetchFunction;

    const wrapper = ({ children }: any): any => (
        <ClientContextProvider client={Client}>{children}</ClientContextProvider>
    );

    return renderHook<any, FavoriteResponse>(
        ({ resId, tokenValue, accessToken }) => useFavorite(resId, tokenValue, accessToken),
        {
            initialProps: { resId: resourceId, tokenValue: token, accessToken },
            wrapper: wrapper,
        },
    );
};
