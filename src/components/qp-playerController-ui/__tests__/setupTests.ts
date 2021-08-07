import { View } from 'react-native';

jest.mock('rn-qp-nxg-player', () => {
    return {
        platformAuthorizer: jest.fn(),
        contentAuthorizer: jest.fn(),
        downloadManager: jest.fn(),
        createPlayer: jest.fn(),
        QpNxgPlaybackView: View,
        QpNxgAirplayView: View,
        createError: jest.fn(),
        platformErrorFrom: jest.fn(),
    };
});

jest.mock('react-native-google-cast', () => {
    return {
        CastButton: View,
    };
});
