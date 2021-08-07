import React from 'React';
import { render, toJSON } from '@testing-library/react-native';
import Rating from 'features/details/presentation/components/atoms/Rating';

jest.mock('core/presentation/hooks/use-app-colors');

describe('rating', () => {
    test('renders correctly', () => {
        const { container } = render(<Rating rating={'Violence'} icon={'assets/images/vln.png'} />);
        expect(toJSON(container)).toMatchSnapshot();
    });

    test('render without icon', () => {
        const { container } = render(<Rating rating={'Violence'} />);
        expect(toJSON(container)).toMatchSnapshot();
    });

    test('render with empty text', () => {
        const { container } = render(<Rating rating={''} />);
        expect(toJSON(container)).toMatchSnapshot();
    });
});
