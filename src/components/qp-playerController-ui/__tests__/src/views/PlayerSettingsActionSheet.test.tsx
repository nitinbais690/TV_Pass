import { PlayerPrefActionSheet } from '../../../src/views/PlayerSettingsActionSheet';
import { render } from '@testing-library/react-native';
import React from 'react';

describe('PlayerSettingsActionSheet', function() {
    it('should show action sheet', async function() {
        const pressHandler = jest.fn();
        const actionsheet = render(
            <PlayerPrefActionSheet
                captionOptions={['EN', 'SR']}
                audioOptions={['Eng', 'Spa']}
                onAudioOptionSelected={pressHandler}
                onTextOptionSelected={pressHandler}
            />,
        );
        expect(actionsheet).toBeDefined();
    });
});
