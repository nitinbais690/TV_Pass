import React from 'react';
import { render, toJSON } from '@testing-library/react-native';
import SettingsItemRow from 'features/settings/presentation/components/atoms/SettingsItemRow';
import Account from 'assets/images/account_outline.svg';

jest.mock('core/presentation/hooks/use-app-colors');

describe('settingsItemRow', () => {
    const title = 'User profiles';
    const subtitle = 'Manage your profiles';
    const image = <Account />;

    it('renders correctly', () => {
        const { container, getByText } = render(<SettingsItemRow title={title} subtitle={subtitle} image={image} />);
        expect(getByText(title)).toBeDefined();
        expect(getByText(subtitle)).toBeDefined();
        expect(toJSON(container)).toMatchSnapshot();
    });
});
