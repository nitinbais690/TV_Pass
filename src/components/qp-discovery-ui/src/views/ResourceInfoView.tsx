import React, { useState } from 'react';
import ResizableImage from './ResizableImage';
import { ResourceVm } from '../models/ViewModels';
import {
    View,
    Text,
    StyleProp,
    ViewStyle,
    ImageStyle,
    TextStyle,
    StyleSheet,
    Platform,
    TouchableHighlight,
    FlexStyle,
    ProgressViewIOS,
    ProgressBarAndroid,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { padding, colors, dimensions, AspectRatio, typography, defaultFont, ImageType } from 'qp-common-ui';

const defaultInfoViewStyle = StyleSheet.create({
    containerStyle: {
        flex: 1,
        flexShrink: 0,
        flexDirection: Platform.isTV ? 'row' : 'column',
        justifyContent: 'center',
        backgroundColor: colors.primary,
    },
    imageWrapperStyle: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.secondary,
        alignSelf: 'center',
        flexShrink: 0,
    },
    imageStyle: {
        flex: 1,
        flexShrink: 0,
        justifyContent: 'center',
        alignSelf: 'stretch',
        padding: 0,
        width: Platform.isTV ? '100%' : dimensions.fullWidth,
        aspectRatio: Platform.isTV ? 1 : 16 / 9,
        borderRadius: dimensions.cardRadius,
        shadowOffset: { width: 0, height: 1 },
        shadowColor: colors.tertiary,
        shadowOpacity: 1.0,
        shadowRadius: 2,
    },
    textWrapperStyle: {
        flex: 1,
        alignSelf: 'stretch',
        flexGrow: 1,
        margin: padding.xs(),
    },
    infoContainerStyle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    titleContainerStyle: {
        flex: 1,
        flexDirection: 'column',
    },
    titleStyle: {
        ...typography.title,
        fontFamily: defaultFont.bold,
        color: colors.secondary,
        marginTop: padding.xs(),
        marginLeft: padding.xxs(),
        marginRight: padding.xxs(),
    },
    infoTextStyle: {
        ...typography.body,
        color: colors.tertiary,
        flexWrap: 'wrap',
        marginTop: padding.xs(),
        marginLeft: padding.xxs(),
        marginRight: padding.xxs(),
    },
    infoCaptionStyle: {
        ...typography.caption,
        color: colors.caption,
        flexWrap: 'wrap',
        marginTop: padding.xs(),
        marginLeft: padding.xxs(),
        marginRight: padding.xxs(),
    },
    actionButtonStyle: {
        borderRadius: 5,
        backgroundColor: colors.brandTint,
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
        marginTop: padding.xs(),
        marginLeft: padding.xxs(),
        marginRight: padding.xxs(),
        overflow: 'hidden',
    },
    buttonTextStyle: {
        ...typography.button,
        color: colors.overlayText,
        margin: padding.sm(),
        justifyContent: 'center',
        alignSelf: 'center',
    },
    progressStyle: {
        width: '100%',
        alignSelf: 'stretch',
        bottom: Platform.OS === 'ios' ? 0 : -7,
        position: 'absolute',
    },
});

export interface ResourceInfoViewStyle {
    /**
     * The style of the detail view container.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * The style of the poster image container
     */
    imageWrapperStyle?: StyleProp<ViewStyle>;
    /**
     * The style of the poster image
     */
    imageStyle?: StyleProp<ImageStyle>;
    /**
     * The style of the title container(View)
     */
    textWrapperStyle?: StyleProp<ViewStyle>;
    /**
     * The style of the title text(Text).
     */
    titleStyle?: StyleProp<TextStyle>;
    /**
     * The style of the content description(Text).
     */
    infoTextStyle?: StyleProp<TextStyle>;
    /**
     * The style of the content description(Text).
     */
    infoCaptionStyle?: StyleProp<TextStyle>;
    /**
     * The style of the genre,year cast etc
     */
    infoContainerStyle?: StyleProp<TextStyle>;
    /**
     * The style of the playback button
     */
    actionButtonStyle?: StyleProp<ViewStyle>;
    /**
     * The style of the button text
     */
    buttonTextStyle?: StyleProp<TextStyle>;
    /**
     * The style of the progress indicator when `showResume` is set to true
     */
    progressStyle?: StyleProp<TextStyle>;
}

export interface ResourceInfoViewProps<T> {
    /**
     * Must be either `ResourceVm` or one of its extensions
     */
    resource: T;
    /**
     * The style of the detail page poster and info container
     */
    infoViewStyle?: ResourceInfoViewStyle;
    /**
     * Underlay color for Action (Play/Download) button
     */
    underlayColor?: string;
    /**
     * Image type of the card
     */
    imageType?: ImageType;
    /**
     * Default Image Aspect Ratio for data store images
     */
    defaultImageAspectRatio: string;
    /**
     * Skip resizing the images. Default is to resize the images.
     */
    skipResize?: boolean;
    /**
     * Indicates whether to show a resume watching button or a regular play now button
     * Defaults to `Watch Now`
     */
    showResume?: boolean;
    /**
     *
     */
    resumeProgress?: number;

