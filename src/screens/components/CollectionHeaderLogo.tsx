import React from 'react';
import { StyleSheet } from 'react-native';
import { ResizableImage } from 'qp-discovery-ui';
import { AspectRatio, ImageType, AspectRatioUtil } from 'qp-common-ui';

const style = StyleSheet.create({
    logo: { flex: 1, aspectRatio: 16 / 9, marginVertical: 8 },
});

const imageType = ImageType.LogoHeader;
const aspectRatio = AspectRatio._16by9;

export const imageAspectRatio = `${imageType}-${AspectRatioUtil.asString(aspectRatio)}`;

const CollectionHeaderLogo = ({ id }: { id?: string }) => {
    if (!id) {
        return null;
    }

    return <ResizableImage keyId={id} style={style.logo} imageType={imageType} aspectRatioKey={aspectRatio} />;
};

export default React.memo(CollectionHeaderLogo, (prev, next) => prev.id === next.id);
