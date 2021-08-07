import React from 'react';
import { render, toJSON } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import DetailsTitle from 'features/details/presentation/components/atoms/DetailsTitle';

jest.mock('core/presentation/hooks/use-app-colors');

describe('detailsTitle', () => {
    const title: string = 'Inception';

    test('render with default style', () => {
        const { container, queryByText } = render(<DetailsTitle name={title} />);
        expect(queryByText(title)).toBeDefined();
        expect(toJSON(container)).toMatchSnapshot();
    });

    test('render with custom style', () => {
        const styles = StyleSheet.create({
            lowerCase: {
                textTransform: 'lowercase',
            },
        });

        const { container, queryByText } = render(<DetailsTitle name={title} style={styles.lowerCase} />);
        expect(queryByText(title)).toBeDefined();
        expect(toJSON(container)).toMatchSnapshot();
    });

    test('render with empty text', () => {
        const { container } = render(<DetailsTitle name={''} />);
        expect(container).toBeDefined();
        expect(toJSON(container)).toMatchSnapshot();
    });
});
