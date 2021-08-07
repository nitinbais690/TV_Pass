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
} from 'react-native';
import LinearGradient, { LinearGradientProps } from 'react-native-linear-gradient';
import ResizableImage from './ResizableImage';
import { ResourceVm } from '../models/ViewModels';
import { dimensions, constants, padding, colors, USE_ABSOLUTE_VALUE, AspectRatio, ImageType } from 'qp-common-ui';
import FastImage from 'react-native-fast-image';

const cardPadding = padding.xs(USE_ABSOLUTE_VALUE);
const defaultImageAspectRatio = '0-16x9';
export const cardStyles = StyleSheet.create({
    container: {
        marginLeft: cardPadding,
        marginTop: cardPadding,
        marginBottom: cardPadding,
    },
    wrapperStyle: {
        width: dimensions.fullWidth / constants.catalogCardsPreview,
        aspectRatio: dimensions.cardAspectRatio,
        borderRadius: dimensions.cardRadius,
    },
    cardWrapperStyle: {
        flex: 1,
    },
    imageStyle: {
        borderRadius: dimensions.cardRadius,
        flex: 1,
        alignSelf: 'stretch',
    },
    overviewWrapperStyle: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    onFocusCardStyle: {
        borderStyle: 'solid',
        borderColor: colors.primary,
        borderWidth: 2,
        elevation: 4,
        transform: [{ scaleX: 1.12 }, { scaleY: 1.12 }],
    },
    gradientOverlayStyle: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
});

const defaultImageGradientProps = {
    locations: [0, 0.5, 1.0],
    colors: ['transparent', 'rgba(16, 16, 16, 0.4)', 'rgba(16, 16, 16, 0.8)'],
    start: { x: 0, y: 0.5 },
    end: { x: 0, y: 1 },
};

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
    onResourcePress?: (resource: T) => void;
    /**
     * Called when the resource card focused or blurred,
     */
    onFocusChange?: (resource: T, hasFocus: boolean, index?: number) => void;
    /**
     * Based on the this TV focus border will be shown in card
     */
    isShowTVFocus?: boolean;
    /**
     * Index of specific resource card,
     */
    resourceIndex?: number;
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
     * Width of a Card
     */
    cardWidth?: number;
}

export interface ResourceCardViewProps<T> extends ResourceCardViewBaseProps<T> {
    /**
     * Must be either `ResourceVm` or one of its extensions
     */
    resource: T;
}

export const cardViewDimensions = (cardStyle: ResourceCardStyle = {}): [number, number] => {
    const wrapperStyle = (cardStyle.wrapperStyle || cardStyles.wrapperStyle) as ViewStyle;
    const cardWidth = wrapperStyle.width as number;
    const cardHeight = wrapperStyle.aspectRatio
        ? cardWidth * wrapperStyle.aspectRatio
        : (wrapperStyle.height as number);
    return [cardWidth, cardHeight];
};

const ResourceCardView = <T extends ResourceVm>(props: ResourceCardViewProps<T>): JSX.Element => {
    const {
        resource,
        cardStyle: style = {},
        onResourcePress,
        onFocusChange,
        resourceIndex,
        cardAspectRatio = dimensions.cardAspectRatio,
        cardImageType = dimensions.cardImageType,
        hideGradient,
        testID = 'cardView',
        skipResize,
        overlayView,
        footerView,
        isShowTVFocus = true,
    } = props;
    const wrapperStyle = (style.wrapperStyle || cardStyles.wrapperStyle) as ViewStyle;
    const [cardWidth] = cardViewDimensions(style);
    const [cardHeight] = cardViewDimensions(style);
    const [isFocussed, setIsFocussed] = useState<boolean>(false);
    const underlayColor = props.underlayColor ? props.underlayColor : wrapperStyle.backgroundColor;
    const activeOpacity = props.activeOpacity ? props.activeOpacity : undefined;
    const aspectRatioKey = cardAspectRatio;
    const imageType = cardImageType;
    const key = resource.imageAspectRatio ? resource.imageAspectRatio : defaultImageAspectRatio;
    const imageUrl = resource.syndicationImages && resource.syndicationImages[key];
    const shouldApplyFocusStyle = Platform.OS === 'android' && Platform.isTV;
    const onCardPress = (): void => onResourcePress && onResourcePress(resource);
    const onCardFocus = (): void => {
        setIsFocussed(true);
        onFocusChange && onFocusChange(resource, true, resourceIndex);
    };
    const onCardBlur = (): void => {
        setIsFocussed(false);
        onFocusChange && onFocusChange(resource, false, resourceIndex);
    };
    return (
        <TouchableHighlight
            style={[
                cardStyles.container,
                style.container,
                isFocussed && isShowTVFocus ? style.onFocusCardStyle || cardStyles.onFocusCardStyle : undefined,
            ]}
            underlayColor={underlayColor}
            activeOpacity={activeOpacity}
            onPress={onCardPress}
            tvParallaxProperties={props.tvParallaxProperties}
            onFocus={shouldApplyFocusStyle ? onCardFocus : undefined}
            onBlur={shouldApplyFocusStyle ? onCardBlur : undefined}
            testID={testID}
            accessibilityLabel={'Card View'}>
            <View>
                <View style={[cardStyles.wrapperStyle, style.wrapperStyle]}>
                    {resource.image ? (
                        <FastImage
                            key={resource.id || ''}
                            style={[cardStyles.imageStyle, style.imageStyle]}
                            resizeMode={FastImage.resizeMode.contain}
                            source={{ uri: resource.image }}
                        />
                    ) : (
                        <ResizableImage
                            keyId={resource.type === 'channel' ? resource.ex_id || '' : resource.id || ''}
                            width={cardWidth}
                            height={cardHeight}
                            skipResize={skipResize}
                            style={[cardStyles.imageStyle, style.imageStyle]}
                            imageType={imageType}
                            aspectRatioKey={aspectRatioKey}
                            source={{ uri: imageUrl }}
                        />
                    )}

                    {overlayView && (
                        <View style={[cardStyles.overviewWrapperStyle, style.overviewWrapperStyle]}>{overlayView}</View>
                    )}
                </View>

                {!hideGradient && (
                    <LinearGradient
                        {...defaultImageGradientProps}
                        {...props.linearGradientProps}
                        style={[cardStyles.gradientOverlayStyle, style.gradientOverlayStyle]}
                    />
                )}

                {footerView && <View style={[style.footer]}>{footerView}</View>}
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

export default React.memo(ResourceCardView, propsAreEqual);
