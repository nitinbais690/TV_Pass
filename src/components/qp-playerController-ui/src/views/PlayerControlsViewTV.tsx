import React, { useState, useReducer, useRef, useEffect } from 'react';
import {
    TouchableHighlight,
    ActivityIndicator,
    ImageBackground,
    StyleSheet,
    Dimensions,
    Animated,
    Platform,
    Image,
    View,
    Text,
    TVEventHandler,
    BackHandler,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Icon } from 'react-native-elements';
import { visualizeVideoDuration } from '../utils/utils';
import { colors, fonts, padding, percentage } from 'qp-common-ui';
import { debounce } from 'lodash';
import { appFonts } from '../../../../../AppStyles';

export interface PlayControllerTVProps {
    currentTime?: number;
    playbackDuration?: number;
    isLoading?: boolean;
    isLive?: boolean;
    showOnlyCaptionsControl?: boolean;
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
    onEnterFullscreen?: () => void;
    onExitFullscreen?: () => void;
    controlTimeout?: number;
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
}

const _setLoadingView = (): JSX.Element => {
    return <ActivityIndicator size="large" color="white" style={styles.loader.container} />;
};

export const PlayerControlsViewTV = (props: PlayControllerTVProps): JSX.Element => {
    const _playPauseButtonRef = useRef<TouchableHighlight>(null);
    const _playbackViewContainerRef = useRef<TouchableHighlight>(null);
    const [captionSelected, setCaptionSelected] = useState(false);

    const isAndroidTV = Platform.OS === 'android' && Platform.isTV;
    const controlUnderlayColor = 'rgba(256, 256, 256, 0.8)';

    const controlReducer = (state: any, action: any): any => {
        switch (action.name) {
            case 'showControls':
                return { ...state, showControls: action.value };
            case 'animations':
                return { ...state, animations: action.value };
            case 'updateState':
                return { ...state, animations: action.value };
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
    };

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
                    case 'select':
                        methods.toggleControls();
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

    useEffect(() => {
        const handleBackButtonPressAndroid = () => {
            if (state.showControls) {
                hideControlAnimation(0);
                // We have handled the back button
                // Return `true` to prevent react-navigation from handling it
                return true;
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
                style={[styles.controls.control, style]}>
                {children}
            </TouchableHighlight>
        );
    };

    /**
     * Renders an empty control, used to disable a control without breaking the view layout.
     */
    const renderNullControl = () => {
        return <View style={[styles.controls.control]} />;
    };

    /**
     * Back button control
     */
    const renderBack = (): JSX.Element => {
        return renderControl(
            'Backbutton',
            <Image source={require('../assets/img/back.png')} style={styles.controls.iconDirection} />,
            methods.toggleBack,
            styles.controls.iconDirection,
        );
    };

    /**
     * Render fullscreen toggle and set icon based on the fullscreen state.
     */
    const renderFullscreen = () => {
        let source =
            state.isFullscreen === true ? require('../assets/img/shrink.png') : require('../assets/img/expand.png');
        return renderControl(
            'FullScreen',
            <Image source={source} />,
            methods.toggleFullscreen,
            styles.controls.iconDirection,
        );
    };

    /**
     * Groups the top bar controls together in an animated
     * view and spaces them out.
     */
    const renderTopControls = () => {
        const backControl = props.disableBack ? renderNullControl() : renderBack();
        const fullscreenControl = props.disableFullscreen ? renderNullControl() : renderFullscreen();

        return (
            <Animated.View
                style={[
                    styles.controls.top,
                    {
                        opacity: state.animations.topControl.opacity,
                        marginTop: state.animations.topControl.marginTop,
                    },
                ]}>
                <ImageBackground
                    source={require('../assets/img/top-vignette.png')}
                    style={[styles.controls.column]}
                    imageStyle={[styles.controls.vignette]}>
                    <View style={styles.controls.topControlGroup}>
                        {backControl}
                        <View style={styles.controls.pullRight}>{fullscreenControl}</View>
                    </View>
                </ImageBackground>
            </Animated.View>
        );
    };

    /**
     * Render fullscreen toggle and set icon based on the fullscreen state.
     */
    const renderRewindButton = () => {
        let source = require('../assets/ic_mat_rewind.png');
        return renderControl(
            'RewindButton',
            <Image source={source} style={styles.controls.iconStyle} />,
            methods.toggleRewind,
            // styles.controls.iconDirection
            styles.controls.buttonContainer,
        );
    };

    /**
     * Render fullscreen toggle and set icon based on the fullscreen state.
     */
    const renderForwardButton = () => {
        let source = require('../assets/ic_mat_foreward.png');
        return renderControl(
            'ForwardButton',
            <Image source={source} style={styles.controls.iconStyle} />,
            methods.toggleForward,
            styles.controls.buttonContainer,
        );
    };

    const renderRestartButton = () => {
        let source = require('../assets/ic_restart.png');
        return renderControl(
            'RestartButton',
            <Image source={source} style={styles.controls.iconStyle} />,
            methods.toggleRestart,
            styles.controls.buttonContainer,
        );
    };

    const renderLookbackButton = () => {
        let source = require('../assets/ic_lookback.png');
        return renderControl(
            'LookbackButton',
            <Image source={source} style={styles.controls.iconStyle} />,
            methods.toggleLookback,
            styles.controls.buttonContainer,
        );
    };

    const renderTitleControl = (): JSX.Element => {
        if (props.contentTitle) {
            return (
                <View style={[styles.controls.control, styles.controls.title]}>
                    <Text style={[styles.controls.titleStyle]} numberOfLines={1}>
                        {props.contentTitle || ''}
                    </Text>
                </View>
            );
        }

        return renderNullControl();
    };

    const renderDuration = (): JSX.Element => {
        const duration = props.isLive ? 'LIVE' : visualizeVideoDuration(props.playbackDuration!);
        if (props.isLive) {
            return (
                <View style={[styles.controls.control, styles.controls.timer]}>
                    <Text style={styles.controls.liveIcon}>•</Text>
                    <Text style={styles.controls.liveTimerText}>{duration}</Text>
                </View>
            );
        } else {
            return (
                <View style={[styles.controls.control, styles.controls.timer]}>
                    <Text style={styles.controls.timerText}>{duration}</Text>
                </View>
            );
        }
    };

    const renderProgress = (): JSX.Element => {
        if (!props.isLive) {
            return (
                <View style={[styles.controls.control]}>
                    <Text style={styles.controls.timerText}>{visualizeVideoDuration(props.currentTime!)}</Text>
                </View>
            );
        }

        return renderNullControl();
    };

    const renderSeekBar = (): JSX.Element => {
        const durationControl = props.disableDuration ? (
            renderNullControl()
        ) : (
            <View style={styles.controls.pullRight}>{renderDuration()}</View>
        );
        return (
            <>
                <View style={[styles.controls.sliderContainer]}>
                    {props.disableDuration ? renderNullControl() : renderProgress()}
                    <Slider
                        maximumValue={props.isLive ? 1 : props.playbackDuration}
                        minimumValue={0}
                        step={1}
                        value={props.currentTime}
                        style={styles.controls.slider}
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
                    {durationControl}
                </View>
                <View style={[styles.controls.moreActionsContainer]}>
                    {props.showOnlyCaptionsControl && (
                        <TouchableHighlight
                            onFocus={() => {
                                hideControlAnimation(playerProps.controlTimeoutDelay);
                            }}
                            onPress={() => {
                                hideControlAnimation(playerProps.controlTimeoutDelay);
                                methods.onSelectSubtitleTrack();
                            }}
                            underlayColor={controlUnderlayColor}
                            style={[styles.controls.moreActionControl]}>
                            <View style={styles.controls.moreIconContainer}>
                                <Text style={captionSelected ? styles.controls.ccTextSelected : styles.controls.ccText}>
                                    CC
                                </Text>
                            </View>
                        </TouchableHighlight>
                    )}
                    {!props.showOnlyCaptionsControl && (
                        <TouchableHighlight
                            onFocus={() => {
                                hideControlAnimation(playerProps.controlTimeoutDelay);
                            }}
                            onPress={() => {
                                hideControlAnimation(playerProps.controlTimeoutDelay);
                                methods.toggleSettings();
                            }}
                            underlayColor={controlUnderlayColor}
                            style={[styles.controls.moreActionControl]}>
                            <View style={styles.controls.moreIconContainer}>
                                <Icon
                                    type="ionicon"
                                    color="white"
                                    name={Platform.OS === 'ios' ? 'ios-more' : 'md-more'}
                                />
                            </View>
                        </TouchableHighlight>
                    )}
                </View>
            </>
        );
    };

    const renderBottomControls = () => {
        const titleControl = renderTitleControl();
        const seekBarControl = renderSeekBar();
        return (
            <Animated.View
                style={[
                    styles.controls.bottom,
                    {
                        opacity: state.animations.bottomControl.opacity,
                        marginTop: state.animations.bottomControl.marginBottom,
                    },
                ]}>
                <ImageBackground
                    source={require('../assets/img/bottom-vignette.png')}
                    style={[styles.controls.column]}
                    imageStyle={[styles.controls.vignette]}>
                    {titleControl}
                    {seekBarControl}
                </ImageBackground>
            </Animated.View>
        );
    };

    const renderCenterControls = () => {
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
            <View style={styles.controls.centerControlGroup}>
                <Animated.View
                    style={[
                        styles.controls.center,
                        {
                            opacity: state.animations.rewindControl.opacity,
                            marginLeft: state.animations.rewindControl.marginLeft,
                        },
                    ]}>
                    <View>{rewindRestartControl}</View>
                </Animated.View>
                <Animated.View
                    style={[
                        styles.controls.center,
                        {
                            opacity: state.animations.centerControl.opacity,
                            // marginTop: state.animations.topControl.marginTop,
                        },
                    ]}>
                    <View>{playPauseControl}</View>
                </Animated.View>
                <Animated.View
                    style={[
                        styles.controls.center,
                        {
                            opacity: state.animations.forwardControl.opacity,
                            marginRight: state.animations.forwardControl.marginRight,
                        },
                    ]}>
                    <View>{forwardLookbackControl}</View>
                </Animated.View>
            </View>
        );
    };

    /**
     * Render the play/pause button and show the respective icon
     */
    const renderPlayPauseButton = () => {
        let source =
            state.paused === true ? require('../assets/ic_mat_play.png') : require('../assets/ic_mat_pause.png');
        return (
            <TouchableHighlight
                accessibilityLabel={'Play'}
                ref={_playPauseButtonRef}
                activeOpacity={1}
                underlayColor={controlUnderlayColor}
                hasTVPreferredFocus={false}
                style={[styles.controls.buttonContainer, { backgroundColor: state.mainColor }, styles.controls.control]}
                // onPress={() => methods.togglePlayPause}>
                onPress={() => {
                    methods.togglePlayPause();
                }}>
                <Image source={source} style={styles.controls.iconStyle} />
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

    /**
     * Animation to hide controls. We fade the
     * display to 0 then move them off the
     * screen so they're not interactable
     */
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
                    hideControlAnimation(playerProps.controlTimeoutDelay);
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
        onSettingsPress: props.onSettingsPress,
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
        const defaultStyle = { width: '100%' };

        return (
            <TouchableHighlight
                accessibilityLabel={'PlayerControls'}
                ref={_playbackViewContainerRef}
                // hasTVPreferredFocus={true}
                onPress={isAndroidTV ? undefined : events.onScreenTouch}
                style={[styles.player.container, defaultStyle]}>
                <View style={[styles.player.container]}>
                    {renderTopControls()}
                    {renderCenterControls()}
                    {renderBottomControls()}
                </View>
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
    controls: StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        column: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        vignette: {
            resizeMode: 'stretch',
        },
        control: {
            padding: percentage(2, true),
        },
        sliderContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        slider: {
            flexDirection: 'column',
            alignItems: 'center',
            width: '80%',
        },
        moreActionsContainer: {
            flexDirection: 'row',
            height: 40,
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: padding.xs(true),
        },
        moreActionControl: {
            borderRadius: padding.xs(true),
            marginRight: padding.xs(true),
            marginLeft: padding.xs(true),
        },
        moreIconContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            margin: padding.xs(true),
        },
        titleStyle: {
            backgroundColor: 'transparent',
            color: '#FFF',
            fontSize: fonts.sm,
            textAlign: 'center',
        },
        pullRight: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        top: {
            flex: 1,
            alignItems: 'stretch',
            justifyContent: 'flex-start',
        },
        bottom: {
            alignItems: 'stretch',
            flex: 1,
            justifyContent: 'flex-end',
        },
        center: {
            flex: 2,
            alignItems: 'center',
            justifyContent: 'center',
        },
        topControlGroup: {
            alignSelf: 'stretch',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
        },
        centerControlGroup: {
            alignSelf: 'stretch',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
        },
        bottomControlGroup: {
            alignSelf: 'stretch',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginLeft: percentage(6, true),
            marginRight: percentage(6, true),
            marginBottom: 10,
        },
        iconDirection: {
            flexDirection: 'row',
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
        fullscreen: {
            flexDirection: 'row',
        },
        playPause: {
            position: 'relative',
            width: percentage(4, true),
            zIndex: 0,
        },
        title: {
            alignItems: 'center',
            flex: 0.6,
            flexDirection: 'column',
            padding: 0,
        },
        timer: {
            // width: percentage(20, true), //80,
        },
        timerText: {
            backgroundColor: 'transparent',
            color: colors.primary,
            fontSize: fonts.xxs,
            textAlign: 'right',
        },
        liveTimerText: {
            color: 'white',
            fontSize: fonts.xs,
            textAlign: 'right',
            fontFamily: appFonts.bold,
        },
        liveIcon: {
            color: 'red',
            fontSize: 30,
            textAlign: 'right',
        },
        ccText: {
            backgroundColor: 'transparent',
            color: colors.primary,
            fontSize: fonts.xs,
            textAlign: 'right',
        },
        ccTextSelected: {
            backgroundColor: 'transparent',
            color: colors.brandTint,
            fontSize: fonts.xs,
            textAlign: 'right',
        },
    }),
};
