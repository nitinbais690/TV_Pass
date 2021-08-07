import React, { useEffect, useState, useRef, useCallback } from 'react';
import { PlaybackStateStatic } from 'qp-playercontroller-ui';
import { ResourceVm } from 'qp-discovery-ui';
import { PlayerConfig } from 'rn-qp-nxg-player';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { AppEvents, condensePlayerData } from 'utils/ReportingUtils';
import { TimerType, useTimer } from 'utils/TimerContext';

const DEFAULT_PROGRESS_REPORT_INTERVAL_MS = 10 * 1000; // 10 secs

export function useInterval(
    callback: React.EffectCallback,
    delay: number | null,
): React.MutableRefObject<number | null> {
    const intervalRef = useRef<number | null>(null);
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Set up the interval:

    useEffect(() => {
        if (typeof delay === 'number') {
            intervalRef.current = setInterval(() => callbackRef.current(), delay);

            // Clear interval if the components is unmounted or the delay changes:
            return () => clearInterval(intervalRef.current || 0);
        }
    }, [delay]);

    return intervalRef;
}

export const usePlayerAnalytics = (
    state: PlaybackStateStatic,
    resource: ResourceVm | null | undefined,
    playerConfig: PlayerConfig,
    isCastSessionActive: boolean,
    activeTextTrack: string | undefined,
    activeAudioTrack: string | undefined,
) => {
    const { appConfig } = useAppPreferencesState();
    const { recordEvent } = useAnalytics();
    const progressRecordInterval =
        appConfig && appConfig.playbackReportingIntervalMs
            ? appConfig.playbackReportingIntervalMs
            : DEFAULT_PROGRESS_REPORT_INTERVAL_MS;
    //Note: To check if the video has started to play.
    const [isStarted, setIsStarted] = useState<boolean>(false);
    //Note: To check if the user has paused the video
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const currentPosition = useRef(Math.floor(state.currentPosition / 1000));
    const { elapsedTime, startTimer, stopTimer } = useTimer();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const reportPlaybackEvent = (
        eventName: AppEvents,
        key: string = 'currentPosition',
        playerLoadTime?: number | undefined,
    ) => {
        if (resource) {
            let attributes = { [key]: currentPosition.current };
            if (attributes) {
                if (playerLoadTime) {
                    attributes.playbackStartedTimeSec = playerLoadTime / 1000;
                }
            }
            console.debug('[usePlayerAnalytics] Record Playback event, ', eventName, attributes);
            recordEvent(
                eventName,
                condensePlayerData(
                    resource,
                    playerConfig,
                    isCastSessionActive,
                    activeTextTrack,
                    activeAudioTrack,
                    attributes,
                ),
            );
        }
    };

    const recordPlaybackProgress = useCallback(() => {
        if (state.playbackState === 'STARTED') {
            reportPlaybackEvent(AppEvents.PLAYBACK_INPROGRESS);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.playbackState]);

    useInterval(recordPlaybackProgress, progressRecordInterval);

    React.useEffect(() => {
        currentPosition.current = Math.floor(state.currentPosition / 1000);
    }, [state.currentPosition]);

    useEffect(() => {
        return () => {
            reportPlaybackEvent(AppEvents.PLAYBACK_STOPPED);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isStarted) {
            reportPlaybackEvent(AppEvents.PLAYBACK_SUBTITLE_LANGUAGE_CHANGE);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTextTrack]);

    useEffect(() => {
        if (isStarted) {
            reportPlaybackEvent(AppEvents.PLAYBACK_AUDIO_LANGUAGE_CHANGE);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeAudioTrack]);

    useEffect(() => {
        switch (state.playbackState) {
            case 'STARTED':
                stopTimer(TimerType.PlayerLoad);
                //Note: isPaused check as player behavior has PLAYBACK_STARTED and PLAYBACK_RESUMED triggering consecutively
                if (!isPaused) {
                    reportPlaybackEvent(AppEvents.PLAYBACK_STARTED, undefined, elapsedTime.playerLoadTime);
                    setIsStarted(true);
                } else {
                    reportPlaybackEvent(AppEvents.PLAYBACK_RESUMED, undefined, elapsedTime.playerLoadTime);
                    setIsPaused(false);
                }
                break;
            case 'LOADED':
                reportPlaybackEvent(AppEvents.PLAYBACK_PREPARED);
                break;
            case 'PAUSED':
                if (currentPosition.current >= Math.floor(state.duration / 1000) && state.duration !== 0) {
                    reportPlaybackEvent(AppEvents.PLAYBACK_COMPLETE);
                } else {
                    startTimer(TimerType.PlayerLoad);
                    reportPlaybackEvent(AppEvents.PLAYBACK_PAUSED);
                    setIsPaused(true);
                }
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.playbackState, state.duration]);

    useEffect(() => {
        if (state.seekingState === 'ACTIVE') {
            reportPlaybackEvent(AppEvents.PLAYBACK_SEEK_START, 'playbackSeekStartTimeSec');
        } else if (isStarted && state.seekingState === 'INACTIVE') {
            reportPlaybackEvent(AppEvents.PLAYBACK_SEEK_COMPLETE, 'playbackSeekEndTimeSec');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.seekingState]);

    useEffect(() => {
        if (state.bufferingState === 'ACTIVE') {
            reportPlaybackEvent(AppEvents.PLAYBACK_BUFFERING_START);
        } else if (isStarted && state.bufferingState === 'INACTIVE') {
            reportPlaybackEvent(AppEvents.PLAYBACK_BUFFERING_END);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.bufferingState]);
};
