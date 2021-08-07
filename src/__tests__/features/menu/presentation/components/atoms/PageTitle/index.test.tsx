import PageTitle from 'features/menu/presentation/components/atoms/PageTitle';
import React from 'react';
import { render, toJSON } from '@testing-library/react-native';

jest.mock('core/presentation/hooks/use-app-colors');

describe('Page Title.test', () => {
    it('Page title rendered correctly with style', () => {
        const { container } = render(<PageTitle title={'Menu'} />);
        expect(toJSON(container)).toMatchSnapshot();
    });
});
