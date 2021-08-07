import React from 'react';
import { render, toJSON } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import DetailsDescription from 'features/details/presentation/components/atoms/DetailsDescription';

jest.mock('core/presentation/hooks/use-app-colors');

describe('detailsDescription', () => {
    const shortText: string =
        'The story follows a war of succession among competing claimants for control of the Iron Throne of the Seven Kingdoms.';
    const longText: string =
        "North of the Seven Kingdoms of Westeros, Night's Watch soldiers are attacked by supernatural White Walkers. One soldier escapes but is captured at Castle Winterfell. Eddard \"Ned\" Stark, Warden of the North, executes him for desertion. Later, six orphaned dire wolf pups are found and one given to each Stark sibling, including Ned's bastard son, Jon Snow. In King's Landing, the Seven Kingdoms capital, Jon Arryn, the Hand of the King, dies suddenly.";

    test('render with long description and default style', () => {
        const { container } = render(<DetailsDescription longDescription={longText} shortDescription={''} />);

        expect(container).toBeDefined();
        expect(toJSON(container)).toMatchSnapshot();
    });

    test('render with short description and default style', () => {
        const { container } = render(<DetailsDescription longDescription={''} shortDescription={shortText} />);

        expect(container).toBeDefined();
        expect(toJSON(container)).toMatchSnapshot();
    });

    test('render with both description and default style', () => {
        const { container, queryByText } = render(
            <DetailsDescription longDescription={longText} shortDescription={shortText} />,
        );

        expect(container).toBeDefined();
        expect(queryByText(longText)).toBeDefined();
        expect(queryByText(shortText)).toBeNull();
        expect(toJSON(container)).toMatchSnapshot();
    });

    test('render with custom style', () => {
        const styles = StyleSheet.create({
            container: {
                padding: 16,
            },
        });

        const { container } = render(
            <DetailsDescription longDescription={longText} shortDescription={''} style={styles.container} />,
        );

        expect(container).toBeDefined();
        expect(toJSON(container)).toMatchSnapshot();
    });

    test('render always longOnly', () => {
        const { container } = render(
            <DetailsDescription longDescription={longText} shortDescription={''} showLongOnly={true} />,
        );

        expect(container).toBeDefined();
        expect(toJSON(container)).toMatchSnapshot();
    });
});
