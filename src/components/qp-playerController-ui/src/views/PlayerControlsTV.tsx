import React, { useState, useEffect, useRef, useReducer } from 'react';
import {
    StyleSheet,
    TouchableHighlight,
    View,
    Text,
    ScrollView,
    Platform,
    BackHandler,
    Animated,
    TVEventHandler,
    ActivityIndicator,
    Image,
    Dimensions,
} from 'react-native';
import { padding, defaultFont, colors, fonts, percentage, typography } from 'qp-common-ui';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import { visualizeVideoDuration } from '../utils/utils';
import { debounce } from 'lodash';
import { ResourceVm, ResourceMetaInfoView } from 'qp-discovery-ui';
import { TrackInfo } from 'features/player/presentation/components/template/PlatformPlayer';
import { TextStyles } from 'rn-qp-nxg-player';

export interface PlayControllerTVProps {
    currentTime?: number;
    playbackDuration?: number;
    isLoading?: boolean;
    isLive?: boolean;
    showOnStart?: boolean;
    disableBack?: boolean;
    disableFullscreen?: boolean;
    toggleResizeModeOnFullscreen?: boolean;
    disableRewind?: boolean;
    disableForward?: boolean;
    disableRestart?: boolean;
    disableLookback?: boolean;
    disablePlayPause?: boolean;
    disableDuration?: boolean;
    contentTitle?: string;
    controlTimeout?: number;
    resource?: ResourceVm | null;
    captionOptions: TrackInfo[];
    audioOptions: TrackInfo[];
    onEnterFullscreen?: () => void;
    onExitFullscreen?: () => void;
    onBackPress?: () => void;
    onPause?: () => void;
    onPlay?: () => void;
    onSettingsPress?: () => void;
    onRewindPress?: (value: number) => void;
    onForwardPress?: (value: number) => void;
    onRestartPress?: () => void;
    onLookbackPress?: () => void;
    onToggleSubtitleTrack?: (selected: boolean) => void;
    onRewindForward?: (value: number) => void;
    onSlidingComplete?: (value: number) => void;
    onAudioOptionSelected: (option: string, languageCode: string) => void;
    onTextOptionSelected: (option: string, languageCode: string, textStyles?: TextStyles) => void;
}

/**
 * Component to render caption settings page
 */
