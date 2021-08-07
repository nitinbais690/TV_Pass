import React from 'react';
import { render, toJSON } from '@testing-library/react-native';
import SecondaryButton from 'core/presentation/components/atoms/SecondaryButton';

jest.mock('core/presentation/hooks/use-app-colors');

describe('secondaryButton', () => {
    test('renders correctly', () => {
        const { container } = render(<SecondaryButton />);
        expect(toJSON(container)).toMatchSnapshot();
    });
});
