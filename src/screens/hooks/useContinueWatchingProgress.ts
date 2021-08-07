import { useEffect, useState, useRef } from 'react';
import { Animated, InteractionManager } from 'react-native';

export const useContinueWatchingProgress = (bookmarkOffset?: number, runningTime?: number) => {
    const [showProgress, setShowProgress] = useState(false);
    const watched = useRef(new Animated.Value(0)).current;
    const percentCompleted = watched.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    useEffect(() => {
        if (!runningTime || !bookmarkOffset) {
            setShowProgress(false);
            return;
        }

        if (runningTime > 0 && bookmarkOffset > 0) {
            const percent = (bookmarkOffset / (runningTime * 1000)) * 100;
            setShowProgress(true);
            InteractionManager.runAfterInteractions(() => {
                Animated.timing(watched, {
                    toValue: percent,
                    duration: 300,
                    useNativeDriver: false,
                }).start();
            });
        }
    }, [bookmarkOffset, runningTime, watched]);

    return [showProgress, percentCompleted];
};
