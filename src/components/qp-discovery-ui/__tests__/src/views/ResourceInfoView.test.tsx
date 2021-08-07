//TODO :Revisit when Storefront Schema is confirmed
import React from 'react';
import ResourceInfoView from '../../../src/views/ResourceInfoView';
import { ResourceVm } from '../../../index';
import { ClientContextProvider, createAPIClient } from '../../../index';
import { render, getAllByTestId, waitForElement, getByTestId, fireEvent } from '@testing-library/react-native';
import * as useCustomHook from '../../../src/hooks/useFetchResourceQuery';

jest.mock('../../../src/hooks/useFetchResourceQuery');
const createMockResourceVm = (): ResourceVm => {
    const vm: ResourceVm = {
        id: '1234',
        name: 'Test Card',
        image: 'http://example.com/images/test.png',
        images: ['0-16x9', '0-1x1', '0-2x3', '1-16x9'],
        contentGenre: ['Acción', 'Drama', 'Suspenso'],
        releaseYear: 2010,
        shortDescription: 'Joe Turner (Max Irons) siempre se ha sentido conflictuado por su',
        type: 'movie',
        cast: { firstname: ['Arnold Schwarzenegger'] },
    };
    return vm;
};

describe('ResourceInfoView', () => {
    it('renders correctly with default styles', async () => {
        const vm = createMockResourceVm();
        mockHook({
            loading: false,
            error: false,
            mainResource: vm,
        });
        const playPressHandler = jest.fn();
        const downloadPressHandler = jest.fn();
        const { container, rerender } = render(jsx(playPressHandler, downloadPressHandler));
        // Verify "Watch now" button is being rendered
        await waitForElement(() => getAllByTestId(container, 'playButton'));
        rerender(jsx(playPressHandler, downloadPressHandler));
        // Verify "Watch now" button is being clicked
        await waitForElement(() => getAllByTestId(container, 'playButton'));
        const playButton = getByTestId(container, 'playButton');
        fireEvent.press(playButton);
        expect(playPressHandler).toHaveBeenCalled();

        // Verify "Download" button is being clicked
        const downloadButton = getByTestId(container, 'downloadButton');
        fireEvent.press(downloadButton);
        expect(downloadPressHandler).toHaveBeenCalled();
    });

    const vm = createMockResourceVm();
    const Client = createAPIClient({
        discovery: { host: 'https://mockHost', basePath: 'mockPath', defaultQueryParams: {} },
    });
    const jsx = (playPressHandler: any = undefined, downloadPressHandler: any = undefined) => {
        return (
            <ClientContextProvider client={Client}>
                <ResourceInfoView
                    resource={vm}
                    onResourcePlayPress={playPressHandler}
                    onResourceDownloadPress={downloadPressHandler}
                    showDownload={true}
                />
            </ClientContextProvider>
        );
    };
});

const mockHook = (mockResponse: useCustomHook.ResourceHookResponse): void => {
    const mockedCounterHook = useCustomHook as jest.Mocked<typeof useCustomHook>;
    mockedCounterHook.useFetchResourceQuery.mockImplementation(() => {
        return mockResponse;
    });
};
