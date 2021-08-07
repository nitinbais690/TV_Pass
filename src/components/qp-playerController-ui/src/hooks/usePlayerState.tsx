/**
 *   This hook Handled Business Logic of a Player.
 */
import {
    PlaybackStateValue,
    BufferingStateValue,
    SeekingStateValue,
    TrackVariantInfo,
    PlatformError,
    PlayerConfig,
    Player,
    createPlayer,
    PlayerPreference,
    // BookmarkerConfig,
    // StreamConcurrencyConfig,
    PlayerStateListener,
    PlayerAudioRouteListener,
    PlayerProgressListener,
    PlayerStatsListener,
    PlayerErrorListener,
    PlayerTrackAvailabilityListener,
    PlayerTrackVariantChangeListener,
    PlayerListener,
    PlayerPictureInPictureListener,
} from 'rn-qp-nxg-player';
import { MutableRefObject, useRef, useReducer, useEffect } from 'react';

export interface PlaybackStateStatic {
    playerID: number;
    playbackState: PlaybackStateValue;
    bufferingState: BufferingStateValue;
    seekingState: SeekingStateValue;
    currentPosition: number;
    duration: number;
    tracks: Array<TrackVariantInfo>;
    selectedTracks: Array<TrackVariantInfo>;
    isAirplayConnected: boolean;
    error?: PlatformError;
}

export declare type PlaybackAction =
    | 'PLAYER_INIT'
    | 'PLAYER_DEINIT'
    | 'STATE_CHANGE'
    | 'PROGRESS'
    | 'TRACK_AVAILABILITY_CHANGE'
    | 'TRACK_CHANGED'
    | 'AIRPLAY_CONNECTED'
    | 'ERROR'
    | 'RESET';

export interface PlaybackActionStatic {
    type: PlaybackAction;
    payload: PlaybackStateStatic | any;
}

const initialState: PlaybackStateStatic = {
    playerID: -1,
    playbackState: 'IDLE',
    bufferingState: 'INACTIVE',
    seekingState: 'INACTIVE',
    currentPosition: 0,
    duration: 0,
    tracks: [],
    selectedTracks: [],
    isAirplayConnected: false,
};

const pbStateReducer = (state: PlaybackStateStatic, action: PlaybackActionStatic) => {
    // console.log(`~~pb_reducer~~ ${action.type}, payload= ${JSON.stringify(action.payload)}`);
    switch (action.type) {
        case 'PLAYER_INIT': {
            return { ...state, playerID: action.payload.playerID };
        }
        case 'PLAYER_DEINIT': {
            if (state.playerID === action.payload.playerID) {
                return { ...state, playerID: -1 };
            } else {
                console.log('Player already changed');
                return state;
            }
        }
        case 'STATE_CHANGE': {
            return { ...state, ...action.payload };
        }
        case 'PROGRESS': {
            return { ...state, ...action.payload };
        }
        case 'TRACK_AVAILABILITY_CHANGE': {
            return { ...state, tracks: action.payload };
        }
        case 'AIRPLAY_CONNECTED': {
            return { ...state, isAirplayConnected: action.payload };
        }
        case 'TRACK_CHANGED': {
            return { ...state, selectedTracks: action.payload };
        }
        case 'ERROR': {
            return { ...state, bufferingState: 'INACTIVE', seekingState: 'INACTIVE' };
        }
        case 'RESET': {
            return initialState;
        }
    }
};

export interface PlayerActions {
    seekTo: (value: any) => void;
}

type PlayerListenerType =
    | PlayerStateListener
    | PlayerAudioRouteListener
    | PlayerProgressListener
    | PlayerStatsListener
    | PlayerErrorListener
    | PlayerTrackAvailabilityListener
    | PlayerTrackVariantChangeListener
    | PlayerListener
    | PlayerPictureInPictureListener;

