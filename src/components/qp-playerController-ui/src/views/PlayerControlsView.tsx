import React, { useReducer, useRef, useState, useEffect, useImperativeHandle, Dispatch, SetStateAction } from 'react';
import { Animated, TouchableHighlight, View, Text, Platform } from 'react-native';
import { useDimensions, useLayout } from '@react-native-community/hooks';
import SystemSetting from 'react-native-system-setting';
import {
    playerBottomControlsStyles,
    playerCenterControlsStyles,
    playerTopControlsStyles,
} from '../styles/PlayerControls.style';
import RewindIcon from '../../assets/images/rewind.svg';
import ForwardIcon from '../../assets/images/forward.svg';
import PlayIcon from '../../assets/images/play.svg';
import PauseIcon from '../../assets/images/pause.svg';
import TracksIcon from '../../assets/images/tracks.svg';
import MuteIcon from '../../assets/images/mute.svg';
import UnMuteIcon from '../../assets/images/unmute.svg';
import CloseIcon from '../../assets/images/close.svg';
import { colors } from 'qp-common-ui';
import Slider from '@react-native-community/slider';
import { visualizeVideoDuration } from '../utils/utils';
import { useSafeArea } from 'react-native-safe-area-context';
import TrackSelectionView from './TracksSelectionView';
import { PlaybackStateValue, QpNxgAirplayView } from 'rn-qp-nxg-player';
import { ResourceVm } from 'qp-discovery-ui';
import { CastButton } from 'react-native-google-cast';
import { TrackInfo } from 'screens/components/PlatformPlayer';
import { PinchGestureHandler, PinchGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';

export type CastType = 'Chromecast' | 'Airplay';

export type PlayerControlsActions = {
    show: () => void;
    hide: () => void;
};

export interface PlayControllerProps {
    currentTime: number;
    contentTitle?: string;
    isCasting: boolean;
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
    onMuteToggle?: (isMuted: boolean) => void;
    onRewindPress?: () => void;
    onForwardPress?: () => void;
    onAirPlayPress?: () => void;
    onCastPress?: () => void;
    onSlidingComplete?: (value: number) => void;
    captionOptions?: TrackInfo[];
    audioOptions?: TrackInfo[];
    activeTextTrack?: string;
    activeAudioTrack?: string;
    onAudioOptionSelected?: (option: string, languageCode: string) => void;
    onTextOptionSelected?: (option: string, languageCode: string) => void;
    heightState: [string, Dispatch<SetStateAction<string>>];
    widthState: [string, Dispatch<SetStateAction<string>>];
    _onGestureStateChange?: ((event: PinchGestureHandlerStateChangeEvent) => void) | undefined;
}

const playerProps = {
    controlTimeoutDelay: 3000,
    controlTimeout: 0,
};

let lastPress = 0;

export const PlayerControlsView = React.forwardRef<PlayerControlsActions, PlayControllerProps>(
    (props, ref): JSX.Element => {
        const isMounted = useRef(true);
        const insets = useSafeArea();
        const { onLayout, ...layout } = useLayout();
        let hideAnimationTimeoutId = useRef<number | undefined>();
        const [showTrackSelection, setShowTrackSelection] = useState(false);
        const { width, height } = useDimensions().window;
        const [sliding, setSliding] = useState(false);
        const [seekedTo, setSeekedTo] = useState<number>(0);
        const [seekVolumeTo, setSeekVolumeTo] = useState<number>(0);
        const [showVolumeIcon, setShowVolumeIcon] = useState(true);
        const [muted, setMuted] = useState(false);

        const isPortrait = height > width;
        const centerControlStyles = playerCenterControlsStyles();
        const topControlStyles = playerTopControlsStyles(insets, isPortrait);
        const bottomControlStyles = playerBottomControlsStyles(insets, isPortrait);

        const initialValue = props.showOnStart ? 1 : 0;
        const onDoublePress = () => {
            const time = new Date().getTime();
            const delta = time - lastPress;
            const DOUBLE_PRESS_DELAY = 250;
            const screenSize = props.heightState[0] === '100%' ? '120%' : '100%';
            if (delta < DOUBLE_PRESS_DELAY) {
                props.heightState[1](screenSize);
                props.widthState[1](screenSize);
            }
            lastPress = time;
        };

        useEffect(() => {
            isMounted.current = true;

            let volumeListener = SystemSetting.addVolumeListener(({ value }) => {
                setSeekVolumeTo(value * 100);
            });

            return () => {
                isMounted.current = false;
                if (volumeListener) {
                    SystemSetting.removeVolumeListener(volumeListener);
                }
            };
        }, []);

        useImperativeHandle(ref, () => ({
            show: () => {
                setState({ name: 'showControls', value: true });
                showControlAnimation();
                setState({ name: 'showingOverlay', value: false });
            },
            hide: () => {
                hideControlAnimation(0);
                setState({ name: 'showingOverlay', value: true });
            },
        }));

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
            showingOverlay: false,
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
                case 'showingOverlay':
                    return { ...state, showingOverlay: action.value };
            }
        };
        const [state, setState] = useReducer(controlsReducer, initialState);

        useEffect(() => {
            if (!isMounted.current) {
                return;
            }
            if (hideAnimationTimeoutId.current && (props.isCasting || props.playbackState === 'PAUSED')) {
                clearTimeout(hideAnimationTimeoutId.current);
            }

            if (state.showingOverlay) {
                // do not show controls when showing an overlay
                return;
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
                        toValue: 0,
                        delay: 0,
                        useNativeDriver: true,
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

        const showControlAnimation = async () => {
            Animated.parallel([
                Animated.timing(animations.topControl.opacity, { toValue: 1, useNativeDriver: true }),
                Animated.timing(animations.topControl.marginTop, { toValue: 1, useNativeDriver: true }),
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

        const handlePlayPause = async () => {
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

        const handleRewind = async () => {
            const value = Math.max(0, props.currentTime - 15000);
            setSeekedTo(value);
            if (props.onRewindPress) {
                props.onRewindPress();
            }
        };

        const handleFastFwd = async () => {
            const value = Math.min(props.playbackDuration, props.currentTime + 15000);
            setSeekedTo(value);
            if (props.onForwardPress) {
                props.onForwardPress();
            }
        };

        const handleTracksSelectionEvent = () => {
            setShowTrackSelection(true);
        };

        const handleVolumeEvent = async () => {
            if (props.castType === 'Airplay') {
                setMuted(!muted);
                props.onMuteToggle && props.onMuteToggle(!muted);
            } else {
                setShowVolumeIcon(false);
            }
        };

        const handleOnScreenTouch = async () => {
            if (props.isCasting && state.showControls) {
                return;
            }

            const show: boolean = !state.showControls;
            if (show === true) {
                await showControlAnimation();
            } else {
                hideControlAnimation(0);
            }
            setShowVolumeIcon(true);
            setState({ name: 'showControls', value: show });
        };

        const renderProgress = (): JSX.Element => {
            const currentDuration = props.playbackDuration! - props.currentTime!;
            return (
                <View style={[bottomControlStyles.durationContainer]}>
                    <Text style={bottomControlStyles.timerText}>{visualizeVideoDuration(currentDuration!)}</Text>
                </View>
            );
        };

        const renderSeekBar = (): JSX.Element => {
            const hideRealProgress = sliding || props.isLoading;
            const value = hideRealProgress ? seekedTo : props.currentTime;
            const currentTime = visualizeVideoDuration(value);
            const percentComplete = props.playbackDuration! > 0 ? (value / props.playbackDuration!) * 100 : 0;
            const textWidth = 100;
            const textCenter = textWidth / 2;
            const thumbSize = 25;
            const thumbOffset = (percentComplete * thumbSize) / 100 - thumbSize / 2;
            const left = Math.max((percentComplete * layout.width) / 100, 0) - (textCenter + thumbOffset);

            return (
                <View style={[bottomControlStyles.sliderContainer]}>
                    <View style={bottomControlStyles.sliderWrapper}>
                        <Slider
                            onLayout={onLayout}
                            maximumValue={props.playbackDuration}
                            minimumValue={0}
                            step={1}
                            value={value}
                            style={bottomControlStyles.slider}
                            onSlidingStart={() => {
                                setSliding(true);
                            }}
                            onSlidingComplete={(value: number) => {
                                setSliding(false);
                                hideControlAnimation(playerProps.controlTimeoutDelay);
                                if (props.onSlidingComplete) {
                                    props.onSlidingComplete(value);
                                }
                            }}
                            onValueChange={(value: number) => {
                                setSeekedTo(value);
                                setState({ name: 'pauseState', value: false });
                                hideControlAnimation(playerProps.controlTimeoutDelay);
                            }}
                            thumbTintColor={colors.brandTint}
                            minimumTrackTintColor={colors.brandTint}
                            maximumTrackTintColor={'rgba(256, 256, 256, 0.2)'}
                        />
                        <Text style={[bottomControlStyles.currentTime, { left: left, width: textWidth }]}>
                            {currentTime}
                        </Text>
                    </View>
                    {renderProgress()}
                </View>
            );
        };
        const renderBottomControls = () => {
            const seekBarControl = renderSeekBar();
            const value = seekVolumeTo;
            let volumeIcon;
            if (props.castType === 'Airplay') {
                volumeIcon = muted ? <MuteIcon /> : <UnMuteIcon />;
            } else {
                volumeIcon = seekVolumeTo > 0 ? <UnMuteIcon /> : <MuteIcon />;
            }

            const mainResource = props.resource;
            let name = mainResource && mainResource.name;
            if (mainResource && mainResource.type === 'tvepisode') {
                name = `${mainResource.name}: S${mainResource.seasonNumber} E${mainResource.episodeNumber}`;
            }
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
                    <View style={bottomControlStyles.titleContainer}>
                        <View>
                            {props.isCasting && <Text style={bottomControlStyles.titleText}>{props.castLabel}</Text>}
                            {props.resource && <Text style={bottomControlStyles.titleText}>{name}</Text>}
                            {props.resource && (
                                <Text style={bottomControlStyles.captionText}>{props.resource.network}</Text>
                            )}
                            {props.resource && (
                                <Text style={[bottomControlStyles.captionText]}>{props.resource.releaseYear}</Text>
                            )}
                        </View>
                        <View style={bottomControlStyles.volumeContainer}>
                            {!showVolumeIcon && (
                                <Slider
                                    onLayout={onLayout}
                                    maximumValue={100}
                                    minimumValue={0}
                                    step={1}
                                    value={value}
                                    style={bottomControlStyles.volumeSlider}
                                    onSlidingComplete={(value: number) => {
                                        console.debug('Volume onSlideComplete ', value);
                                        hideControlAnimation(playerProps.controlTimeoutDelay);
                                        setShowVolumeIcon(true);
                                    }}
                                    onValueChange={(value: number) => {
                                        setSeekVolumeTo(value);
                                        SystemSetting.setVolume(value / 100);
                                        hideControlAnimation(playerProps.controlTimeoutDelay);
                                        props.handleVolumeToggle && props.handleVolumeToggle(value / 100);
                                    }}
                                    thumbTintColor={colors.primary}
                                    minimumTrackTintColor={colors.primary}
                                    maximumTrackTintColor={'rgba(256, 256, 256, 0.2)'}
                                />
                            )}
                            {(showVolumeIcon || props.castType === 'Airplay') &&
                                renderControlIcon(
                                    'VolumeButton',
                                    volumeIcon,
                                    handleVolumeEvent,
                                    bottomControlStyles.icon,
                                )}
                        </View>
                    </View>
                    {seekBarControl}
                </Animated.View>
            );
        };

        const renderControlIcon = (
            accessibilityLabel: string,
            children: any,
            callback: any,
            style = {},
        ): JSX.Element => {
            return (
                <TouchableHighlight
                    accessibilityLabel={accessibilityLabel}
                    underlayColor={colors.backgroundInactiveSelected}
                    onPress={() => {
                        if (callback) {
                            //  hideControlAnimation(playerProps.controlTimeoutDelay);
                            callback();
                        }
                    }}
                    style={[style]}>
                    {children}
                </TouchableHighlight>
            );
        };

        const renderTopControls = () => {
            return (
                <Animated.View
                    style={[
                        topControlStyles.top,
                        {
                            opacity: state.animations.topControl.opacity,
                        },
                    ]}>
                    <View style={topControlStyles.rootContainer}>
                        <View style={{ flexDirection: 'row' }}>
                            {renderControlIcon(
                                'TracksButton',
                                <TracksIcon />,
                                handleTracksSelectionEvent,
                                topControlStyles.moreControlsIconContainer,
                            )}
                            {Platform.OS === 'ios' && !props.isDownloadedContentPlayback && (
                                <QpNxgAirplayView style={topControlStyles.castIconContainer} />
                            )}
                            {props.showCastIcon && (
                                <CastButton
                                    style={[
                                        props.isCasting && props.castType === 'Chromecast'
                                            ? topControlStyles.activeCastIcon
                                            : topControlStyles.castIconContainer,
                                    ]}
                                />
                            )}
                        </View>
                        <View>
                            {renderControlIcon('CloseButton', <CloseIcon />, props.onBackPress, [
                                topControlStyles.moreControlsIconContainer,
                            ])}
                        </View>
                    </View>
                </Animated.View>
            );
        };

        const renderCenterControls = () => {
            const PlayStateIcon = state.paused === true ? PlayIcon : PauseIcon;
            return (
                <Animated.View
                    style={[centerControlStyles.center, { opacity: state.animations.centerControl.opacity }]}>
                    <View style={{ flexDirection: 'row' }}>
                        {renderControlIcon('RewindButton', <RewindIcon />, handleRewind, {
                            marginRight: '10%',
                            ...centerControlStyles.icon,
                        })}
                        {renderControlIcon('Play', <PlayStateIcon />, handlePlayPause, [
                            centerControlStyles.icon,
                            props.isLoading ? { opacity: 0 } : {},
                        ])}
                        {renderControlIcon('ForwardButton', <ForwardIcon />, handleFastFwd, {
                            marginLeft: '10%',
                            ...centerControlStyles.icon,
                        })}
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
                    <PinchGestureHandler onHandlerStateChange={props._onGestureStateChange}>
                        <View onStartShouldSetResponder={() => onDoublePress()} style={topControlStyles.container}>
                            {state.showControls && (
                                <View style={topControlStyles.container}>
                                    <View style={{ flex: 1 }}>{renderTopControls()}</View>
                                    <View style={{ flex: 2 }}>{renderCenterControls()}</View>
                                    <View style={{ flex: 1 }}>{renderBottomControls()}</View>
                                </View>
                            )}
                            {showTrackSelection && (
                                <TrackSelectionView
                                    captionOptions={props.captionOptions!}
                                    audioOptions={props.audioOptions!}
                                    activeTextTrack={props.activeTextTrack}
                                    activeAudioTrack={props.activeAudioTrack}
                                    onCancel={() => setShowTrackSelection(false)}
                                    onCaptionOptionSelected={props.onTextOptionSelected!}
                                    onAudioOptionSelected={props.onAudioOptionSelected!}
                                />
                            )}
                        </View>
                    </PinchGestureHandler>
                </>
            </TouchableHighlight>
        );
    },
);
