import React, { useState, useEffect, useRef } from 'react';
import {
    TouchableHighlight,
    View,
    Text,
    ScrollView,
    Platform,
    BackHandler,
    Animated,
    StyleProp,
    ViewStyle,
} from 'react-native';
import { colors } from 'qp-common-ui';
import { useDeviceOrientation } from 'qp-discovery-ui';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TrackInfo } from 'features/player/presentation/components/template/PlatformPlayer';
import { styles } from '../styles/PlayerCaptions.styles';
import { TextStyles } from 'rn-qp-nxg-player';

interface PlayerCaptionProps {
    /**
     * Application styling to override default styles
     */
    playerScreenStyles?: CaptionsStyle;
    /**
     * Current show/hide state of captions overlay
     */
    showSettings: boolean;
    /**
     * Determines if we should show/hide caption settings
     */
    setShowSettings: any;
    /**
     * Determines if we should show/hide all player controls
     */
    setDisableControls: any;
    /**
     * Determines if we should show playback quality options
     */
    showPlaybackQuality?: boolean;
    /**
     * List of subtitle tracks available that are sent from native PlayerController, or an empty list if no tracks are available.
     */
    captionOptions: TrackInfo[];
    /**
     * List of audio tracks available that are sent from native PlayerController, or an empty list if no tracks are available.
     */
    audioOptions: TrackInfo[];
    /**
     * Function to enable the selected audio track
     */
    onAudioOptionSelected: (option: string, languageCode: string) => void;
    /**
     * Function to enable the selected text track
     */
    onTextOptionSelected: (option: string, languageCode: string, textStyles?: TextStyles) => void;
    /**
     * State to enable/disable description
     */
    setshowDescription: (showDescription: boolean) => void;
}

export interface CaptionsStyle {
    /**
     * The style of the controls container in potrait mode.
     */
    potraitControlsContainerBackground?: StyleProp<ViewStyle>;
    /**
     * The style of the controls container in landscape mode.
     */
    landscapeControlsContainerBackground?: StyleProp<ViewStyle>;
    /**
     * The style of selection container
     */
    selectionContainerStyle?: StyleProp<ViewStyle>;
    /**
     * Text style of caption icon text
     */
    buttonText?: StyleProp<ViewStyle>;
    /**
     * Text style of subtitle/language button
     */
    captionText?: StyleProp<ViewStyle>;
    /**
     * Text style of container heading
     */
    headingText?: StyleProp<ViewStyle>;
    /**
     * Selected button style of available subtitle/language
     */
    selectedButtonStyle?: StyleProp<ViewStyle>;
    /**
     * Unselected button style of available subtitle/language
     */
    unselectedButtonStyle?: StyleProp<ViewStyle>;
}

const OPT_PLAYBACK_QUALITY = 'QUALITY';
const OPT_SUBTITLES = 'SUBTITLES';
const OPT_AUDIO = 'AUDIO';
const OPT_LANGUAGE = 'LANGUAGE';
const selectionColor = colors.secondary;
const isAndroidTV = Platform.OS === 'android' && Platform.isTV;

/**
 * Component to render caption settings page
 */
