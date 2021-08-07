import React from 'react';
import { render, toJSON } from '@testing-library/react-native';
import DetailsThumbnailAndCaption from 'features/details/presentation/components/molecules/DetailsThumbnailAndCaption';

jest.mock('core/presentation/hooks/use-app-colors');

describe('detailsThumbnailAndCaption', () => {
    const props = {
        image: 'assets/images/video_placeholder.png',
        resourceId: '01234',
        imageUrl: 'assets/images/got.png',
        seriesTitle: 'Game of Thrones',
        name: 'Season 1: Winter Is Coming',
        caption1String: '2011 . 50 Minutes . Drama',
        advisory: 'violence',
    };

    test('renders correctly', () => {
        const { container } = render(
            <DetailsThumbnailAndCaption
                resourceId={props.resourceId}
                image={props.image}
                imageUrl={props.imageUrl}
                advisory={props.advisory}
                seriesTitle={props.seriesTitle}
                name={props.name}
                caption1String={props.caption1String}
            />,
        );
        expect(toJSON(container)).toMatchSnapshot();
    });
});
