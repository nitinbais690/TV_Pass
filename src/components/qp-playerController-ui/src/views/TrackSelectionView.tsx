import React, { useEffect, useState } from 'react';
import { colors, padding, selectDeviceType } from 'qp-common-ui';
import { FlatList, TouchableOpacity, Modal, View, Text, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { trackSelectionStyles } from '../styles/PlayerControls.style';
import { TrackInfo } from 'features/player/presentation/components/template/PlatformPlayer';

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
    const [captionIndex, setCaptionIndex] = useState(0);
    const [audioIndex, setAudioIndex] = useState(0);
    const keyExtractor = (item: string) => String(item);
    const radioButtonSize = selectDeviceType({ Tablet: 24 }, 20);
    const showAudioOptions = false;

    const trackStyles = trackSelectionStyles();

    //Adding this to have 'NONE' empty track as default option in track selection
    let emptyTrack = {
        type: 'TEXT',
        displayName: 'NONE',
        languageCode: '',
    };

    if (captionOptions.length === 0 || captionOptions[0].displayName !== 'NONE') {
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
                    <View style={{ marginRight: padding.xs(true) }}>
                        <Icon
                            name={
                                type === 'caption'
                                    ? index === captionIndex
                                        ? 'check-circle'
                                        : 'radio-button-unchecked'
                                    : index === audioIndex
                                    ? 'check-circle'
                                    : 'radio-button-unchecked'
                            }
                            color={colors.brandTint}
                            size={radioButtonSize}
                        />
                    </View>
                    <Text style={trackStyles.renderItemTextStyle}>{item}</Text>
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
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={trackStyles.backgroundOverlay}>
                    <View style={trackStyles.rootContainer}>
                        <View style={{ flex: 1 }}>
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
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
export default TrackSelectionView;