    /**
     * Indicates whether to show a `Download Now` button or not.
     */
    showDownload?: boolean;

    downloadActionText?: string;
    /**
     * Indiates Download Progress.
     */
    downloadProgress?: number;
    /**
     * Called when Play Action is selected.
     * Called when the touch is released,
     * but not if cancelled (e.g. by a scroll that steals the responder lock).
     */
    onResourcePlayPress: (resource: T) => void;

    /**
     * Called when Download Action is selected
     */
    onResourceDownloadPress?: (resource: T) => void;
}

//Commenting this as Running time format is changed now
// const humanDuration = (seconds: number): string => {
//     const levels = [
//         [Math.floor(((seconds % 31536000) % 86400) / 3600), 'h'],
//         [Math.ceil((((seconds % 31536000) % 86400) % 3600) / 60), 'm'],
//     ];

//     let durationString = '';
//     for (let i = 0, max = levels.length; i < max; i++) {
//         if (levels[i][0] === 0) {
//             continue;
//         }
//         durationString += ' ' + levels[i][0] + '' + levels[i][1];
//     }
//     return durationString.trim();
// };

export const ResourceCastInfoView = <T extends ResourceVm>(props: ResourceInfoViewProps<T>): JSX.Element => {
    const { resource, infoViewStyle = {} } = props;

    let cast: string[] = [];
    if (resource.cast) {
        cast = Object.keys(resource.cast).map(
            (k: string) => `${k}: ${resource.cast![k] && resource.cast![k]!.filter(Boolean).join(', ')}`,
        );
    }

    return (
        <View style={defaultInfoViewStyle.titleContainerStyle}>
            <View style={[defaultInfoViewStyle.infoContainerStyle, infoViewStyle.infoContainerStyle]}>
                {cast.map((value, i) => {
                    return (
                        <Text key={i} style={[defaultInfoViewStyle.infoCaptionStyle, infoViewStyle.infoCaptionStyle]}>
                            {value}
                        </Text>
                    );
                })}
            </View>
        </View>
    );
};

export const ResourceMetaInfoView = <T extends ResourceVm>(props: ResourceInfoViewProps<T>): JSX.Element => {
    const { resource, infoViewStyle = {} } = props;

    const genres =
        (resource.contentGenre && resource.contentGenre.map((g: any) => g.toUpperCase()).join(' \u2022 ')) || null;
    const metaInfo = [];
    if (resource.formattedRunningTime) {
        metaInfo.push(resource.formattedRunningTime);
    }
    if (resource.rating) {
        metaInfo.push(resource.rating);
    }
    if (resource.releaseYear) {
        metaInfo.push(resource.releaseYear);
    }
    if (genres) {
        metaInfo.push(genres);
    }
    if (resource.subtitle) {
        metaInfo.push(resource.subtitle);
    }
    const metaInfoString = metaInfo.join(' \u2022 ');

    return (
        <View style={defaultInfoViewStyle.titleContainerStyle}>
            <Text style={[defaultInfoViewStyle.infoCaptionStyle, infoViewStyle.infoCaptionStyle]}>
                {metaInfoString}
            </Text>
        </View>
    );
};

const ProgressView = ({
    progress,
    infoViewStyle = {},
}: {
    progress: number;
    infoViewStyle: ResourceInfoViewStyle;
}): JSX.Element => {
    return Platform.OS === 'ios' ? (
        <ProgressViewIOS
            style={[
                defaultInfoViewStyle.progressStyle,
                { transform: [{ scaleX: 1.0 }, { scaleY: 3.5 }] },
                infoViewStyle.progressStyle,
            ]}
            progress={progress}
            progressTintColor={colors.brandTintLight}
            trackTintColor={colors.brandTintDark}
        />
    ) : (
        <ProgressBarAndroid
            progress={progress}
            // progressViewStyle={'default'}
            styleAttr={'Horizontal'}
            style={[defaultInfoViewStyle.progressStyle, infoViewStyle.progressStyle]}
            indeterminate={false}
            color={colors.brandTintLight}
        />
    );
};

