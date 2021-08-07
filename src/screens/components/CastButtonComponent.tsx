import React from 'react';
import { ViewProps, View, Platform } from 'react-native';

const CastButtonComponent = (props: React.PropsWithChildren<ViewProps>): JSX.Element => {
    if (!Platform.isTV) {
        // const { CastButton } = require('react-native-google-cast');
        // return <CastButton style={props.style} />;
        return <View style={props.style} />;
    } else {
        return <View />;
    }
};

export default CastButtonComponent;
