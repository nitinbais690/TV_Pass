import React from 'react';
import { ViewProps, View, Platform } from 'react-native';

function BlurComponent(props: React.PropsWithChildren<ViewProps>) {
    if (Platform.OS === 'android' || Platform.isTV) {
        return <View style={[props.style, { backgroundColor: '#100c0c', opacity: 0.9 }]}>{props.children}</View>;
    } else {
        const { BlurView } = require('@react-native-community/blur');
        return <BlurView style={[props.style, { overflow: 'hidden' }]}>{props.children}</BlurView>;
    }
}

export default BlurComponent;
