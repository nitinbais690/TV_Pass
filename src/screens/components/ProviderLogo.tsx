import React from 'react';
import { StyleSheet } from 'react-native';
import { ResizableImage } from 'qp-discovery-ui';
import { AspectRatio, ImageType } from 'qp-common-ui';

const style = StyleSheet.create({
    logo: { flex: 1, aspectRatio: 16 / 9, marginVertical: 12 },
});

const ProviderLogo = ({ provider }: { provider?: string }) => {
    if (!provider) {
        return null;
    }

    return (
        <ResizableImage
            keyId={provider.toLowerCase()}
            style={style.logo}
            imageType={ImageType.Logo}
            aspectRatioKey={AspectRatio._16by9}
        />
    );
};

export default React.memo(ProviderLogo, (prev, next) => prev.provider === next.provider);
