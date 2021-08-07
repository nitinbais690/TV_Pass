import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, TouchableWithoutFeedback, Modal, View, Text } from 'react-native';
import { captionFormatStyle, captionSizeStyle, trackSelectionStyles } from '../styles/PlayerControls.style';
import { TrackInfo } from 'features/player/presentation/components/template/PlatformPlayer';
import PrimaryButton from './PrimaryButton';
import LinearGradient from 'react-native-linear-gradient';
import { colors, dimentionsValues, fonts } from 'qp-common-ui';
import CloseIcon from '../../assets/images/close.svg';
import { useLocalization } from 'contexts/LocalizationContext';
import { TextStyles } from 'rn-qp-nxg-player';

export interface SubTitleSelectionViewProps {
    captionOptions: TrackInfo[];
    activeTextTrack?: string;
    onCaptionOptionSelected: (option: string, languageCode: string, textStyles?: TextStyles) => void;
    onCancel?: () => void;
}

const SubTitleSelectionView = (props: SubTitleSelectionViewProps): JSX.Element => {
    const { strings } = useLocalization();
    const { captionOptions, onCaptionOptionSelected, onCancel } = props;
    const [captionSizeIndex, setCaptionSizeIndex] = useState(0);
    const [captionFormatIndex, setCaptionFormatIndex] = useState(0);
    const [captionSelected, setLanguageCode] = useState(false);
    let initialcaptionStyle: TextStyles = {
        subtitleFontSize: fonts.sm,
        subtitleBackgroundColor: colors.black,
        subtitleForegroundColor: colors.primary,
        subtitleTextColor: colors.transparent,
    };
    const [captionStyle, setCaptionStyle] = useState<TextStyles>(initialcaptionStyle);
    const keyExtractor = (item: any) => String(item);
    const trackStyles = trackSelectionStyles();
    const captionSetupArray = [
        { id: 1, value: 'Aa' },
        { id: 2, value: 'Aa' },
        { id: 3, value: 'Aa' },
        { id: 4, value: 'Aa' },
        { id: 5, value: 'Aa' },
    ];

    //Adding this to have 'Off' empty track as default option in track selection
    let emptyTrack = {
        type: 'TEXT',
        displayName: 'Off',
        languageCode: '',
    };

    if (captionOptions[0].displayName !== 'Off') {
        captionOptions.splice(1, 1, emptyTrack);
    }

    const [captionIndex, setCaptionIndex] = useState(captionOptions.length - 1);

    useEffect(() => {
        setCaptionSizeIndex(0);
        setCaptionFormatIndex(0);

        if (props.activeTextTrack) {
            const index = captionOptions.findIndex(item => item.displayName === props.activeTextTrack);
            const languageCode = captionOptions[index].languageCode;
            setLanguageCode(languageCode.length > 0);
            setCaptionIndex(index);
        } else {
            setLanguageCode(false);
            setCaptionIndex(captionOptions.length - 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderItem = (item: string, index: number, languageCode: string, disable: boolean) => {
        return (
            <TouchableOpacity
                style={{ alignSelf: 'center', paddingEnd: dimentionsValues.md }}
                disabled={disable}
                onPress={() => onPressItem(item, languageCode)}>
                <View>
                    {index === captionIndex ? (
                        <PrimaryButton
                            containerStyle={trackStyles.renderSelectedItemContainerStyle}
                            titleStyle={trackStyles.renderSelectedItemTextStyle}
                            title={item}
                        />
                    ) : (
                        <Text style={trackStyles.renderItemTextStyle}>{item}</Text>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const textSizeItem = (item: string, index: number) => {
        return (
            <TouchableOpacity onPress={() => onPressTextSizeItem(index)}>
                <View style={trackStyles.captionFormatItem}>
                    <Text
                        style={[
                            captionSizeStyle.captionSizeColor,
                            getCaptionSizeStyle(index),
                            index === captionSizeIndex && trackStyles.selectedCaptionTextSizeStyle,
                        ]}>
                        {item}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const captionFormatItem = (item: string, index: number) => {
        return (
            <TouchableOpacity onPress={() => onPressCaptionFormatItem(index)}>
                <View style={trackStyles.captionFormatItem}>
                    <Text
                        style={[
                            getCaptionFormatStyle(index),
                            index === captionFormatIndex && trackStyles.selectedCaptionFormatStyle,
                        ]}>
                        {item}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const onPressItem = (value: string, languageCode: string) => {
        const index = captionOptions.findIndex(item => item.displayName === value);
        setCaptionIndex(index);
        setLanguageCode(languageCode.length > 0);
        onCaptionOptionSelected(value, languageCode);
    };

    const onPressTextSizeItem = (index: number) => {
        setCaptionSizeIndex(index);
        setCaptionSize(index);
    };

    const onPressCaptionFormatItem = (index: number) => {
        setCaptionFormatIndex(index);
        setCaptionColor(index);
    };

    function getCaptionSizeStyle(index: number) {
        switch (index) {
            case 0:
                return captionSizeStyle.captionSize1;
            case 1:
                return captionSizeStyle.captionSize2;
            case 2:
                return captionSizeStyle.captionSize3;
            case 3:
                return captionSizeStyle.captionSize4;
            case 4:
                return captionSizeStyle.captionSize5;
            default:
                return {};
        }
    }

    function getCaptionFormatStyle(index: number) {
        switch (index) {
            case 0:
                return captionFormatStyle.captionFormat1;
            case 1:
                return captionFormatStyle.captionFormat2;
            case 2:
                return captionFormatStyle.captionFormat3;
            case 3:
                return captionFormatStyle.captionFormat4;
            case 4:
                return captionFormatStyle.captionFormat5;
            default:
                return {};
        }
    }

    function setCaptionSize(index: number) {
        let captionFontSize;
        switch (index) {
            case 0:
                captionFontSize = fonts.xxs;
                break;
            case 1:
                captionFontSize = fonts.xs;
                break;
            case 2:
                captionFontSize = fonts.sm;
                break;
            case 3:
                captionFontSize = fonts.md;
                break;
            case 4:
                captionFontSize = fonts.lg;
                break;
            default:
                captionFontSize = fonts.sm;
                break;
        }
        setCaptionStyle({ ...captionStyle, subtitleFontSize: captionFontSize });
    }

    function setCaptionColor(index: number) {
        let captionBackgroundColor;
        let cationTextColor;
        switch (index) {
            case 0:
                captionBackgroundColor = colors.black;
                cationTextColor = colors.primary;
                break;
            case 1:
                captionBackgroundColor = '#BCBDBE';
                cationTextColor = colors.primary;
                break;
            case 2:
                captionBackgroundColor = colors.black;
                cationTextColor = '#E3DB30';
                break;
            case 3:
                captionBackgroundColor = colors.primary;
                cationTextColor = colors.black;
                break;
            case 4:
                captionBackgroundColor = '#97989C';
                cationTextColor = colors.black;
                break;
        }
        setCaptionStyle({
            ...captionStyle,
            subtitleBackgroundColor: captionBackgroundColor,
            subtitleForegroundColor: cationTextColor,
        });
    }

    function onCloseClick() {
        onCaptionOptionSelected(
            captionOptions[captionIndex].displayName,
            captionOptions[captionIndex].languageCode,
            captionStyle,
        );

        if (onCancel) {
            onCancel();
        }
    }

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
                    {captionSelected && (
                        <Text
                            style={[
                                trackStyles.captionSampleTextStyle,
                                getCaptionFormatStyle(captionFormatIndex),
                                getCaptionSizeStyle(captionSizeIndex),
                            ]}>
                            {strings['caption.sample_text']}
                        </Text>
                    )}
                    <CloseIcon style={trackStyles.closeIconStyle} onPress={onCloseClick} />
                    <LinearGradient
                        colors={['#3B4046', '#2D3037']}
                        useAngle={true}
                        angle={180}
                        style={trackStyles.rootContainer}>
                        <View>
                            <FlatList
                                data={captionOptions.map(item => item.displayName)}
                                renderItem={({ item, index }) =>
                                    renderItem(
                                        item,
                                        index,
                                        captionOptions[index].languageCode,
                                        captionOptions.length > 1 ? false : true,
                                    )
                                }
                                keyExtractor={keyExtractor}
                                horizontal={true}
                                showsVerticalScrollIndicator={false}
                            />
                            {captionSelected && (
                                <View style={[trackStyles.captionFormatContainer]}>
                                    <Text style={trackStyles.subTitleOptionText}>Size</Text>
                                    <FlatList
                                        style={{ marginStart: dimentionsValues.sm }}
                                        data={captionSetupArray.map(item => item)}
                                        renderItem={({ item, index }) => textSizeItem(item.value, index)}
                                        keyExtractor={item => item.id.toString()}
                                        horizontal={true}
                                        showsVerticalScrollIndicator={false}
                                    />
                                </View>
                            )}
                            {captionSelected && (
                                <View style={[trackStyles.captionFormatContainer]}>
                                    <Text style={trackStyles.subTitleOptionText}>Format</Text>
                                    <FlatList
                                        data={captionSetupArray.map(item => item)}
                                        renderItem={({ item, index }) => captionFormatItem(item.value, index)}
                                        keyExtractor={item => item.id.toString()}
                                        horizontal={true}
                                        showsVerticalScrollIndicator={false}
                                    />
                                </View>
                            )}
                        </View>
                    </LinearGradient>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default SubTitleSelectionView;
