import React from 'react';
import { render, toJSON } from '@testing-library/react-native';
import { MenuFooterView } from 'features/menu/presentation/components/molecules/MenuFooterView';

jest.mock('core/presentation/hooks/use-app-colors');
jest.mock('contexts/AuthContextProvider');

describe('Menu Footer view test', () => {
    it('Menu Footer view render correctly', () => {
        const { container } = render(<MenuFooterView />);
        expect(toJSON(container)).toMatchSnapshot();
    });
});
