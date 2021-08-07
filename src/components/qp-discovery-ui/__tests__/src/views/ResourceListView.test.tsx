import React from 'react';
import ResourceListView from '../../../src/views/ResourceListView';
import { ResourceVm } from '../../../src/models/ViewModels';
import { render, getByTestId, getAllByTestId, waitForElement } from '@testing-library/react-native';

describe('ResourceListView', () => {
    const pressHandler = jest.fn();
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
        showSubtitle: true,
    };

    it('renders correctly with default styles', async () => {
        const seasons = [createMockResourceVm(), createMockResourceVm()];
        const jsx = <ResourceListView resources={seasons} cardProps={cardProps} />;
        const { container } = render(jsx);
        await waitForElement(() => getByTestId(container, 'resourceListView'));
        await waitForElement(() => getAllByTestId(container, 'cardView'));
    });
    it('avoid re-renders correctly', async () => {
        const seasons = [createMockResourceVm(), createMockResourceVm()];
        const jsx = <ResourceListView resources={seasons} cardProps={cardProps} />;
        const { container, rerender } = render(jsx);
        await waitForElement(() => getByTestId(container, 'resourceListView'));
        await waitForElement(() => getAllByTestId(container, 'cardView'));
        rerender(jsx);
        await waitForElement(() => getAllByTestId(container, 'cardView'));
    });
});
const createMockResourceVm = (): ResourceVm => {
    const vm: ResourceVm = {
        id: `${Math.random()}`,
        name: `Resource_Title_${Math.random()}`,
        image: 'http://example.com/images/test.png',
        images: [
            'http://example.com/images/test_0-1x1.png',
            'http://example.com/images/test_0-2x3.png',
            'http://example.com/images/test_0-16x9.png',
        ],
        type: 'movie',
    };
    return vm;
};
