//TODO :Revisit when Storefront Schema is confirmed
import React from 'react';
import { Text } from 'react-native';
import { ClientContextProvider, createAPIClient } from '../../../index';
import { DiscoveryCatalog } from '../../../src/views/DiscoveryCatalog';
import { render, getAllByTestId, getByTestId, waitForElement } from '@testing-library/react-native';
import { ContainerVm, ResourceVm, CardLayout } from '../../../src/models/ViewModels';
import { ImageType, AspectRatio } from 'qp-common-ui';

jest.mock('../../../src/hooks/useFetchContainerQuery');

describe('DiscoveryCatalog', () => {
    it('renders catalog correctly with default styles', async () => {
        const vms = [createMockResourceVm(), createMockResourceVm()];

        const containers = [createMockContainer('banner', vms), createMockContainer('carousel', vms)];

        const { container } = render(jsx(containers));
        // Verify the carousel is rendered
        await waitForElement(() => getAllByTestId(container, 'carouselCardView'));
        await waitForElement(() => getByTestId(container, 'pageIndicator'));
        // // Verify section header is rendered
        await waitForElement(() => getByTestId(container, containers[1].name!));
        // Verify resource cards are rendered
        await waitForElement(() => getAllByTestId(container, 'cardView'));
    });

    it('should render with custom container renderers', async () => {
        const vms = [createMockResourceVm()];
        const containers = [
            createMockContainer('banner' as CardLayout, vms),
            createMockContainer('carousel' as CardLayout, vms),
        ];

        const customContainerRenderer = ({ item }: { item: ContainerVm }): JSX.Element => {
            return <Text testID={item.name} />;
        };

        const { container } = render(jsx(containers, customContainerRenderer));
        // Verify the custom carousel is rendered
        await waitForElement(() => getByTestId(container, containers[0].name!));
        await waitForElement(() => getByTestId(container, containers[1].name!));
    });

    it('should render with custom resource renderer', async () => {
        const containers = [
            createMockContainer('banner' as CardLayout, [createMockResourceVm(), createMockResourceVm()]),
            createMockContainer('carousel' as CardLayout, [createMockResourceVm(), createMockResourceVm()]),
        ];

        const customResourceRenderer = ({ item }: { item: ResourceVm }): JSX.Element => {
            return <Text testID={item.name} />;
        };

        const { container } = render(jsx(containers, undefined, customResourceRenderer, 2));
        // Verify the carousel is rendered
        await waitForElement(() => getByTestId(container, 'pageIndicator'));
        // Verify section header is rendered
        await waitForElement(() => getByTestId(container, containers[1].name!));
        // Verify the custom carousel is rendered
        await waitForElement(() => getByTestId(container, containers[0].resources![0].name!));
        await waitForElement(() => getByTestId(container, containers[1].resources![0].name!));
    });
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////-------SETUP MOCKS-------///////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const jsx = (containers: ContainerVm[], renderContainer?: any, renderResource?: any, numColumns?: number) => {
    const Client = createAPIClient({
        discovery: { host: 'https://mockHost', basePath: 'mockPath', defaultQueryParams: {} },
    });
    return (
        <ClientContextProvider client={Client}>
            <DiscoveryCatalog
                containers={containers}
                carouselCardWidth={300}
                sectionHeaderStyle={{}}
                renderResource={renderResource ? renderResource : undefined}
                renderContainer={renderContainer ? renderContainer : undefined}
                numColumns={numColumns}
            />
        </ClientContextProvider>
    );
};

const createMockContainer = (type: CardLayout, resources: ResourceVm[]): ContainerVm => {
    const vm: ContainerVm = {
        name: `Container_Title_${Math.random()}`,
        id: `${Math.random()}`,
        resources: resources,
        imageType: ImageType.Poster,
        aspectRatio: AspectRatio._2by3,
        layout: type,
    };
    return vm;
};

const createMockResourceVm = (): ResourceVm => {
    const vm: ResourceVm = {
        id: `${Math.random()}`,
        key: `${Math.random()}-key`,
        name: `Resource_Title_${Math.random()}`,
        image: 'http://example.com/images/test.png',
        type: 'movie',
    };
    return vm;
};

export {};
