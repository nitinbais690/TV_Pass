import React from 'react';
import { CarouselView } from '../../../src/views/CarouselView';
import { createMockResourceVm } from './ResourceCarouselView.test';
import { render, toJSON } from '@testing-library/react-native';

describe('CarouselView.test', () => {
    it('renders correctly with default styles', () => {
        const vms = [createMockResourceVm(0), createMockResourceVm(1), createMockResourceVm(2)];
        const pressHandler = jest.fn();
        const { container } = render(
            <CarouselView
                renderItem={pressHandler}
                autoplay={true}
                autoplayInterval={2000}
                onIndexChange={pressHandler}
                data={vms}
                onViewableItemsChanged={pressHandler}
            />,
        );
        expect(toJSON(container)).toMatchSnapshot();
    });
});
