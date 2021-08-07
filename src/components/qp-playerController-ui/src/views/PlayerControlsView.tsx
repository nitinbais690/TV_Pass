import React, { useReducer, useRef, useState, useEffect } from 'react';
import { Animated, TouchableHighlight, View, Text, Platform, Easing } from 'react-native';
import { useDimensions, useLayout } from '@react-native-community/hooks';
import {
    playerBottomControlsStyles,
    playerCenterControlsStyles,
    playerTopControlsStyles,
} from '../styles/PlayerControls.style';
import RewindIcon from '../../assets/images/rewind.svg';
import ForwardIcon from '../../assets/images/forward.svg';
import PlayIcon from '../../assets/images/play.svg';
import PauseIcon from '../../assets/images/pause.svg';
import Back from '../../assets/images/player_back.svg';
import SubTitleIcon from '../../assets/images/ic_sub_title.svg';
import VideoQualityIcon from '../../assets/images/ic_video_quality.svg';
import EpisodeIcon from '../../assets/images/ic_episodes.svg';
import ControlsLockIcon from '../../assets/images/ic_controls_lock.svg';
import ZoomScreenIcon from '../../assets/images/ic_fit_to_screen.svg';
import LockMessageIcon from '../../assets/images/ic_lock_info.svg';
import BrightnessIcon from '../../assets/images/ic_brightnes_control.svg';
import { appFlexStyles, colors, dimentionsValues } from 'qp-common-ui';
import Slider from '@react-native-community/slider';
import { advisoryMeta, ratingMetadata, visualizeVideoDuration } from '../utils/utils';
import { useSafeArea } from 'react-native-safe-area-context';
import { PlaybackStateValue, QpNxgAirplayView, TextStyles } from 'rn-qp-nxg-player';
import { ResourceVm } from 'qp-discovery-ui';
import { FORWORD_BACKWORD_TIME } from '../utils/Constants';
import SubTitleSelectionView from './SubTitleSelectionView';
import VideoQualitySelectionView from './VideoQualitySelectionView';
import LinearGradient from 'react-native-linear-gradient';
import { useLocalization } from 'contexts/LocalizationContext';
import MessagePopup from './MessagePopup/MessagePopup';
import BrightnessView from './BrightnessView';
import AsyncStorage from '@react-native-community/async-storage';
import { getStreamQuality, StreamQuality } from 'utils/UserPreferenceUtils';
import { TrackInfo } from 'features/player/presentation/components/template/PlatformPlayer';

export type CastType = 'Chromecast' | 'Airplay';

export interface PlayControllerProps {
    currentTime: number;
    contentTitle?: string;
    isCasting: boolean;
    isLive: boolean;
    isDownloadedContentPlayback?: boolean;
    castType?: CastType;
    castLabel: string;
    playbackDuration: number;
    isLoading?: boolean;
    playbackState?: PlaybackStateValue;
    showOnStart?: boolean;
    showCastIcon?: boolean;
    controlTimeout?: number;
    resource?: ResourceVm | null;
    onBackPress?: () => void;
    onPause?: () => void;
    onPlay?: () => void;
    onStop?: () => void;
    handleVolumeToggle?: (value: number) => void;
    onRewindPress?: () => void;
    onForwardPress?: () => void;
    onAirPlayPress?: () => void;
    onCastPress?: () => void;
    onSlidingComplete?: (value: number) => void;
    captionOptions?: TrackInfo[];
    audioOptions?: TrackInfo[];
    activeTextTrack?: string;
    activeAudioTrack?: string;
    hideEpisodesList?: boolean;
    onAudioOptionSelected?: (option: string, languageCode: string) => void;
    onTextOptionSelected?: (option: string, languageCode: string, textStyles?: TextStyles) => void;
    onVideoQualitySelected?: (streamQuality: StreamQuality) => void;
    onFitToScreen: (fitToScreen: boolean) => void;
    onEpisodeSelection?: (showEpisodes: boolean) => void;
}

const playerProps = {
    controlTimeoutDelay: 3000,
    controlTimeout: 0,
};

