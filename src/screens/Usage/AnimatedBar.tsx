import React, { useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export interface AnimateBarProps {
    value: number;
    delay: number;
    creditSum: number;
}

const AnimatedBar = (props: AnimateBarProps): JSX.Element => {
    const width = new Animated.Value(0);

    const styles = StyleSheet.create({
        barStyles: {
            margin: 2,
            height: 4,
        },
    });

    const animateTo = (delay: number, value: number) => {
        Animated.sequence([
            Animated.delay(delay),
            Animated.timing(width, {
                toValue: value,
                useNativeDriver: false,
            }),
        ]).start();
    };
    useEffect(() => {
        const animateValue = (props.value / props.creditSum) * 100;
        animateTo(props.delay, animateValue);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.delay, props.value]);

    return (
        <>
            <LinearGradient
                locations={[0, 1]}
                colors={['rgba(104, 110, 255, 0)', 'rgba(104, 110, 255, 1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.barStyles}>
                <Animated.View style={[styles.barStyles, { width: width }]} />
            </LinearGradient>
        </>
    );
};

export default AnimatedBar;
