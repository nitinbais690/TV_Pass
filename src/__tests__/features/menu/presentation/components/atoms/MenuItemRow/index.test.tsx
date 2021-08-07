import { MenuItemRow } from 'features/menu/presentation/components/atoms/MenuItemRow';
import Help from 'assets/images/menu_help.svg';
import React from 'react';
import { render, toJSON } from '@testing-library/react-native';

jest.mock('core/presentation/hooks/use-app-colors');

describe('Menu Item row test', () => {
    it('Menu item render correctly', () => {
        const pressHandler = jest.fn();
        const { container } = render(<MenuItemRow title={'Privacy'} image={<Help />} onPress={pressHandler} />);
        expect(toJSON(container)).toMatchSnapshot();
    });

    it('Menu item render correctly if is not given', () => {
        const pressHandler = jest.fn();
        const { container } = render(<MenuItemRow title={'Privacy'} image={undefined} onPress={pressHandler} />);
        expect(toJSON(container)).toMatchSnapshot();
    });
});