export const PlayerControlsView = (props: PlayControllerProps): JSX.Element => {
    const isMounted = useRef(true);
    const insets = useSafeArea();
    const { onLayout } = useLayout();
    let hideAnimationTimeoutId = useRef<number | undefined>();
    const [showTrackSelection, setShowTrackSelection] = useState(false);
    const [showQualitySelection, setShowQualitySelection] = useState(false);
    const { width, height } = useDimensions().window;
    const [sliding, setSliding] = useState(false);
    const [seekedTo, setSeekedTo] = useState<number>(0);
    const { strings } = useLocalization();
    const isPortrait = height > width;
    const centerControlStyles = playerCenterControlsStyles();
    const topControlStyles = playerTopControlsStyles();
    const bottomControlStyles = playerBottomControlsStyles(insets, isPortrait);
    const [showRating, setShowRating] = useState(false);
    const [isControlLocked, setControlLock] = useState(false);
    const [showLock, setShowLock] = useState(false);
    const [showBrightnessControl, setShowBrightnessControl] = useState(false);
    const [brightness, setBrightness] = useState(50);
    const [videoQuality, setSelectedVideoQuality] = useState<string>();
    const [showLockInfo, setShowLockInfo] = useState<any>(undefined);
    const [showEpisodes, setShowEpisodes] = useState<boolean>(false);
    const ratingAnimation = useRef(new Animated.Value(0)).current;

    const [fitToScreen, setFitToScreen] = useState<boolean>(false);
    const initialValue = props.showOnStart ? 1 : 0;

    useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (props.hideEpisodesList) {
            handleEpisodeSelectionEvent();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.hideEpisodesList]);

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
        video: {
            opacity: new Animated.Value(1),
        },
        loader: {
            rotate: new Animated.Value(0),
            MAX_VALUE: 360,
        },
    };

    const initialState = {
        isLoading: props.isLoading,
        currentTime: props.currentTime,
        duration: props.playbackDuration,
        lastScreenPress: 0,
        paused: false,
        showControls: props.showOnStart,
        animations: animations,
    };

    const controlsReducer = (state: any, action: any): any => {
        switch (action.name) {
            case 'showControls':
                return { ...state, showControls: action.value };
            case 'animations':
                return { ...state, animations: action.value };
            case 'updateState':
                return { ...state, animations: action.value };
            case 'pauseState':
                return { ...state, paused: action.value };
        }
    };
    const [state, setState] = useReducer(controlsReducer, initialState);

    useEffect(() => {
        const setActiveVideoQuality = async () => {
            const activeVideoQuality = await getStreamQuality();
            setSelectedVideoQuality(activeVideoQuality);
        };
        setActiveVideoQuality();
    }, [props.onVideoQualitySelected]);

    useEffect(() => {
        if (!isMounted.current) {
            return;
        }

        if (props.playbackState === 'LOADED') {
            showRatingAnimation();
        }
        getLockInfoStatus();
        if (hideAnimationTimeoutId.current && (props.isCasting || props.playbackState === 'PAUSED')) {
            clearTimeout(hideAnimationTimeoutId.current);
        }

        // Always show controls while casting
        if ((props.isCasting || props.playbackState === 'PAUSED') && !state.showControls) {
            showControlAnimation();
            setState({ name: 'showControls', value: true });
        } else {
            hideControlAnimation(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isCasting, props.playbackState]);

    useEffect(() => {
        if (props.playbackState === 'PAUSED') {
            setState({ name: 'pauseState', value: true });
        } else if (props.playbackState === 'STARTED') {
            setState({ name: 'pauseState', value: false });
        }
    }, [props.playbackState]);

    const hideBrightnessControl = (value: any) => {
        setTimeout(() => {
            setShowBrightnessControl(false);
        }, value);
    };

    const hideControlAnimation = (value: any) => {
        if (props.isCasting || props.playbackState === 'PAUSED') {
            // When casting, do not hide controls
            return;
        }

        if (hideAnimationTimeoutId.current) {
            clearTimeout(hideAnimationTimeoutId.current);
        }

        hideAnimationTimeoutId.current = setTimeout(() => {
            Animated.parallel([
                Animated.timing(animations.topControl.opacity, { toValue: 0, delay: 0, useNativeDriver: true }),
                Animated.timing(animations.topControl.marginTop, { toValue: 0, delay: 0, useNativeDriver: true }),
                Animated.timing(animations.centerControl.opacity, { toValue: 0, delay: 0, useNativeDriver: true }),
                Animated.timing(animations.centerControl.marginTop, {
                    useNativeDriver: true,
                    toValue: 0,
                }),
                Animated.timing(animations.bottomControl.opacity, { toValue: 0, delay: 0, useNativeDriver: true }),
                Animated.timing(animations.bottomControl.marginBottom, {
                    toValue: 0,
                    delay: 0,
                    useNativeDriver: true,
                }),
            ]).start(result => {
                if (result.finished && isMounted.current) {
                    setState({ name: 'showControls', value: false });
                }
            });

            if (isMounted.current) {
                setState({ name: 'animations', value: animations });
            }
        }, value);
    };

    const showControlAnimation = () => {
        Animated.parallel([
            Animated.timing(animations.topControl.opacity, { toValue: 1, useNativeDriver: true }),
            Animated.timing(animations.topControl.marginTop, { useNativeDriver: true, toValue: 1 }),
            Animated.timing(animations.centerControl.opacity, { toValue: 1, useNativeDriver: true }),
            Animated.timing(animations.centerControl.marginTop, { toValue: 0, useNativeDriver: true }),
            Animated.timing(animations.bottomControl.opacity, { toValue: 1, useNativeDriver: true }),
            Animated.timing(animations.bottomControl.marginBottom, { toValue: 0, useNativeDriver: true }),
        ]).start(() => {
            hideControlAnimation(playerProps.controlTimeoutDelay);
        });

        if (isMounted.current) {
            setState({ name: 'animations', value: animations });
        }
    };

    const showRatingAnimation = () => {
        Animated.timing(ratingAnimation, {
            useNativeDriver: false,
            toValue: dimentionsValues.xxxxlg,
            easing: Easing.quad,
            duration: 300,
        }).start(() => {
            hideRatingAnimation(15000);
        });
        setShowRating(true);
    };

    const hideRatingAnimation = (value: any) => {
        setTimeout(() => {
            Animated.timing(ratingAnimation, {
                useNativeDriver: false,
                toValue: -500,
                easing: Easing.quad,
                duration: 500,
            }).start(() => {
                setShowRating(false);
            });
        }, value);
    };

    const hideLockAnimation = (value: any) => {
        setTimeout(() => {
            setShowLock(false);
        }, value);
    };

    const hideLockInfoAnimation = (value: any) => {
        setTimeout(() => {
            setShowLockInfo('true');
        }, value);
    };

    async function getLockInfoStatus() {
        const status = await AsyncStorage.getItem('LOCK_INFO');
        setShowLockInfo(status);
    }

    const handlePlayPause = () => {
        const newValue = !state.paused;

        setState({ name: 'pauseState', value: newValue });

        if (newValue && props.onPause) {
            props.onPause();
        } else {
            if (props.onPlay) {
                props.onPlay();
            }
        }
    };

    const handleRewind = () => {
        const value = Math.max(0, props.currentTime - FORWORD_BACKWORD_TIME);
        setSeekedTo(value);
        if (props.onRewindPress) {
            props.onRewindPress();
        }
    };

    const handleFastFwd = () => {
        const value = Math.min(props.playbackDuration, props.currentTime + FORWORD_BACKWORD_TIME);
        setSeekedTo(value);
        if (props.onForwardPress) {
            props.onForwardPress();
        }
    };

    const handleOnScreenTouch = () => {
        setShowRating(false);
        setShowBrightnessControl(false);
        if (isControlLocked) {
            setShowLock(!showLock);
            if (!showLock) {
                hideLockAnimation(playerProps.controlTimeoutDelay);
            }
        }
        if (isControlLocked || (props.isCasting && state.showControls)) {
            return;
        }

        const show: boolean = !state.showControls;
        if (show === true) {
            showControlAnimation();
        } else {
            hideControlAnimation(0);
        }
        setState({ name: 'showControls', value: show });
    };

    const handleSubtitleSelectionEvent = () => {
        setState({ name: 'pauseState', value: true });
        if (props.onPause) {
            props.onPause();
        }
        setShowTrackSelection(true);
    };

    const handleVideooptionsClose = () => {
        setShowTrackSelection(false);
        setShowQualitySelection(false);
        handlePlayPause();
    };

    const handleVideoQualitySelectionEvent = () => {
        setState({ name: 'pauseState', value: true });
        if (props.onPause) {
            props.onPause();
        }
        setShowQualitySelection(true);
    };

    const handleEpisodeSelectionEvent = () => {
        if (props.onEpisodeSelection) {
            props.onEpisodeSelection(!showEpisodes);
            setShowEpisodes(!showEpisodes);
        }
    };

    const handleBrightnessIconClick = () => {
        hideControlAnimation(0);
        setShowBrightnessControl(true);
    };

    const handleBrightnessChange = () => {
        hideBrightnessControl(playerProps.controlTimeoutDelay);
    };

    const handleFitToScreenEvent = () => {
        props.onFitToScreen(!fitToScreen);
        setFitToScreen(!fitToScreen);
    };

    const handleLockControlEvent = () => {
        AsyncStorage.getItem('LOCK_INFO').then(value => {
            if (value) {
                AsyncStorage.setItem('LOCK_INFO', 'true');
                setShowLockInfo('true');
            } else {
                AsyncStorage.setItem('LOCK_INFO', 'false');
                setShowLockInfo('false');
            }
        });

        hideLockInfoAnimation(5000);
        setShowLock(false);
        if (!isControlLocked) {
            hideControlAnimation(0);
            setShowBrightnessControl(false);
            setState({ name: 'showControls', value: false });
        } else {
            showControlAnimation();
            setState({ name: 'showControls', value: true });
        }
        setControlLock(!isControlLocked);
    };

    const renderProgress = (): JSX.Element => {
        const currentDuration = props.playbackDuration! - props.currentTime!;
        const duration = props.isLive ? 'LIVE' : visualizeVideoDuration(currentDuration!);
        if (props.isLive) {
            return (
                <View style={[bottomControlStyles.liveIconContainer]}>
                    <Text style={bottomControlStyles.liveIcon}>•</Text>
                    <Text style={bottomControlStyles.liveTimerText}>{duration}</Text>
                </View>
            );
        } else {
            return (
                <View style={[bottomControlStyles.durationContainer]}>
                    <Text style={bottomControlStyles.timerText}>{duration}</Text>
                </View>
            );
        }
    };

    const renderSeekBar = (): JSX.Element => {
        const hideRealProgress = sliding || props.isLoading;
        const value = hideRealProgress ? seekedTo : props.currentTime;

        return (
            <View style={[bottomControlStyles.sliderContainer]}>
                <View style={bottomControlStyles.sliderWrapper}>
                    <Slider
                        onLayout={onLayout}
                        maximumValue={props.isLive ? 1 : props.playbackDuration}
                        minimumValue={0}
                        step={1}
                        value={value}
                        style={bottomControlStyles.slider}
                        onSlidingStart={() => {
                            setSliding(true);
                        }}
                        onSlidingComplete={(seekValue: number) => {
                            setSliding(false);
                            hideControlAnimation(playerProps.controlTimeoutDelay);
                            if (props.onSlidingComplete) {
                                props.onSlidingComplete(seekValue);
                            }
                        }}
                        onValueChange={(seekValue: number) => {
                            setSeekedTo(seekValue);
                            setState({ name: 'pauseState', seekValue: false });
                            hideControlAnimation(playerProps.controlTimeoutDelay);
                        }}
                        thumbTintColor={colors.brandTint}
                        minimumTrackTintColor={colors.brandTint}
                        maximumTrackTintColor={'grey'}
                    />
                </View>
                {renderProgress()}
            </View>
        );
    };

    const renderBottomControls = () => {
        const seekBarControl = renderSeekBar();
        const mainResource = props.resource;
        return (
            <Animated.View
                useNativeDriver={true}
                style={[
                    bottomControlStyles.bottom,
                    {
                        opacity: state.animations.bottomControl.opacity,
                        translateY: state.animations.bottomControl.marginBottom,
                    },
                ]}>
                {!showEpisodes &&
                    renderControlIcon(
                        'Brightness Icon',
                        <BrightnessIcon height={dimentionsValues.xxxlg} width={dimentionsValues.xxxlg} />,
                        handleBrightnessIconClick,
                        bottomControlStyles.brightnessIcon,
                    )}
                {seekBarControl}
                <View style={bottomControlStyles.playerOptionsContainer}>
                    {props.captionOptions &&
                        props.captionOptions.length > 0 &&
                        renderPlayerOptions(
                            'Sub Title',
                            <SubTitleIcon />,
                            strings['player.subtitle'],
                            handleSubtitleSelectionEvent,
                        )}
                    {renderPlayerOptions(
                        'Video Quality',
                        <VideoQualityIcon />,
                        videoQuality,
                        handleVideoQualitySelectionEvent,
                    )}
                    {mainResource &&
                        mainResource.type === 'tvepisode' &&
                        renderPlayerOptions(
                            'Episodes',
                            <EpisodeIcon />,
                            strings['player.episodes'],
                            handleEpisodeSelectionEvent,
                        )}
                </View>
            </Animated.View>
        );
    };

    const renderControlIcon = (accessibilityLabel: string, children: any, callback: any, style = {}): JSX.Element => {
        return (
            <TouchableHighlight
                accessibilityLabel={accessibilityLabel}
                underlayColor={colors.transparent}
                onPress={() => {
                    if (callback) {
                        callback();
                    }
                }}
                style={style}>
                {children}
            </TouchableHighlight>
        );
    };

    const renderBrightnessview = () => {
        return (
            <View style={bottomControlStyles.brightnessControllerContainer}>
                <BrightnessView
                    initialBrightness={brightness}
                    onCompleteBrightness={brightnessValue => {
                        setBrightness(brightnessValue);
                        handleBrightnessChange();
                    }}
                />
            </View>
        );
    };

    const renderPlayerOptions = (accessibilityLabel: string, icon: any, title: string, callback: any): JSX.Element => {
        return (
            <TouchableHighlight
                accessibilityLabel={accessibilityLabel}
                underlayColor={colors.transparent}
                onPress={() => {
                    if (callback) {
                        callback();
                    }
                }}>
                <View style={[bottomControlStyles.playerOptions]}>
                    {icon}
                    <Text style={[bottomControlStyles.playerOptionsTitle, bottomControlStyles.titleText]}>{title}</Text>
                </View>
            </TouchableHighlight>
        );
    };

    function getEpisodeName(episodeName: string | undefined) {
        if (episodeName && episodeName.length > 0) {
            return <Text style={[topControlStyles.subTitleStyle]}>{episodeName}</Text>;
        }
    }

    const renderTopControls = () => {
        const mainResource = props.resource;
        let name = mainResource && mainResource.name;
        let episodeDetails;
        if (mainResource && mainResource.type === 'tvepisode') {
            name = mainResource.seriesTitle;
            episodeDetails = mainResource.title;
        }
        return (
            <Animated.View
                style={[
                    topControlStyles.top,
                    {
                        opacity: state.animations.topControl.opacity,
                    },
                ]}>
                <View style={topControlStyles.rootContainer}>
                    <View style={topControlStyles.topLeftControl}>
                        <View style={appFlexStyles.flexRow}>
                            {renderControlIcon(
                                'CloseButton',
                                <Back />,
                                props.onBackPress,
                                topControlStyles.moreControlsIconContainer,
                            )}
                            <View>
                                <Text style={[bottomControlStyles.titleText, bottomControlStyles.movieTitle]}>
                                    {name}
                                </Text>
                                {getEpisodeName(episodeDetails)}
                            </View>
                        </View>
                        <View style={appFlexStyles.flexRow}>
                            {Platform.OS === 'ios' && !props.isDownloadedContentPlayback && (
                                <QpNxgAirplayView style={topControlStyles.castIconContainer} />
                            )}
                            {renderControlIcon(
                                'Lock/Un lock Controls',
                                <ControlsLockIcon />,
                                handleLockControlEvent,
                                topControlStyles.moreControlsIconContainer,
                            )}
                            {renderControlIcon(
                                'Zoom in/ out screen',
                                <ZoomScreenIcon />,
                                handleFitToScreenEvent,
                                topControlStyles.moreControlsIconContainer,
                            )}
                        </View>
                    </View>
                </View>
            </Animated.View>
        );
    };

    const renderLockOption = () => {
        return (
            <View>
                {renderControlIcon(
                    'Lock/Un lock Controls',
                    <ControlsLockIcon />,
                    handleLockControlEvent,
                    topControlStyles.lockOptionStyle,
                )}
            </View>
        );
    };

    const renderCenterControls = () => {
        const PlayStateIcon = props && props.playbackState === 'STARTED' ? PauseIcon : PlayIcon;
        return (
            <Animated.View style={[centerControlStyles.center, { opacity: state.animations.centerControl.opacity }]}>
                <View style={{ flexDirection: 'row' }}>
                    {!props.isLive &&
                        !showEpisodes &&
                        renderControlIcon('RewindButton', <RewindIcon />, handleRewind, {
                            marginRight: '10%',
                            ...centerControlStyles.icon,
                        })}
                    {!showEpisodes &&
                        renderControlIcon('Play', <PlayStateIcon />, handlePlayPause, [
                            centerControlStyles.playicon,
                            props.isLoading ? { opacity: 0 } : {},
                        ])}
                    {!props.isLive &&
                        !showEpisodes &&
                        renderControlIcon('ForwardButton', <ForwardIcon />, handleFastFwd, {
                            marginLeft: '10%',
                            ...centerControlStyles.icon,
                        })}
                </View>
            </Animated.View>
        );
    };
    const renderRatingView = () => {
        const mainResource = props.resource;
        return (
            <Animated.View
                style={[
                    topControlStyles.ratingStyle,
                    {
                        left: ratingAnimation,
                    },
                ]}>
                <View style={{ flexDirection: 'row' }}>
                    <LinearGradient style={{ width: 2 }} colors={['#B61A09', '#FF6D2E']} useAngle={true} angle={180} />
                    <View style={{ marginStart: dimentionsValues.xs }}>
                        <Text style={bottomControlStyles.titleText}>
                            {strings['player.rating']} {ratingMetadata(mainResource)}
                        </Text>
                        <Text style={[topControlStyles.subTitleStyle]}>{advisoryMeta(strings, mainResource)}</Text>
                    </View>
                </View>
            </Animated.View>
        );
    };

    return (
        <TouchableHighlight
            accessibilityLabel={'PlayerControls'}
            underlayColor={'transparent'}
            onPress={handleOnScreenTouch}
            style={topControlStyles.container}>
            <>
                {showLockInfo === 'false' && (
                    <MessagePopup message={strings['player.control_lock_message']} icon={<LockMessageIcon />} />
                )}
                {showLock && renderLockOption()}
                {showBrightnessControl && renderBrightnessview()}
                {showRating && renderRatingView()}
                <View style={topControlStyles.container}>
                    {state.showControls && (
                        <View style={topControlStyles.container}>
                            <View style={{ flex: 1 }}>{renderTopControls()}</View>
                            <View style={{ flex: 0.5 }}>{renderCenterControls()}</View>
                            <View style={{ flex: 1 }}>{renderBottomControls()}</View>
                        </View>
                    )}
                    {showTrackSelection && (
                        <SubTitleSelectionView
                            captionOptions={props.captionOptions!}
                            activeTextTrack={props.activeTextTrack}
                            onCancel={() => handleVideooptionsClose()}
                            onCaptionOptionSelected={props.onTextOptionSelected!}
                        />
                    )}
                    {showQualitySelection && (
                        <VideoQualitySelectionView
                            onCancel={() => handleVideooptionsClose()}
                            onVideoQualitySelected={props.onVideoQualitySelected!}
                        />
                    )}
                </View>
            </>
        </TouchableHighlight>
    );
};
