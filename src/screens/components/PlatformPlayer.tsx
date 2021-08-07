import React, { useEffect, useState, useRef, Dispatch, SetStateAction } from 'react';
import { View, Dimensions, StyleSheet, Platform, Text } from 'react-native';
//import DeviceInfo from 'react-native-device-info';
import { NetInfoStateType } from '@react-native-community/netinfo';
import PrefersHomeIndicatorAutoHidden from 'react-native-home-indicator';
import { dimensions, AspectRatio, ImageType } from 'qp-common-ui';
import {
    QpNxgPlaybackView,
    TrackVariantInfo,
    PlatformError,
    TrackVariantTypeValue,
    PlayerConfig,
    PlayingInfo,
    Player,
    PlayerPreference,
    PlaybackStateValue,
} from 'rn-qp-nxg-player';
import {
    PlayerActions,
    usePlayerState,
    PlayerControlsView,
    CaptionsStyle,
    // PlayerControlsTV,
    PlayerCaptionsView,
    PlayerControlsActions,
} from 'qp-playercontroller-ui';
import PlayerControlsTV from 'qp-playercontroller-ui/src/views/PlayerControlsTV';
import { ResourceVm, useConfig } from 'qp-discovery-ui';
import { useCastContext } from 'utils/CastContextProvider';
import { getStreamQuality } from 'utils/UserPreferenceUtils';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import { useLocalization } from 'contexts/LocalizationContext';
import { useEntitlements } from 'contexts/EntitlementsContextProvider';
// import { useAlert } from 'contexts/AlertContext';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { imageResizerUri } from 'qp-discovery-ui/src/utils/ImageUtils';
import { useHistoryCreate } from 'screens/hooks/useHistoryCreate';
import { useShowUpNext } from 'screens/hooks/useShowUpNext';
import { usePauseCreditsTimer } from 'screens/hooks/usePauseCreditsTimer';
import { usePlayerAnalytics } from 'screens/hooks/usePlayerAnalytics';
import { PlayerProps } from 'screens/hooks/usePlayerConfig';
import { appFonts } from '../../../AppStyles';
import AppLoadingIndicator from './AppLoadingIndicator';
import UpNextOverlay, { UpNextOverlayActions } from './UpNextOverlay';
import { useSetDownloadBookmarks } from 'screens/hooks/useSetDownloadBookmarks';
import { useDownloadsContext } from 'utils/DownloadsContextProvider';
import UpNextTV from '../../TV/components/UpNextTV';

export interface PlatformPlayerProps {
    /**
     * Application styling to override default styles
     */
    playerScreenStyles?: CaptionsStyle;
    /**
     * Player Configuration
     */
    playerConfig: PlayerConfig;
    /**
     * Show only caption change options, instead of audio, captions and quality controls.
     * Default is false.
     */
    showOnlyCaptionsControl?: boolean;
    /**
     * Determines whether or not to show the debug overlay on the player. Defaults is false. (Android only).
     */
    showPlayerDebugOverlay?: boolean;
    /**
     * Sets the max number of player re-prepare on error. Default is 0. (Android only).
     */
    maxPlaybackRetries?: number;
    /**
     * The minimum bitrate in bits per second.
     * Pass 0 to clear the minimum bitrate cap. (Android only).
     */
    preferredMinBitrate?: number;
    /**
     * The maximum bitrate in bits per second.
     * Pass {@link Integer#MAX_VALUE} to clear the maximum bitrate cap. (Android only).
     */
    preferredMaxBitrate?: number;
    /**
     * Metadata of the playing content
     */
    resource?: ResourceVm | null;

    tvodToken: string;

    setPlayerProps: Dispatch<SetStateAction<PlayerProps>>;

    onPlayerClose: () => void;
    onError: (error: PlatformError) => void;
    onEnterFullScreen?: () => void;
    onExitFullScreen?: () => void;
    onPlaybackProgress?: (progress: number, duration: number) => void;
    onPlayerPrepared?: (actions: PlayerActions) => void;
    setshowDescription: (showDescription: boolean) => void;
}

