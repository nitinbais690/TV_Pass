import React from 'react';
import { render, toJSON } from '@testing-library/react-native';
import PrimaryButton from 'core/presentation/components/atoms/PrimaryButton';

jest.mock('core/presentation/hooks/use-app-colors');

describe('primaryButton', () => {
    test('renders correctly', () => {
        const { container } = render(<PrimaryButton />);
        expect(toJSON(container)).toMatchSnapshot();
    });

    test('render with icon', () => {
        const { container } = render(<PrimaryButton primaryButtonIcon={'Icon'} />);
        expect(toJSON(container)).toMatchSnapshot();
    });
});
