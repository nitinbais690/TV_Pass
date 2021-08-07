import path from 'path';

export const ANDROID_DEVICE_NAME = process.env.ANDROID_DEVICE_NAME || 'Android_Device';
export const ANDROID_PLATFORM_VERSION = process.env.ANDROID_PLATFORM_VERSION || '7.1.2';
export const ANDROID_APPLICATION_PATH =
    process.env.ANDROID_APPLICATION_PATH ||
    path.resolve(__dirname, '../../../android/app/build/outputs/apk/release/app-release.apk');

export const DEVICE_TIMEOUT = process.env.DEVICE_TIMEOUT || 5 * 1000;

export const IOS_DEVICE_NAME = process.env.IOS_DEVICE_NAME || 'iPhone 8';
export const IOS_PLATFORM_VERSION = process.env.IOS_PLATFORM_VERSION || '12.2';

export const TVOS_DEVICE_NAME = process.env.TVOS_DEVICE_NAME || 'Apple TV';
export const TVOS_PLATFORM_VERSION = process.env.TVOS_PLATFORM_VERSION || '12.4';

export const IOS_APPLICATION_PATH =
    process.env.IOS_APPLICATION_PATH ||
    path.resolve(__dirname, '../../../ios/build/B2BDemo/Build/Products/Release-iphonesimulator/B2BDemo.app');

export const TVOS_APPLICATION_PATH =
    process.env.TVOS_APPLICATION_PATH ||
    path.resolve(__dirname, '../../../ios/build/B2BDemo/Build/Products/Release-appletvsimulator/B2BDemo-tvOS.app');

export const APPIUM_HOST = process.env.APPIUM_HOST || 'localhost';
export const APPIUM_LOG_LEVEL = process.env.APPIUM_LOG_LEVEL || 'debug';
export const APPIUM_PASSWORD = process.env.APPIUM_PASSWORD || undefined;
export const APPIUM_PORT = (process.env.APPIUM_PORT && Number(process.env.APPIUM_PORT)) || 4723;
export const APPIUM_USER = process.env.APPIUM_USER || undefined;

export const TARGET_PLATFORM = process.env.TARGET_PLATFORM || 'android';

export const INTERFACE_IDIOM = process.env.INTERFACE_IDIOM || 'mobile';

export const JEST_TIMEOUT = process.env.JEST_TIMEOUT || 60 * 1000;

export const PLAYBACK_START_WAIT_TIME = 15000;
export const POLL_FREQUENCY = 10;