export const ResourceInfoView = <T extends ResourceVm>(props: ResourceInfoViewProps<T>): JSX.Element => {
    const [briefMode, setBriefMode] = useState(!Platform.isTV);
    const {
        resource,
        onResourcePlayPress,
        infoViewStyle = {},
        skipResize,
        showResume,
        resumeProgress = 0,
        underlayColor,
        showDownload = false,
        downloadProgress = -1,
        onResourceDownloadPress,
    } = props;
    let resourceItem: T = resource;

    const imageAspectRatio = infoViewStyle.imageStyle
        ? (infoViewStyle.imageStyle as FlexStyle).aspectRatio
        : defaultInfoViewStyle.imageStyle.aspectRatio;
    const aspectRatioKey = imageAspectRatio as AspectRatio;
    const imageType = props.imageType as ImageType;
    const key = props.defaultImageAspectRatio;
    const imageUrl = resource.syndicationImages && resource.syndicationImages[key];
    const wrapperStyle = (infoViewStyle.actionButtonStyle || defaultInfoViewStyle.actionButtonStyle) as ViewStyle;
    const buttonUnderlayColor = underlayColor || wrapperStyle.backgroundColor;
    let showActions = !['tvseries', 'contentHighlight'].includes(resourceItem.type);
    if (showActions && resourceItem.type === 'schedules') {
        showActions = false; //resourceItem.isProgramActive;
    }
    return (
        <>
            {resourceItem && (
                <View style={[defaultInfoViewStyle.containerStyle, infoViewStyle.containerStyle]}>
                    <View style={[defaultInfoViewStyle.imageWrapperStyle, infoViewStyle.imageWrapperStyle]}>
                        {resourceItem.image && (
                            <FastImage
                                key={resourceItem.id || ''}
                                style={[defaultInfoViewStyle.imageStyle, infoViewStyle.imageStyle]}
                                resizeMode={FastImage.resizeMode.contain}
                                source={{ uri: `${resourceItem.image}` }}
                            />
                        )}
                        <ResizableImage
                            keyId={resourceItem.id || ''}
                            style={[defaultInfoViewStyle.imageStyle, infoViewStyle.imageStyle]}
                            imageType={imageType}
                            aspectRatioKey={aspectRatioKey}
                            skipResize={skipResize}
                            source={{ uri: imageUrl }}
                        />
                    </View>
                    <View style={[defaultInfoViewStyle.textWrapperStyle, infoViewStyle.textWrapperStyle]}>
                        <View style={defaultInfoViewStyle.infoContainerStyle}>
                            <View style={defaultInfoViewStyle.titleContainerStyle}>
                                <Text style={[defaultInfoViewStyle.titleStyle, infoViewStyle.titleStyle]}>
                                    {resourceItem.name}
                                </Text>
                                <ResourceMetaInfoView {...props} />
                                <Text
                                    onPress={() => setBriefMode(false)}
                                    numberOfLines={briefMode ? 5 : 99}
                                    ellipsizeMode={'tail'}
                                    style={[defaultInfoViewStyle.infoTextStyle, infoViewStyle.infoTextStyle]}>
                                    {resourceItem.shortDescription
                                        ? resourceItem.shortDescription
                                        : resourceItem.longDescription}
                                </Text>
                                <ResourceCastInfoView {...props} />
                            </View>
                        </View>
                        {showActions && (
                            <TouchableHighlight
                                testID="playButton"
                                accessibilityLabel={'Watch Now'}
                                activeOpacity={0.5}
                                underlayColor={buttonUnderlayColor}
                                style={[defaultInfoViewStyle.actionButtonStyle, infoViewStyle.actionButtonStyle]}
                                onPress={(): void => onResourcePlayPress && onResourcePlayPress(resourceItem)}>
                                <>
                                    <Text style={[defaultInfoViewStyle.buttonTextStyle, infoViewStyle.buttonTextStyle]}>
                                        {showResume ? 'Continue Watching' : 'Watch now'}
                                    </Text>
                                    {showResume && (
                                        <ProgressView progress={resumeProgress} infoViewStyle={infoViewStyle} />
                                    )}
                                </>
                            </TouchableHighlight>
                        )}
                        {showActions && showDownload && (
                            <TouchableHighlight
                                testID="downloadButton"
                                accessibilityLabel={props.downloadActionText}
                                activeOpacity={0.5}
                                underlayColor={buttonUnderlayColor}
                                style={[defaultInfoViewStyle.actionButtonStyle, infoViewStyle.actionButtonStyle]}
                                //  {...((downloadProgress < 0)?{
                                //      onPress:(): void => onResourceDownloadPress && onResourceDownloadPress(resourceItem)
                                //  }:{})}
                                onPress={(): void => onResourceDownloadPress && onResourceDownloadPress(resourceItem)}>
                                <>
                                    <Text style={[defaultInfoViewStyle.buttonTextStyle, infoViewStyle.buttonTextStyle]}>
                                        {props.downloadActionText}
                                    </Text>
                                    {downloadProgress >= 0 && (
                                        <ProgressView progress={downloadProgress} infoViewStyle={infoViewStyle} />
                                    )}
                                </>
                            </TouchableHighlight>
                        )}
                    </View>
                </View>
            )}
        </>
    );
};
const propsAreEqual = (prevProps: any, nextProps: any): boolean => {
    return prevProps.resource.id === nextProps.resource.id;
};

export default React.memo(ResourceInfoView, propsAreEqual);