export interface TrackInfo {
    type: string;
    displayName: string;
    languageCode: string;
}

const filterAndMapVariantsToCode = (variants: Array<TrackVariantInfo>, type: TrackVariantTypeValue): TrackInfo[] => {
    if (variants) {
        return variants
            .filter((variant: TrackVariantInfo) => {
                return variant.type === type;
            })
            .map((variant: TrackVariantInfo) => {
                return { displayName: variant.displayName, languageCode: variant.languageCode };
            })
            .filter(Boolean) as [];
    } else {
        return [];
    }
};

const filterAndMapActiveVariantsToCode = (variants: Array<TrackVariantInfo>, type: TrackVariantTypeValue) => {
    if (variants) {
        const track: Array<TrackVariantInfo> = variants.filter((variant: TrackVariantInfo) => {
            return variant.type === type;
        });
        if (track && track.length > 0) {
            return track[0].displayName;
        } else {
            return '';
        }
    }
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const castPlayerStateAdaptor = (castPlayerState: number): PlaybackStateValue => {
    // https://developers.google.com/cast/docs/reference/ios/g_c_k_media_status_8h#ae2742cc7441bbceea50f19ab3b6a68f9
    switch (castPlayerState) {
        case 1: // GCKMediaPlayerStateIdle
            return 'IDLE';
        case 2: // GCKMediaPlayerStatePlaying
            return 'STARTED';
        case 3: // GCKMediaPlayerStatePaused
            return 'PAUSED';
        case 4: // GCKMediaPlayerStateBuffering
        case 5: // GCKMediaPlayerStateLoading
            return 'LOADING';
        default:
            return 'IDLE';
    }
};

const useCellularPlaybackWarning = (player: Player | null) => {
    const { type } = useNetworkStatus();

    const { streamOverCellular: canStreamOverCellularState } = useDownloadsContext();

    useEffect(() => {
        if (player && canStreamOverCellularState === false && type === NetInfoStateType.cellular) {
            player.stop();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [player, canStreamOverCellularState, type]);
};

//const disbaleControls: boolean = false;
export const PlatformPlayer = (props: PlatformPlayerProps): JSX.Element => {
    const { playerConfig, resource } = props;
    // const { Alert } = useAlert();
    const tvodTokenRef = useRef(props.tvodToken);
    const upNextOverlayRef = useRef<UpNextOverlayActions>(null);
    const upNextOverlayTVRef = useRef<UpNextOverlayActions>(null);
    const playerControlsRef = useRef<PlayerControlsActions>(null);
    const { appConfig } = useAppPreferencesState();
    let { xAuthToken } = useEntitlements();
    const [castContentProgress, setCastContentProgress] = useState(0);
    const [castContentDuration, setCastContentDuration] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isCastConnecting, setIsCastConnecting] = useState<boolean>(false);
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [disableControls, setDisableControls] = useState<boolean>(false);
    const [castPlayerState, setCastPlayerState] = useState<PlaybackStateValue>('IDLE');
    const [playerPrefs, setPlayerPrefs] = useState<PlayerPreference | undefined>(undefined);
    const { player, state, reset } = usePlayerState({
        // platformAsset: platformAsset,
        // bookmarkConfig,
        // streamConcurrencyConfig,
        playerConfig,
        onError: props.onError,
        playerPreference: playerPrefs,
    });
    let captionsOptions: TrackInfo[] = filterAndMapVariantsToCode(state.tracks, 'TEXT');
    let audioOptions: TrackInfo[] = filterAndMapVariantsToCode(state.tracks, 'AUDIO');
    let activeTextTrack: string | undefined = filterAndMapActiveVariantsToCode(state.selectedTracks, 'TEXT');
    let activeAudioTrack: string | undefined = filterAndMapActiveVariantsToCode(state.selectedTracks, 'AUDIO');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isCastSessionActive, device, dispatch } = useCastContext();
    const { strings } = useLocalization();
    //const isTVScreen: boolean = Platform.isTV;

    const onUpNextSelected = (playerProps: PlayerProps) => {
        if (upNextOverlayRef.current) {
            upNextOverlayRef.current.hide();
        }

        props.setPlayerProps(playerProps);
        reset();
    };

    useEffect(() => {
        const loadPrefs = async () => {
            const preferredStreamQuality = await getStreamQuality();
            const preferredStreamQualityKey = `preferredPeakBitRate_${preferredStreamQuality}`;
            const preferredForwardBufferDuration = (appConfig && appConfig.preferredForwardBufferDuration) || 0;
            let preferredPeakBitRate = 0;
            if (appConfig) {
                preferredPeakBitRate = (appConfig as any)[preferredStreamQualityKey] || 0;
            }
            const initialPlaybackTime = resource && resource.watchedOffset ? resource.watchedOffset / 1000 : 0;

            console.debug('[PlatformPlayer] setting player preference', {
                preferredPeakBitRate,
                preferredForwardBufferDuration,
                initialPlaybackTime,
            });

            setPlayerPrefs({
                initialPlaybackTime: initialPlaybackTime,
                preferredForwardBufferDuration: preferredForwardBufferDuration,
                preferredPeakBitRate: preferredPeakBitRate,
            });
        };

        loadPrefs();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appConfig]);

    useEffect(() => {
        if (isCastSessionActive && !Platform.isTV) {
            console.debug('[GoogleCast] [Connect & Play] handler');
            /* Whenever the resource id is updated(new content selected from upnext overlay or from browse for cast connect and play)we are resetting
             the cast player state, content progress and content duration to its initial state. Since, tvodToken is content specific, we use a ref
             for comparing its value */
            setCastPlayerState('IDLE');
            setCastContentProgress(0);
            setCastContentDuration(0);
            if (tvodTokenRef.current !== props.tvodToken) {
                loadMedia();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.resource && props.resource.id, props.tvodToken]);

    useEffect(() => {
        if (state.playbackState === 'STARTED' && isCastSessionActive && player && !Platform.isTV) {
            console.debug('[GoogleCast] [Connect & Play] handler');
            player.pause();
        }
    }, [state.playbackState, isCastSessionActive, player]);

    const playbackState = isCastSessionActive && castPlayerState ? castPlayerState : state.playbackState;
    const currentPosition = isCastSessionActive ? castContentProgress * 1000 : state.currentPosition;
    const playbackDuration = isCastSessionActive ? castContentDuration * 1000 : state.duration;

    const showUpNextOverlay = useShowUpNext(
        playbackState,
        currentPosition,
        playbackDuration,
        props.resource && props.resource.id,
    );
    useCellularPlaybackWarning(player);
    useHistoryCreate(currentPosition, playbackDuration, props.resource);
    usePauseCreditsTimer(state.playbackState);
    usePlayerAnalytics(state, props.resource, playerConfig, isCastSessionActive, activeTextTrack, activeAudioTrack);

    const handleSettingsPress = () => {
        if (state.playbackState === 'IDLE' || state.playbackState === 'LOADING') {
            return;
        }
        setDisableControls(true);
        setShowSettings(true);
        //showPlayerPrefSheet();
    };

    function handlePause(): void {
        console.log('####### handlePause #######');
        if (isCastSessionActive && !Platform.isTV) {
            const { GoogleCast } = require('react-native-google-cast');
            console.log('####### googlecast handlePause #######');
            GoogleCast.pause();
        } else if (player) {
            player.pause();
        }
    }

    function handleStop(): void {
        console.log('####### handleStop #######');
        if (isCastSessionActive && !Platform.isTV) {
            const { GoogleCast } = require('react-native-google-cast');
            GoogleCast.stop();
        } else if (player) {
            player.stop();
        }
    }

    async function handleTextTrackSelection(name: string, languageCode: string) {
        console.log(`handleTextTrackSelection: ${name}`);
        const trackName: string | undefined = name === 'Off' ? undefined : name;
        const trackLanguageCode: string | undefined = name === 'Off' ? undefined : languageCode;
        if (isCastSessionActive && !Platform.isTV) {
            const { GoogleCast } = require('react-native-google-cast');
            const enabled = name !== 'Off' ? true : false;
            await GoogleCast.toggleSubtitles(enabled, trackLanguageCode);
        } else if (player) {
            player.setPreferredTrackVariant('TEXT', {
                languageCode: trackLanguageCode,
                displayName: trackName,
                mimeType: '',
                type: 'TEXT',
            });
        }
    }

    function handleAudioTrackSelection(selection: any) {
        const trackName: string | undefined = selection === 'Off' ? undefined : selection.name;
        const trackLanguageCode: string | undefined = selection === 'Off' ? undefined : selection.languageCode;
        if (player) {
            player.setPreferredTrackVariant('AUDIO', {
                languageCode: trackLanguageCode,
                displayName: trackName,
                mimeType: '',
                type: 'AUDIO',
            });
        }
    }

    function handlePlayback(): void {
        console.log('####### handlePlayback #######');
        if (isCastSessionActive && !Platform.isTV) {
            const { GoogleCast } = require('react-native-google-cast');
            GoogleCast.play();
        } else if (player) {
            player.play();
        }
    }

    function handleRewindForward(value: number): void {
        console.log('Going to Seek up to  ' + value);
        if (isCastSessionActive && !Platform.isTV) {
            const { GoogleCast } = require('react-native-google-cast');
            const currenTimeInSec = castContentProgress * 1000;
            const seekToInSeconds = value;
            GoogleCast.seek((currenTimeInSec + seekToInSeconds) / 1000);
        } else if (player) {
            if (Platform.isTV) {
                // player.seek(state.currentPosition + value * 10000);
                player.seek(state.currentPosition + value);
            } else if (state.currentPosition + value < playbackDuration) {
                player.seek(state.currentPosition + value);
            }
        }
    }

    function handleRestart(): void {
        console.log('Restarting the playback');
    }

    function handleLookback(): void {
        console.log('Initiated video lookback');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function handleVolumeToggle(value: number): void {
        if (isCastSessionActive && !Platform.isTV) {
            const { GoogleCast } = require('react-native-google-cast');
            GoogleCast.setVolume(value);
        }
    }

    const onSlidingComplete = (value: any): void => {
        if (isCastSessionActive && !Platform.isTV) {
            const { GoogleCast } = require('react-native-google-cast');
            GoogleCast.seek(value / 1000);
        } else if (player) {
            player.play();
        }
        if (player) {
            player.seek(value);
        }
        //Platform.OS === 'android' ? handleSeek(value) : playbackView.seek(findNodeHandle(_playbackView), value);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleSelectedTrack = (isSubtitle: boolean, trackName: string): void => {
        console.log(`selectedTrack = isSubtitle=${isSubtitle}, trackName=${trackName}`);
        if (player) {
            if (isSubtitle) {
                player.setPreferredTrackVariant('TEXT', {
                    languageCode: trackName,
                    mimeType: '',
                    type: 'TEXT',
                });
            } else {
                player.setPreferredTrackVariant('AUDIO', {
                    languageCode: trackName,
                    mimeType: '',
                    type: 'TEXT',
                });
            }
        }
    };

    let isLoading = false;

    if (isCastSessionActive) {
        isLoading = castPlayerState === undefined || castPlayerState === 'LOADING';
    } else {
        isLoading =
            player === null ||
            state.playbackState === 'LOADING' ||
            state.playbackState === 'IDLE' ||
            state.bufferingState === 'ACTIVE' ||
            state.seekingState === 'ACTIVE';
    }

    useEffect(() => {
        if (props.resource) {
            const playingInfo: PlayingInfo = {
                title: props.resource.name,
                playbackDuration: state.duration,
                playbackProgress: state.currentPosition,
                assetUrl: props.resource.contentUrl,
                defaultPlaybackRate: 1.0,
                mediaType: props.resource.type,
            };
            // if (player) {
            //     player.setNowPlayingInfo(playingInfo);
            // }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.isAirplayConnected, player]);

    const screen_height = Dimensions.get('window').height;
    const screen_width = Dimensions.get('window').width;
    const config = useConfig();
    const resizerEndpoint = (config && config.imageResizeURL) || undefined;
    const resizerPath = 'image' || undefined;
    const styles = StyleSheet.create({
        posterImageStyle: { width: 200 },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const posterImageURI = imageResizerUri(
        resizerEndpoint || '',
        resizerPath,
        props.resource ? props.resource.id : '',
        AspectRatio._16by9,
        ImageType.Poster,
        styles.posterImageStyle.width,
    );

    const loadMedia = React.useMemo(
        () => (): void => {
            const headers = {
                'X-Tvod-Authorization': props.tvodToken,
            };

            if (props.resource && !Platform.isTV) {
                const { GoogleCast } = require('react-native-google-cast');
                const initialPlaybackTime =
                    props.resource && props.resource.watchedOffset ? props.resource.watchedOffset : 0;
                const playPosition = state.currentPosition > 0 ? state.currentPosition : initialPlaybackTime;

                GoogleCast.castMedia({
                    mediaUrl: props.resource.contentUrl ? props.resource.contentUrl : '',
                    imageUrl: posterImageURI,
                    title: props.resource.name,
                    customData: {
                        castAsset: {
                            userAuthToken: xAuthToken,
                            platformAsset: {
                                mediaID: props.resource.id,
                                consumptionType: props.resource.type === 'movie' || 'tvepisode' ? 'vod' : 'live',
                                catalogType: props.resource.type,
                                mediaType: 'dash',
                                drmScheme: 'widevine',
                            },
                            headers,
                        },
                    },
                    playPosition: playPosition / 1000,
                });
            }
            tvodTokenRef.current = props.tvodToken;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [xAuthToken, state.currentPosition, props.tvodToken],
    );

    // const showCastError = () => {
    //     Alert.alert(
    //         strings['playback.error.chromecast'],
    //         undefined,
    //         [
    //             {
    //                 text: strings['global.okay'],
    //                 onPress: () => {
    //                     if (player) {
    //                         player.play();
    //                     }
    //                 },
    //             },
    //         ],
    //         {
    //             cancelable: false,
    //         },
    //     );
    // };

    const onOverlayClose = () => {
        if (playerControlsRef.current) {
            playerControlsRef.current.show();
        }
    };

    useEffect(() => {
        if (Platform.isTV) {
            // if (!upNextOverlayTVRef.current || !playerControlsRef.current) {
            //     return;
            // }
            if (showUpNextOverlay) {
                upNextOverlayTVRef.current && upNextOverlayTVRef.current.show();
                playerControlsRef.current && playerControlsRef.current.hide();
            } else {
                upNextOverlayTVRef.current && upNextOverlayTVRef.current.hide();
                playerControlsRef.current && playerControlsRef.current.show();
            }
        } else {
            if (!upNextOverlayRef.current || !playerControlsRef.current) {
                return;
            }
            if (showUpNextOverlay) {
                upNextOverlayRef.current.show();
                playerControlsRef.current.hide();
            } else {
                upNextOverlayRef.current.hide();
                playerControlsRef.current.show();
            }
        }
    }, [showUpNextOverlay]);

    // useEffect(() => {
    //     if (!Platform.isTV) {
    //         const { GoogleCast } = require('react-native-google-cast');
    //         const onSessionEnded = () => {
    //             console.debug('[GoogleCast] Session ended', castContentProgress);
    //             dispatch({
    //                 type: 'SESSION_ENDED',
    //             });

    //             if (player) {
    //                 player.seek(castContentProgress * 1000);
    //                 player.play();
    //             }
    //         };

    //         GoogleCast.EventEmitter.addListener(GoogleCast.SESSION_ENDED, onSessionEnded);

    //         return () => {
    //             GoogleCast.EventEmitter.removeListener(GoogleCast.SESSION_ENDED, onSessionEnded);
    //         };
    //     }

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [player, castContentProgress]);

    // useEffect(() => {
    //     if (!Platform.isTV) {
    //         const { GoogleCast } = require('react-native-google-cast');
    //         const channel_namespace = 'urn:x-cast:com.quickplay.platform.player.cast';

    //         GoogleCast.SESSION_STARTING,
    //             () => {
    //                 console.debug('[GoogleCast] Session Starting');
    //                 handlePause();
    //                 setIsCastConnecting(true);
    //             };

    //         GoogleCast.EventEmitter.addListener(GoogleCast.SESSION_STARTED, async () => {
    //             console.debug('[GoogleCast] Session Started');
    //             dispatch({
    //                 type: 'SESSION_STARTED',
    //             });
    //             await GoogleCast.initChannel(channel_namespace).catch(e =>
    //                 console.log('INIT CHANNEL ERROR OCCURRED', e),
    //             );
    //         });

    //         GoogleCast.EventEmitter.addListener(GoogleCast.SESSION_START_FAILED, () => {
    //             console.debug('[GoogleCast] session failed');
    //         });

    //         GoogleCast.EventEmitter.addListener(GoogleCast.CHANNEL_CONNECTED, async ({ channel }) => {
    //             console.debug('[GoogleCast] custom channel connected', channel);
    //             if (!isCastConnecting) {
    //                 console.debug('[GoogleCast] we are resuming a session, do not loadMedia', channel);
    //                 return;
    //             }

    //             setIsCastConnecting(false);
    //             try {
    //                 const { id } = await GoogleCast.getCastDevice();
    //                 const castMessage = {
    //                     messageName: 'userContext',
    //                     messageType: 'info',
    //                     messageOrigin: 'sender',
    //                     message: {
    //                         userAuthToken: xAuthToken,
    //                         platformClient: {
    //                             id: DeviceInfo.getUniqueId(),
    //                             name: Platform.OS === 'ios' ? 'iosmobile' : 'androidmobile',
    //                         },
    //                         proxyPlatformClient: {
    //                             name: 'chromecast',
    //                             id: id,
    //                         },
    //                     },
    //                 };
    //                 sendMessage(channel_namespace, JSON.stringify(castMessage));
    //                 loadMedia();
    //             } catch (e) {
    //                 console.error('[GoogleCast] Error sending message to receiver ', e);

    //                 showCastError();
    //             }
    //         });

    //         GoogleCast.EventEmitter.addListener(GoogleCast.CHANNEL_DISCONNECTED, ({ channel }) => {
    //             console.debug('[GoogleCast] custom channel disconnected', channel);
    //         });

    //         GoogleCast.EventEmitter.addListener(GoogleCast.CHANNEL_MESSAGE_RECEIVED, ({ channel, message }) => {
    //             console.debug('[GoogleCast] custom channel message received', channel, message);
    //             try {
    //                 const messageJSON = JSON.parse(message);
    //                 // TODO: unable to parse the message from receiver, this might have to updated on the receiver
    //                 // see here: https://issuetracker.google.com/issues/117136854#comment7
    //                 if (messageJSON.includes('messageType":"error"')) {
    //                     console.debug('[GoogleCast] message error ', messageJSON.messageType);
    //                     showCastError();
    //                 }
    //             } catch (e) {
    //                 console.error('[GoogleCast] Error parsing message from receiver', e);
    //             }
    //         });

    //         GoogleCast.EventEmitter.addListener(GoogleCast.MEDIA_STATUS_UPDATED, ({ mediaStatus }) => {
    //             console.debug('[GoogleCast] media status updated', mediaStatus);
    //             if (mediaStatus.playerState) {
    //                 const playerState = castPlayerStateAdaptor(mediaStatus.playerState);
    //                 setCastPlayerState(playerState);
    //             }
    //         });

    //         GoogleCast.EventEmitter.addListener(GoogleCast.MEDIA_PLAYBACK_STARTED, ({ mediaStatus }) => {
    //             console.debug('[GoogleCast] media playback started', mediaStatus);
    //         });

    //         GoogleCast.EventEmitter.addListener(GoogleCast.MEDIA_PLAYBACK_ENDED, ({ mediaStatus }) => {
    //             console.debug('[GoogleCast] media playback ended', mediaStatus);
    //         });

    //         GoogleCast.EventEmitter.addListener(GoogleCast.MEDIA_PROGRESS_UPDATED, ({ mediaProgress }) => {
    //             console.debug('[GoogleCast] MEDIA_PROGRESS_UPDATED', mediaProgress);
    //             setCastContentProgress(mediaProgress.progress);
    //             setCastContentDuration(mediaProgress.duration);
    //         });

    //         const sendMessage = async (namespace: string, castMessage: string): Promise<void> => {
    //             await GoogleCast.sendMessage(namespace, castMessage).catch(e => console.log('SEND MESSAGE FAILED', e));
    //         };

    //         return () => {
    //             GoogleCast.EventEmitter.removeAllListeners(GoogleCast.SESSION_STARTING);
    //             GoogleCast.EventEmitter.removeAllListeners(GoogleCast.SESSION_STARTED);
    //             GoogleCast.EventEmitter.removeAllListeners(GoogleCast.SESSION_START_FAILED);
    //             GoogleCast.EventEmitter.removeAllListeners(GoogleCast.CHANNEL_CONNECTED);
    //             GoogleCast.EventEmitter.removeAllListeners(GoogleCast.CHANNEL_DISCONNECTED);
    //             GoogleCast.EventEmitter.removeAllListeners(GoogleCast.CHANNEL_MESSAGE_RECEIVED);
    //             GoogleCast.EventEmitter.removeAllListeners(GoogleCast.MEDIA_STATUS_UPDATED);
    //             GoogleCast.EventEmitter.removeAllListeners(GoogleCast.MEDIA_PLAYBACK_STARTED);
    //             GoogleCast.EventEmitter.removeAllListeners(GoogleCast.MEDIA_PLAYBACK_ENDED);
    //             GoogleCast.EventEmitter.removeAllListeners(GoogleCast.MEDIA_PROGRESS_UPDATED);
    //         };
    //     }

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [state.playbackState, player, castPlayerState]);

    let castLabel = '';
    if (isCastSessionActive && device && device.name && !Platform.isTV) {
        castLabel = strings.formatString(strings['playback.cast_lbl'], device.name) as string;
    } else if (state.isAirplayConnected) {
        castLabel = strings['playback.airplay_lbl'];
    }
    const isDownloadedContentPlayback = playerConfig.deliveryType === 'DOWNLOAD' ? true : false;

    useSetDownloadBookmarks(resource && resource.id, state.currentPosition);

    return (
        <>
            {!Platform.isTV && Platform.OS == 'ios' && <PrefersHomeIndicatorAutoHidden />}
            <View style={playerViewStyles.rootContainer}>
                <View
                    style={[
                        playerViewStyles.playbackContainer,
                        {
                            width: '100%',
                            aspectRatio:
                                screen_height >= screen_width ? AspectRatio._16by9 : screen_width / screen_height,
                        },
                    ]}>
                    <QpNxgPlaybackView
                        style={[playerViewStyles.videoContainer, { width: '100%', height: '100%' }]}
                        playerID={state.playerID}
                    />
                    {(isCastSessionActive || state.isAirplayConnected) && (
                        <View
                            style={[
                                playerViewStyles.videoContainer,
                                { width: '100%', height: '100%', backgroundColor: 'black' },
                            ]}
                        />
                    )}
                    {player && !disableControls && !Platform.isTV && (
                        <PlayerControlsView
                            ref={playerControlsRef}
                            contentTitle={props.resource ? props.resource.name : ''}
                            currentTime={currentPosition}
                            castLabel={castLabel}
                            isCasting={isCastSessionActive || state.isAirplayConnected}
                            isDownloadedContentPlayback={isDownloadedContentPlayback}
                            castType={
                                isCastSessionActive ? 'Chromecast' : state.isAirplayConnected ? 'Airplay' : undefined
                            }
                            playbackDuration={playbackDuration}
                            isLoading={isLoading}
                            playbackState={playbackState}
                            showOnStart={false}
                            resource={props.resource}
                            showCastIcon={true}
                            onSlidingComplete={value => onSlidingComplete(value)}
                            onBackPress={props.onPlayerClose}
                            onPause={() => handlePause()}
                            onPlay={() => handlePlayback()}
                            onStop={() => handleStop()}
                            onRewindPress={() => handleRewindForward(-15000)}
                            onForwardPress={() => handleRewindForward(15000)}
                            captionOptions={captionsOptions}
                            audioOptions={audioOptions}
                            activeTextTrack={activeTextTrack}
                            activeAudioTrack={activeAudioTrack}
                            onAudioOptionSelected={handleAudioTrackSelection}
                            onTextOptionSelected={handleTextTrackSelection}
                            handleVolumeToggle={handleVolumeToggle}
                        />
                    )}

                    {player && !disableControls && Platform.isTV && (
                        <PlayerControlsTV
                            currentTime={state.currentPosition}
                            playbackDuration={state.duration}
                            isLoading={isLoading}
                            isLive={playerConfig.contentType !== 'VOD'}
                            //showOnlyCaptionsControl={props.showOnlyCaptionsControl}
                            showOnStart={false}
                            //onBack={() => props.onBackPress()}
                            disableRewind={false}
                            disableForward={false} //playerConfig.contentType !== 'VOD'}
                            disableRestart={true}
                            disableLookback={true}
                            disableFullscreen={Platform.isTV}
                            disableBack={false}
                            onSlidingComplete={value => onSlidingComplete(value)}
                            onBackPress={props.onPlayerClose}
                            onEnterFullscreen={props.onEnterFullScreen}
                            onExitFullscreen={props.onExitFullScreen}
                            onPause={() => handlePause()}
                            onPlay={() => handlePlayback()}
                            onRewindPress={() => handleRewindForward(-15000)}
                            onForwardPress={() => handleRewindForward(15000)}
                            onSettingsPress={() => handleSettingsPress()}
                            onRestartPress={() => handleRestart()}
                            onLookbackPress={() => handleLookback()}
                            onToggleSubtitleTrack={selected => console.log(`${JSON.stringify(selected)}`)}
                            resource={props.resource}
                            captionOptions={captionsOptions}
                            audioOptions={audioOptions}
                            onAudioOptionSelected={handleAudioTrackSelection}
                            onTextOptionSelected={handleTextTrackSelection}
                        />
                    )}
                    {Platform.OS === 'ios' && isLoading && (
                        <AppLoadingIndicator
                            style={playerViewStyles.loaderContainer}
                            isClearable={player ? false : true}
                        />
                    )}
                    {isCastConnecting && (
                        <View style={[playerViewStyles.videoContainer, playerViewStyles.connectionContainer]}>
                            <AppLoadingIndicator />
                            <Text style={playerViewStyles.castRoomLabel}>{strings['playback.cast_connecting']}</Text>
                        </View>
                    )}
                </View>
            </View>
            {showSettings && !disableControls && !Platform.isTV && (
                <PlayerCaptionsView
                    playerScreenStyles={props.playerScreenStyles}
                    showSettings={showSettings}
                    setShowSettings={setShowSettings}
                    setDisableControls={setDisableControls}
                    showPlaybackQuality={false}
                    captionOptions={captionsOptions}
                    audioOptions={audioOptions}
                    onAudioOptionSelected={handleAudioTrackSelection}
                    onTextOptionSelected={handleTextTrackSelection}
                    setshowDescription={props.setshowDescription}
                />
            )}
            {resource && !Platform.isTV ? (
                <UpNextOverlay
                    resource={resource}
                    onUpNextSelected={onUpNextSelected}
                    onOverlayClose={onOverlayClose}
                    ref={upNextOverlayRef}
                />
            ) : (
                <UpNextTV
                    resource={resource}
                    ref={upNextOverlayTVRef}
                    onUpNextSelected={onUpNextSelected}
                    onOverlayClose={onOverlayClose}
                />
            )}
        </>
    );
};

export const playerViewStyles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        height: dimensions.fullHeight,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,1)',
    },
    playbackContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    videoContainer: {
        overflow: 'hidden',
        position: 'absolute',
        aspectRatio: AspectRatio._16by9,
    },
    loaderContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    connectionContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    castRoomLabel: {
        color: 'white',
        fontFamily: appFonts.medium,
        fontSize: appFonts.md,
        marginVertical: 10,
    },
});
