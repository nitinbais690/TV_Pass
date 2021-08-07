import React from 'react';
import { render, toJSON } from '@testing-library/react-native';
import MenuHeaderView from 'features/menu/presentation/components/molecules/MenuHeaderView';

jest.mock('core/presentation/hooks/use-app-colors');

describe('Menu header view test', () => {
    it('Menu header view render correctly', () => {
        const pressHandler = jest.fn();
        const { container } = render(<MenuHeaderView closeBtnAction={pressHandler} />);
        expect(toJSON(container)).toMatchSnapshot();
    });
});
