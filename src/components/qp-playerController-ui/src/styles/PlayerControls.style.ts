import { StyleSheet } from 'react-native';
import {
    appFlexStyles,
    appFontStyle,
    colors,
    dimentionsValues,
    fonts,
    padding,
    scale,
    selectDeviceType,
} from 'qp-common-ui';
import { appDimensionValues } from 'core/styles/AppStyles';

export const playerTopControlsStyles = () => {
    return StyleSheet.create({
        rootContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
        },
        container: {
            flex: 1,
            width: '100%',
        },
        top: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: 'rgba(0,0,0,0.7)',
            paddingStart: dimentionsValues.xmd,
            paddingTop: dimentionsValues.md,
        },
        topControlGroup: {
            alignSelf: 'stretch',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
        },
        topLeftControl: {
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
        },
        moreControlsIconContainer: {
            width: dimentionsValues.xxxxlg,
            height: dimentionsValues.xxxxlg,
        },
        zoomIcon: {
            width: dimentionsValues.xxxxlg,
            height: dimentionsValues.xxxxlg,
            marginStart: dimentionsValues.xxxxxs,
        },
        subTitleStyle: {
            marginTop: dimentionsValues.xxxs,
            fontSize: fonts.xxs,
            fontFamily: fonts.primary,
            fontWeight: '400',
            color: colors.primary,
        },
        castIconContainer: {
            width: dimentionsValues.xxxxlg,
            height: dimentionsValues.xxxxlg,
            flexGrow: 1,
            tintColor: colors.primary,
            marginLeft: dimentionsValues.lg,
        },
        lockOptionStyle: {
            position: 'absolute',
            right: 0,
            top: 0,
            marginEnd: dimentionsValues.md,
            marginTop: dimentionsValues.md,
            padding: appDimensionValues.xxxxxs,
        },
        activeCastIcon: {
            width: dimentionsValues.xxxxlg,
            height: dimentionsValues.xxxxlg,
            flexGrow: 1,
            tintColor: colors.brandTint,
            marginLeft: dimentionsValues.lg,
        },
        ratingStyle: {
            position: 'absolute',
            left: 0,
            top: 0,
            //marginStart: dimentionsValues.xxxxlg,
            marginTop: dimentionsValues.mlg,
        },
    });
};

export const playerCenterControlsStyles = () => {
    return StyleSheet.create({
        center: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)',
        },
        centerControlGroup: {
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
        },
        icon: {
            borderRadius: dimentionsValues.xxxxxlg,
        },
        playicon: {
            paddingTop: dimentionsValues.xxxxs,
            paddingHorizontal: dimentionsValues.xxxxs,
        },
    });
};

