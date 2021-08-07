import React, { useEffect, useState, useRef, Dispatch, SetStateAction } from 'react';
import { View, Dimensions, StyleSheet, Platform } from 'react-native';
import PrefersHomeIndicatorAutoHidden from 'react-native-home-indicator';

import { dimensions, AspectRatio } from 'qp-common-ui';
import {
    QpNxgPlaybackView,
    PlatformError,
    PlayerConfig,
    PlayingInfo,
    PlayerPreference,
    TextStyles,
} from 'rn-qp-nxg-player';
import {
    PlayerActions,
    usePlayerState,
    PlayerControlsView,
    CaptionsStyle,
    PlayerControlsTV,
    PlayerCaptionsView,
} from 'qp-playercontroller-ui';
import { Category, ResourceVm } from 'qp-discovery-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';
import UpNextOverlay, { UpNextOverlayActions } from 'screens/components/UpNextOverlay';
import {
    filterAndMapActiveVariantsToCode,
    filterAndMapVariantsToCode,
    FORWORD_BACKWORD_TIME,
} from 'features/player/utils/player-utils';
import { useCellularPlaybackWarning } from '../../hooks/useCellularPlaybackWarning';
import { getStreamQuality, setStreamQuality, StreamQuality } from 'utils/UserPreferenceUtils';
import { PlayerProps } from '../../hooks/usePlayerConfig';
import { useShowUpNext } from '../../hooks/useShowUpNext';
import { useHistoryCreate } from '../../hooks/useHistoryCreate';
import { usePauseCreditsTimer } from '../../hooks/usePauseCreditsTimer';
import { usePlayerAnalytics } from '../../hooks/usePlayerAnalytics';
import { RenderEpisodesList } from '../organism/RenderEpisodesList';
import { platformPlayerStyles } from './style';
import { appFonts } from 'core/styles/AppStyles';

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

