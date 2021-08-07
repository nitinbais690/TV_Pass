import { StyleSheet, Platform } from 'react-native';
import { selectDeviceType, AspectRatio, percentage, padding } from 'qp-common-ui';
import { appFonts, appPadding, appDimensions } from '../../AppStyles';
import { modalHeaderHeight } from 'screens/components/ModalOverlay';

export const imageAspectRatio = AspectRatio._16by9;

export const defaultContentDetailsStyle = ({ appColors, insets, isOnboarding }: any) => {
    const overlapY = 2 * appPadding.sm(true) + 50;

    return StyleSheet.create({
        headerContainer: {
            position: 'absolute',
            top: 0,
            zIndex: 100,
            width: '100%',
        },
        contentWrapperStyle: {
            flex: 1,
            flexDirection: 'column',
            marginTop: 0,
            marginBottom: insets.bottom,
        },
        imageWrapperStyle: {
            justifyContent: 'center',
            overflow: 'hidden',
            width: '100%',
            aspectRatio: imageAspectRatio,
            top: 0,
            left: 0,
            right: 0,
            marginTop: modalHeaderHeight(insets),
        },
        imageStyle: {
            flex: 1,
            justifyContent: 'center',
            alignSelf: 'center',
            width: '100%',
            aspectRatio: imageAspectRatio,
            backgroundColor: appColors.primaryVariant2,
        },
        textWrapperStyle: {
            marginTop: appPadding.sm(),
            marginHorizontal: appPadding.sm(true),
            flexDirection: selectDeviceType({ Handset: 'column' }, 'row-reverse'),
            justifyContent: 'space-between',
        },
        ctaWrapperStyle: {
            flex: 1,
            alignSelf: 'stretch',
            flexGrow: 0.5,
            paddingLeft: selectDeviceType({ Handset: 0 }, appPadding.sm(true)),
        },
        infoContainerStyle: {
            flex: 0.8,
            flexDirection: 'column',
            flexWrap: 'wrap',
            marginTop: selectDeviceType({ Handset: 5 }, 0),
        },
        titleContainerStyle: {},
        descStyle: {
            marginHorizontal: appPadding.sm(true),
        },
        seriesTitleStyle: {
            fontSize: appFonts.xs,
            fontFamily: appFonts.primary,
            color: appColors.secondary,
            marginVertical: 5,
        },
        titleStyle: {
            fontSize: appFonts.xxxlg,
            fontFamily: appFonts.bold,
            color: appColors.secondary,
        },
        infoTextStyle: {
            fontSize: appFonts.xs,
            fontFamily: appFonts.primary,
            color: appColors.secondary,
            marginTop: appPadding.xxs(),
        },
        readMoreStyle: {
            fontSize: appFonts.xs,
            fontFamily: appFonts.semibold,
            color: appColors.caption,
            paddingTop: 2,
        },
        caption1: {
            fontSize: appFonts.xxs,
            fontFamily: appFonts.primary,
            color: appColors.caption,
            margin: 0,
            marginVertical: appPadding.xxs(true),
            textTransform: 'none',
        },
        playButton: {
            justifyContent: 'center',
            alignItems: 'center',
            ...StyleSheet.absoluteFillObject,
        },
        playButtonLoading: {
            position: 'absolute',
            backgroundColor: appColors.brandTint,
            width: 45,
            aspectRatio: 1,
            borderRadius: 50,
        },
        subscribeButton: {
            marginVertical: appPadding.xs(true),
        },
        gradient: {
            ...StyleSheet.absoluteFillObject,
            top: undefined,
            height: overlapY + 40,
        },
        gradientHeader: {
            ...StyleSheet.absoluteFillObject,
            top: 0,
            bottom: undefined,
            height: 66,
        },
        redeemButtonWrapper: {
            width: '100%',
            flexDirection: 'row',
            opacity: isOnboarding ? 0 : 1,
        },
        downloadButtonWrapper: { marginLeft: 20 },
        progressContainer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            backgroundColor: appColors.primaryEnd,
        },
        progress: {
            backgroundColor: appColors.brandTint,
            height: '100%',
        },
    });
};

const customPadding = selectDeviceType<number>({ Tv: appPadding.xs(true) }, appPadding.md(true));
const catalogCardsPreview = selectDeviceType<number>({ Tv: 6.2, Tablet: 3.5 }, 1.5);

export const defaultEpisodesCardStyle = ({ appColors }: any) => {
    return StyleSheet.create({
        containerStyle: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'stretch',
            backgroundColor: 'transparent',
            marginTop: appPadding.xs(),
        },
        wrapperStyle: {
            width: (appDimensions.fullWidth - (catalogCardsPreview + 1) * customPadding) / catalogCardsPreview,
            aspectRatio: appDimensions.cardAspectRatio,
            marginLeft: customPadding / 2,
            marginRight: 0,
            marginTop: 0,
            marginBottom: Platform.isTV ? appPadding.xs(true) : appPadding.xxs(true),
            borderRadius: appDimensions.cardRadius,
            backgroundColor: appColors.primaryVariant2,
            shadowOffset: { width: 0, height: 2 },
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 1,
            elevation: 0,
        },
        imageStyle: {
            borderRadius: appDimensions.cardRadius,
            flex: 1,
        },
    });
};

export const defaultDropDownMenuStyle = ({ appColors }: any) => {
    return StyleSheet.create({
        modalInsideView: {
            backgroundColor: appColors.primaryVariant1,
            height: '30%',
            width: selectDeviceType({ Handset: '80%' }, '40%'),
            borderRadius: 22,
        },
        modelContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        rootContainerStyle: {
            flexDirection: 'row',
            width: selectDeviceType({ Handset: 120 }, 160),
            backgroundColor: 'transparent',
            borderBottomWidth: 1,
            borderBottomColor: 'transparent',
        },
        touchableContainerStyle: {
            flex: 1,
            height: undefined,
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: appPadding.xxs(true),
            paddingVertical: 10,
            marginVertical: 0,
        },
        dropDownMenuButtonStyle: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        titleTextStyle: {
            color: appColors.brandTint,
            fontSize: appFonts.sm,
            fontWeight: '500',
        },
        itemStyle: {
            flex: 1,
            height: undefined,
            width: appDimensions.fullWidth,
            justifyContent: 'center',
            backgroundColor: appColors.backgroundInactive,
        },
        itemSeparatorStyle: {
            flex: 1,
            backgroundColor: appColors.captionLight,
            marginLeft: 0,
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 0,
        },
        itemRowStyle: {
            flex: 1,
            flexDirection: 'row',
            paddingHorizontal: 40,
            alignItems: 'center',
            justifyContent: 'flex-start',
        },
        dropDownArrowStyle: {
            width: 10,
            height: 5,
            marginLeft: percentage(2, true),
        },
        itemTextStyle: {
            fontFamily: appFonts.primary,
            fontSize: appFonts.md,
            color: appColors.secondary,
            paddingVertical: selectDeviceType({ Handset: 10 }, 0),
        },
        closeButton: {
            marginHorizontal: selectDeviceType({ Handset: padding.sm(true) }, padding.xs(true)),
            paddingTop: selectDeviceType({ Handset: padding.sm(true) }, padding.xs(true)),
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            alignContent: 'flex-end',
        },
    });
};
