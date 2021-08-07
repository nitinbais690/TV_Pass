import React from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import MarketingText from '../../atoms/MarketingText';
import { marketingContentStyle } from './styles';

export default function MarketingContentView(props: MarketingContentprops) {
    return (
        <View>
            <FastImage style={marketingContentStyle.marketingImage} source={{ uri: props.imageUrl }} />
            <MarketingText title={props.title} description={props.description} />
        </View>
    );
}

interface MarketingContentprops {
    title: string;
    description: string;
    imageUrl: string;
}
