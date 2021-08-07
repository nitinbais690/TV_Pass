import React from 'react';
import CollectionCardView from '../../../src/views/CollectionCardView';
import { ResourceVm } from '../../../index';

import { render, fireEvent, toJSON, getByTestId } from '@testing-library/react-native';

const createMockResourceVm = (): ResourceVm => {
    const vm: ResourceVm = {
        id: '1234',
        name: 'Test card',
        images: [
            'http://example.com/images/test_0-1x1.png',
            'http://example.com/images/test_0-2x3.png',
            'http://example.com/images/test_0-16x9.png',
        ],
        type: 'Collection',
    };
    return vm;
};

const vm = createMockResourceVm();

describe('CollectionCardView', () => {
    it('renders correctly with default styles', () => {
        const jsx = <CollectionCardView resource={vm} backgroundColors={['#C90619']} />;
        const { container } = render(jsx);
        expect(toJSON(container)).toMatchSnapshot();
    });

    it('renders correctly and invokes onPress callback', () => {
        const pressHandler = jest.fn();
        const { container } = render(
            <CollectionCardView resource={vm} onResourcePress={pressHandler} backgroundColors={['#C90619']} />,
        );
        const wrapper = getByTestId(container, 'collectionCardView');
        fireEvent.press(wrapper);
        expect(pressHandler).toHaveBeenCalled();
    });

    it('avoid re-renders correctly', () => {
        const jsx = <CollectionCardView resource={vm} backgroundColors={['#C90619']} />;
        const { container, rerender } = render(jsx);
        expect(toJSON(container)).toMatchSnapshot();
        rerender(jsx);
        expect(toJSON(container)).toMatchSnapshot();
    });
});
describe('renders with the correct aspect ratio image', () => {
    it('renders correctly 1/1 aspect ratio', () => {
        const jsx = <CollectionCardView resource={vm} cardAspectRatio={1} backgroundColors={['#C90619']} />;
        const { container } = render(jsx);
        expect(toJSON(container)).toMatchSnapshot();
    });

    it('renders correctly 2/3 aspect ratio', () => {
        const jsx = <CollectionCardView resource={vm} cardAspectRatio={2 / 3} backgroundColors={['#C90619']} />;
        const { container } = render(jsx);
        expect(toJSON(container)).toMatchSnapshot();
    });

    it('renders correctly 16/9 aspect ratio', () => {
        const jsx = <CollectionCardView resource={vm} cardAspectRatio={16 / 9} backgroundColors={['#C90619']} />;
        const { container } = render(jsx);
        expect(toJSON(container)).toMatchSnapshot();
    });

    it('renders fallback image for an invalid aspect ratio', () => {
        const jsx = <CollectionCardView resource={vm} cardAspectRatio={8 / 4} backgroundColors={['#C90619']} />;
        const { container } = render(jsx);
        expect(toJSON(container)).toMatchSnapshot();
    });

    it('renders empty image when no valid image is passed', () => {
        vm.image = '';
        vm.images = [];
        vm.id = '';
        const jsx = <CollectionCardView resource={vm} cardAspectRatio={8 / 4} backgroundColors={['#C90619']} />;
        const { container } = render(jsx);
        expect(toJSON(container)).toMatchSnapshot();
    });
});