export const playerBottomControlsStyles = (insets: any, isPortrait: boolean) => {
    return StyleSheet.create({
        bottom: {
            alignItems: 'stretch',
            flex: 1,
            justifyContent: 'flex-end',
            paddingBottom: dimentionsValues.sm,
            backgroundColor: 'rgba(0,0,0,0.7)',
        },
        volumeContainer: {
            flexDirection: 'row',
            alignContent: 'center',
            paddingBottom: dimentionsValues.sm,
            backgroundColor: 'red',
        },
        sliderContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: dimentionsValues.xs,
            paddingEnd: dimentionsValues.xmd,
            paddingStart: dimentionsValues.xxxs,
        },
        sliderWrapper: {
            flex: 1,
        },
        slider: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            height: dimentionsValues.lg,
        },
        volumeSlider: {
            flexDirection: 'column',
            alignItems: 'center',
            width: 150,
            height: 25,
        },
        durationContainer: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginLeft: dimentionsValues.xxxs,
        },
        liveIconContainer: {
            alignItems: 'center',
            flexDirection: 'row',
            marginLeft: dimentionsValues.xxxs,
            paddingBottom: selectDeviceType(
                { Tablet: isPortrait ? padding.xxs(true) : padding.md(true) },
                insets.bottom ? insets.bottom : dimentionsValues.xxxs,
            ),
        },
        liveIcon: {
            color: 'red',
            fontSize: fonts.xxlg,
            textAlign: 'right',
        },
        liveTimerText: {
            color: 'white',
            ...appFontStyle.sublineText,
            textAlign: 'right',
        },
        currentTime: {
            color: 'white',
            fontSize: fonts.xxs,
            fontFamily: fonts.primary,
            position: 'absolute',
            bottom: 0,
            textAlign: 'center',
        },
        iconContainer: {
            width: dimentionsValues.xxxxxxlg,
            height: dimentionsValues.xxxxxxlg,
            backgroundColor: 'transparent',
            alignItems: 'center',
        },
        icon: {
            width: dimentionsValues.xxxxlg,
            height: dimentionsValues.xxxxlg,
            borderRadius: dimentionsValues.xmd,
            alignItems: 'center',
            justifyContent: 'center',
        },
        timerText: {
            backgroundColor: 'transparent',
            color: colors.primary,
            ...appFontStyle.body3,
            paddingLeft: padding.xxs(true),
            textAlign: 'right',
        },
        titleContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingBottom: dimentionsValues.xs,
        },
        titleText: {
            color: 'white',
            ...appFontStyle.body3,
        },
        movieTitle: {
            marginTop: dimentionsValues.xxxxxs,
        },
        captionText: {
            color: 'white',
            fontSize: fonts.xxs,
            fontWeight: '600',
            textTransform: 'capitalize',
        },
        playerOptionsContainer: {
            alignSelf: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
        },
        playerOptionsTitle: {
            marginStart: dimentionsValues.xxxs,
            ...appFontStyle.sublineText,
        },
        playerOptions: {
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: dimentionsValues.md,
        },
        brightnessIcon: {
            zIndex: 10000,
            marginBottom: dimentionsValues.xxxlg,
            marginStart: dimentionsValues.xmd,
            height: dimentionsValues.xxxxlg,
            width: dimentionsValues.xxxxlg,
            alignItems: 'center',
            justifyContent: 'center',
        },
        brightnessControllerContainer: {
            position: 'absolute',
            marginStart: dimentionsValues.xs,
            left: 0,
            bottom: 0,
            top: 0,
            justifyContent: 'center',
        },
    });
};

export const trackSelectionStyles = () => {
    return StyleSheet.create({
        rootContainer: {
            flexDirection: 'column',
            paddingVertical: dimentionsValues.lg,
            paddingHorizontal: dimentionsValues.md,
            justifyContent: 'center',
            borderRadius: dimentionsValues.xxxs,
        },
        backgroundOverlay: {
            flex: 1,
            position: 'absolute',
            alignSelf: 'center',
            top: 0,
            bottom: 0,
            justifyContent: 'center',
        },
        closeIconStyle: {
            alignSelf: 'flex-end',
            marginBottom: dimentionsValues.xmd,
        },
        modalContainer: {
            marginHorizontal: padding.sm(true),
            minWidth: '60%',
            borderRadius: dimentionsValues.xxxxxs,
            elevation: dimentionsValues.lg,
            flexDirection: 'row',
            overflow: 'hidden',
        },
        captionFormatContainer: {
            ...appFlexStyles.flexRow,
            alignItems: 'center',
            marginTop: dimentionsValues.sm,
        },
        captionFormatItem: {
            paddingStart: dimentionsValues.lg,
        },
        subTitleOptionText: {
            ...appFontStyle.body3,
            color: colors.primary,
        },
        captionSampleTextStyle: {
            position: 'absolute',
            top: 0,
            alignSelf: 'center',
            marginTop: dimentionsValues.lg,
        },
        trackHeadingStyle: {
            color: colors.primary,
            fontSize: selectDeviceType({ Tablet: fonts.lg }, fonts.md),
            fontFamily: fonts.semibold,
            padding: selectDeviceType({ Tablet: padding.xs(true) }, padding.xs(true)),
            paddingLeft: selectDeviceType({ Tablet: padding.sm(true) }, padding.xs(true)),
        },
        renderItemTextStyle: {
            color: colors.greyText,
            ...appFontStyle.body2,
            paddingVertical: dimentionsValues.xxxs,
        },
        selectedCaptionTextSizeStyle: {
            color: colors.brandTintLight,
        },
        selectedCaptionFormatStyle: {
            borderColor: colors.brandTintLight,
            borderWidth: 1,
        },
        renderSelectedItemTextStyle: {
            paddingHorizontal: dimentionsValues.xxxs,
        },
        renderSelectedItemContainerStyle: {
            minWidth: selectDeviceType({ Handset: scale(100, 0) }, scale(120, 0)),
        },
        videoQualityPopupcontainer: {
            flexDirection: 'column',
            paddingBottom: dimentionsValues.xxs,
            paddingHorizontal: dimentionsValues.md,
            justifyContent: 'center',
            borderRadius: dimentionsValues.xxxs,
        },
        videoQualityItem: {
            paddingTop: 12,
            flexDirection: 'row',
            alignItems: 'center',
        },
    });
};