const createPlayerListener = (
    dispatch: any,
    onError: (error: PlatformError) => void,
    playerRef: MutableRefObject<Player | null>,
) => {
    return {
        onStateChanged(
            playbackState: PlaybackStateValue,
            bufferingState: BufferingStateValue,
            seekingState: SeekingStateValue,
        ): void {
            console.log(`pbState: ${playbackState}, bufStat: ${bufferingState}, seekState: ${seekingState}`);
            dispatch({
                type: 'STATE_CHANGE',
                payload: {
                    playbackState,
                    bufferingState,
                    seekingState,
                },
            });
        },
        onProgressUpdate(currentPosition: number, duration: number) {
            // console.log(`cusPos= ${currentPosition}, duration: ${duration}`);
            dispatch({
                type: 'PROGRESS',
                payload: {
                    currentPosition,
                    duration,
                },
            });
        },
        onError(error: PlatformError): void {
            console.log(`pb_error: ${JSON.stringify(error, null, 2)}`);
            dispatch({
                type: 'ERROR',
                payload: {
                    error,
                },
            });
            onError(error);
        },
        async onTrackAvailabilityChanged(): Promise<void> {
            console.log('track availability changed');
            const player = playerRef.current;
            if (player != null) {
                const tracks: Array<TrackVariantInfo> = [
                    ...(await player.getAvailableTrackVariants('TEXT')),
                    ...(await player.getAvailableTrackVariants('AUDIO')),
                ];
                dispatch({
                    type: 'TRACK_AVAILABILITY_CHANGE',
                    payload: tracks,
                });
            }
        },
        async onTrackVariantChanged(): Promise<void> {
            console.log('track variant changed');
            const player = playerRef.current;
            if (player != null) {
                const activeTracks: Array<TrackVariantInfo> = [
                    await player.getSelectedTrack('TEXT'),
                    await player.getSelectedTrack('AUDIO'),
                ];
                dispatch({
                    type: 'TRACK_CHANGED',
                    payload: activeTracks,
                });
            }
        },
        async onAirplayConnected(airplayConnected: boolean): Promise<void> {
            dispatch({
                type: 'AIRPLAY_CONNECTED',
                payload: airplayConnected,
            });
        },
        async onAudiorouteChanged(fromPort: string, toPort: string): Promise<void> {
            console.debug(`onAudiorouteChanged from: ${fromPort}, to: ${toPort}`);
            // TODO: this shouldn't be requires. Bridge should be fixed to send `airplayConnected` false
            // via `onAirplayConnected`
            dispatch({
                type: 'AIRPLAY_CONNECTED',
                payload: false,
            });
        },
    };
};

export const usePlayerState = ({
    playerConfig,
    onError,
    playerPreference,
    wOffset,
}: {
    playerConfig: PlayerConfig;
    onError: (error: PlatformError) => void;
    playerPreference?: PlayerPreference;
    wOffset: number;
}): { player: Player | null; state: PlaybackStateStatic; reset: () => void } => {
    const playerRef: MutableRefObject<Player | null> = useRef(null);
    const [state, dispatch] = useReducer(pbStateReducer, initialState);

    const playerListener = useRef<PlayerListenerType | null>(null);

    const reset = () => {
        dispatch({
            type: 'RESET',
            payload: {},
        });
    };

    useEffect((): any => {
        return async () => {
            const player = playerRef.current;
            if (player != null) {
                if (playerListener.current) {
                    player.removeListener(playerListener.current);
                }
                console.log(`didmount disposing player ${player.getNativeID()}`);
                await player.stop();
                await player.dispose();
                playerRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        console.debug(`pb_reset_state: ${playerConfig.mediaURL}`);
        reset();
    }, [playerConfig.mediaURL]);

    useEffect((): any => {
        async function preparePlayer() {
            if (playerRef.current != null) {
                console.log(`disposing player ${playerRef.current.getNativeID()}`);
                if (playerListener.current) {
                    playerRef.current.removeListener(playerListener.current);
                }
                await playerRef.current.stop();
                await playerRef.current.dispose();
                playerRef.current = null;
            }

            console.log('initializing player...');
            const player = await createPlayer(playerConfig);
            playerRef.current = player;
            if (playerPreference) {
                player.setPlayerPreference({ ...playerPreference, initialPlaybackTime: wOffset ? wOffset / 1000 : 0 });
            }
            player.play();
            //=== Add Listeners ===
            playerListener.current = createPlayerListener(dispatch, onError, playerRef);
            player.addListener(playerListener.current);
            dispatch({
                type: 'PLAYER_INIT',
                payload: {
                    playerID: player.getNativeID(),
                },
            });
        }

        if (playerPreference) {
            preparePlayer();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerPreference, playerConfig.mediaURL]);

    return { player: playerRef.current, state, reset };
};
