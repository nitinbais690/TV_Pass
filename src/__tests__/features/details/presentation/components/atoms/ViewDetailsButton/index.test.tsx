import React from 'react';
import { render, toJSON } from '@testing-library/react-native';
import ViewDetailsButton from 'features/details/presentation/components/atoms/ViewDetailButton';
import useAppColors from 'core/presentation/hooks/use-app-colors';

jest.mock('core/presentation/hooks/use-app-colors');

describe('viewDetailsButton', () => {
    test('renders correctly', () => {
        const actionCallback = jest.fn();
        const { container } = render(
            <ViewDetailsButton appColors={useAppColors()} openDetailContent={actionCallback} />,
        );
        expect(toJSON(container)).toMatchSnapshot();
    });
});
