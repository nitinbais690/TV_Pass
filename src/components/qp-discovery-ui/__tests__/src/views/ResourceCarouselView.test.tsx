import React from 'react';
import ResourceCarouselView from '../../../src/views/ResourceCarouselView';
import { ResourceVm } from '../../../index';

import { render, fireEvent, toJSON, getAllByTestId } from '@testing-library/react-native';

export const createMockResourceVm = (randomId: number): ResourceVm => {
    const vm: ResourceVm = {
        name: 'Test card',
        id: 'id_' + randomId,
        type: 'movie',
        images: [
            'http://example.com/images/test_0-1x1.png',
            'http://example.com/images/test_0-2x3.png',
            'http://example.com/images/test_0-16x9.png',
        ],
    };
    return vm;
};

describe('ResourceCarouselView', () => {
    const vms = [createMockResourceVm(0), createMockResourceVm(1), createMockResourceVm(2)];

    it('renders correctly with default styles', () => {
        const pressHandler = jest.fn();
        const { container } = render(<ResourceCarouselView resources={vms} onResourcePress={pressHandler} />);
        expect(toJSON(container)).toMatchSnapshot();
    });

    it('renders correctly and invokes onPress callback', () => {
        const pressHandler = jest.fn();
        const { container } = render(<ResourceCarouselView resources={vms} onResourcePress={pressHandler} />);
        const cardViews = getAllByTestId(container, 'carouselCardView');

        // press first element
        fireEvent.press(cardViews[0]);
        expect(pressHandler).toHaveBeenCalled();

        // press last element
        fireEvent.press(cardViews.slice(-1)[0]);
        expect(pressHandler).toHaveBeenCalled();
    });

    it('avoid re-renders correctly', () => {
        const jsx = <ResourceCarouselView resources={vms} />;
        const { container, rerender } = render(jsx);
        expect(toJSON(container)).toMatchSnapshot();
        rerender(jsx);
        expect(toJSON(container)).toMatchSnapshot();
    });

    it("renders correctly when custom wrapper style doesn't define aspect ratio", () => {
        const cardStyle = {
            wrapperStyle: {
                width: 100,
                height: 100,
                backgroundColor: 'red',
            },
        };
        const jsx = <ResourceCarouselView resources={vms} cardStyle={cardStyle} />;
        const { container } = render(jsx);
        expect(toJSON(container)).toMatchSnapshot();
    });
});
