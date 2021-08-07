import React from 'react';
import { View, Text } from 'react-native';
import { ImageandTextContainerStyle } from './style';
import { appFontStyle } from 'core/styles/AppStyles';
import FastImage from 'react-native-fast-image';

export default function ImageAndTextContainer(props: ImageAndTextContainer) {
    const styles = ImageandTextContainerStyle();
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <FastImage
                    source={require('assets/images/empty_state_image.png')}
                    style={styles.image}
                    resizeMode={'cover'}
                />
            </View>
            <View style={[styles.textContainer, props.messageStyle]}>
                <Text style={[appFontStyle.mediumText1, styles.msg]}>{props.text}</Text>
            </View>
        </View>
    );
}

export interface ImageAndTextContainer {
    imagePath: string;
    text: string;
    messageStyle: MessageStyle;
}

export interface MessageStyle {
    paddingRight: number;
    paddingLeft: number;
}
