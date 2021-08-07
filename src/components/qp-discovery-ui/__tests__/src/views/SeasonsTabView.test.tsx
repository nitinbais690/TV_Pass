//TODO :Revisit when Storefront Schema is confirmed
import React from 'react';
import { Text } from 'react-native';
import { ClientContextProvider, createAPIClient } from '../../../index';
import { SeasonsTabView, TabBarStyle } from '../../../src/views/SeasonsTabView';
import { render, getByTestId, waitForElement } from '@testing-library/react-native';
import * as useFetchTVSeriesQueryHook from '../../../src/hooks/useFetchTVSeriesQuery';
import { TVSeriesHookResponse } from '../../../src/hooks/useFetchTVSeriesQuery';
import { ResourceVm } from '../../../src/models/ViewModels';

jest.mock('../../../src/hooks/useFetchTVSeriesQuery');

describe('SeasonsTabView', () => {
    it('renders error state correctly', async () => {
        mockHook({
            loading: false,
            error: true,
            seasons: [],
        });

        const { container } = render(jsx());
        expect(getByTestId(container, 'error')).not.toBeNull();
    });

    it('renders loading state correctly', async () => {
        mockHook({
            loading: true,
            error: false,
            seasons: [],
        });

        const { container } = render(jsx());
        expect(getByTestId(container, 'loading')).not.toBeNull();
    });

    it('renders tabs with default styles', async () => {
        const seasons = [createMockResourceVm(1), createMockResourceVm(2)];
        mockHook({
            loading: false,
            error: false,
            seasons: seasons,
        });

        const { container } = render(jsx());
        await waitForElement(() => getByTestId(container, 'Resource_1_1'));
    });
    it('avoid re-renders correctly', async () => {
        const seasons = [createMockResourceVm(1), createMockResourceVm(2)];

        mockHook({
            loading: false,
            error: false,
            seasons: seasons,
        });

        const { container, rerender } = render(jsx());
        await waitForElement(() => getByTestId(container, 'Resource_1_1'));
        rerender(jsx());
        await waitForElement(() => getByTestId(container, 'Resource_1_1'));
    });
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////-------SETUP MOCKS-------///////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const jsx = () => {
    const Client = createAPIClient({
        discovery: { host: 'https://mockHost', basePath: 'mockPath', defaultQueryParams: {} },
    });
    const tabBarStyle: TabBarStyle = {
        barColor: 'red',
        barHeight: 55,
        indicatorColor: 'black',
        activeTextColor: 'white',
        inactiveTextColor: 'blue',
    };
    const resourceType = 'seasons';
    return (
        <ClientContextProvider client={Client}>
            <SeasonsTabView
                resourceId={''}
                ListLoadingComponent={<Text testID={'loading'}>Loading..</Text>}
                ListErrorComponent={<Text testID={'error'}>Error..</Text>}
                containerStyle={{}}
                tabBarStyle={tabBarStyle}
                renderPage={(resources): JSX.Element => {
                    return <Text testID={resources.name} />;
                }}
                resourceType={resourceType}
            />
        </ClientContextProvider>
    );
};

const createMockResourceVm = (season: number): ResourceVm => {
    const vm: ResourceVm = {
        name: 'Resource_1_1',
        id: `${Math.random()}`,
        type: 'movie',
        seasonNumber: season,
        image: 'http://example.com/images/test.png',
        images: ['0-16x9', '0-1x1', '0-2x3', '1-16x9'],
    };
    return vm;
};

const mockHook = (mockResponse: TVSeriesHookResponse): void => {
    const mockedCounterHook = useFetchTVSeriesQueryHook as jest.Mocked<typeof useFetchTVSeriesQueryHook>;
    mockedCounterHook.useFetchTVSeriesQuery.mockImplementation(() => {
        return mockResponse;
    });
};
