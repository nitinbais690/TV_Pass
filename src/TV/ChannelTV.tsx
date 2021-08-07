import React, { useCallback, useRef } from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Menu from '../TV/components/Menu';

const ChannelScreen = () => {
    const touchableFeedbacktRef = useRef(null);

    const onRef = useCallback(ref => {
        if (ref) {
            touchableFeedbacktRef.current = ref;
        }
    }, []);

    return (
        <TouchableWithoutFeedback ref={onRef}>
            <View style={styles.container}>
                <Text>Channel</Text>
                <Menu />
            </View>
        </TouchableWithoutFeedback>
    );
};

export default ChannelScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
