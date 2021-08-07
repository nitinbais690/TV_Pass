import React, { useState } from 'react';
import {
    View,
    TouchableHighlight,
    ViewStyle,
    StyleProp,
    ImageStyle,
    TVParallaxProperties,
    StyleSheet,
    Platform,
    TextStyle,
    Text,
} from 'react-native';
import { LinearGradientProps } from 'react-native-linear-gradient';
import ResizableImage from './ResizableImage';
import { ResourceVm } from '../models/ViewModels';
import { colors, AspectRatio, ImageType } from 'qp-common-ui';
import FastImage from 'react-native-fast-image';
import { appFonts, appPadding } from '../../../../../AppStyles';
import { Pill } from '../../../../../src/screens/components/Pill';
import CreditsIcon from '../../../../../assets/images/credits_small.svg';

export const cardStyles = StyleSheet.create({
    container: {
        margin: 50,
        marginTop: 30,
        marginBottom: 0,
        borderRadius: 20,
        width: '90%',
        alignSelf: 'center',
    },
    tvOSContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 25,
        paddingVertical: 25,
        margin: 0,
        borderColor: 'white',
        borderRadius: 25,
        borderWidth: 0,
        width: '94%',
        alignSelf: 'center',
    },
    wrapperStyle: {
        width: '100%',
        borderRadius: 20,
        backgroundColor: '#2E425980',
        padding: 20,
        flexDirection: 'row',
    },
    cardWrapperStyle: {
        flex: 1,
    },
    imageStyle: {
        borderRadius: 20,
        flex: 1,
        alignSelf: 'stretch',
    },
    overviewWrapperStyle: {
        ...StyleSheet.absoluteFillObject,
        top: undefined,
    },
    onFocusCardStyle: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    gradientOverlayStyle: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    cardContainerShadow: {
        borderColor: colors.primary,
        borderWidth: 3,
        backgroundColor: '#9BADBE',
        borderRadius: 20,
    },
    pillOverlay: {
        position: 'absolute',
        bottom: 6,
        left: 6,
    },
    pillWrapper: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 4,
        marginVertical: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pillText: {
        color: '#FFFFFF',
        fontFamily: appFonts.semibold,
        fontSize: appFonts.xxs,
        fontWeight: '500',
        marginLeft: 2,
    },
    imageWrapper: {
        width: Platform.isTV ? '16%' : '40%',
        aspectRatio: AspectRatio._16by9,
        borderRadius: !Platform.isTV ? 5 : 15,
        overflow: 'hidden',
    },
    image: {
        flex: 1,
        backgroundColor: '#2E425980',
        borderRadius: 5,
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginHorizontal: !Platform.isTV ? appPadding.sm(true) : appPadding.xs(true),
    },
    titleTypography: {
        fontFamily: appFonts.semibold,
        fontSize: Platform.isTV ? appFonts.md : appFonts.xs,
        color: '#FFFFFF',
    },
    title: {
        marginBottom: 2,
    },
    captionTypography: {
        fontFamily: appFonts.semibold,
        fontSize: Platform.isTV ? appFonts.md : appFonts.xs,
        color: '#9BADBE',
        textTransform: 'none',
    },
});

export interface ResourceCardStyle {
    /**
     * The style of the overall card container(View).
     */
    container?: StyleProp<ViewStyle>;
    /**
     * The style of the card container(View).
     */
    wrapperStyle?: StyleProp<ViewStyle>;
    /**
     * The style of the card container(View).
     */
    cardWrapperStyle?: StyleProp<ViewStyle>;
    /**
     * The style of the card container(Image).
     */
    imageStyle?: StyleProp<ImageStyle>;
    /**
     * The style for the card overview (View)
     */
    overviewWrapperStyle?: StyleProp<ViewStyle>;
    /**
     * The style of the linear gradient (View).
     */
    gradientOverlayStyle?: StyleProp<ViewStyle>;
    /*
     * The style of the card in focus (Only Android Tv and Firetv)
     */
    onFocusCardStyle?: StyleProp<ViewStyle>;
    /*
     * The style of the card footer container
     */
    footer?: StyleProp<ViewStyle>;
    /*
     * The style of the card footer title
     */
    footerTitle?: StyleProp<TextStyle>;
    /*
     * The style of the card footer subtitle
     */
    footerSubtitle?: StyleProp<TextStyle>;
}

