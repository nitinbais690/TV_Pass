import { StyleSheet, Platform } from 'react-native';
import { selectDeviceType, AspectRatio, percentage, padding } from 'qp-common-ui';
import { appFonts, appPadding, appDimensions, tvPixelSizeForLayout } from '../../AppStyles';
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
            marginTop: 20,
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
            marginTop: 5,
            marginBottom: appPadding.xs(),
        },
        titleContainerStyle: {},
        headerLogoContainerStyle: {
            marginTop: appPadding.xs(true),
        },
        seriesTitleStyle: {
            fontSize: Platform.isTV ? tvPixelSizeForLayout(32) : appFonts.xs,
            fontFamily: appFonts.primary,
            color: appColors.secondary,
            marginVertical: Platform.isTV ? tvPixelSizeForLayout(15) : 5,
            marginBottom: Platform.isTV ? 0 : 5,
        },
        titleStyle: {
            fontSize: Platform.isTV ? tvPixelSizeForLayout(75) : appFonts.xxxlg,
            fontFamily: appFonts.bold,
            color: appColors.secondary,
            marginVertical: Platform.isTV ? tvPixelSizeForLayout(10) : undefined,
        },
        infoTextStyle: {
            fontSize: Platform.isTV ? tvPixelSizeForLayout(32) : appFonts.xs,
            fontFamily: appFonts.primary,
            color: appColors.secondary,
            marginTop: Platform.isTV ? tvPixelSizeForLayout(0) : appPadding.xs(),
        },
        readMoreStyle: {
            fontSize: Platform.isTV ? tvPixelSizeForLayout(32) : appFonts.xs,
            fontFamily: appFonts.semibold,
            color: Platform.isTV ? appColors.tertiary : appColors.caption,
            paddingVertical: Platform.isTV ? tvPixelSizeForLayout(8) : 2,
        },
        readMoreBtnStyleTv: {
            borderRadius: Platform.isTV ? tvPixelSizeForLayout(400) : 27,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: appColors.primaryVariant1,
            width: tvPixelSizeForLayout(250),
            marginTop: tvPixelSizeForLayout(30),
            borderWidth: tvPixelSizeForLayout(4),
            borderColor: appColors.primaryVariant1,
        },
        readMoreFocusStyleTv: {
            borderColor: appColors.secondary,
            borderWidth: tvPixelSizeForLayout(4),
            backgroundColor: appColors.primaryVariant1,
        },
        caption1: {
            fontSize: Platform.isTV ? tvPixelSizeForLayout(24) : appFonts.xxs,
            fontFamily: appFonts.primary,
            color: Platform.isTV ? appColors.tertiary : appColors.caption,
            marginVertical: Platform.isTV ? tvPixelSizeForLayout(15) : appPadding.xxs(true),
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
            backgroundColor: '#fff',
            height: '100%',
        },
        progressContainerTv: {
            left: 0,
            right: 0,
            marginTop: tvPixelSizeForLayout(40),
            height: tvPixelSizeForLayout(8),
            backgroundColor: appColors.caption,
        },
        progressTv: {
            backgroundColor: appColors.brandTint,
            height: '100%',
        },
        headerLogoStyle: {
            height: Platform.OS === 'ios' ? tvPixelSizeForLayout(90) : tvPixelSizeForLayout(110),
            width: Platform.OS === 'ios' ? tvPixelSizeForLayout(90) : tvPixelSizeForLayout(110),
        },
        container: {
            flex: 1,
        },
        gradientBackgroundStyle: {
            position: 'absolute',
            height: appDimensions.fullHeight,
            width: appDimensions.fullWidth,
            zIndex: 0,
        },
        scrollStyleTv: {
            position: 'absolute',
            height: appDimensions.fullHeight,
            width: appDimensions.fullWidth,
            zIndex: 1,
        },
        scrollContainerWrapper: {
            paddingTop: tvPixelSizeForLayout(292),
            paddingBottom: tvPixelSizeForLayout(100),
        },
        rowContainer: {
            width: appDimensions.fullWidth,
            flexDirection: 'row',
            paddingLeft: Platform.isTV ? tvPixelSizeForLayout(160) : appPadding.xl(true),
        },
        tvSeriescontainer: {
            height: 'auto',
        },
        movieContainer: {
            height: 'auto',
        },
        relatedListStyle: {
            paddingLeft: Platform.isTV ? tvPixelSizeForLayout(160) : appPadding.xl(true),
        },
        relatedSectionTvHeader: {
            fontSize: tvPixelSizeForLayout(32),
            fontFamily: appFonts.medium,
            fontWeight: undefined,
            paddingTop: tvPixelSizeForLayout(30),
            color: Platform.isTV ? appColors.tertiary : appColors.secondary,
            textAlign: 'left',
            textTransform: 'capitalize',
            paddingLeft: tvPixelSizeForLayout(160),
            paddingBottom: tvPixelSizeForLayout(20),
        },
        relatedSectionTvHeaderTop: {
            fontSize: tvPixelSizeForLayout(32),
            fontFamily: appFonts.medium,
            fontWeight: undefined,
            paddingTop: tvPixelSizeForLayout(100),
            color: Platform.isTV ? appColors.tertiary : appColors.secondary,
            textAlign: 'left',
            textTransform: 'capitalize',
            paddingLeft: tvPixelSizeForLayout(160),
            paddingBottom: tvPixelSizeForLayout(20),
        },
        fallBackImageStyle: {
            // height: '50%',
            borderRadius: appDimensions.cardRadius,
            marginRight: appPadding.md(),
            marginTop: appPadding.sm(),
            overlayColor: 'hidden',
            alignSelf: 'flex-end',
            backgroundColor: appColors.primary,
        },
        gridBoxStyle: {
            flex: 1,
            justifyContent: 'flex-start',
        },
        ctaWrapperStyleTV: {
            width: '60%',
            marginTop: tvPixelSizeForLayout(40),
            flexDirection: 'row',
            alignItems: 'center',
        },
        playButtonTvContainer: {
            marginRight: tvPixelSizeForLayout(70),
        },
        resumeButtonContainerTv: {
            width: '50%',
            marginRight: tvPixelSizeForLayout(30),
        },
        playButtonTv: {
            borderColor: appColors.brandTint,
            borderWidth: tvPixelSizeForLayout(4),
            borderRadius: tvPixelSizeForLayout(80),
            height: tvPixelSizeForLayout(80),
            width: tvPixelSizeForLayout(80),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: appColors.brandTint,
        },
        playButtonFocusTv: {
            borderColor: appColors.secondary,
            borderWidth: tvPixelSizeForLayout(4),
            borderRadius: tvPixelSizeForLayout(80),
            height: tvPixelSizeForLayout(80),
            width: tvPixelSizeForLayout(80),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: appColors.brandTint,
        },
        resumeTV: {
            width: '100%',
            height: Platform.isTV ? tvPixelSizeForLayout(80) : 54,
            borderRadius: Platform.isTV ? tvPixelSizeForLayout(400) : 27,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: appColors.primaryVariant1,
            borderColor: appColors.secondary,
            borderWidth: tvPixelSizeForLayout(4),
        },
        resumeTextStyleTv: {
            fontFamily: appFonts.primary,
            fontSize: Platform.isTV ? tvPixelSizeForLayout(32) : appFonts.md,
            fontWeight: '500',
            color: appColors.secondary,
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
        dropDownContainer: {
            flex: 1,
            flexDirection: 'column',
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: appColors.border,
            marginHorizontal: 0,
        },
        seasonHeadingContainer: {
            borderBottomWidth: Platform.isTV ? tvPixelSizeForLayout(4) : 2,
            borderColor: appColors.caption,
            marginBottom: Platform.isTV ? undefined : appPadding.xs(true),
            paddingVertical: Platform.isTV ? tvPixelSizeForLayout(10) : 5,
        },
        seasonListContainer: {
            marginTop: Platform.isTV ? tvPixelSizeForLayout(36) : undefined,
        },
        seasonRowContainer: {
            flexDirection: 'row',
        },
        headingTextStyle: {
            fontSize: Platform.isTV ? tvPixelSizeForLayout(32) : appFonts.xs,
            fontFamily: appFonts.medium,
            color: appColors.tertiary,
            fontWeight: '500',
        },
        inActiveTextStyle: {
            color: appColors.caption,
        },
        activeTextStyle: {
            color: appColors.secondary,
        },
        seasonContainerStyle: {
            marginRight: tvPixelSizeForLayout(32),
            height: tvPixelSizeForLayout(80),
            width: tvPixelSizeForLayout(296),
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: tvPixelSizeForLayout(5),
            borderRadius: tvPixelSizeForLayout(150),
        },
        activeSeasonContainerStyle: {
            backgroundColor: appColors.primaryVariant1,
        },
        focusedSeasonContainerStyle: {
            backgroundColor: appColors.primaryVariant1,
            borderWidth: tvPixelSizeForLayout(4),
            borderColor: appColors.secondary,
        },
        episodesListViewContainer: {
            flex: 1,
            flexDirection: Platform.isTV ? 'row' : 'column',
        },
        containerStyleTv: {
            paddingHorizontal: tvPixelSizeForLayout(160),
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
            paddingLeft: appPadding.sm(true),
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
