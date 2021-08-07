import React from 'react';
import { View } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { colors } from 'qp-common-ui';

interface PlayerPrefProps {
    /**
     * Determines if we should show playback quality options
     */
    showPlaybackQuality?: boolean;
    /**
     * List of subtitle tracks available that are sent from native PlayerController, or an empty list if no tracks are available.
     */
    captionOptions: string[];
    /**
     * List of audio tracks available that are sent from native PlayerController, or an empty list if no tracks are available.
     */
    audioOptions: string[];

    onAudioOptionSelected: (option: string) => void;

    onTextOptionSelected: (option: string) => void;
}

const OPT_PLAYBACK_QUALITY = 'Playback Quality';
const OPT_CAPTIONS = 'Captions';
const OPT_AUDIO = 'Audio';

let _actionSheetPlayerPrefRef: ActionSheet;
let _actionSheetSubtitleRef: ActionSheet;
let _actionSheetAudioRef: ActionSheet;
let _actionSheetQualityRef: ActionSheet;
let playerPrefOptionsSet: Set<string> = new Set(['Cancel']);
let playerPrefOptions: string[] = [];

//, 'Playback Quality', 'Captions', 'Audio'];
const playbackQualityOptions: string[] = ['Cancel', 'Low', 'Medium', 'High'];

export const showPlayerPrefSheet = (): void => {
    _actionSheetPlayerPrefRef.show();
};
/**
 * The React component which wraps the the list of action sheets to display the player setting preferences namely
 * subtitles, audio language and quality of streaming
 * @param {PlayerPrefProps} props
 */
export const PlayerPrefActionSheet = (props: PlayerPrefProps): JSX.Element => {
    const { captionOptions, audioOptions, showPlaybackQuality = true } = props;
    const showTracksActionSheet = (isSubtitle: boolean): void => {
        if (isSubtitle === true) {
            _actionSheetSubtitleRef.show();
        } else {
            _actionSheetAudioRef.show();
        }
    };

    const handlePressPlayerPrefItem = (index: any, options: any[]): any => {
        console.log('selected item index: ', options[index]);

        switch (options[index]) {
            case OPT_PLAYBACK_QUALITY:
                return _actionSheetQualityRef.show();
            case OPT_CAPTIONS:
                console.log('calling to set captions');
                return showTracksActionSheet(true);
            case OPT_AUDIO:
                return showTracksActionSheet(false);
        }
    };

    const handleSelectedTrack = (isSubtitle: boolean, trackName: string): void => {
        console.log(`selectTrack = ${isSubtitle}, ${trackName}`);
        if (isSubtitle) {
            props.onTextOptionSelected(trackName);
        } else {
            props.onAudioOptionSelected(trackName);
        }
    };

    const handleSelectedQuality = (value: string): void => {
        console.log(`quality = ${value}`);
        // Platform.OS === 'android'
        //     ? UIManager.dispatchViewManagerCommand(
        //           findNodeHandle(_playbackView),
        //           UIManager.getViewManagerConfig('VstbPlaybackView').Commands.qualitySelected,
        //           [value],
        //       )
        //     : playbackView.qualitySelected(findNodeHandle(_playbackView), value);
    };

    if (showPlaybackQuality) {
        playerPrefOptionsSet.add(OPT_PLAYBACK_QUALITY);
    }

    if (captionOptions.length > 0) {
        playerPrefOptionsSet.add(OPT_CAPTIONS);
    }

    // if only 1 (including `cancel`, do not show the option)
    if (audioOptions.length > 1) {
        playerPrefOptionsSet.add(OPT_AUDIO);
    }

    playerPrefOptions = Array.from(playerPrefOptionsSet);

    return (
        <View>
            <View>
                <ActionSheet
                    ref={component => (_actionSheetPlayerPrefRef = component as ActionSheet)}
                    options={playerPrefOptions}
                    cancelButtonIndex={0}
                    tintColor={colors.secondary}
                    onPress={index => {
                        handlePressPlayerPrefItem(index, playerPrefOptions);
                    }}
                />
            </View>
            {showPlaybackQuality && (
                <View>
                    <ActionSheet
                        ref={component => (_actionSheetQualityRef = component as ActionSheet)}
                        options={playbackQualityOptions}
                        cancelButtonIndex={0}
                        tintColor={colors.secondary}
                        onPress={index => {
                            handleSelectedQuality(playbackQualityOptions[index]);
                        }}
                    />
                </View>
            )}
            {captionOptions.length > 0 && (
                <View>
                    <ActionSheet
                        ref={component => (_actionSheetSubtitleRef = component as ActionSheet)}
                        options={captionOptions}
                        cancelButtonIndex={captionOptions.length - 1}
                        tintColor={colors.secondary}
                        onPress={index => {
                            if (index === captionOptions.length - 1) {
                                return;
                            }
                            handleSelectedTrack(true, captionOptions[index]);
                        }}
                    />
                </View>
            )}
            {audioOptions.length > 1 && (
                <View>
                    <ActionSheet
                        ref={component => (_actionSheetAudioRef = component as ActionSheet)}
                        options={audioOptions}
                        cancelButtonIndex={audioOptions.length - 1}
                        tintColor={colors.secondary}
                        onPress={index => {
                            if (index === audioOptions.length - 1) {
                                return;
                            }
                            handleSelectedTrack(false, audioOptions[index]);
                        }}
                    />
                </View>
            )}
        </View>
    );
};
