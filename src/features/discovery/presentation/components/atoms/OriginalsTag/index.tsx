import React from 'react';
import { Image, Platform } from 'react-native';
import { styles } from './styles';

export default function OriginalsTag(props: { style?: any }) {
    return (
        <Image
            source={
                Platform.isTV
                    ? require('assets/images/aha_tv_originals.png')
                    : require('assets/images/aha-originals.png')
            }
            resizeMode={'stretch'}
            style={[styles.container, props.style]}
        />
    );
}
