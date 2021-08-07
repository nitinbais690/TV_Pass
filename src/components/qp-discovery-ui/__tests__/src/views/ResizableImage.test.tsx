import React from 'react';
import ResizableImage from '../../../src/views/ResizableImage';
import { ConfigProvider } from '../../../src/context/ConfigProvider';

import { render, toJSON, fireEvent, NativeTestEvent } from '@testing-library/react-native';
import { AspectRatio, ImageType } from 'qp-common-ui';

jest.mock('react-native-fast-image', () => {
    return require('react-native').Image;
});

describe('ResizableImage', () => {
    const imageType = ImageType.Poster;
    const aspectRatioKey = AspectRatio._1by1;
    it('renders correctly', () => {
        const { getByTestId } = render(
            <ResizableImage testID={'image'} keyId="01234" imageType={imageType} aspectRatioKey={aspectRatioKey} />,
        );
        expect(getByTestId('image')).not.toBeNull();
    });

    it('renders nothing when an invalid uri is passed', () => {
        const { queryByTestId } = render(
            <ResizableImage testID={'image'} keyId={''} imageType={imageType} aspectRatioKey={aspectRatioKey} />,
        );
        expect(queryByTestId('image')).toBeNull();
    });

    it('renders correctly when no dimensions are passed in', () => {
        const config = {
            imageResizeURL: 'https://image-resizer-service.apisbox.devops.quickplay.com',
            // imageResizerPath: 'image',
        };

        const { getByTestId } = render(
            <ConfigProvider config={config} serviceConfig={{}}>
                <ResizableImage testID={'image'} keyId="012345" imageType={imageType} aspectRatioKey={aspectRatioKey} />
            </ConfigProvider>,
        );

        const image = getByTestId('image');
        fireEvent(
            image,
            new NativeTestEvent('layout', {
                nativeEvent: {
                    layout: {
                        width: 200,
                        height: 300,
                    },
                },
            }),
        );

        expect(image.props.source.uri).toBe(
            'https://image-resizer-service.apisbox.devops.quickplay.com/image/012345/0-1x1.jpg?width=400',
        );
    });

    it('avoid re-renders correctly', () => {
        const jsx = (
            <ResizableImage testID={'image'} keyId="01234" imageType={imageType} aspectRatioKey={aspectRatioKey} />
        );
        const { getByTestId, rerender } = render(jsx);
        expect(getByTestId('image')).not.toBeNull();
        rerender(jsx);
        expect(getByTestId('image')).not.toBeNull();
    });

    it('avoid renders overridden style correctly', () => {
        const style = { backgroundColor: 'red' };
        const { container } = render(
            <ResizableImage
                testID={'image'}
                keyId="01234"
                imageType={imageType}
                aspectRatioKey={aspectRatioKey}
                style={style}
            />,
        );
        expect(toJSON(container)).toMatchSnapshot();
    });

    it('renders correctly when dimensions are passed in', () => {
        const { container } = render(
            <ResizableImage
                testID={'image'}
                keyId="sdsd"
                width={300}
                height={300}
                imageType={imageType}
                aspectRatioKey={aspectRatioKey}
            />,
        );
        expect(toJSON(container)).toMatchSnapshot();
    });
});