export const captionFormatStyle = StyleSheet.create({
    captionFormat1: {
        color: colors.primary,
        ...appFontStyle.sublineText,
        fontFamily: fonts.primary,
        backgroundColor: colors.black,
        paddingHorizontal: dimentionsValues.xxxs,
        paddingVertical: selectDeviceType({ Handset: scale(6, 0) }, scale(8, 0)),
        borderRadius: dimentionsValues.xxxxxs,
    },
    captionFormat2: {
        color: colors.primary,
        ...appFontStyle.sublineText,
        fontFamily: fonts.primary,
        backgroundColor: '#BCBDBE',
        paddingHorizontal: dimentionsValues.xxxs,
        paddingVertical: selectDeviceType({ Handset: scale(6, 0) }, scale(8, 0)),
        borderRadius: dimentionsValues.xxxxxs,
    },
    captionFormat3: {
        color: '#E3DB30',
        ...appFontStyle.sublineText,
        fontFamily: fonts.primary,
        backgroundColor: colors.black,
        paddingHorizontal: dimentionsValues.xxxs,
        paddingVertical: selectDeviceType({ Handset: scale(6, 0) }, scale(8, 0)),
        borderRadius: dimentionsValues.xxxxxs,
    },
    captionFormat4: {
        color: colors.black,
        ...appFontStyle.sublineText,
        fontFamily: fonts.primary,
        backgroundColor: colors.primary,
        paddingHorizontal: dimentionsValues.xxxs,
        paddingVertical: selectDeviceType({ Handset: scale(6, 0) }, scale(8, 0)),
        borderRadius: dimentionsValues.xxxxxs,
    },
    captionFormat5: {
        color: colors.black,
        ...appFontStyle.sublineText,
        fontFamily: fonts.primary,
        backgroundColor: '#97989C',
        paddingHorizontal: dimentionsValues.xxxs,
        paddingVertical: selectDeviceType({ Handset: scale(6, 0) }, scale(8, 0)),
        borderRadius: dimentionsValues.xxxxxs,
    },
});

export const captionSizeStyle = StyleSheet.create({
    captionSizeColor: {
        color: colors.greyText,
    },
    captionSize1: {
        ...appFontStyle.sublineText,
        fontFamily: fonts.primary,
        padding: dimentionsValues.xxxs,
    },
    captionSize2: {
        ...appFontStyle.body3,
        fontFamily: fonts.primary,
        padding: dimentionsValues.xxxs,
    },
    captionSize3: {
        ...appFontStyle.body2,
        fontFamily: fonts.primary,
        padding: dimentionsValues.xxxs,
    },
    captionSize4: {
        ...appFontStyle.body1,
        fontFamily: fonts.primary,
        padding: dimentionsValues.xxxxs,
    },
    captionSize5: {
        ...appFontStyle.body,
        fontFamily: fonts.primary,
        padding: dimentionsValues.xxxxs,
    },
});

export const loadingIndicatorStyles = () => {
    return StyleSheet.create({
        loading: {
            position: 'absolute' as 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center' as 'center',
            justifyContent: 'center' as 'center',
        },
    });
};