export const PlayerCaptionsView = (props: PlayerCaptionProps): JSX.Element => {
    const {
        playerScreenStyles = {},
        showSettings,
        setShowSettings,
        setDisableControls,
        captionOptions,
        audioOptions,
        onAudioOptionSelected,
        onTextOptionSelected,
        setshowDescription,
    } = props;

    const {
        potraitControlsContainerBackground,
        landscapeControlsContainerBackground,
        selectionContainerStyle,
        buttonText,
        captionText,
        headingText,
        selectedButtonStyle,
        unselectedButtonStyle,
    } = playerScreenStyles;

    const [showCaptionContainer, setshowCaptionContainer] = useState<boolean>(false);
    const [showQualityContainer, setshowQualityContainer] = useState<boolean>(false);
    const [isCaptionFocussed, setIsCaptionFocussed] = useState(false);
    const [isQualityfocussed, setIsQualityfocussed] = useState(false);
    const [isPortrait, setisPortrait] = useState<boolean>(true);
    const defaultCaptionStyles = styles(colors);

    useEffect(() => {
        const handleBackButtonPressAndroid = () => {
            if (showSettings) {
                setShowSettings(false);
                setDisableControls(false);
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
    }, []);

    const orientation = useDeviceOrientation();
    useEffect(() => {
        setisPortrait(orientation === 'PORTRAIT');
    }, [orientation]);

    /**
     * Renders 'Language' controls button above the player
     */
    const renderCaptionButton = () => {
        return (
            <TouchableHighlight
                underlayColor={''}
                style={defaultCaptionStyles.captionIcon}
                onFocus={() => setIsCaptionFocussed(true)}
                onBlur={() => setIsCaptionFocussed(false)}
                onPress={() => {
                    setshowQualityContainer(false);
                    setshowCaptionContainer(!showCaptionContainer);
                    setshowDescription(showCaptionContainer);
                }}>
                <View style={defaultCaptionStyles.iconContainer}>
                    <MaterialCommunityIcons
                        color={colors.primary}
                        size={40}
                        name={showCaptionContainer || isCaptionFocussed ? 'subtitles' : 'subtitles-outline'}
                    />
                    <Text style={[defaultCaptionStyles.captionText, captionText]}>{OPT_LANGUAGE}</Text>
                </View>
            </TouchableHighlight>
        );
    };
    /**
     * Renders 'Quality' controls button
     */
    const renderQualityButton = () => {
        return (
            <TouchableHighlight
                underlayColor={''}
                style={defaultCaptionStyles.qualityIcon}
                onFocus={() => setIsQualityfocussed(true)}
                onBlur={() => setIsQualityfocussed(false)}
                onPress={() => {
                    setshowCaptionContainer(false);
                    setshowQualityContainer(!showQualityContainer);
                    setshowDescription(showQualityContainer);
                }}>
                <View style={defaultCaptionStyles.iconContainer}>
                    <MaterialCommunityIcons
                        color={colors.primary}
                        size={40}
                        name={showQualityContainer || isQualityfocussed ? 'information' : 'information-outline'}
                    />
                    <Text style={[defaultCaptionStyles.captionText, captionText]}>{OPT_PLAYBACK_QUALITY}</Text>
                </View>
            </TouchableHighlight>
        );
    };

    /**
     * Renders close button
     */
    const renderCloseButton = () => {
        return (
            <View style={defaultCaptionStyles.closeContainer}>
                <TouchableHighlight
                    underlayColor={isAndroidTV ? selectionColor : ''}
                    onPress={() => {
                        setDisableControls(false);
                        setShowSettings(false);
                        setshowDescription(true);
                    }}>
                    <MaterialCommunityIcons color={colors.primary} size={40} name={'close'} />
                </TouchableHighlight>
            </View>
        );
    };
    /**
     * Renders all the controls above the player
     */
    const renderControls = () => {
        return (
            <View style={defaultCaptionStyles.centerIconsContainer}>
                <View style={defaultCaptionStyles.centerIcons}>
                    {renderCaptionButton()}
                    {renderQualityButton()}
                </View>
            </View>
        );
    };

    /**
     * Renders list of available audio tracks
     */
    const renderQualityContainer = () => {
        const qualityOptions: string[] = ['GOOD', 'BETTER', 'BEST'];
        return (
            <View style={defaultCaptionStyles.qualityContainer}>
                <Text style={[defaultCaptionStyles.headingText, headingText]}>{OPT_PLAYBACK_QUALITY}</Text>
                <ScrollView style={[!isPortrait && defaultCaptionStyles.ScrollViewStyle]}>
                    {renderButton(false, qualityOptions)}
                </ScrollView>
            </View>
        );
    };

    /**
     * Renders list of available audio tracks
     */
    const renderLanguageContainer = () => {
        return (
            <View style={defaultCaptionStyles.languageContainer}>
                <Text style={[defaultCaptionStyles.headingText, headingText]}>{OPT_AUDIO}</Text>
                <ScrollView style={[!isPortrait && defaultCaptionStyles.ScrollViewStyle]}>
                    {renderButton(false, audioOptions)}
                </ScrollView>
            </View>
        );
    };

    /**
     * Renders list of available text tracks
     */
    const renderSubtitleContainer = () => {
        captionOptions[0] !== 'OFF' && captionOptions.splice(0, 0, 'OFF');
        return (
            <View style={defaultCaptionStyles.captionContainer}>
                <Text style={[defaultCaptionStyles.headingText, headingText]}>{OPT_SUBTITLES}</Text>
                <ScrollView style={[!isPortrait && defaultCaptionStyles.ScrollViewStyle]}>
                    {renderButton(true, captionOptions)}
                </ScrollView>
            </View>
        );
    };
    /**
     * Create controls container above the player
     */
    const controlsContainer = () => {
        return (
            <>
                <View
                    style={
                        isPortrait
                            ? [
                                  defaultCaptionStyles.potraitControlsContainerBackground,
                                  potraitControlsContainerBackground,
                              ]
                            : [
                                  defaultCaptionStyles.landscapeControlsContainerBackground,
                                  landscapeControlsContainerBackground,
                              ]
                    }
                />
                <View
                    style={[
                        isPortrait
                            ? defaultCaptionStyles.potraitControlsContainer
                            : showQualityContainer || showCaptionContainer
                            ? defaultCaptionStyles.reducedLandscapeControlsContainer
                            : defaultCaptionStyles.landscapeControlsContainer,
                    ]}>
                    {!isAndroidTV && renderCloseButton()}
                    {renderControls()}
                </View>
            </>
        );
    };

    /**
     * Create selection container on pressing the caption options
     */
    const selectionContainer = () => {
        return (
            <View
                style={
                    isPortrait
                        ? [defaultCaptionStyles.selectionContainerStyle, selectionContainerStyle]
                        : defaultCaptionStyles.landscapeSelectionContainer
                }>
                <View
                    style={
                        isPortrait
                            ? defaultCaptionStyles.selectionContainerWrapper
                            : defaultCaptionStyles.landscapeSelectionContainerWrapper
                    }>
                    {renderLanguageContainer()}
                    {isPortrait && <View style={[defaultCaptionStyles.itemSeparatorStyle]} />}
                    {renderSubtitleContainer()}
                </View>
            </View>
        );
    };

    /**
     * Create quality container on pressing the button
     */
    const qualityContainer = () => {
        return (
            <View
                style={
                    isPortrait
                        ? [defaultCaptionStyles.selectionContainerStyle, selectionContainerStyle]
                        : defaultCaptionStyles.landscapeSelectionContainer
                }>
                <View
                    style={
                        isPortrait
                            ? defaultCaptionStyles.selectionContainerWrapper
                            : defaultCaptionStyles.landscapeSelectionContainerWrapper
                    }>
                    {renderQualityContainer()}
                </View>
            </View>
        );
    };
    /**
     * Button to display for the available set of subtitles and audio
     */
    const renderButton = (isSubtitle: boolean, captionOptions: string[], isActive = false) => {
        return captionOptions.map(displayText => (
            <TouchableHighlight
                underlayColor={isAndroidTV ? selectionColor : ''}
                activeOpacity={0.5}
                style={[
                    isActive
                        ? [defaultCaptionStyles.selectedButtonStyle, selectedButtonStyle]
                        : [defaultCaptionStyles.unselectedButtonStyle, unselectedButtonStyle],
                ]}
                onPress={() => {
                    handleSelectedTrack(isSubtitle, displayText);
                }}>
                <View style={[defaultCaptionStyles.buttonTextContainer]}>
                    {isActive && (
                        <Icon
                            //containerStyle={playerCaptionStyles.tickStyle}
                            //type="material"
                            color={colors.primary}
                            size={20}
                            name={'done'}
                        />
                    )}
                    <Text style={[defaultCaptionStyles.buttonText, buttonText]}>{displayText}</Text>
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
            onTextOptionSelected(trackName, '');
        } else {
            onAudioOptionSelected(trackName, '');
        }
    };

    const fadeAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
        }).start();
    }, [fadeAnim]);

    return (
        <Animated.View
            style={[
                isPortrait ? defaultCaptionStyles.rootContainer : defaultCaptionStyles.landscaperootContainer,
                { opacity: fadeAnim },
            ]}>
            {controlsContainer()}
            {showCaptionContainer && selectionContainer()}
            {showQualityContainer && qualityContainer()}
        </Animated.View>
    );
};
