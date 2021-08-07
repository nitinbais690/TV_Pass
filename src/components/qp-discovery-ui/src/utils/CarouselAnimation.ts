import { getInputRangeFromIndexes } from 'react-native-snap-carousel';
import { StyleSheet } from 'react-native';
function scrollInterpolatorNormalScrollEffect(index: any, carouselProps: any) {
    const range = [3, 2, 1, 0, -1];
    const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
    const outputRange = range;

    return { inputRange, outputRange };
}

function animatedStylesNormalScrollEffect(index: any, animatedValue: any, carouselProps: any) {
    const sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth;
    const translateProp = carouselProps.vertical ? 'translateY' : 'translateX';

    return {
        zIndex: carouselProps.data.length - index,
        opacity: animatedValue.interpolate({
            inputRange: [2, 3],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        }),
        transform: [
            {
                rotate: animatedValue.interpolate({
                    inputRange: [-1, 0, 1, 2, 3],
                    outputRange: ['-25deg', '0deg', '-3deg', '1.8deg', '0deg'],
                    extrapolate: 'clamp',
                }),
            },
            {
                [translateProp]: animatedValue.interpolate({
                    inputRange: [-1, 0, 1, 2, 3],
                    outputRange: [
                        -sizeRef * 0.5,
                        0,
                        -sizeRef, // centered
                        -sizeRef * 2, // centered
                        -sizeRef * 3, // centered
                    ],
                    extrapolate: 'clamp',
                }),
            },
        ],
    };
}

// Perspective effect
function scrollInterpolatorPerspectiveEffect(index: any, carouselProps: any) {
    const range = [1, 0, -1];
    const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
    const outputRange = range;

    return { inputRange, outputRange };
}
function animatedStylesPerspectiveEffect(index: any, animatedValue: any, carouselProps: any) {
    //const sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth;
    //const translateProp = carouselProps.vertical ? 'translateY' : 'translateX';

    return {
        zIndex: carouselProps.data.length - index,
        opacity: animatedValue.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [0.75, 1, 0.75],
        }),
        transform: [
            {
                rotate: animatedValue.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: ['-4deg', '0deg', '4deg'],
                    extrapolate: 'clamp',
                }),
            },
            {
                scale: animatedValue.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [0.8, 0.8, 0.8],
                }),
            },
            {
                translateY: animatedValue.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [-50, -150, -50],
                }),
            },
            {
                translateX: animatedValue.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [30, 0, -30],
                }),
            },
        ],
    };
}

// Left/right translate effect
function scrollInterpolatorTranslateEffect(index: any, carouselProps: any) {
    const range = [2, 1, 0, -1];
    const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
    const outputRange = range;

    return { inputRange, outputRange };
}
function animatedStylesTranslateEffect(index: any, animatedValue: any, carouselProps: any) {
    const sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth;
    const translateProp = carouselProps.vertical ? 'translateY' : 'translateX';

    return {
        zIndex: carouselProps.data.length - index,
        opacity: animatedValue.interpolate({
            inputRange: [-1, 0, 1, 2],
            outputRange: [1, 1, 0.75, 0.5],
            extrapolate: 'clamp',
        }),
        transform: [
            {
                [translateProp]: animatedValue.interpolate({
                    inputRange: [-1, 0, 1, 2],
                    outputRange: [0, 0, -sizeRef * 2, -sizeRef],
                    extrapolate: 'clamp',
                }),
            },
        ],
    };
}

const defaultCarouselStyle = StyleSheet.create({
    containerStyle: {
        marginLeft: 2,
        marginRight: 5,
        overflow: 'visible',
    },
    containerCustomStyle: {
        paddingVertical: 0,
    },
    sliderStyle: {
        marginTop: 80,
    },
    activePaginationDotStyle: {
        width: 8,
        height: 8,
        borderRadius: 20,
        backgroundColor: 'linear-gradient(139.8deg, rgba(255, 255, 255, 0.4) 10.38%, rgba(255, 255, 255, 0) 137.67%)',
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        margin: -2,
    },
    inactivePaginationDotStyle: {
        width: 8,
        height: 8,
        borderRadius: 20,
        backgroundColor: 'linear-gradient(139.8deg, rgba(255, 255, 255, 0.2) 10.38%, rgba(255, 255, 255, 0) 137.67%)',
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    containerPaginationStyle: {
        marginTop: -170,
        backgroundColor: 'transparent',
    },
    containerPaginationStyleNormalEffet: {
        backgroundColor: 'transparent',
        marginBottom: -30,
    },
});

// Exports
export const scrollInterpolators = {
    scrollInterpolatorNormalScrollEffect,
    scrollInterpolatorPerspectiveEffect,
    scrollInterpolatorTranslateEffect,
};

export const animatedStyles = {
    animatedStylesNormalScrollEffect,
    animatedStylesPerspectiveEffect,
    animatedStylesTranslateEffect,
};

export const carouselStyle = defaultCarouselStyle;
