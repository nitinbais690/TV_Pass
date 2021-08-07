import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    StyleProp,
    ViewStyle,
    TextStyle,
    ImageStyle,
    Platform,
    Modal,
    TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { ResourceVm } from '../models/ViewModels';
import { fonts, colors, padding, dimensions, AspectRatioUtil, AspectRatio, percentage } from 'qp-common-ui';
import ResizableImage from './ResizableImage';

const closeIconSize: number = 40;

const defaultEpgOverlayViewStyle = StyleSheet.create({
    overlayImageStyle: {
        width: dimensions.epgOverlayImageWidth,
        overflow: 'hidden',
        borderRadius: 5,
        height: Platform.isTV ? dimensions.epgOverlayImageHeightTV : dimensions.epgOverlayImageHeight,
        margin: padding.xs(),
        alignSelf: 'stretch',
        marginTop: Platform.isTV ? padding.xs() : padding.lg(),
        backgroundColor: colors.backgroundGrey,
        justifyContent: 'center',
        alignItems: 'center',
        padding: padding.sm(),
    },
    playIconStyle: {
        width: Platform.isTV ? percentage(15, true) : percentage(30, true),
        height: Platform.isTV ? percentage(15, true) : percentage(30, true),
        resizeMode: 'contain',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        tintColor: colors.brandTint,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayTextContainerStyle: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    overlayTextItemStyle: {
        margin: padding.xxs(),
        color: colors.secondary,
        textAlign: 'left',
        textShadowColor: colors.primary,
        fontSize: Platform.isTV ? fonts.xxxs : fonts.xs,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        flex: 1,
        width: Platform.isTV ? dimensions.fullWidth / 2 : dimensions.fullWidth,
        height: dimensions.fullHeight,
        left: Platform.isTV ? dimensions.fullWidth / 4 : 0,
        backgroundColor: Platform.isTV ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.97)',
    },
    closeIconStyle: {
        padding: padding.sm(),
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
        alignItems: 'flex-end',
    },
});

export interface EpgOverlayStyleProps<T> {
    /**
     * Must be either `ResourceVm` or one of its extensions
     */
    resource: T;
    /**
     * Called when the touch is released,
     * but not if cancelled (e.g. by a scroll that steals the responder lock).
     */
    onResourcePress: (resource: T) => void;
    /**
     * The style of the detail page poster and info container
     */
    epgOverlayViewStyle?: EpgOverlayViewStyle;
    /**
     * called when the back key pressed on overlay modal view
     */
    onBackPress: () => void;
}

export interface EpgOverlayViewStyle {
    /**
     * The style of the image view container(Image)
     */
    overlayImageStyle?: StyleProp<ImageStyle>;
    /**
     * The style of the overly text item(Text)
     */
    overlayTextItemStyle?: StyleProp<TextStyle>;
    /**
     * The style of the overly play icon style(Image)
     */
    playIconStyle?: StyleProp<ImageStyle>;
    /**
     * The style of the overly button container(View)
     */
    buttonContainer?: StyleProp<ViewStyle>;
    /**
     * The style of the overly text item(Text)
     */
    overlayTextContainerStyle?: StyleProp<ViewStyle>;
    /**
     * The style of the root container
     */
    container?: StyleProp<ViewStyle>;
    /**
     * The style of the overly modal container
     */
    modal?: StyleProp<ViewStyle>;
    /**
     * The style of the overly modal close icon style
     */
    closeIconStyle?: StyleProp<ViewStyle>;
}

