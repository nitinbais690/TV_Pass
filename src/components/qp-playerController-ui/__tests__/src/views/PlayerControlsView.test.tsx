import React from 'react';
import { PlayerControlsView } from '../../../src/views/PlayerControlsView';
import { render, toJSON, getByLabelText, fireEvent } from '@testing-library/react-native';

describe('PlayerControlsView', () => {
    it('should render loading', () => {
        jest.useFakeTimers();
        const jsx = <PlayerControlsView isLoading={true} />;
        const { container } = render(jsx);
        expect(toJSON(container)).toMatchSnapshot();
    });

    it('should be visible on pressing', () => {
        jest.useFakeTimers();
        const jsx = <PlayerControlsView />;
        const { container, debug } = render(jsx);
        const playerControls = getByLabelText(container, 'PlayerControls');
        fireEvent.press(playerControls);
        debug();
        expect(getByLabelText(container, 'CloseButton')).toBeDefined();
        expect(getByLabelText(container, 'RewindButton')).toBeDefined();
        expect(getByLabelText(container, 'ForwardButton')).toBeDefined();
        expect(getByLabelText(container, 'Play')).toBeDefined();
    });

    it('should render all player controls', () => {
        jest.useFakeTimers();
        const jsx = <PlayerControlsView showOnStart={true} currentTime={207360000} playbackDuration={307360000} />;

        const { container } = render(jsx);
        expect(toJSON(container)).toMatchSnapshot();
        expect(getByLabelText(container, 'CloseButton')).toBeDefined();
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
            <PlayerControlsView
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

        const closeButton = getByLabelText(container, 'CloseButton');
        fireEvent.press(closeButton);
        expect(backPressHandler).toHaveBeenCalled();
    });
});
