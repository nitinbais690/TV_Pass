import { GlobalWithFetchMock } from 'jest-fetch-mock';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';

const customGlobal: GlobalWithFetchMock = (global as unknown) as GlobalWithFetchMock;
customGlobal.fetch = require('jest-fetch-mock');
customGlobal.fetchMock = customGlobal.fetch;

// Workaround applied based on: https://github.com/testing-library/native-testing-library/issues/113
// Long term solution: https://callstack.github.io/react-native-testing-library/docs/migration-v7/
jest.mock('react-native/Libraries/Components/Touchable/TouchableOpacity', () => {
    const TouchableOpacity = jest.requireActual('react-native/Libraries/Components/Touchable/TouchableOpacity');
    TouchableOpacity.displayName = 'TouchableOpacity';
    return TouchableOpacity;
});

jest.mock('react-native/Libraries/Components/Touchable/TouchableHighlight', () => {
    const TouchableHighlight = jest.requireActual('react-native/Libraries/Components/Touchable/TouchableHighlight');
    TouchableHighlight.displayName = 'TouchableHighlight';
    return TouchableHighlight;
});

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);

const keychainMock = {
    SECURITY_LEVEL_ANY: 'MOCK_SECURITY_LEVEL_ANY',
    SECURITY_LEVEL_SECURE_SOFTWARE: 'MOCK_SECURITY_LEVEL_SECURE_SOFTWARE',
    SECURITY_LEVEL_SECURE_HARDWARE: 'MOCK_SECURITY_LEVEL_SECURE_HARDWARE',
    setGenericPassword: jest.fn(),
    getGenericPassword: jest.fn(),
    resetGenericPassword: jest.fn(),
};

jest.mock('react-native-keychain', () => keychainMock);

const systemSetting = {
    getVolume: jest.fn(() => Promise.resolve(1)),
    setVolume: jest.fn(),
    addVolumeListener: jest.fn(() => Promise.resolve({ volume: 1 })),
    removeVolumeListener: jest.fn(),
};
jest.mock('react-native-system-setting', () => systemSetting);

const safeArea = {
    useSafeArea: () => {
        return { left: 0 };
    },
};
jest.mock('react-native-safe-area-context', () => safeArea);
