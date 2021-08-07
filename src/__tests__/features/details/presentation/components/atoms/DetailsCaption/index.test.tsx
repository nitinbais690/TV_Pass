import React from 'react';
import { render, toJSON } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import DetailsCaption from 'features/details/presentation/components/atoms/DetailsCaption';

jest.mock('core/presentation/hooks/use-app-colors');

describe('detailsCaption', () => {
    const text: string = 'Inception';

    test('render with default style', () => {
        const { container, queryByText } = render(<DetailsCaption name={text} />);
        expect(queryByText(text)).toBeDefined();
        expect(toJSON(container)).toMatchSnapshot();
    });

    test('render with custom style', () => {
        const styles = StyleSheet.create({
            upperCase: {
                textTransform: 'uppercase',
            },
        });

        const { container, queryByText } = render(<DetailsCaption name={text} style={styles.upperCase} />);
        expect(queryByText(text)).toBeDefined();
        expect(toJSON(container)).toMatchSnapshot();
    });

    test('render with empty text', () => {
        const { container } = render(<DetailsCaption name={''} />);
        expect(container).toBeDefined();
        expect(toJSON(container)).toMatchSnapshot();
    });
});
