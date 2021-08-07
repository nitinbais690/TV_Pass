import {
    ANDROID_APPLICATION_PATH,
    ANDROID_DEVICE_NAME,
    ANDROID_PLATFORM_VERSION,
    APPIUM_HOST,
    APPIUM_LOG_LEVEL,
    APPIUM_PASSWORD,
    APPIUM_PORT,
    APPIUM_USER,
    DEVICE_TIMEOUT,
    IOS_APPLICATION_PATH,
    IOS_DEVICE_NAME,
    IOS_PLATFORM_VERSION,
    TVOS_DEVICE_NAME,
    TVOS_PLATFORM_VERSION,
    TVOS_APPLICATION_PATH,
    TARGET_PLATFORM,
} from './constants';
import { version as appiumVersion } from 'appium/package.json';

const common = {
    hostname: APPIUM_HOST,
    port: APPIUM_PORT,
    logLevel: APPIUM_LOG_LEVEL,
    user: APPIUM_USER,
    pwd: APPIUM_PASSWORD,
    capabilities: {
        appiumVersion,
        waitforTimeout: DEVICE_TIMEOUT,
        commandTimeout: DEVICE_TIMEOUT,
        newCommandTimeout: DEVICE_TIMEOUT,
    },
};

export const android = {
    ...common,
    capabilities: {
        ...common.capabilities,
        platformName: 'Android',
        automationName: 'UiAutomator2',
        deviceName: ANDROID_DEVICE_NAME,
        platformVersion: ANDROID_PLATFORM_VERSION,
        app: ANDROID_APPLICATION_PATH,
    },
};

export const ios = {
    ...common,
    capabilities: {
        ...common.capabilities,
        platformName: 'iOS',
        automationName: 'XCUITest',
        deviceName: IOS_DEVICE_NAME,
        platformVersion: IOS_PLATFORM_VERSION,
        app: IOS_APPLICATION_PATH,
    },
};

export const tvos = {
    ...common,
    capabilities: {
        ...common.capabilities,
        platformName: 'tvOS',
        automationName: 'XCUITest',
        deviceName: TVOS_DEVICE_NAME,
        platformVersion: TVOS_PLATFORM_VERSION,
        app: TVOS_APPLICATION_PATH,
    },
};
