import { PlayerControlsViewTV } from '../../../src/views/PlayerControlsViewTV';
import { render, toJSON, fireEvent, getByLabelText } from '@testing-library/react-native';
import React from 'react';

describe('PlayerControlsViewTV', function() {
    it('should render loading', () => {
        jest.useFakeTimers();
        const jsx = <PlayerControlsViewTV isLoading={true} />;
        const { container } = render(jsx);
        expect(toJSON(container)).toMatchSnapshot();
    });

    it('should be visible on pressing', () => {
        jest.useFakeTimers();
        const jsx = <PlayerControlsViewTV />;
        const { container } = render(jsx);
        const playerControls = getByLabelText(container, 'PlayerControls');
        fireEvent.press(playerControls);
        expect(getByLabelText(container, 'Backbutton')).toBeDefined();
        expect(getByLabelText(container, 'RewindButton')).toBeDefined();
        expect(getByLabelText(container, 'ForwardButton')).toBeDefined();
        expect(getByLabelText(container, 'Play')).toBeDefined();
    });

    it('should render all player controls', () => {
        jest.useFakeTimers();
        const jsx = (
            <PlayerControlsViewTV
                showOnStart={true}
                currentTime={207360000}
                playbackDuration={307360000}
                isLive={false}
                contentTitle={'test'}
            />
        );

        const { container } = render(jsx);
        expect(toJSON(container)).toMatchSnapshot();
        expect(getByLabelText(container, 'Backbutton')).toBeDefined();
        expect(getByLabelText(container, 'RewindButton')).toBeDefined();
        expect(getByLabelText(container, 'ForwardButton')).toBeDefined();
        expect(getByLabelText(container, 'Play')).toBeDefined();
    });

    it('should call player controls on press', () => {
        jest.useFakeTimers();
        const pausePressHandler = jest.fn();
        const rewindPressHandler = jest.fn();
        const forwardPressHandler = jest.fn();
        const backPressHandler = jest.fn();

        const jsx = (
            <PlayerControlsViewTV
                showOnStart={true}
                onPause={pausePressHandler}
                onRewindPress={rewindPressHandler}
                onForwardPress={forwardPressHandler}
                onBackPress={backPressHandler}
                isLoading={false}
            />
        );

        const { container } = render(jsx);

        const playButton = getByLabelText(container, 'Play');
        fireEvent.press(playButton);
        expect(pausePressHandler).toHaveBeenCalled();

        const rewindButton = getByLabelText(container, 'RewindButton');
        fireEvent.press(rewindButton);
        expect(rewindPressHandler).toHaveBeenCalled();

        const forwardButton = getByLabelText(container, 'ForwardButton');
        fireEvent.press(forwardButton);
        expect(forwardPressHandler).toHaveBeenCalled();

        const backButton = getByLabelText(container, 'Backbutton');
        fireEvent.press(backButton);
        expect(backPressHandler).toHaveBeenCalled();
    });

    it('should call restart/lookback on press', () => {
        jest.useFakeTimers();
        const restartPressHandler = jest.fn();
        const lookbackPressHandler = jest.fn();
        const jsx = (
            <PlayerControlsViewTV
                showOnStart={true}
                disableRewind={true}
                onRestartPress={restartPressHandler}
                disableForward={true}
                onLookbackPress={lookbackPressHandler}
                isLoading={false}
            />
        );

        const { container } = render(jsx);

        const restartButton = getByLabelText(container, 'RestartButton');
        fireEvent.press(restartButton);
        expect(restartPressHandler).toHaveBeenCalled();

        const lookbackButton = getByLabelText(container, 'LookbackButton');
        fireEvent.press(lookbackButton);
        expect(lookbackPressHandler).toHaveBeenCalled();
    });
});
