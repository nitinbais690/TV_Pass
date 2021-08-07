import React from 'react';
import { render, toJSON } from '@testing-library/react-native';
import DetailsThumbnail from 'features/details/presentation/components/atoms/DetailsThumbnail';

jest.mock('core/presentation/hooks/use-app-colors');

describe('detailsThumbnail', () => {
    const props = {
        mainResourceImage: 'assets/images/video_placeholder.png',
        id: '01234',
        imageUrl: 'assets/images/got.png',
    };

    test('renders correctly', () => {
        const { container } = render(
            <DetailsThumbnail mainResourceImage={props.mainResourceImage} id={props.id} imageUrl={props.imageUrl} />,
        );
        expect(toJSON(container)).toMatchSnapshot();
    });
});
