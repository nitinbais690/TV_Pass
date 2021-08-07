import React, { useState } from 'react';

import {
    Text,
    View,
    TouchableHighlight,
    ViewStyle,
    StyleProp,
    TextStyle,
    TVParallaxProperties,
    ImageStyle,
    StyleSheet,
    Platform,
} from 'react-native';
import LinearGradient, { LinearGradientProps } from 'react-native-linear-gradient';
import ResizableImage from './ResizableImage';
import { ResourceVm } from '../models/ViewModels';
import {
    dimensions,
    constants,
    padding,
    colors,
    secondaryColors,
    USE_ABSOLUTE_VALUE,
    AspectRatio,
    ImageType,
    defaultFont,
    typography,
} from 'qp-common-ui';
import FastImage from 'react-native-fast-image';

const cardPadding = padding.xs(USE_ABSOLUTE_VALUE);

export const collectionCardStyles = StyleSheet.create({
    wrapperStyle: {
        width: dimensions.fullWidth / constants.catalogCardsPreview,
        aspectRatio: dimensions.cardAspectRatio,
        marginLeft: cardPadding,
        marginTop: cardPadding,
        marginBottom: cardPadding,
        borderRadius: dimensions.cardRadius,
        shadowOffset: { width: 0, height: 1 },
        shadowColor: colors.tertiary,
        shadowOpacity: 1.0,
        shadowRadius: 2,
        backgroundColor: colors.primary,
        elevation: 2,
    },
    imageStyle: {
        borderRadius: dimensions.cardRadius,
        flex: 1,
        alignSelf: 'stretch',
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
    textWrapperStyle: {
        flex: 1,
        flexDirection: 'column',
        position: 'absolute' as 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleStyle: {
        ...typography.body,
        color: colors.primary,
        fontFamily: defaultFont.bold,
        alignSelf: 'center',
        fontWeight: Platform.OS === 'ios' ? 'bold' : undefined,
    },
    subtitleStyle: {
        ...typography.subheading,
        color: colors.tertiary,
    },
});

const defaultImageGradientProps = {
    colors: ['transparent', 'rgba(16, 16, 16, 0.4)', 'rgba(16, 16, 16, 0.8)'],
    useAngle: true,
    angle: 45,
    angleCenter: { x: 0.5, y: 0.5 },
};

export interface CollectionCardViewStyle {
    /**
     * The style of the card container(View).
     */
    wrapperStyle?: StyleProp<ViewStyle>;
    /**
     * The style of the card container(Image).
     */
    imageStyle?: StyleProp<ImageStyle>;
    /**
     * The style of the card text container(View).
     */
    textWrapperStyle?: StyleProp<ViewStyle>;
    /**
     * The style of the linear gradient (View).
     */
    gradientOverlayStyle?: StyleProp<ViewStyle>;
    /**
     * The style of the card title (Text).
     */
    titleStyle?: StyleProp<TextStyle>;
    /**
     * The style of the card title (Text).
     */
    subtitleStyle?: StyleProp<TextStyle>;
    /*
     * The style of the card in focus (Only Android Tv and Firetv)
     */
    onFocusCardStyle?: StyleProp<ViewStyle>;
}

export interface CollectionCardViewBaseProps<T> {
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
     * The style of the `CollectionCardView` component
     */
    cardStyle?: CollectionCardViewStyle;
    /**
     * The aspectRatio for the collection card view
     */
    cardAspectRatio?: AspectRatio;
    /**
     * The aspectRatio for the collection card view
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
     * Boolean prop to toggle show/hide title
     */
    showTitle?: boolean;
    /**
     * Boolean prop to show subtitle or not
     */
    showSubtitle?: boolean;
    /**
     * The max number of lines to show for title
     */
    titleNumberOfLines?: number;
    /**
     * Skip resizing the images. Default is to resize the images.
     */
    skipResize?: boolean;
    /**
     * An array of colors which will be randomly picked as background color
     */
    backgroundColors?: string[];
}

export interface CollectionCardViewProps<T> extends CollectionCardViewBaseProps<T> {
    /**
     * Must be either `ResourceVm` or one of its extensions
     */
    resource: T;
}

export const cardViewDimensions = (cardStyle: CollectionCardViewStyle = {}): [number, number] => {
    const wrapperStyle = (cardStyle.wrapperStyle || collectionCardStyles.wrapperStyle) as ViewStyle;
    const cardWidth = wrapperStyle.width as number;
    const cardHeight = wrapperStyle.aspectRatio
        ? cardWidth * wrapperStyle.aspectRatio
        : (wrapperStyle.height as number);
    return [cardWidth, cardHeight];
};

const CollectionCardView = <T extends ResourceVm>(props: CollectionCardViewProps<T>): JSX.Element => {
    const {
        resource,
        cardStyle: style = {},
        onResourcePress,
        cardAspectRatio = dimensions.cardAspectRatio,
        cardImageType = dimensions.cardImageType,
        hideGradient,
        testID = 'collectionCardView',
        showTitle = false,
        showSubtitle = false,
        skipResize,
        titleNumberOfLines = 2,
        backgroundColors = secondaryColors,
    } = props;
    const randomColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
    const wrapperStyle = (style.wrapperStyle || collectionCardStyles.wrapperStyle) as ViewStyle;
    const [cardWidth] = cardViewDimensions(style);
    const [isFocussed, setIsFocussed] = useState<boolean>(false);
    const underlayColor = wrapperStyle.backgroundColor;
    const activeOpacity = 1.0;
    const aspectRatioKey = cardAspectRatio;
    const imageType = cardImageType;
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
                collectionCardStyles.wrapperStyle,
                style.wrapperStyle,
                { backgroundColor: randomColor },
                isFocussed ? style.onFocusCardStyle || collectionCardStyles.onFocusCardStyle : undefined,
            ]}
            underlayColor={underlayColor}
            activeOpacity={activeOpacity}
            onPress={onCardPress}
            tvParallaxProperties={props.tvParallaxProperties}
            onFocus={shouldApplyFocusStyle ? onCardFocus : undefined}
            onBlur={shouldApplyFocusStyle ? onCardBlur : undefined}
            testID={testID}
            accessibilityLabel={'Collection Card View'}>
            <>
                {resource.image ? (
                    <FastImage
                        key={resource.id || ''}
                        style={[collectionCardStyles.imageStyle, style.imageStyle]}
                        resizeMode={FastImage.resizeMode.contain}
                        source={{ uri: resource.image }}
                    />
                ) : (
                    <ResizableImage
                        keyId={resource.id || ''}
                        width={cardWidth}
                        skipResize={skipResize}
                        style={[collectionCardStyles.imageStyle, style.imageStyle]}
                        imageType={imageType}
                        aspectRatioKey={aspectRatioKey}
                    />
                )}
                {!hideGradient && (
                    <LinearGradient
                        {...defaultImageGradientProps}
                        {...props.linearGradientProps}
                        style={[collectionCardStyles.gradientOverlayStyle, style.gradientOverlayStyle]}
                    />
                )}
                <View style={[collectionCardStyles.textWrapperStyle, style.textWrapperStyle]}>
                    {showSubtitle && resource.subtitle && (
                        <Text style={[collectionCardStyles.subtitleStyle, style.subtitleStyle]}>
                            {resource.subtitle}
                        </Text>
                    )}
                    {showTitle && resource.name && (
                        <Text
                            numberOfLines={titleNumberOfLines}
                            style={[collectionCardStyles.titleStyle, style.titleStyle]}>
                            {resource.name}
                        </Text>
                    )}
                </View>
            </>
        </TouchableHighlight>
    );
};

const propsAreEqual = (prevProps: any, nextProps: any): boolean => {
    return prevProps.resource.id === nextProps.resource.id;
};

export default React.memo(CollectionCardView, propsAreEqual);
