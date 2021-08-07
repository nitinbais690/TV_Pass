module.exports = {
    preset: '@testing-library/react-native',
    clearMocks: true,
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|react-clone-referenced-element|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|sentry-expo|native-base|rn-qp-nxg-player|@react-native-community/.*))',
    ],
    testEnvironment: 'node',
    testMatch: [
        '<rootDir>/**/src/components/**/__tests__/src/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/**/src/__tests__/**/*.{js,jsx,ts,tsx}',
    ],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
        '\\.svg': '<rootDir>/src/__mocks__/svgMock.js',
    },
    setupFilesAfterEnv: [
        './src/components/qp-discovery-ui/__tests__/setupTests.ts',
        './setupJest.ts',
        './src/components/qp-playerController-ui/__tests__/setupTests.ts',
    ],
    collectCoverageFrom: [
        'src/utils/GeoChecker.{ts,tsx}',
        'src/utils/CreditsContextProvider.{ts,tsx}',
        'src/components/**/*.{ts,tsx}',
        '!src/index.ts',
        '!src/components/qp-discovery-ui/index.ts',
        '!src/components/qp-discovery-ui/src/styles/stylesheet.ts',
        '!src/components/qp-playerController-ui/src/styles/stylesheet.ts',
        '!src/components/qp-playerController-ui/src/utils/Constants.ts',
        '!src/components/qp-discovery-ui/src/api/index.ts',
        '!src/components/qp-discovery-ui/src/models/Discovery.types.ts',
    ],
    coveragePathIgnorePatterns: ['/node_modules/', '/index.ts'],
    // coverageThreshold: {
    //     global: {
    //         statements: 40,
    //         branches: 15,
    //         functions: 20,
    //         lines: 40,
    //     },
    // },
    coverageDirectory: './coverage/',
    coverageReporters: ['json-summary', 'text', 'cobertura', 'lcov'],
    globals: {
        'ts-jest': {
            diagnostics: false,
            isolatedModules: true,
        },
        window: {},
    },
};
