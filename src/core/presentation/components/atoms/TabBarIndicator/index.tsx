import React, { useEffect, useRef } from 'react';
import { Animated, Easing, I18nManager } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Route } from 'react-native-tab-view';
import { GetTabWidth, Props } from 'react-native-tab-view/lib/typescript/src/TabBarIndicator';
import { styles, INDICATOR_GRADIENT } from './styles';

export default function TabBarIndicator<T extends Route>(props: Props<T>) {
    const { position, navigationState, getTabWidth, width, layout } = props;
    const { routes } = navigationState;
    let isIndicatorShown = useRef(false);
    let opacity = new Animated.Value(props.width === 'auto' ? 0 : 1);
    const transform = [];

    useEffect(() => {
        isIndicatorShown.current = fadeInIndicator(props, isIndicatorShown.current, opacity);
    }, [props, isIndicatorShown, opacity]);

    if (layout.width) {
        const translateX = routes.length > 1 ? getTranslateX(position, routes, getTabWidth) : 0;

        transform.push({ translateX });
    }

    if (width === 'auto') {
        const inputRange = routes.map((_, i) => i);
        const outputRange = inputRange.map(getTabWidth);

        transform.push(
            {
                scaleX:
                    routes.length > 1
                        ? position.interpolate({
                              inputRange,
                              outputRange,
                              extrapolate: 'clamp',
                          })
                        : outputRange[0],
            },
            { translateX: 0.5 },
        );
    }

    // If layout is not available, use `left` property for positioning the indicator
    // This avoids rendering delay until we are able to calculate translateX
    const left = layout.width ? 0 : `${(100 / routes.length) * navigationState.index}%`;
    const indicatorWidth = props.width === 'auto' ? 1 : props.width;
    const indicatorStyle = styles(indicatorWidth, left);
    return (
        <Animated.View style={[indicatorStyle.tabIndicatorStyle, { transform }]}>
            <LinearGradient locations={[0, 1]} colors={INDICATOR_GRADIENT} style={indicatorStyle.gradientStyle} />
        </Animated.View>
    );
}

function getTranslateX(position: Animated.AnimatedInterpolation, routes: Route[], getTabWidth: GetTabWidth) {
    const inputRange = routes.map((_, i) => i);

    // every index contains widths at all previous indices
    const outputRange = routes.reduce<number[]>((acc, _, i) => {
        if (i === 0) {
            return [0];
        }
        return [...acc, acc[i - 1] + getTabWidth(i - 1)];
    }, []);

    const translateX = position.interpolate({
        inputRange,
        outputRange,
        extrapolate: 'clamp',
    });

    return Animated.multiply(translateX, I18nManager.isRTL ? -1 : 1);
}

function fadeInIndicator<T extends Route>(
    props: Props<T>,
    isIndicatorShown: boolean,
    opacity: Animated.Value,
): boolean {
    const { navigationState, layout, width, getTabWidth } = props;

    if (
        !isIndicatorShown &&
        width === 'auto' &&
        layout.width &&
        // We should fade-in the indicator when we have widths for all the tab items
        navigationState.routes.every((_, i) => getTabWidth(i))
    ) {
        isIndicatorShown = true;

        Animated.timing(opacity, {
            toValue: 1,
            duration: 150,
            easing: Easing.in(Easing.linear),
            useNativeDriver: true,
        }).start();
    }
    return isIndicatorShown;
}