export const PlatformPlayer = (props: PlatformPlayerProps): JSX.Element => {
    const { playerConfig, resource } = props;
    const upNextOverlayRef = useRef<UpNextOverlayActions>(null);
    const { appConfig } = useAppPreferencesState();
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [disableControls, setDisableControls] = useState<boolean>(false);
    const [playerPrefs, setPlayerPrefs] = useState<PlayerPreference | undefined>(undefined);
    const [showEpisodes, setShowEpisodes] = useState<boolean>(false);
    const [hideEpisodesList, setHideEpisodeList] = useState<boolean>(false);

    const { player, state, reset } = usePlayerState({
        // platformAsset: platformAsset,
        // bookmarkConfig,
        // streamConcurrencyConfig,
        playerConfig,
        onError: props.onError,
        playerPreference: playerPrefs,
    });
    let seriesId: string | undefined;
    if (resource) {
        if (resource.type === Category.TVSeries) {
            seriesId = resource.id;
        } else if (resource.seriesId) {
            seriesId = resource.seriesId;
        }
    }
    let captionsOptions: TrackInfo[] = filterAndMapVariantsToCode(state.tracks, 'TEXT');
    let audioOptions: TrackInfo[] = filterAndMapVariantsToCode(state.tracks, 'AUDIO');
    let activeTextTrack: string | undefined = filterAndMapActiveVariantsToCode(state.selectedTracks, 'TEXT');
    let activeAudioTrack: string | undefined = filterAndMapActiveVariantsToCode(state.selectedTracks, 'AUDIO');
    const isCastSessionActive = false;

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
        if (state.playbackState === 'STARTED' && isCastSessionActive && player) {
            console.debug('[GoogleCast] [Connect & Play] handler');
            player.pause();
        }
    }, [state.playbackState, isCastSessionActive, player]);

    const playbackState = state.playbackState;
    const currentPosition = state.currentPosition;
    const playbackDuration = state.duration;

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
        if (isCastSessionActive) {
            console.log('####### googlecast handlePause #######');
            // GoogleCast.pause();
        } else if (player) {
            player.pause();
        }
    }

    function handleStop(): void {
        console.log('####### handleStop #######');
        if (player) {
            player.stop();
        }
    }

    function handleTextTrackSelection(name: string, languageCode: string, textStyles?: TextStyles) {
        console.log(`handleTextTrackSelection: ${name}`);
        const trackName: string | undefined = name === 'Off' ? '' : name;
        const trackLanguageCode: string | undefined = name === 'Off' ? '' : languageCode;
        if (player) {
            player.setPreferredTrackVariant('TEXT', {
                languageCode: trackLanguageCode,
                displayName: trackName,
                mimeType: '',
                type: 'TEXT',
            });

            if (textStyles && trackName && trackLanguageCode) {
                player.setSubtitleTextStyle(textStyles);
            }
        }
    }

    function handleVideoSelectionSelection(selectedVideoQuality: StreamQuality) {
        setStreamQuality(selectedVideoQuality);
        if (player) {
            const preferredStreamQualityKey = `preferredPeakBitRate_${selectedVideoQuality}`;
            let preferredPeakBitRate = 0;
            if (appConfig) {
                preferredPeakBitRate = (appConfig as any)[preferredStreamQualityKey] || 0;
            }
            player.setQualitySelection({
                qualitySelectionBitRate: preferredPeakBitRate,
                qualitySelectionType: 'VIDEO',
            });
        }
    }

    function handleEpisodeCloseIconPress() {
        setHideEpisodeList(true);
    }

    function handleFitToScreen(fitToScreen: boolean) {
        if (player) {
            player.setVideoAspect(fitToScreen ? 'resizeAspectFill' : 'resizeAspect');
        }
    }

    function handleAudioTrackSelection(name: string, languageCode: string) {
        console.log(`handleAudioTrackSelection: ${name}`);
        const trackName: string | undefined = name === 'Off' ? undefined : name;
        const trackLanguageCode: string | undefined = name === 'Off' ? undefined : languageCode;
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
        if (player) {
            player.play();
        }
    }

    function handleEpisodeSelection(isShowEpisodes: boolean): void {
        setShowEpisodes(isShowEpisodes);
        if (hideEpisodesList) {
            setHideEpisodeList(!isShowEpisodes);
        }
    }

    function handleRewindForward(value: number): void {
        console.log('Going to Seek up to  ' + value);
        if (player) {
            if (Platform.isTV) {
                player.seek(state.currentPosition + value * 10000);
            } else {
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

    // function handleVolumeToggle(value: number): void {
    //     if (isCastSessionActive) {
    //         //  GoogleCast.setVolume(value);
    //     }
    // }

    const onSlidingComplete = (value: any): void => {
        if (player) {
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

    isLoading =
        player === null ||
        state.playbackState === 'LOADING' ||
        state.playbackState === 'IDLE' ||
        state.bufferingState === 'ACTIVE' ||
        state.seekingState === 'ACTIVE';

    if (player && state.isAirplayConnected && props.resource) {
        const playingInfo: PlayingInfo = {
            title: props.resource.name,
            playbackDuration: state.duration,
            playbackProgress: state.currentPosition,
            assetUrl: props.resource.contentUrl,
            defaultPlaybackRate: 1.0,
            mediaType: props.resource.type,
        };
        player.setNowPlayingInfo(playingInfo);
    }

    const screen_height = Dimensions.get('window').height;
    const screen_width = Dimensions.get('window').width;
    //  const config = useConfig();
    // const resizerEndpoint = (config && config.imageResizeURL) || undefined;
    // const resizerPath = 'image' || undefined;
    // const styles = StyleSheet.create({
    //     posterImageStyle: { width: 200 },
    // });

    // const posterImageURI = imageResizerUri(
    //     resizerEndpoint || '',
    //     resizerPath,
    //     props.resource ? props.resource.id : '',
    //     AspectRatio._16by9,
    //     ImageType.Poster,
    //     styles.posterImageStyle.width,
    // );

    useEffect(() => {
        if (!upNextOverlayRef.current) {
            return;
        }

        if (showUpNextOverlay) {
            upNextOverlayRef.current.show();
        } else {
            upNextOverlayRef.current.hide();
        }
    }, [showUpNextOverlay]);

    let castLabel = '';

    const isDownloadedContentPlayback = playerConfig.deliveryType === 'DOWNLOAD' ? true : false;

    return (
        <>
            <PrefersHomeIndicatorAutoHidden />
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
                            contentTitle={props.resource ? props.resource.name : ''}
                            currentTime={currentPosition}
                            castLabel={castLabel}
                            isCasting={isCastSessionActive || state.isAirplayConnected}
                            isLive={playerConfig.contentType === 'LIVE'}
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
                            onRewindPress={() => handleRewindForward(-FORWORD_BACKWORD_TIME)}
                            onForwardPress={() => handleRewindForward(FORWORD_BACKWORD_TIME)}
                            captionOptions={captionsOptions}
                            audioOptions={audioOptions}
                            activeTextTrack={activeTextTrack}
                            activeAudioTrack={activeAudioTrack}
                            onAudioOptionSelected={handleAudioTrackSelection}
                            onTextOptionSelected={handleTextTrackSelection}
                            onVideoQualitySelected={handleVideoSelectionSelection}
                            onFitToScreen={handleFitToScreen}
                            onEpisodeSelection={handleEpisodeSelection}
                            hideEpisodesList={hideEpisodesList}
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
                            disableRewind={true}
                            disableForward={true} //playerConfig.contentType !== 'VOD'}
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
                            onRewindPress={value => handleRewindForward(value)}
                            onForwardPress={value => handleRewindForward(value)}
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
                    {showEpisodes && resource && seriesId && (
                        <View style={platformPlayerStyles.episodeListSection}>
                            <RenderEpisodesList
                                episodeResource={resource as ResourceVm}
                                seriesId={seriesId as string}
                                onCloseIconPress={() => {
                                    handleEpisodeCloseIconPress();
                                }}
                            />
                        </View>
                    )}
                    {isLoading && <AppLoadingIndicator style={playerViewStyles.loaderContainer} />}
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
            {resource && (
                <UpNextOverlay resource={resource} onUpNextSelected={onUpNextSelected} ref={upNextOverlayRef} />
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
