import React from 'react';
import { render, toJSON } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import LabeledText from 'features/settings/presentation/components/atoms/LabeledText';

jest.mock('core/presentation/hooks/use-app-colors');

describe('labeledText', () => {
    const label = 'Email';
    const text = 'kunal@mailinator.com';

    it('renders correctly', () => {
        const { container, getByText } = render(<LabeledText label={label} text={text} />);
        expect(getByText(label)).toBeDefined();
        expect(getByText(text)).toBeDefined();
        expect(toJSON(container)).toMatchSnapshot();
    });

    it('render with style', () => {
        const style = StyleSheet.create({
            label: {
                paddingTop: 15,
            },
        });

        const { container, getByText } = render(<LabeledText label={label} text={text} style={style.label} />);
        expect(getByText(label)).toBeDefined();
        expect(getByText(text)).toBeDefined();
        expect(toJSON(container)).toMatchSnapshot();
    });
});
