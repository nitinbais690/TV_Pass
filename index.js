/**
 * @format
 */

require('react-native').unstable_enableLogBox();

import { AppRegistry, Text, TextInput, Linking } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import PushNotification from 'react-native-push-notification';

// Configure local notifications
PushNotification.configure({
    onRegister: function(token) {
        console.log('TOKEN:', token);
    },

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function(notification) {
        let deepUrl = '';
        const pushType = notification.data.pushType || '';
        // need to navigate to mycontent download screen on notification received
        if (pushType == 'local') {
            deepUrl = 'struum://app/mycontent/downloads';
        } else {
            deepUrl = notification.data._sd || '';
        }
        Linking.openURL(deepUrl);
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function(notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function(err) {
        console.error(err.message, err);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
});

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