export const PlayerControlsTV = (props: PlayControllerTVProps): JSX.Element => {
    const _playPauseButtonRef = useRef<TouchableHighlight>(null);
    const _playbackViewContainerRef = useRef<TouchableHighlight>(null);
    const [captionSelected, setCaptionSelected] = useState(false);

    const OPT_SUBTITLES = 'SUBTITLES';
    const OPT_AUDIO = 'AUDIO';
    const selectionColor = colors.secondary;
    const isAndroidTV = Platform.OS === 'android' && Platform.isTV;
    const controlUnderlayColor = 'rgba(256, 256, 256, 0.8)';

    const resource: ResourceVm | null | undefined = props.resource ? props.resource : null;

    const controlReducer = (state: any, action: any): any => {
        switch (action.name) {
            case 'showControls':
                return { ...state, showControls: action.value };
            case 'animations':
                return { ...state, animations: action.value };
            case 'updateState':
                return { ...state, animations: action.value };
            case 'captionControls':
                return { ...state, showCaptions: action.value };
        }
    };

    /**
     * Various animations
     */
    const initialValue = props.showOnStart ? 1 : 0;

    const animations = {
        bottomControl: {
            marginBottom: new Animated.Value(0),
            opacity: new Animated.Value(initialValue),
        },
        topControl: {
            marginTop: new Animated.Value(0),
            opacity: new Animated.Value(initialValue),
        },
        centerControl: {
            marginTop: new Animated.Value(0),
            opacity: new Animated.Value(initialValue),
        },
        rewindControl: {
            opacity: new Animated.Value(initialValue),
        },
        forwardControl: {
            opacity: new Animated.Value(initialValue),
        },
        video: {
            opacity: new Animated.Value(1),
        },
        loader: {
            rotate: new Animated.Value(0),
            MAX_VALUE: 360,
        },
    };

    const initialState = {
        // paused: props.paused,
        isLoading: props.isLoading,
        currentTime: props.currentTime,
        duration: props.playbackDuration,
        // progress: props.playbackProgress,
        lastScreenPress: 0,
        isFullScreen: false,
        paused: false,
        showControls: props.showOnStart,
        animations: animations,
        showCaptions: false,
    };

    /**
     * Loading indicator
     */
    const _setLoadingView = (): JSX.Element => {
        return <ActivityIndicator size="large" color="white" style={styles.loader.container} />;
    };

    /**
     * Function to handle rewind/forward button press
     */
    const handleRewindForwardEvent = (count: number, eventType: string) => {
        let speedFactor = _getPlaybackSpeed(count, eventType);
        keyPressedCount = 0;
        switch (eventType) {
            case 'fastForward':
                methods.toggleForward(speedFactor);
                mPlaybackSpeed = 1;
                break;
            case 'rewind':
                methods.toggleRewind(speedFactor);
                mPlaybackSpeed = 1;
                break;
        }
    };

    /**
     * Handling remote keypress in android tv
     */
    useEffect(() => {
        let _tvEventHandler: TVEventHandler;
        if (isAndroidTV) {
            const debounceKeyEventHandler = debounce(handleRewindForwardEvent, 500);
            _tvEventHandler = new TVEventHandler();

            _tvEventHandler.enable(_playbackViewContainerRef.current, function(_, evt: any) {
                if (evt.eventKeyAction === 0) {
                    return;
                }
                switch (evt.eventType) {
                    case 'fastForward':
                        _showForwardLookBackControl();
                        keyPressedCount++;
                        if (!props.disableForward) {
                            debounceKeyEventHandler(keyPressedCount, 'fastForward');
                        }
                        break;
                    case 'rewind':
                        _showRewindRestartControl();
                        keyPressedCount++;
                        if (!props.disableRewind) {
                            debounceKeyEventHandler(keyPressedCount, 'rewind');
                        }
                        break;
                    case 'playPause':
                        methods.toggleControls();
                        methods.togglePlayPause();
                        break;
                }
            });
        }

        return () => {
            if (_tvEventHandler) {
                _tvEventHandler.disable();
                _tvEventHandler = undefined;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [state, setState] = useReducer(controlReducer, initialState);
    let hideAnimationTimeoutId = useRef<number | undefined>();
    let keyPressedCount = 0;
    let mPlaybackSpeed: number = 1;

    /**
     * We have handled the back button press
     */
    useEffect(() => {
        const handleBackButtonPressAndroid = () => {
            if (state.showControls) {
                hideControlAnimation(0);
                return true; // Return `true` to prevent react-navigation from handling it
            } else {
                return false;
            }
        };

        if (isAndroidTV) {
            BackHandler.addEventListener('hardwareBackPress', handleBackButtonPressAndroid);
        }

        return () => {
            if (isAndroidTV) {
                BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPressAndroid);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.showControls, isAndroidTV]);

    /**
     * Standard render control function that handles
     * everything except the sliders. Adds a
     * consistent <TouchableHighlight>
     * wrapper and styling.
     */
    const renderControl = (accessibilityLabel: string, children: any, callback: any, style = {}): JSX.Element => {
        return (
            <TouchableHighlight
                accessibilityLabel={accessibilityLabel}
                underlayColor={controlUnderlayColor}
                activeOpacity={1}
                onFocus={() => {
                    hideControlAnimation(playerProps.controlTimeoutDelay);
                }}
                onPress={() => {
                    if (callback) {
                        hideControlAnimation(playerProps.controlTimeoutDelay);
                        callback();
                    }
                }}
                style={[styles.playerControls.control, style]}>
                {children}
            </TouchableHighlight>
        );
    };

    /**
     * Renders an empty control, used to disable a control without breaking the view layout.
     */
    const renderNullControl = () => {
        return <View style={[styles.playerControls.control]} />;
    };

    /**
     * Renders back button
     */
    const renderBack = (): JSX.Element => {
        return renderControl(
            'Backbutton',
            <MaterialCommunityIcons color={colors.primary} size={40} name={'chevron-left'} />,
            methods.toggleBack,
            styles.playerControls.backIcon,
        );
    };

    /**
     * Render fullscreen toggle and set icon based on the fullscreen state.
     */
    const renderFullscreen = () => {
        let source =
            state.isFullscreen === true ? (
                <MaterialCommunityIcons color={colors.primary} size={30} name={'arrow-collapse'} />
            ) : (
                <MaterialCommunityIcons color={colors.primary} size={30} name={'arrow-expand'} />
            );
        return renderControl('FullScreen', source, methods.toggleFullscreen, styles.playerControls.fullScreenIcon);
    };

    /**
     * Render Top controls with back and fullscreen buttons
     */
    const renderTopControls = (): JSX.Element => {
        const backControl = props.disableBack ? renderNullControl() : renderBack();
        const fullscreenControl = props.disableFullscreen ? renderNullControl() : renderFullscreen();
        return (
            <Animated.View
                style={[
                    styles.container.topControls,
                    {
                        opacity: state.animations.topControl.opacity,
                        marginTop: state.animations.topControl.marginTop,
                    },
                ]}>
                {backControl}
                {fullscreenControl}
            </Animated.View>
        );
    };

    /**
     * Button to rewind vod playback
     */
    const renderRewindButton = () => {
        let source = require('../assets/ic_mat_rewind.png');
        return renderControl(
            'RewindButton',
            <Image source={source} style={styles.playerControls.iconStyle} />,
            methods.toggleRewind,
            // styles.controls.iconDirection
            styles.playerControls.buttonContainer,
        );
    };

    /**
     * Button to forward vod playback
     */
    const renderForwardButton = () => {
        let source = require('../assets/ic_mat_foreward.png');
        return renderControl(
            'ForwardButton',
            <Image source={source} style={styles.playerControls.iconStyle} />,
            methods.toggleForward,
            styles.playerControls.buttonContainer,
        );
    };

    /**
     * Button to restart live playback
     */

    const renderRestartButton = () => {
        let source = require('../assets/ic_restart.png');
        return renderControl(
            'RestartButton',
            <Image source={source} style={styles.playerControls.iconStyle} />,
            methods.toggleRestart,
            styles.playerControls.buttonContainer,
        );
    };

    /**
     * Button to lookback live playback by few seconds
     */
    const renderLookbackButton = () => {
        let source = require('../assets/ic_lookback.png');
        return renderControl(
            'LookbackButton',
            <Image source={source} style={styles.playerControls.iconStyle} />,
            methods.toggleLookback,
            styles.playerControls.buttonContainer,
        );
    };

    /**
     * Render More settings button
     */
    const renderMoreSettingsButton = () => {
        return (
            <TouchableHighlight
                onPress={() => {
                    methods.toggleSettings();
                }}
                underlayColor={controlUnderlayColor}
                style={styles.playerControls.moreButton}>
                <>
                    <MaterialCommunityIcons color={colors.primary} size={30} name={'dots-horizontal'} />
                </>
            </TouchableHighlight>
        );
    };
    /**
     * Title container to display movie name and more settings button
     */
    const renderTitleContainer = (resource: ResourceVm) => {
        const contentTitle = resource.name;
        const isEpisode = resource.type === 'tvepisode';
        const contentSeason = resource.seasonNumber;
        const contentEpisode = resource.episodeNumber;
        return (
            <View style={styles.title.root}>
                <View style={styles.title.metadata}>
                    {!state.showCaptions && (
                        <View style={styles.title.metadataHeading}>
                            <Text numberOfLines={1} style={styles.title.metadataHeadingText}>
                                {contentTitle}
                            </Text>
                        </View>
                    )}
                    {!state.showCaptions && isEpisode && (
                        <View style={styles.title.metadataSubheading}>
                            <Text
                                numberOfLines={1}
                                style={
                                    styles.title.metadataSubheadingText
                                }>{`Season ${contentSeason} Episode ${contentEpisode}`}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.playerControls.moreContainer}>{renderMoreSettingsButton()}</View>
            </View>
        );
    };
    /**
     * Total playback duration of the content
     */
    // const renderDuration = (): JSX.Element => {
    //     const duration = props.isLive ? 'LIVE' : visualizeVideoDuration(props.playbackDuration!);

    //     return (
    //         <View style={[styles.playerControls.control, styles.playerControls.timer]}>
    //             <Text style={styles.playerControls.timerText}>{duration}</Text>
    //         </View>
    //     );
    // };

    /**
     * Current playback progress
     */
    const renderProgress = (): JSX.Element => {
        const duration = props.isLive ? 'LIVE' : visualizeVideoDuration(props.currentTime!);
        return <Text style={styles.playerControls.timerText}>{duration}</Text>;
    };

    /**
     * Render seekbar controller
     */
    const renderSeekBar = (): JSX.Element => {
        //const durationControl = props.disableDuration ? (renderNullControl()) : (renderDuration());
        return (
            <View style={styles.playerControls.seekbarContainer}>
                <View style={[styles.playerControls.sliderContainer]}>
                    {/* {props.disableDuration ? renderNullControl() : renderProgress()} */}
                    <Slider
                        maximumValue={props.isLive ? 1 : props.playbackDuration}
                        minimumValue={0}
                        step={1}
                        value={props.currentTime}
                        style={styles.playerControls.slider}
                        onValueChange={(value: number) => {
                            hideControlAnimation(playerProps.controlTimeoutDelay);
                            if (props.onSlidingComplete) {
                                props.onSlidingComplete(value);
                            }
                        }}
                        thumbTintColor="white"
                        minimumTrackTintColor={colors.brandTint}
                        // maximumTrackTintColor={colors.inActiveTintColor}
                    />
                </View>
                <View style={styles.playerControls.timerContainer}>{renderProgress()}</View>
            </View>
        );
    };

    /**
     * Trickplay buttons like Play/pause, rw & fw
     */
    const trickPlayControls = () => {
        const playPauseControl = props.disablePlayPause ? renderNullControl() : renderPlayPauseButton();
        //const rewindControl = props.disableRewind ? renderNullControl() : renderRewindButton();
        //const forwardControl = props.disableForward ? renderNullControl() : renderForwardButton();
        const rewindRestartControl = props.disableRewind
            ? props.disableRestart
                ? renderNullControl()
                : renderRestartButton()
            : renderRewindButton();

        const forwardLookbackControl = props.disableForward
            ? props.disableLookback
                ? renderNullControl()
                : renderLookbackButton()
            : renderForwardButton();

        return (
            <View style={styles.trickplay.root}>
                <View style={styles.trickplay.trickPlayControls}>
                    {playPauseControl}
                    {rewindRestartControl}
                    {forwardLookbackControl}
                </View>
            </View>
        );
    };

    /**
     * Bottom controls container
     */
    const renderBottomControls = (): JSX.Element => {
        const titleControl = resource && renderTitleContainer(resource);
        const seekBarControl = renderSeekBar();
        const trickplayControls = trickPlayControls();
        return (
            <Animated.View
                style={[
                    styles.container.bottomControls,
                    {
                        opacity: state.animations.bottomControl.opacity,
                        marginTop: state.animations.bottomControl.marginBottom,
                    },
                ]}>
                {titleControl}
                {seekBarControl}
                {trickplayControls}
            </Animated.View>
        );
    };
    /**
     * Content description
     */
    const resourceInfo = (resource: ResourceVm): JSX.Element => {
        return (
            <View style={[styles.metadata.textWrapperStyle]}>
                <View style={styles.metadata.infoContainerStyle}>
                    <View style={styles.metadata.titleContainerStyle}>
                        <Text style={[styles.metadata.titleStyle]}>{resource.name}</Text>
                    </View>
                </View>
                <View style={[styles.metadata.metaInfo]}>
                    <ResourceMetaInfoView
                        resource={resource}
                        defaultImageAspectRatio={''}
                        infoViewStyle={styles.metadata}
                        onResourcePlayPress={() => {}}
                    />
                </View>
                <Text style={[styles.metadata.infoTextStyle]}>
                    {resource.shortDescription ? resource.shortDescription : resource.longDescription}
                </Text>
            </View>
        );
    };

    /**
     * Create description container on pressing more
     */
    const descriptionContainer = (): JSX.Element => {
        return <View style={styles.metadata.root}>{resource && resourceInfo(resource)}</View>;
    };

    /**
     * Renders list of available audio tracks
     */
    const renderLanguageContainer = (): JSX.Element => {
        return (
            <View style={styles.caption.languageContainer}>
                <Text style={styles.caption.headingText}>{OPT_AUDIO}</Text>
                <ScrollView style={styles.caption.scrollview}>{renderButton(false, props.audioOptions)}</ScrollView>
            </View>
        );
    };

    /**
     * Renders list of available text tracks
     */
    const renderSubtitleContainer = (): JSX.Element => {
        props.captionOptions[0] !== 'OFF' && props.captionOptions.splice(0, 0, 'OFF');
        return (
            <View style={styles.caption.subtitleContainer}>
                <Text style={styles.caption.headingText}>{OPT_SUBTITLES}</Text>
                <ScrollView style={styles.caption.scrollview}>{renderButton(true, props.captionOptions)}</ScrollView>
            </View>
        );
    };

    /**
     * Button to display for the available set of subtitles and audio
     */
    const renderButton = (isSubtitle: boolean, captionOptions: string[], isActive = false): JSX.Element[] => {
        return captionOptions.map(displayText => (
            <TouchableHighlight
                underlayColor={isAndroidTV ? selectionColor : ''}
                activeOpacity={0.5}
                style={[isActive ? styles.caption.selectedButton : styles.caption.unselectedButton]}
                onPress={() => {
                    handleSelectedTrack(isSubtitle, displayText);
                }}>
                <View style={[styles.caption.buttonTextContainer]}>
                    {isActive && (
                        <MaterialCommunityIcons
                            //containerStyle={playerCaptionStyles.tickStyle}
                            //type="material"
                            color={colors.primary}
                            size={20}
                            name={'done'}
                        />
                    )}
                    <Text style={styles.caption.buttonText}>{displayText}</Text>
                </View>
            </TouchableHighlight>
        ));
    };

    /**
     * Function to enable the selected track
     * @param isSubtitle Param to identify if the passed value is subtitle
     * @param trackName Name of the selected track
     */
    const handleSelectedTrack = (isSubtitle: boolean, trackName: string): void => {
        console.log(`selectTrack = ${isSubtitle}, ${trackName}`);
        if (isSubtitle) {
            props.onTextOptionSelected(trackName, '');
        } else {
            props.onAudioOptionSelected(trackName, '');
        }
    };

    /**
     * Create caption container on pressing more
     */
    const captionContainer = (): JSX.Element => {
        return (
            <View style={styles.caption.root}>
                <View style={styles.caption.wrapper}>
                    {renderLanguageContainer()}
                    {renderSubtitleContainer()}
                </View>
            </View>
        );
    };

    const renderCenterControls = (): JSX.Element => {
        return (
            <Animated.View
                style={[
                    styles.container.centerControls,
                    {
                        opacity: state.animations.centerControl.opacity,
                    },
                ]}>
                {state.showCaptions && descriptionContainer()}
                {state.showCaptions && captionContainer()}
            </Animated.View>
        );
    };

    /**
     * Render the play/pause button and show the respective icon
     */
    const renderPlayPauseButton = () => {
        const playButton = <MaterialCommunityIcons color={colors.primary} size={30} name={'play'} />;
        const pauseButton = <MaterialCommunityIcons color={colors.primary} size={30} name={'pause'} />;
        let source = state.paused ? playButton : pauseButton;
        return (
            <TouchableHighlight
                accessibilityLabel={'Play'}
                ref={_playPauseButtonRef}
                activeOpacity={1}
                underlayColor={controlUnderlayColor}
                hasTVPreferredFocus={false}
                style={[styles.playerControls.playButton]}
                onPress={() => {
                    methods.togglePlayPause();
                }}>
                {source}
            </TouchableHighlight>
        );
    };

    /**
     * The default 'onBack' function pops the navigator
     * and as such the video player requires a
     * navigator prop by default.
     */
    const _onBackPress = () => {};
    /**
     * Toggle fullscreen changes resizeMode on
     * the <Video> component then updates the
     * isFullscreen state.
     */
    const _toggleFullscreen = () => {
        state.isFullscreen = !state.isFullscreen;

        if (state.isFullscreen) {
            typeof events.onEnterFullscreen === 'function' && events.onEnterFullscreen();
        } else {
            typeof events.onExitFullscreen === 'function' && events.onExitFullscreen();
        }

        //setState(state);
        //setState({ name: 'updateState', value: state.isFullscreen });
    };

    /**
     * Toggle playing state on <Video> component
     */
    const _togglePlayPause = () => {
        state.paused = !state.paused;

        if (state.paused) {
            typeof events.onPause === 'function' && events.onPause();
        } else {
            typeof events.onPlay === 'function' && events.onPlay();
        }
    };

    /**
     * Toggle to rewind the playback for a given value
     */
    const _toggleRewind = (value: number) => {
        typeof events.onRewindPress === 'function' && events.onRewindPress(value);
    };

    const _toggleBack = () => {
        typeof events.onBackPress === 'function' && events.onBackPress();
    };

    const _toggleSettings = () => {
        typeof events.onSettingsPress === 'function' && events.onSettingsPress();
    };

    /**
     * Toggle to forward the playback for a given value
     */
    const _toggleForward = (value: number) => {
        typeof events.onForwardPress === 'function' && events.onForwardPress(value);
    };

    const _toggleRestart = () => {
        typeof events.onRestartPress === 'function' && events.onRestartPress();
    };

    const _toggleLookback = () => {
        typeof events.onLookbackPress === 'function' && events.onLookbackPress();
    };

    const _onSelectSubtitleTrack = () => {
        typeof events.onSelectSubtitleTrack === 'function' && events.onSelectSubtitleTrack(!captionSelected);
        setCaptionSelected(!captionSelected);
    };

    const _toggle = (animationName: string) => {
        const show: boolean = !state.showControls;
        if (show) {
            showControlAnimation(animationName);
        } else {
            hideControlAnimation(0);
        }
        setState({ name: 'showControls', value: show });
    };

    /**
     * Function to toggle controls based on
     * current state.
     */
    const _toggleControls = () => {
        _toggle('showControls');
    };

    const _showForwardLookBackControl = () => {
        _toggle('showForwardLookback');
    };

    const _showRewindRestartControl = () => {
        _toggle('showRewindRestart');
    };

    const _onScreenTouch = () => {
        methods.toggleControls();
    };

    /**
     * Show/Hide more settings in center controls
     */
    const onSettingsPress = () => {
        setState({ name: 'captionControls', value: !state.showCaptions });
    };

    /**
     * Compute playback speed for multiple fw/rw key presses
     */
    const _getPlaybackSpeed = (count: number, eventType: string): number => {
        if (count === 1) {
            // no need to calculate in case of one time press
            return 1;
        }
        if (eventType === 'fastForward') {
            if (count < 1) {
                // from different direction
                mPlaybackSpeed = 2;
                count = 1;
            } else if (mPlaybackSpeed >= 16) {
                mPlaybackSpeed = 2;
            } else {
                mPlaybackSpeed *= 2;
            }
        } else if (eventType === 'rewind') {
            if (count > -1) {
                // from different direction
                mPlaybackSpeed = 2;
                count = -1;
            } else if (mPlaybackSpeed >= 16) {
                mPlaybackSpeed = 2;
            } else {
                mPlaybackSpeed *= 2;
            }
        } else {
            mPlaybackSpeed = 1;
            count = 1;
        }
        return count * mPlaybackSpeed;
    };

    const hideControlAnimation = (value: any) => {
        // if (_playbackViewContainerRef !== null && _playbackViewContainerRef.current !== null) {
        //     _playbackViewContainerRef.current.setNativeProps({ hasTVPreferredFocus: true });
        // }

        if (hideAnimationTimeoutId.current) {
            clearTimeout(hideAnimationTimeoutId.current);
        }

        hideAnimationTimeoutId.current = setTimeout(() => {
            Animated.parallel([
                Animated.timing(animations.topControl.opacity, { toValue: 0, delay: 0 }),
                Animated.timing(animations.topControl.marginTop, { toValue: -100, delay: 0 }),
                Animated.timing(animations.centerControl.opacity, { toValue: 0, delay: 0 }),
                Animated.timing(animations.centerControl.marginTop, { toValue: 0, delay: 0 }),
                Animated.timing(animations.forwardControl.opacity, { toValue: 0, delay: 0 }),
                Animated.timing(animations.rewindControl.opacity, { toValue: 0, delay: 0 }),
                Animated.timing(animations.bottomControl.opacity, { toValue: 0, delay: 0 }),
                Animated.timing(animations.bottomControl.marginBottom, { toValue: -100, delay: 0 }),
            ]).start(result => {
                // Platform.OS === 'android' ? VstbLibrary.hideNavigationBar() : '';
                if (result.finished) {
                    if (_playbackViewContainerRef !== null && _playbackViewContainerRef.current !== null) {
                        _playbackViewContainerRef.current.setNativeProps({ hasTVPreferredFocus: true });
                    }
                    setState({ name: 'showControls', value: false });
                }
            });

            setState({ name: 'animations', value: animations });
        }, value);
    };

    /**
     * Animation to show controls.
     * Move onto the screen and then
     * fade in.
     */
    const showControlAnimation = (type: string) => {
        if (_playbackViewContainerRef !== null && _playbackViewContainerRef.current !== null) {
            _playbackViewContainerRef.current.setNativeProps({ hasTVPreferredFocus: false });
        }
        if (_playPauseButtonRef !== null && _playPauseButtonRef.current !== null) {
            _playPauseButtonRef.current.setNativeProps({ hasTVPreferredFocus: true });
        }
        switch (type) {
            case 'showControls':
                Animated.parallel([
                    Animated.timing(animations.topControl.opacity, { toValue: 1 }),
                    Animated.timing(animations.topControl.marginTop, { toValue: 0 }),
                    Animated.timing(animations.centerControl.opacity, { toValue: 1 }),
                    Animated.timing(animations.centerControl.marginTop, { toValue: 0 }),
                    Animated.timing(animations.bottomControl.opacity, { toValue: 1 }),
                    Animated.timing(animations.bottomControl.marginBottom, { toValue: 0 }),
                ]).start(() => {
                    //hideControlAnimation(playerProps.controlTimeoutDelay);
                });
                break;
            case 'showRewindRestart':
                Animated.parallel([Animated.timing(animations.rewindControl.opacity, { toValue: 1 })]).start(() => {
                    hideControlAnimation(100);
                });
                break;
            case 'showForwardLookback':
                Animated.parallel([Animated.timing(animations.forwardControl.opacity, { toValue: 1 })]).start(() => {
                    hideControlAnimation(100);
                });
        }
        setState({ name: 'animations', value: animations });
    };

    const events = {
        onBackPress: props.onBackPress || _onBackPress,
        onSlidingComplete: props.onSlidingComplete,
        onScreenTouch: _onScreenTouch,
        onEnterFullscreen: props.onEnterFullscreen,
        onExitFullscreen: props.onExitFullscreen,
        onPause: props.onPause,
        onPlay: props.onPlay,
        onRewindPress: props.onRewindPress,
        onForwardPress: props.onForwardPress,
        onSettingsPress: onSettingsPress,
        onRestartPress: props.onRestartPress,
        onLookbackPress: props.onLookbackPress,
        onSelectSubtitleTrack: props.onToggleSubtitleTrack,
    };

    /**
     * UI Functions used throughout the playback
     */
    const methods = {
        toggleFullscreen: _toggleFullscreen,
        toggleBack: _toggleBack,
        togglePlayPause: _togglePlayPause,
        toggleForward: _toggleForward,
        toggleRewind: _toggleRewind,
        toggleSettings: _toggleSettings,
        toggleControls: _toggleControls,
        toggleRestart: _toggleRestart,
        toggleLookback: _toggleLookback,
        onSelectSubtitleTrack: _onSelectSubtitleTrack,
    };

    /**
     * Player information
     */
    const playerProps = {
        controlTimeoutDelay: 4000,
        controlTimeout: 0,
    };

    const _setPlayerControls = (): JSX.Element => {
        return (
            <TouchableHighlight
                accessibilityLabel={'PlayerControls'}
                underlayColor={'transparent'}
                ref={_playbackViewContainerRef}
                // hasTVPreferredFocus={true}
                onPress={events.onScreenTouch}
                style={[styles.player.container]}>
                <>
                    {renderTopControls()}
                    {renderCenterControls()}
                    {renderBottomControls()}
                </>
            </TouchableHighlight>
        );
    };

    return (
        <>
            {props.isLoading === true && _setLoadingView()}
            {_setPlayerControls()}
        </>
    );
};

const styles = {
    player: StyleSheet.create({
        container: {
            backgroundColor: 'transparent',
            flex: 1,
            alignSelf: 'stretch',
            justifyContent: 'space-between',
        },
    }),
    loader: StyleSheet.create({
        container: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            alignItems: 'center',
            justifyContent: 'center',
        },
    }),
    container: StyleSheet.create({
        topControls: {
            height: '16%',
            justifyContent: 'space-between',
            flexDirection: 'row',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            paddingLeft: 50,
            paddingRight: 50,
        },
        centerControls: {
            flexDirection: 'row',
            height: '55%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            paddingLeft: 50,
            paddingRight: 50,
        },
        bottomControls: {
            height: '30%',
            paddingTop: '1%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            paddingBottom: 50,
            paddingLeft: 50,
            paddingRight: 50,
        },
    }),
    caption: StyleSheet.create({
        root: {
            width: '40%',
            alignItems: 'center',
            flexDirection: 'row',
        },
        wrapper: {
            flexDirection: 'row',
        },
        languageContainer: {
            flex: 1,
            marginTop: 10,
            paddingLeft: '2%',
            paddingRight: '2%',
        },
        subtitleContainer: {
            flex: 1,
            marginTop: 10,
            paddingLeft: '2%',
            paddingRight: '2%',
        },
        headingText: {
            color: colors.backgroundGrey,
            fontFamily: defaultFont.bold,
            alignSelf: 'center',
            marginTop: padding.sm(),
        },
        scrollview: {
            alignSelf: 'center',
        },
        selectedButton: {
            height: 45,
            width: 150,
            backgroundColor: colors.brandTint,
            marginTop: padding.sm(),
            alignSelf: 'center',
            justifyContent: 'center',
        },
        unselectedButton: {
            height: 45,
            width: 150,
            backgroundColor: colors.tertiary,
            marginTop: padding.sm(),
            alignSelf: 'center',
            justifyContent: 'center',
            opacity: 1,
        },
        buttonTextContainer: {
            flexDirection: 'row',
            alignSelf: 'center',
            marginBottom: 5,
        },
        buttonText: {
            color: colors.primary,
            fontFamily: defaultFont.bold,
            alignSelf: 'center',
        },
        tickStyle: {
            marginRight: padding.sm(),
        },
    }),
    trickplay: StyleSheet.create({
        root: {
            flex: 1,
            justifyContent: 'flex-end',
        },
        trickPlayControls: {
            flexDirection: 'row',
            alignSelf: 'center',
        },
    }),
    title: StyleSheet.create({
        root: {
            flex: 1,
            justifyContent: 'space-between',
            flexDirection: 'row',
        },
        metadata: {
            width: '40%',
            paddingLeft: 13,
        },
        metadataHeading: {
            height: '60%',
        },
        metadataHeadingText: {
            color: colors.primary,
            fontFamily: defaultFont.bold,
            fontSize: fonts.sm,
        },
        metadataSubheading: {
            height: '40%',
        },
        metadataSubheadingText: {
            color: colors.primary,
            fontFamily: defaultFont.bold,
            fontSize: fonts.xxs,
        },
    }),
    playerControls: StyleSheet.create({
        playButton: {
            height: 40,
            width: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        moreButton: {
            height: 40,
            width: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginLeft: percentage(10, true),
            marginRight: percentage(10, true),
            alignItems: 'center',
            width: percentage(8, true),
            height: percentage(8, true),
            borderRadius: Dimensions.get('window').width * 0.075,
            borderWidth: 0.8,
            borderColor: 'rgba(255,255,255,0.7)',
        },
        iconStyle: {
            width: percentage(6, true),
            height: percentage(6, true),
            resizeMode: 'contain',
        },
        backIcon: {
            alignSelf: 'center',
            height: 40,
            width: 40,
            borderRadius: 20,
        },
        fullScreenIcon: {
            alignSelf: 'center',
        },
        iconDirection: {
            flexDirection: 'row',
        },
        seekbarContainer: {
            //flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
        },
        moreContainer: {
            width: '10%',
            alignItems: 'flex-end',
            justifyContent: 'center',
        },
        sliderContainer: {
            width: '95%',
            flexDirection: 'row',
        },
        timerContainer: {
            width: '5%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        slider: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
        },
        control: {
            //padding: percentage(2, true),
            //backgroundColor: 'red',
        },
        timer: {
            width: '10%',
            paddingRight: 3,
        },
        timerText: {
            //backgroundColor: 'transparent',
            color: colors.primary,
            fontSize: fonts.xs,
            textAlign: 'right',
        },
    }),
    metadata: StyleSheet.create({
        root: {
            width: '60%',
        },
        infoCaptionStyle: {
            color: colors.primary,
        },
        metaInfo: {
            height: '10%',
            alignSelf: 'flex-start',
            justifyContent: 'center',
            paddingLeft: 8,
        },
        textWrapperStyle: {
            flex: 1,
            alignSelf: 'stretch',
            flexGrow: 1,
            marginTop: padding.xs(),
            marginBottom: padding.xs(),
            marginLeft: padding.xs(),
            marginRight: padding.xs(),
        },
        infoContainerStyle: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        titleContainerStyle: {
            flex: 1,
            flexDirection: 'column',
        },
        titleStyle: {
            ...typography.title,
            color: colors.primary,
            marginTop: padding.xs(),
            marginLeft: padding.xs(),
            marginRight: padding.xs(),
        },
        infoTextStyle: {
            ...typography.body,
            color: colors.primary,
            flexWrap: 'wrap',
            marginTop: padding.xs(),
            marginLeft: padding.xs(),
            marginRight: padding.xs(),
            marginBottom: padding.xs(),
        },
    }),
};
