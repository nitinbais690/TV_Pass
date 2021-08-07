import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { Modal, View, Text } from 'react-native';
import { trackSelectionStyles } from '../styles/PlayerControls.style';
import { useDimensions } from '@react-native-community/hooks';
import { TrackInfo } from 'screens/components/PlatformPlayer';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import RoundChecked from '../../../../../assets/images/roundChecked.svg';
import CloseIcon from '../../../../../assets/images/close.svg';
import { Button as RNEButton } from 'react-native-elements';

export interface TrackSelectionProps {
    captionOptions: TrackInfo[];
    audioOptions: TrackInfo[];
    activeTextTrack?: string;
    activeAudioTrack?: string;
    onAudioOptionSelected: (option: string, languageCode: string) => void;
    onCaptionOptionSelected: (option: string, languageCode: string) => void;
    onCancel?: () => void;
}

const TrackSelectionView = (props: TrackSelectionProps): JSX.Element => {
    const { captionOptions, audioOptions, onAudioOptionSelected, onCaptionOptionSelected, onCancel } = props;
    const { width, height } = useDimensions().window;
    const [captionIndex, setCaptionIndex] = useState(0);
    const [audioIndex, setAudioIndex] = useState(0);
    const keyExtractor = (item: string) => String(item);
    const isPortrait = height > width;
    const showAudioOptions = false;

    const trackStyles = trackSelectionStyles(isPortrait);

    //Adding this to have 'NONE' empty track as default option in track selection
    let emptyTrack = {
        type: 'TEXT',
        displayName: 'Off',
        languageCode: '',
    };

    if (captionOptions.length === 0 || captionOptions[0].displayName !== 'Off') {
        captionOptions.splice(0, 0, emptyTrack);
    }

    useEffect(() => {
        //TODO: handle active audio track as well in future
        if (props.activeTextTrack) {
            const index = captionOptions.findIndex(item => item.displayName === props.activeTextTrack);
            setCaptionIndex(index);
        }
    }, [captionOptions, props.activeTextTrack]);

    const renderItem = (item: string, index: number, languageCode: string, type: string, disable: boolean) => {
        return (
            <TouchableOpacity disabled={disable} onPress={() => onPressItem(item, type, languageCode)}>
                <View style={trackStyles.rowContainer}>
                    <View>
                        <Text
                            style={[
                                trackStyles.renderItemTextStyle,
                                index === captionIndex || index === audioIndex
                                    ? trackStyles.renderItemTextEnabled
                                    : trackStyles.renderItemTextDisabled,
                            ]}>
                            {item}
                        </Text>
                    </View>
                    <View>
                        {type === 'caption'
                            ? index === captionIndex && <RoundChecked />
                            : index === audioIndex && <RoundChecked />}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const onPressItem = (value: string, type: string, languageCode: string) => {
        if (type === 'caption') {
            const index = captionOptions.findIndex(item => item.displayName === value);
            setCaptionIndex(index);
            onCaptionOptionSelected(value, languageCode);
        } else {
            const index = audioOptions.findIndex(item => item.displayName === value);
            setAudioIndex(index);
            onAudioOptionSelected(value, languageCode);
        }
    };

    return (
        <Modal
            animationType={'fade'}
            transparent
            hardwareAccelerated
            visible={true}
            supportedOrientations={[
                'portrait',
                'portrait-upside-down',
                'landscape',
                'landscape-left',
                'landscape-right',
            ]}
            onRequestClose={onCancel}>
            <View style={trackStyles.backgroundOverlay}>
                <BackgroundGradient>
                    <View style={trackStyles.close}>
                        <RNEButton icon={CloseIcon} titleStyle={{}} type="clear" onPress={onCancel} />
                    </View>
                    <View style={trackStyles.rootContainer}>
                        <View style={{ flex: 1, paddingTop: 10 }}>
                            <Text style={trackStyles.trackHeadingStyle}>Subtitles</Text>
                            <FlatList
                                data={captionOptions.map(item => item.displayName)}
                                renderItem={({ item, index }) =>
                                    renderItem(
                                        item,
                                        index,
                                        captionOptions[index].languageCode,
                                        'caption',
                                        captionOptions.length > 1 ? false : true,
                                    )
                                }
                                keyExtractor={keyExtractor}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                        {showAudioOptions && (
                            <View style={{ flex: 1 }}>
                                <Text style={trackStyles.trackHeadingStyle}>Audio</Text>
                                <FlatList
                                    data={audioOptions.map(item => item.displayName)}
                                    renderItem={({ item, index }) =>
                                        renderItem(
                                            item,
                                            index,
                                            audioOptions[index].languageCode,
                                            'audio',
                                            audioOptions.length > 1 ? false : true,
                                        )
                                    }
                                    keyExtractor={keyExtractor}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>
                        )}
                    </View>
                </BackgroundGradient>
            </View>
        </Modal>
    );
};
export default TrackSelectionView;
