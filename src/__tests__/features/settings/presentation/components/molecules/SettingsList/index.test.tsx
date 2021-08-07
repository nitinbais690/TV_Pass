import React from 'react';
import { render, toJSON } from '@testing-library/react-native';
import SettingsList from 'features/settings/presentation/components/molecules/SettingsList';

jest.mock('core/presentation/hooks/use-app-colors');

describe('settingsList', () => {
    it('renders correctly', () => {
        const pressHandler = jest.fn();
        const { container } = render(<SettingsList onPress={pressHandler} />);
        expect(toJSON(container)).toMatchSnapshot();
    });
});
