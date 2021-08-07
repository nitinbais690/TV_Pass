import React from 'react';
import { Text } from 'react-native';
import RelatedItemsView from '../../../src/views/RelatedItemsView';
import { render, getByTestId, getAllByTestId, waitForElement } from '@testing-library/react-native';
import { ClientContextProvider, createAPIClient } from '../../../index';
import * as useCustomHook from '../../../src/hooks/useFetchRelatedItemsQuery';
import { ResourceVm } from '../../../src/models/ViewModels';

jest.mock('../../../src/hooks/useFetchRelatedItemsQuery');

describe('RelatedItemsView', () => {
    it('renders loading state correctly', async () => {
        mockHook({
            loading: true,
            error: false,
            relatedItems: [],
        });

        const { container } = render(jsx());
        expect(getByTestId(container, 'loading')).not.toBeNull();
    });

    it('renders correctly with default styles', async () => {
        const vms = [createMockResourceVm(), createMockResourceVm()];

        mockHook({
            loading: false,
            error: false,
            relatedItems: vms,
        });

        const headerTitle = 'Mock Header';
        const { container, rerender } = render(jsx(headerTitle));
        // Verify section header is rendered
        await waitForElement(() => getByTestId(container, headerTitle));
        // Verify resource cards are rendered
        await waitForElement(() => getAllByTestId(container, 'cardView'));

        rerender(jsx(headerTitle));
        // Verify resource cards are rendered
        await waitForElement(() => getAllByTestId(container, 'cardView'));
    });
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////-------SETUP MOCKS-------///////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const jsx = (title: string = 'Related Items', pressHandler: any = undefined) => {
    const relatedContentLink =
        '/relatedContent?resourceType=movies&resourceId=FNGMovieP384956zzPH0211992&contentGenre=%28Ciencia+Ficcion+Acci%C3%B3n+Aventura+Drama+Romance+Suspenso+%29&originalCountry=US&originalLanguage=eng&brandingChannel=%28FOX+PREMIUM+%29&defaultRatingCodes=%284+%29&releaseYear=2018&castCrew=%28Gwendoline+Christie+FNGPersonGwendolinezzChristie+Bradley+Whitford+FNGPersonBradleyzzWhitford+Amandla+Stenberg+FNGPersonAmandlazzStenberg+Skylan+Brooks+FNGPersonSkylanzzBrooks+Mandy+Moore+FNGPersonMandyzzMoore+Jennifer+Yuh+Nelson+FNGPersonJenniferYuhzzNelson+%29&disableResourceIdFilter=true';
    const cardProps = {
        wrapperStyle: {
            width: 100,
            height: 100,
            backgroundColor: 'red',
        },
        cardAspectRatio: 1,
        onResourcePress: () => {
            pressHandler;
        },
        linearGradientProps: {
            locations: [0, 0.5, 1.0],
            colors: ['transparent', 'rgba(16, 16, 16, 0.4)', 'rgba(16, 16, 16, 0.8)'],
            start: { x: 0, y: 0.5 },
            end: { x: 0, y: 1 },
        },
        tvParallaxProperties: {
            magnification: 1.1,
        },
    };

    const Client = createAPIClient({
        discovery: { host: 'https://mockHost', basePath: 'mockPath', defaultQueryParams: {} },
    });
    return (
        <ClientContextProvider client={Client}>
            <RelatedItemsView
                relatedContentLink={relatedContentLink}
                cardProps={cardProps}
                title={title}
                ListLoadingComponent={<Text testID={'loading'}>Loading..</Text>}
            />
        </ClientContextProvider>
    );
};

const createMockResourceVm = (): ResourceVm => {
    const vm: ResourceVm = {
        name: `Resource_Title_${Math.random()}`,
        id: `${Math.random()}`,
        type: 'movie',
        image: 'http://example.com/images/test.png',
        images: [
            'http://example.com/images/test_0-1x1.png',
            'http://example.com/images/test_0-2x3.png',
            'http://example.com/images/test_0-16x9.png',
        ],
    };
    return vm;
};

const mockHook = (mockResponse: useCustomHook.RelatedItemsHookResponse): void => {
    const mockedCounterHook = useCustomHook as jest.Mocked<typeof useCustomHook>;
    mockedCounterHook.useFetchRelatedItemsQuery.mockImplementation(() => {
        return mockResponse;
    });
};
