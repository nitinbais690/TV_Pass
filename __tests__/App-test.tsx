/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

// jest.mock('react-native-gesture-handler', () => {
//     const View = require('react-native/Libraries/Components/View/View');
//     return {
//         Swipeable: View,
//         DrawerLayout: View,
//         State: {},
//         ScrollView: View,
//         Slider: View,
//         Switch: View,
//         TextInput: View,
//         ToolbarAndroid: View,
//         ViewPagerAndroid: View,
//         DrawerLayoutAndroid: View,
//         WebView: View,
//         NativeViewGestureHandler: View,
//         TapGestureHandler: View,
//         FlingGestureHandler: View,
//         ForceTouchGestureHandler: View,
//         LongPressGestureHandler: View,
//         PanGestureHandler: View,
//         PinchGestureHandler: View,
//         RotationGestureHandler: View,
//         /* Buttons */
//         RawButton: View,
//         BaseButton: View,
//         RectButton: View,
//         BorderlessButton: View,
//         /* Other */
//         FlatList: View,
//         gestureHandlerRootHOC: jest.fn(),
//         Directions: {},
//     };
// });

jest.mock('react-native-device-info', () => {
    return {
        getDeviceType: jest.fn(),
    };
});

it('renders correctly', () => {
    renderer.create(<App />);
});
