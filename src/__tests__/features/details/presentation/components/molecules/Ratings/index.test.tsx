import React from 'react';
import { render, toJSON } from '@testing-library/react-native';
import Ratings from 'features/details/presentation/components/molecules/Ratings';

jest.mock('core/presentation/hooks/use-app-colors');

describe('ratings', () => {
    const ratings: string[] = ['Premium', '18+', 'U/A'];

    test('renders correctly', () => {
        const { container } = render(<Ratings ratings={ratings} />);
        expect(toJSON(container)).toMatchSnapshot();
    });

    test('render empty list', () => {
        const { container } = render(<Ratings ratings={[]} />);
        expect(toJSON(container)).toMatchSnapshot();
    });
});
