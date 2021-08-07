//TODO :Revisit when Storefront Schema is confirmed
import React from 'react';
import { render, getByTestId, fireEvent, waitForElement } from '@testing-library/react-native';
import { ResourceVm } from '../../../src/models/ViewModels';
import { EpgScheduleOverlayView } from '../../../src/views/EpgScheduleOverlayView';

const createMockResourceVm = (): ResourceVm => {
    const vm: ResourceVm = {
        name: `Resource_Title_${Math.random()}`,
        id: `${Math.random()}`,
        endTime: Math.random(),
        startTime: Math.random(),
        image: 'http://example.com/images/test.png',
        images: ['0-16x9', '0-1x1', '0-2x3', '1-16x9'],
        type: 'airing',
    };
    return vm;
};

describe('EpgScheduleOverlay', () => {
    const vm = createMockResourceVm();

    it('renders correctly with default styles', async () => {
        const pressHandler = jest.fn();
        const { container } = render(
            <EpgScheduleOverlayView resource={vm} onBackPress={pressHandler} onResourcePress={pressHandler} />,
        );
        await waitForElement(() => getByTestId(container, 'modalView'));
        await waitForElement(() => getByTestId(container, 'closeButton'));
        await waitForElement(() => getByTestId(container, 'detailsContainer'));
        await waitForElement(() => getByTestId(container, 'playIcon'));
    });

    it('renders correctly and invokes play icon onResourcePress callback', () => {
        const pressHandler = jest.fn();
        const { container } = render(
            <EpgScheduleOverlayView resource={vm} onBackPress={pressHandler} onResourcePress={pressHandler} />,
        );
        const wrapper = getByTestId(container, 'playIcon');
        fireEvent.press(wrapper);
        expect(pressHandler).toHaveBeenCalled();
    });

    it('renders correctly and invokes close button callback', () => {
        const pressHandler = jest.fn();
        const { container } = render(
            <EpgScheduleOverlayView resource={vm} onBackPress={pressHandler} onResourcePress={pressHandler} />,
        );
        const wrapper = getByTestId(container, 'closeButton');
        fireEvent.press(wrapper);
        expect(pressHandler).toHaveBeenCalled();
    });
});
