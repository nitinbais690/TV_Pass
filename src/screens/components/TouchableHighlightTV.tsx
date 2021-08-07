import React from 'react';
import { Platform, TouchableHighlight } from 'react-native';
let TouchableHighlightTV = TouchableHighlight;

if (Platform.OS === 'android' && Platform.isTV) {
    const TouchableHighlightAndroidTV = props => {
        /** Make sure presses on AndroidTV are sent only once */
        const onPressFilter = e => {
            const { onPress } = props;
            const { eventKeyAction } = e;
            if (onPress && eventKeyAction === 1 /*up trigger*/) {
                onPress(e);
            }
        };
        return <TouchableHighlight {...props} onPress={onPressFilter} clickable={false} />;
    };
    TouchableHighlightTV = TouchableHighlightAndroidTV;
}

export default TouchableHighlightTV;
