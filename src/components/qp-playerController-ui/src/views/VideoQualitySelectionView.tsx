import React, { useEffect, useState } from 'react';
import { dimentionsValues } from 'qp-common-ui';
import { FlatList, TouchableOpacity, Modal, View, Text, TouchableWithoutFeedback } from 'react-native';
import { trackSelectionStyles } from '../styles/PlayerControls.style';
import LinearGradient from 'react-native-linear-gradient';
import CloseIcon from '../../assets/images/close.svg';
import RadioButtonUnSelected from '../../assets/images/radio_button_unselected.svg';
import RadioButtonSelected from '../../assets/images/radio_button_selected.svg';
import { getStreamQuality, StreamQuality } from 'utils/UserPreferenceUtils';

interface VideoQualitySelectionViewProps {
    onVideoQualitySelected: (streamQuality: StreamQuality) => void;
    onCancel?: () => void;
}

const VideoQualitySelectionView = (props: VideoQualitySelectionViewProps): JSX.Element => {
    const { onVideoQualitySelected, onCancel } = props;
    const [qualityIndex, setQualityIndex] = useState(0);
    const keyExtractor = (item: string) => String(item);
    const trackStyles = trackSelectionStyles();
    const videoQualityArray = [
        { id: 1, value: 'Auto' as StreamQuality },
        { id: 2, value: 'Low' as StreamQuality },
        { id: 3, value: 'Medium' as StreamQuality },
        { id: 4, value: 'High' as StreamQuality },
    ];

    useEffect(() => {
        const setActiveVideoQuality = async () => {
            const activeVideoQuality = await getStreamQuality();
            const index = videoQualityArray.findIndex(item => item.value === activeVideoQuality);
            setQualityIndex(index);
        };
        setActiveVideoQuality();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderItem = (item: StreamQuality, index: number) => {
        return (
            <TouchableOpacity onPress={() => onPressItem(item)}>
                <View style={trackStyles.videoQualityItem}>
                    {index === qualityIndex ? <RadioButtonSelected /> : <RadioButtonUnSelected />}
                    <Text style={[{ marginStart: dimentionsValues.xxxs }, trackStyles.renderItemTextStyle]}>
                        {item}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const onPressItem = (value: StreamQuality) => {
        const index = videoQualityArray.findIndex(item => item.value === value);
        setQualityIndex(index);
        onVideoQualitySelected(value);
    };

    return (
        <Modal
            animationType={'slide'}
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
            <TouchableWithoutFeedback>
                <View style={trackStyles.backgroundOverlay}>
                    <CloseIcon style={trackStyles.closeIconStyle} onPress={onCancel} />
                    <LinearGradient
                        colors={['#3B4046', '#2D3037']}
                        useAngle={true}
                        angle={180}
                        style={trackStyles.videoQualityPopupcontainer}>
                        <View>
                            <FlatList
                                data={videoQualityArray.map(item => item.value)}
                                renderItem={({ item, index }) => renderItem(item, index)}
                                keyExtractor={keyExtractor}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </LinearGradient>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
export default VideoQualitySelectionView;
