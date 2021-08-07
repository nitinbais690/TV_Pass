import React from 'react';
import { render, toJSON } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import DetailsTitleAndCaption from 'features/details/presentation/components/molecules/TitleAndCaption';

jest.mock('core/presentation/hooks/use-app-colors');

describe('detailsTitleAndCaption', () => {
    const seriesTitle: string = 'Game of Thrones';
    const title: string = 'Season 1: Winter Is Coming';
    const caption: string = '2011 . 50 Minutes . Drama';
    const advisory: string = 'violence';

    test('render with default style', () => {
        const { container } = render(
            <DetailsTitleAndCaption seriesTitle={seriesTitle} title={title} caption={caption} advisory={advisory} />,
        );

        expect(container).toBeDefined();
        expect(toJSON(container)).toMatchSnapshot();
    });

    test('render with custom style ', () => {
        const styles = StyleSheet.create({
            container: {
                padding: 16,
            },
        });

        const { container } = render(
            <DetailsTitleAndCaption
                seriesTitle={seriesTitle}
                title={title}
                caption={caption}
                advisory={advisory}
                style={styles.container}
            />,
        );

        expect(container).toBeDefined();
        expect(toJSON(container)).toMatchSnapshot();
    });

    test('render without series title', () => {
        const { container } = render(
            <DetailsTitleAndCaption seriesTitle={''} title={title} caption={caption} advisory={advisory} />,
        );

        expect(container).toBeDefined();
        expect(toJSON(container)).toMatchSnapshot();
    });
});
