import React, { useRef, useCallback, useState } from 'react';

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
    findNodeHandle,
    Text,
} from 'react-native';
import LinearGradient, { LinearGradientProps } from 'react-native-linear-gradient';
import ResizableImage from './ResizableImage';
import { ResourceVm } from '../models/ViewModels';
import {
    dimensions,
    constants,
    padding,
    colors,
    USE_ABSOLUTE_VALUE,
    AspectRatio,
    ImageType,
    fonts,
} from 'qp-common-ui';
import FastImage from 'react-native-fast-image';
import { useLocalization } from 'contexts/LocalizationContext';

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
        borderRadius: 15,
        shadowOffset: { width: 0, height: 1 },
        shadowColor: colors.tertiary,
        shadowOpacity: 1.0,
        shadowRadius: 2,
        backgroundColor: colors.primary,
        elevation: 2,
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
    cardContainerShadow: {
        borderColor: colors.primary,
        borderWidth: 3,
        zIndex: 100,
        shadowColor: colors.brandTint,
        shadowOpacity: 1,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 14,
        elevation: 10,
    },
    viewAllContainer: {
        backgroundColor: colors.backgroundVariant1,
        flex: 1,
    },
    viewAllWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        shadowOpacity: 1.0,
        shadowRadius: 2,
        backgroundColor: colors.backgroundVariant1,
        flex: 1,
    },
    viewAllText: {
        fontSize: fonts.md,
        fontFamily: fonts.primary,
        color: colors.primary,
        fontWeight: '600',
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
    viewAllWrapper?: StyleProp<ViewStyle>;
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

    viewAllText?: StyleProp<TextStyle>;
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
    /**
     * down focus block on tv
     */
    hasTVPreferredFocus?: boolean;
    /**
     * down focus block on tv
     */
    blockFocusDown?: boolean;
    /**
     * up focus block on tv
     */
    blockFocusUp?: boolean;
    /**
     * right focus block on tv
     */
    blockFocusRight?: boolean;
    /**
     * left focus block on tv
     */
    blockFocusLeft?: boolean;
    /**
     * sift scroll to index how is focused
     */
    shiftScrollToFocusIndex: () => void;
}

export const cardViewDimensions = (cardStyle: ResourceCardStyle = {}): [number, number] => {
    const wrapperStyle = (cardStyle.container || cardStyles.container) as ViewStyle;
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
        cardAspectRatio = dimensions.cardAspectRatio,
        cardImageType = dimensions.cardImageType,
        hideGradient,
        testID = 'cardView',
        skipResize,
        overlayView,
        footerView,
        blockFocusRight,
        blockFocusLeft,
        blockFocusDown,
        blockFocusUp,
        hasTVPreferredFocus,
        shiftScrollToFocusIndex,
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
    const touchableHighlightRef = useRef(null);
    const { strings } = useLocalization();

    const onCardPress = (): void => onResourcePress && onResourcePress(resource);
    const onCardFocus = (): void => {
        setIsFocussed(true);
        shiftScrollToFocusIndex && shiftScrollToFocusIndex();
    };
    const onCardBlur = (): void => {
        setIsFocussed(false);
    };
    const onRef = useCallback(ref => {
        if (ref) {
            touchableHighlightRef.current = ref;
        }
    }, []);

    return (
        <TouchableHighlight
            style={[
                cardStyles.container,
                style.container,
                isFocussed ? cardStyles.cardContainerShadow : undefined,
                resource.type && resource.type === 'viewall' ? cardStyles.viewAllContainer : {},
                resource.type && resource.type === 'viewall' && resource.aspectRatio === 1 ? { width: 175 } : {},
            ]}
            underlayColor={underlayColor}
            activeOpacity={activeOpacity}
            onPress={onCardPress}
            tvParallaxProperties={props.tvParallaxProperties}
            ref={onRef}
            hasTVPreferredFocus={hasTVPreferredFocus ? true : false}
            nextFocusUp={blockFocusUp ? findNodeHandle(touchableHighlightRef.current) : null}
            nextFocusDown={blockFocusDown ? findNodeHandle(touchableHighlightRef.current) : null}
            nextFocusLeft={blockFocusLeft ? findNodeHandle(touchableHighlightRef.current) : null}
            nextFocusRight={blockFocusRight ? findNodeHandle(touchableHighlightRef.current) : null}
            onFocus={Platform.isTV ? onCardFocus : undefined}
            onBlur={Platform.isTV ? onCardBlur : undefined}
            testID={testID}
            accessibilityLabel={'Card View'}>
            {resource.type && resource.type === 'viewall' ? (
                <View style={[cardStyles.viewAllWrapper]}>
                    <Text style={[cardStyles.viewAllText, style.viewAllText]}>{strings['my_content.view_all']}</Text>
                </View>
            ) : (
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
                        {!hideGradient && (
                            <LinearGradient
                                {...defaultImageGradientProps}
                                {...props.linearGradientProps}
                                style={[cardStyles.gradientOverlayStyle, style.gradientOverlayStyle]}
                            />
                        )}
                        {overlayView && (
                            <View style={[cardStyles.overviewWrapperStyle, style.overviewWrapperStyle]}>
                                {overlayView}
                            </View>
                        )}
                    </View>
                    {footerView && <View style={style.footer}>{footerView}</View>}
                </View>
            )}
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
