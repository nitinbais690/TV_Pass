import { StyleSheet } from 'react-native';
import { colors, dimensions, fonts, padding, selectDeviceType } from 'qp-common-ui';

export const playerTopControlsStyles = (insets: any, isPortrait: boolean) => {
    return StyleSheet.create({
        rootContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        container: {
            flex: 1,
            width: '100%',
        },
        top: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: 'rgba(0,0,0,0.7)',
            paddingHorizontal: padding.sm(true),
            paddingTop: selectDeviceType({ Tablet: isPortrait ? padding.xxs(true) : padding.sm(true) }, 10),
        },
        topControlGroup: {
            alignSelf: 'stretch',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
        },
        moreControlsIconContainer: {
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
        },
        castIconContainer: {
            width: 40,
            height: 40,
            flexGrow: 1,
            tintColor: colors.primary,
            marginLeft: 25,
        },
        activeCastIcon: {
            width: 40,
            height: 40,
            flexGrow: 1,
            tintColor: colors.brandTint,
            marginLeft: 25,
        },
    });
};

export const playerCenterControlsStyles = () => {
    return StyleSheet.create({
        center: {
            flex: 2,
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
            borderRadius: 50,
        },
    });
};

export const playerBottomControlsStyles = (insets: any, isPortrait: boolean) => {
    return StyleSheet.create({
        bottom: {
            alignItems: 'stretch',
            flex: 1,
            justifyContent: 'flex-end',
            paddingBottom: selectDeviceType(
                { Tablet: isPortrait ? padding.xxs(true) : padding.md(true) },
                insets.bottom ? insets.bottom : 10,
            ),
            backgroundColor: 'rgba(0,0,0,0.7)',
            paddingHorizontal: selectDeviceType({ Handset: 40 }, 50),
        },
        volumeContainer: {
            flexDirection: 'row',
            alignContent: 'center',
            paddingBottom: selectDeviceType({ Handset: 15 }, 25),
        },
        sliderContainer: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
        },
        sliderWrapper: {
            flex: 1,
            height: 45,
            paddingBottom: selectDeviceType({ Handset: 15 }, 30),
        },
        slider: {
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
            height: 25,
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
            paddingTop: selectDeviceType({ Handset: 8 }, 0),
            marginLeft: 8,
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
            width: 50,
            height: 50,
            backgroundColor: 'transparent',
            alignItems: 'center',
        },
        icon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        timerText: {
            backgroundColor: 'transparent',
            color: colors.primary,
            paddingLeft: padding.xxs(true),
            fontSize: fonts.xxs,
            textAlign: 'right',
        },
        titleContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingBottom: 15,
        },
        titleText: {
            color: 'white',
            fontSize: fonts.xxs,
            fontWeight: '500',
        },
        captionText: {
            color: 'white',
            fontSize: fonts.xxs,
            fontWeight: '500',
            textTransform: 'capitalize',
        },
    });
};

export const trackSelectionStyles = (isPortrait: boolean) => {
    return StyleSheet.create({
        rootContainer: {
            flex: 1,
            marginLeft: selectDeviceType({ Tablet: isPortrait ? '15%' : '25%' }, '25%'),
            marginRight: selectDeviceType({ Tablet: isPortrait ? '15%' : '25%' }, '25%'),
            justifyContent: 'center',
        },
        backgroundOverlay: {
            justifyContent: 'center',
            height: selectDeviceType({ Tablet: isPortrait ? '30%' : '50%' }, '100%'),
        },
        modalContainer: {
            marginHorizontal: padding.sm(true),
            minWidth: '60%',
            borderRadius: 2,
            elevation: 24,
            flexDirection: 'row',
            overflow: 'hidden',
        },
        rowContainer: {
            height: dimensions.fullHeight * 0.06,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomColor: colors.borderLineColor,
            borderBottomWidth: 1,
        },
        trackHeadingStyle: {
            color: colors.primary,
            fontSize: selectDeviceType({ Tablet: fonts.xxlg }, fonts.xxlg),
            fontFamily: fonts.semibold,
            paddingVertical: selectDeviceType({ Tablet: padding.xs(true) }, padding.xs(true)),
        },
        renderItemTextStyle: {
            fontSize: selectDeviceType({ Tablet: fonts.sm }, fonts.sm),
            color: colors.primary,
            fontFamily: fonts.primary,
        },
        renderItemTextEnabled: {
            color: colors.primary,
        },
        renderItemTextDisabled: {
            color: colors.captionMedium,
        },
        close: {
            position: 'absolute',
            top: '7%',
            right: '5%',
            alignSelf: 'flex-end',
        },
    });
};

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