export const EpgScheduleOverlayView = <T extends ResourceVm>(props: EpgOverlayStyleProps<T>): JSX.Element => {
    const { resource, onResourcePress, onBackPress, epgOverlayViewStyle = {} } = props;
    let resourceItem: any = resource;

    const imageAspectRatio = 16 / 9;
    const aspectRatioKey = AspectRatioUtil.asString(imageAspectRatio as AspectRatio);
    const href =
        (resourceItem.images && resourceItem.images[aspectRatioKey]) ||
        (resourceItem.image && resourceItem.image.href) ||
        '';

    const startHours = new Date(resourceItem.startTime * 1000).getHours();
    const startMin = '0' + new Date(resourceItem.startTime * 1000).getMinutes();
    const formattedStartTime = startHours + ':' + startMin.substr(-2);

    const endHours = new Date(resourceItem.endTime * 1000).getHours();
    const endMin = '0' + new Date(resourceItem.endTime * 1000).getMinutes();
    const formattedEndTime = endHours + ':' + endMin.substr(-2);

    const formattedDuration = formattedStartTime + ' - ' + formattedEndTime;

    const scheduleName = resourceItem.name;
    const season = resourceItem.seasonNumber;
    const episodeNumber = resourceItem.episodeNumber;
    let seasonDetails;
    if (season && episodeNumber && season !== -1 && episodeNumber !== -1) {
        seasonDetails = `Season: ${season}, Episode: ${episodeNumber}`;
    }
    const description = resourceItem.shortDescription;
    return (
        <View testID={'modalView'} style={[defaultEpgOverlayViewStyle.container, epgOverlayViewStyle.container]}>
            <Modal
                animationType={'slide'}
                transparent={true}
                visible={true}
                hardwareAccelerated
                onRequestClose={() => {
                    onBackPress();
                }}>
                <View style={[defaultEpgOverlayViewStyle.modal, epgOverlayViewStyle.modal]}>
                    {Platform.isTV ? (
                        <></>
                    ) : (
                        <View>
                            <TouchableOpacity
                                style={[defaultEpgOverlayViewStyle.closeIconStyle, epgOverlayViewStyle.closeIconStyle]}
                                onPress={() => {
                                    onBackPress();
                                }}
                                testID={'closeButton'}
                                accessibilityLabel={'Close'}>
                                <Icon type="ionicon" color={colors.brandTint} name={'md-close'} size={closeIconSize} />
                            </TouchableOpacity>
                        </View>
                    )}
                    <ResizableImage
                        keyId={resourceItem.id || ''}
                        style={[defaultEpgOverlayViewStyle.overlayImageStyle, epgOverlayViewStyle.overlayImageStyle]}
                        source={{ uri: href }}
                    />

                    <View
                        testID={'detailsContainer'}
                        style={[
                            defaultEpgOverlayViewStyle.overlayTextContainerStyle,
                            epgOverlayViewStyle.overlayTextContainerStyle,
                        ]}>
                        {scheduleName && (
                            <Text
                                style={[
                                    defaultEpgOverlayViewStyle.overlayTextItemStyle,
                                    epgOverlayViewStyle.overlayTextItemStyle,
                                    { fontSize: Platform.isTV ? fonts.xs : fonts.md },
                                ]}>
                                {scheduleName}{' '}
                            </Text>
                        )}
                        {seasonDetails && (
                            <Text
                                style={[
                                    defaultEpgOverlayViewStyle.overlayTextItemStyle,
                                    epgOverlayViewStyle.overlayTextItemStyle,
                                    { fontSize: Platform.isTV ? fonts.xxs : fonts.sm },
                                ]}>
                                {seasonDetails}
                            </Text>
                        )}
                        {description && (
                            <Text
                                numberOfLines={6}
                                ellipsizeMode={'tail'}
                                style={[
                                    defaultEpgOverlayViewStyle.overlayTextItemStyle,
                                    epgOverlayViewStyle.overlayTextItemStyle,
                                ]}>
                                {description}{' '}
                            </Text>
                        )}
                        {formattedDuration && (
                            <Text
                                style={[
                                    defaultEpgOverlayViewStyle.overlayTextItemStyle,
                                    epgOverlayViewStyle.overlayTextItemStyle,
                                ]}>
                                {formattedDuration}{' '}
                            </Text>
                        )}
                    </View>

                    <View style={[defaultEpgOverlayViewStyle.buttonContainer, epgOverlayViewStyle.buttonContainer]}>
                        <TouchableOpacity
                            testID={'playIcon'}
                            accessibilityLabel={'Play Icon'}
                            activeOpacity={0.6}
                            hasTVPreferredFocus
                            onPress={() => onResourcePress(resourceItem)}>
                            <Image
                                source={require('../../assets/overlay_play.jpg')}
                                style={[defaultEpgOverlayViewStyle.playIconStyle, epgOverlayViewStyle.playIconStyle]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
