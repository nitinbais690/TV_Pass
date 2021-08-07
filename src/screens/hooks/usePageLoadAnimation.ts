import { useEffect, useRef } from 'react';
import { Animated, InteractionManager, Easing } from 'react-native';

export const usePageLoadAnimation = (
    startAnimation: boolean = true,
    runAfterInteractions: boolean = true,
    onFinished?: () => void,
) => {
    let animatedValue = useRef<Animated.Value>(new Animated.Value(0));
    const animatedStyle = {
        transform: [
            {
                translateY: animatedValue.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [200, 1],
                }),
            },
        ],
        opacity: animatedValue.current.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        }),
    };

    useEffect(() => {
        if (!startAnimation) {
            return;
        }

        const runAnimations = () => {
            Animated.timing(animatedValue.current, {
                delay: 0,
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }).start(() => {
                animatedValue.current = new Animated.Value(0);
                onFinished && onFinished();
            });
        };

        if (runAfterInteractions) {
            InteractionManager.runAfterInteractions(() => runAnimations());
        } else {
            runAnimations();
        }
    }, [onFinished, runAfterInteractions, startAnimation]);

    return animatedStyle;
};
