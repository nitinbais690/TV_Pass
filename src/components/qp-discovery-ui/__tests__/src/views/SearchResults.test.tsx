import React from 'react';
import { ResourceCardViewBaseProps } from '../../../src/views/ResourceCardView';
import SearchResults from '../../../src/views/SearchResults';
import { ResourceVm } from '../../../index';

import { render, fireEvent, toJSON, getAllByTestId } from '@testing-library/react-native';

const createMockResourceVm = (randomId: number): ResourceVm => {
    const vm: ResourceVm = {
        id: 'id_' + randomId,
        name: 'Test card',
        images: [
            'http://example.com/images/test_0-1x1.png',
            'http://example.com/images/test_0-2x3.png',
            'http://example.com/images/test_0-16x9.png',
        ],
        type: 'movie',
    };
    return vm;
};

describe('SearchResults', () => {
    const vms = [createMockResourceVm(1), createMockResourceVm(2), createMockResourceVm(3)];

    it('renders correctly with default styles', () => {
        const { container } = render(<SearchResults resources={vms} />);
        expect(toJSON(container)).toMatchSnapshot();
    });

    it('renders correctly with custom number of card to show', () => {
        const { container } = render(<SearchResults resources={vms} cardsPerRow={3} />);
        expect(toJSON(container)).toMatchSnapshot();
    });

    it('renders correctly and invokes onPress callback', () => {
        const pressHandler = jest.fn();
        const mockCardProps: ResourceCardViewBaseProps<ResourceVm> = {
            onResourcePress: pressHandler,
        };
        const { container } = render(<SearchResults resources={vms} cardProps={mockCardProps} />);
        const cardViews = getAllByTestId(container, 'cardView');

        // press first element
        fireEvent.press(cardViews[0]);
        expect(pressHandler).toHaveBeenCalled();

        // press last element
        fireEvent.press(cardViews.slice(-1)[0]);
        expect(pressHandler).toHaveBeenCalled();
    });

    it('avoid re-renders correctly', () => {
        const jsx = <SearchResults resources={vms} />;
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
        const mockCardProps: ResourceCardViewBaseProps<ResourceVm> = {
            onResourcePress: jest.fn(),
            cardStyle: cardStyle,
        };
        const jsx = <SearchResults resources={vms} cardProps={mockCardProps} />;
        const { container } = render(jsx);
        expect(toJSON(container)).toMatchSnapshot();
    });

    // describe('renders with the correct aspect ratio image', () => {
    //     it('renders correctly 1/1 aspect ratio', () => {
    //         const jsx = <ResourceCardView resource={vm} cardAspectRatio={1} />;
    //         const { container } = render(jsx);
    //         expect(toJSON(container)).toMatchSnapshot();
    //     });

    //     it('renders correctly 2/3 aspect ratio', () => {
    //         const jsx = <ResourceCardView resource={vm} cardAspectRatio={2 / 3} />;
    //         const { container } = render(jsx);
    //         expect(toJSON(container)).toMatchSnapshot();
    //     });

    //     it('renders correctly 16/9 aspect ratio', () => {
    //         const jsx = <ResourceCardView resource={vm} cardAspectRatio={16 / 9} />;
    //         const { container } = render(jsx);
    //         expect(toJSON(container)).toMatchSnapshot();
    //     });

    //     it('renders fallback image for an invalid aspect ratio', () => {
    //         const jsx = <ResourceCardView resource={vm} cardAspectRatio={8 / 4} />;
    //         const { container } = render(jsx);
    //         expect(toJSON(container)).toMatchSnapshot();
    //     });

    //     it('renders empty image when no valid image is passed', () => {
    //         vm.image = undefined;
    //         vm.images = undefined;
    //         vm.id = undefined;
    //         const jsx = <ResourceCardView resource={vm} cardAspectRatio={8 / 4} />;
    //         const { container } = render(jsx);
    //         expect(toJSON(container)).toMatchSnapshot();
    //     });
    // });
});
