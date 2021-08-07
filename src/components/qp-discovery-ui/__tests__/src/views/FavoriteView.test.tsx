import React from 'react';
import { ClientContextProvider, createAPIClient } from '../../../index';
import FavoriteView from '../../../src/views/FavoriteView';
import { render, fireEvent } from '@testing-library/react-native';
import * as useFavoritesHook from '../../../src/hooks/useFavorites';

jest.mock('../../../src/hooks/useFavorites');

describe('FavoriteView', () => {
    it('renders already liked state correctly', async () => {
        mockHook({
            loading: false,
            liked: true,
            like: jest.fn(),
            unlike: jest.fn(),
        });

        const { getByTestId } = render(jsx());
        expect(getByTestId('favoriteButton')).not.toBeNull();
    });

    it('renders loading state correctly', async () => {
        mockHook({
            loading: true,
            liked: false,
            like: jest.fn(),
            unlike: jest.fn(),
        });

        const { getByTestId } = render(jsx());
        expect(getByTestId('favoriteButton')).not.toBeNull();
    });

    it('should trigger like when currently unliked', async () => {
        const like = jest.fn();
        const unlike = jest.fn();
        mockHook({
            loading: false,
            liked: false,
            like: like,
            unlike: unlike,
        });

        const { getByTestId } = render(jsx());
        fireEvent.press(getByTestId('favoriteButton'));
        expect(like).toHaveBeenCalledTimes(1);
    });

    it('should trigger unlike when currently liked', async () => {
        const like = jest.fn();
        const unlike = jest.fn();
        mockHook({
            loading: false,
            liked: true,
            like: like,
            unlike: unlike,
        });

        const { getByTestId } = render(jsx());
        fireEvent.press(getByTestId('favoriteButton'));
        expect(unlike).toHaveBeenCalledTimes(1);
    });
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////-------SETUP MOCKS-------///////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const jsx = () => {
    const Client = createAPIClient({
        discovery: { host: 'https://mockHost', basePath: 'mockPath', defaultQueryParams: {} },
    });
    return (
        <ClientContextProvider client={Client}>
            <FavoriteView resourceId={''} ovatToken={''} />
        </ClientContextProvider>
    );
};

const mockHook = (mockResponse: useFavoritesHook.FavoriteResponse): void => {
    const mockedCounterHook = useFavoritesHook as jest.Mocked<typeof useFavoritesHook>;
    mockedCounterHook.useFavorite.mockImplementation(() => {
        return mockResponse;
    });
};
