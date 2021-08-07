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
import { ResourceVm } from '../models/ViewModels';
import { dimensions, constants, padding, colors, USE_ABSOLUTE_VALUE, AspectRatio, ImageType } from 'qp-common-ui';

const cardPadding = padding.xs(USE_ABSOLUTE_VALUE);
// const defaultImageAspectRatio = '0-16x9';
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
        shadowOffset: { width: 0, height: 1 },
        shadowColor: colors.tertiary,
        shadowOpacity: 1.0,
        shadowRadius: 2,
        // backgroundColor: colors.primary,
        backgroundColor: 'red',
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
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
        ...StyleSheet.absoluteFillObject,
        top: undefined,
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
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
    },
    arrowRight: {
        borderTopWidth: 22,
        borderRightWidth: 0,
        borderBottomWidth: 22,
        borderLeftWidth: 40,
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'rgba(155, 173, 190, 0.5)',
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
    onResourcePress?: (resource: T) => void;
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
    const { resource, cardStyle: style = {}, onResourcePress, testID = 'cardView', overlayView, footerView } = props;
    const wrapperStyle = (style.wrapperStyle || cardStyles.wrapperStyle) as ViewStyle;
    // const [cardWidth] = cardViewDimensions(style);
    // const [cardHeight] = cardViewDimensions(style);
    const [isFocussed, setIsFocussed] = useState<boolean>(false);
    const underlayColor = props.underlayColor ? props.underlayColor : wrapperStyle.backgroundColor;
    const activeOpacity = props.activeOpacity ? props.activeOpacity : undefined;
    // const aspectRatioKey = cardAspectRatio;
    // const imageType = cardImageType;
    // const key = resource.imageAspectRatio ? resource.imageAspectRatio : defaultImageAspectRatio;
    // const imageUrl = resource.syndicationImages && resource.syndicationImages[key];
    const shouldApplyFocusStyle = Platform.OS === 'android' && Platform.isTV;
    const onCardPress = (): void => onResourcePress && onResourcePress(resource);
    const onCardFocus = (): void => {
        setIsFocussed(true);
    };
    const onCardBlur = (): void => {
        setIsFocussed(false);
    };

    return (
        <TouchableHighlight
            style={[
                cardStyles.container,
                style.container,
                isFocussed ? style.onFocusCardStyle || cardStyles.onFocusCardStyle : undefined,
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
                    {resource.layout === 'banner' && (
                        <>
                            <LinearGradient
                                colors={[colors.brandTint, colors.primaryVariant1]}
                                start={{ x: 1.5, y: 0 }}
                                end={{ x: 0.3, y: 0.9 }}
                                style={[
                                    {
                                        ...StyleSheet.absoluteFillObject,
                                    },
                                ]}
                            />
                            <View style={[cardStyles.triangle, cardStyles.arrowRight]} />
                        </>
                    )}
                    {overlayView && (
                        <View style={[cardStyles.overviewWrapperStyle, style.overviewWrapperStyle]}>{overlayView}</View>
                    )}
                </View>
                {footerView && <View style={style.footer}>{footerView}</View>}
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