export interface ResourceCardViewBaseProps<T> {
    /**
     * Called when the touch is released,
     * but not if cancelled (e.g. by a scroll that steals the responder lock).
     */
    onResourcePress?: (resource: T, index: number) => void;
    /**
     * *(Apple TV only)* Object with properties to control Apple TV parallax effects.
     *
     * enabled: If true, parallax effects are enabled.  Defaults to true.
     * shiftDistanceX: Defaults to 2.0.
     * shiftDistanceY: Defaults to 2.0.
     * tiltAngle: Defaults to 0.05.
     * magnification: Defaults to 1.0.
     * pressMagnification: Defaults to 1.0.
     * pressDuration: Defaults to 0.3.
     * pressDelay: Defaults to 0.0.
     *
     * @platform tvOS
     */
    tvParallaxProperties?: TVParallaxProperties;
    /**
     * Props to apply as a linear gradient on top of image
     */
    linearGradientProps?: LinearGradientProps;
    /**
     * The style of the `ResourceCardView` component
     */
    cardStyle?: ResourceCardStyle;
    /**
     * The aspectRatio for the card view
     */
    cardAspectRatio?: AspectRatio;
    /**
     * The aspectRatio for the card view
     */
    cardImageType?: ImageType;
    /**
     * Boolean prop to toggle show/hide gradient
     */
    hideGradient?: boolean;
    /**
     * Unique identifier to identify the element in tests
     */
    testID?: string;
    /**
     * Skip resizing the images. Default is to resize the images.
     */
    skipResize?: boolean;
    /**
     * The color of the underlay that will show through when the touch is active.
     * Defaults to background color of the card.
     */
    underlayColor?: string;
    /**
     * Determines what the opacity of the wrapped view should be when touch is active.
     * The value should be between 0 and 1. Defaults to 0.85. Requires underlayColor to be set.
     */
    activeOpacity?: number;
    /**
     *
     */
    overlayView?: React.ComponentType<any> | React.ReactElement | null;
    /**
     *
     */
    footerView?: React.ComponentType<any> | React.ReactElement | null;
    /**
     * Indicates the orientation of the card
     */
    isPortrait?: boolean;
    /**
     * index of the content
     */
    index?: number;
}

export interface ResourceCardViewProps<T> extends ResourceCardViewBaseProps<T> {
    /**
     * Must be either `ResourceVm` or one of its extensions
     */
    resource: T;
}

export const cardViewDimensions = (cardStyle: ResourceCardStyle = {}): [number, number] => {
    const wrapperStyle = (cardStyle.container || cardStyles.container) as ViewStyle;
    const cardWidth = wrapperStyle.width as number;
    const cardHeight = wrapperStyle.aspectRatio
        ? cardWidth * wrapperStyle.aspectRatio
        : (wrapperStyle.height as number);
    return [cardWidth, cardHeight];
};

const ResourceCardViewSearchTV = <T extends ResourceVm>(props: ResourceCardViewProps<T>): JSX.Element => {
    const { resource, cardStyle: style = {}, onResourcePress, index, testID = 'cardView' } = props;
    const wrapperStyle = (style.wrapperStyle || cardStyles.wrapperStyle) as ViewStyle;
    const [isFocussed, setIsFocussed] = useState<boolean>(false);
    const underlayColor = props.underlayColor ? props.underlayColor : wrapperStyle.backgroundColor;
    const activeOpacity = props.activeOpacity ? props.activeOpacity : undefined;
    // const key = resource.imageAspectRatio ? resource.imageAspectRatio : defaultImageAspectRatio;
    const onCardPress = (): void => onResourcePress && onResourcePress(resource, index);
    const onCardFocus = (): void => {
        setIsFocussed(true);
    };
    const onCardBlur = (): void => {
        setIsFocussed(false);
    };
    const genres = (resource.contentGenre && resource.contentGenre.en) || [];
    const genreString = genres.join(', ');
    const metaInfo = [];
    if (resource.releaseYear) {
        metaInfo.push(resource.releaseYear);
    }
    if (genreString) {
        metaInfo.push(genreString);
    }

    const metaInfoString = metaInfo.join(' - ');
    return (
        <TouchableHighlight
            style={[cardStyles.container, style.container, isFocussed ? cardStyles.cardContainerShadow : undefined]}
            underlayColor={underlayColor}
            activeOpacity={activeOpacity}
            onPress={onCardPress}
            tvParallaxProperties={props.tvParallaxProperties}
            onFocus={Platform.isTV ? onCardFocus : undefined}
            onBlur={Platform.isTV ? onCardBlur : undefined}
            testID={testID}
            accessibilityLabel={'Card View'}>
            <View>
                <View
                    style={[
                        cardStyles.wrapperStyle,
                        style.wrapperStyle,
                        { backgroundColor: isFocussed ? '#2E425980' : 'transparent' },
                    ]}>
                    <View style={cardStyles.imageWrapper}>
                        {resource.image ? (
                            <FastImage
                                key={resource.id || ''}
                                resizeMode={FastImage.resizeMode.contain}
                                source={{ uri: resource.image }}
                            />
                        ) : (
                            <ResizableImage
                                keyId={resource.id}
                                aspectRatioKey={AspectRatio._16by9}
                                imageType={ImageType.Poster}
                                style={cardStyles.image}
                            />
                        )}
                        {resource.credits && (
                            <View style={cardStyles.pillOverlay}>
                                <Pill>
                                    <View style={cardStyles.pillWrapper}>
                                        <CreditsIcon />
                                        <Text style={cardStyles.pillText}>{resource.credits}</Text>
                                    </View>
                                </Pill>
                            </View>
                        )}
                    </View>
                    <View style={cardStyles.textContainer}>
                        <View>
                            <Text style={[cardStyles.titleTypography, cardStyles.title]}>{resource.name}</Text>
                            <Text style={[cardStyles.captionTypography]}>{metaInfoString}</Text>
                            <Text style={[cardStyles.captionTypography]}>{resource.formattedRunningTime}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    );
};

const propsAreEqual = (prevProps: any, nextProps: any): boolean => {
    return (
        prevProps.resource.id === nextProps.resource.id &&
        prevProps.resource.expiresIn === nextProps.resource.expiresIn &&
        prevProps.resource.completedPercent === nextProps.resource.completedPercent &&
        prevProps.isPortrait === nextProps.isPortrait
    );
};

export default React.memo(ResourceCardViewSearchTV, propsAreEqual);
