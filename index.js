/**
 * @format
 */

require('react-native').unstable_enableLogBox();

import { AppRegistry, Text, TextInput } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Disable font scaling globally
if (Text.defaultProps == null) {
    Text.defaultProps = {};
}
Text.defaultProps.allowFontScaling = false;
if (TextInput.defaultProps == null) {
    TextInput.defaultProps = {};
}
TextInput.defaultProps.allowFontScaling = false;

//Dependency for react fetching library
global.Buffer = global.Buffer || require('buffer').Buffer;

AppRegistry.registerComponent(appName, () => App);
