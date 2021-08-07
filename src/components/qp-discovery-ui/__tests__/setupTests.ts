import { cleanup } from '@testing-library/react-native';
import { NativeModules as RNNativeModules } from 'react-native';
RNNativeModules.UIManager = RNNativeModules.UIManager || {};
RNNativeModules.UIManager.RCTView = RNNativeModules.UIManager.RCTView || {};
RNNativeModules.RNGestureHandlerModule = RNNativeModules.RNGestureHandlerModule || {
    State: { BEGAN: 'BEGAN', FAILED: 'FAILED', ACTIVE: 'ACTIVE', END: 'END' },
    attachGestureHandler: jest.fn(),
    createGestureHandler: jest.fn(),
    dropGestureHandler: jest.fn(),
    updateGestureHandler: jest.fn(),
};
RNNativeModules.PlatformConstants = RNNativeModules.PlatformConstants || {
    forceTouchAvailable: false,
};
RNNativeModules.ReactLocalization = {
    language: 'en',
};

jest.mock('react-native-device-info', () => {
    return {
        getDeviceType: jest.fn(),
    };
});

jest.mock('react-native-localize', () => {
    return {
        getLocales: jest.fn(),
        // you can add other functions mock here that you are using
    };
});
//TODO:https://github.com/kmagiera/react-native-reanimated/pull/344
//react-native-reanimated/mock should be replaced
// jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock');

jest.mock('react-native-reanimated', () => {
    const { View, Text, Animated } = require('react-native');

    return {
        Value: Animated.Value,
        ScrollView: Animated.ScrollView,
        Text: Text,
        event: jest.fn(),
        add: jest.fn(),
        eq: jest.fn(),
        set: jest.fn(),
        cond: jest.fn(),
        interpolate: jest.fn(),
        View: View,
        Extrapolate: { CLAMP: jest.fn() },
        Transition: {
            Together: 'Together',
            Out: 'Out',
            In: 'In',
        },
        Easing: {
            in: jest.fn(),
            out: jest.fn(),
            inOut: jest.fn(),
        },
        Clock: jest.fn(),
        onChange: jest.fn(),
        and: jest.fn(),
        abs: jest.fn(),
        block: jest.fn(),
        call: jest.fn(),
        ceil: jest.fn(),
        clockRunning: jest.fn(),
        divide: jest.fn(),
        floor: jest.fn(),
        greaterThan: jest.fn(),
        lessThan: jest.fn(),
        max: jest.fn(),
        min: jest.fn(),
        multiply: jest.fn(),
        neq: jest.fn(),
        not: jest.fn(),
        round: jest.fn(),
        spring: jest.fn(),
        startClock: jest.fn(),
        stopClock: jest.fn(),
        sub: jest.fn(),
        timing: jest.fn(),
    };
});

afterEach(cleanup);
