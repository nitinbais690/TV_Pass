import React from 'react';
import { render, toJSON } from '@testing-library/react-native';
import FlexButtons from 'core/presentation/components/atoms/FlexButtons';
import { StyleSheet } from 'react-native';

jest.mock('core/presentation/hooks/use-app-colors');

describe('flexButtons', () => {
    const primaryText: string = 'Watch';
    const secondaryText: string = 'Play Trailer';
    const primaryCallback = jest.fn();
    const secondaryCallback = jest.fn();

    test('renders correctly', () => {
        const { container } = render(
            <FlexButtons
                primryButtonText={primaryText}
                secondaryButtonText={secondaryText}
                onPressPrimary={primaryCallback}
                onPressSecondary={secondaryCallback}
            />,
        );
        expect(toJSON(container)).toMatchSnapshot();
    });

    test('render with custom style', () => {
        const styles = StyleSheet.create({
            container: {
                padding: 16,
            },
        });

        const { container } = render(
            <FlexButtons
                primryButtonText={primaryText}
                secondaryButtonText={secondaryText}
                onPressPrimary={primaryCallback}
                onPressSecondary={secondaryCallback}
                containerStyle={styles.container}
            />,
        );
        expect(toJSON(container)).toMatchSnapshot();
    });

    test('render with primary icon', () => {
        const { container } = render(
            <FlexButtons
                primryButtonText={primaryText}
                secondaryButtonText={secondaryText}
                onPressPrimary={primaryCallback}
                onPressSecondary={secondaryCallback}
                primaryButtonIcon={'Icon'}
            />,
        );
        expect(toJSON(container)).toMatchSnapshot();
    });
});
