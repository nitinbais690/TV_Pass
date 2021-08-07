import { StyleSheet, Platform } from 'react-native';
import { appFonts } from '../../AppStyles';
import { AspectRatio, padding, selectDeviceType } from 'qp-common-ui';
import { useHeaderTabBarHeight } from 'screens/components/HeaderTabBar';
import { modalHeaderHeight } from 'screens/components/ModalOverlay';

export const onboardingStyle = ({ appColors, appPadding, insets, isPortrait, width }: any) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const headerHeight = useHeaderTabBarHeight();
    const bannerCardHeight =
        (width - appPadding.sm(true)) / selectDeviceType({ Handset: AspectRatio._16by9 }, AspectRatio._3by1);
    const carouselOffset = bannerCardHeight + 20;

    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            margin: 0,
            padding: 0,
            backgroundColor: appColors.primary,
        },
        containerStyle: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'stretch',
            backgroundColor: appColors.primary,
            marginTop: padding.xs(),
        },
        logoContainer: {
            alignSelf: 'center',
            paddingTop: insets.top + 20,
            zIndex: 1,
        },
        wrapper: {
            flex: 1,
            position: 'relative',
            paddingTop: insets.top,
            justifyContent: 'space-between',
        },
        headerCreditBtnCont: {
            width: 100,
            height: 40,
            marginVertical: 2,
            zIndex: 3,
        },
        headerCreditBtnCont1: {
            top: selectDeviceType({ Tablet: 35 }, 20),
            left: selectDeviceType({ Tablet: isPortrait ? 40 : '15%' }, 0),
        },
        creditsButtonContainerSelectcontent: {
            position: 'absolute',
            top: insets.top + 10,
            zIndex: 1,
        },
        vPlaceholderCont: {
            position: 'relative',
            flex: 1,
            alignItems: 'center',
            paddingTop: carouselOffset, //selectDeviceType({ Tablet: '40%' }, '60%'),
        },
        storeFrontBackgroundContainer: {
            position: 'absolute',
            paddingVertical: appPadding.lg(),
            flex: 1,
            alignItems: 'center',
            width: '100%',
            minHeight: 350,
            height: '100%', // selectDeviceType({ Tablet: '40%' }, '100%'),
            zIndex: 3,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
        },
        storeFrontCardContainer: {
            position: 'absolute',
            top: headerHeight, //selectDeviceType({ Tablet: '10%' }, '23%'),
            zIndex: 9,
            left: 0,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        cardContainerShadow: {
            shadowColor: appColors.brandTint,
            shadowOffset: {
                width: 0,
                height: 0,
            },
            shadowRadius: 18,
            elevation: 19,
            borderColor: 'red',
            zIndex: 10,
        },
        cardBorderHighlight: {
            borderRadius: 22,
            borderWidth: 2,
            paddingBottom: Platform.OS === 'android' ? 215 : 0,
            position: 'absolute',
            left: Platform.OS === 'android' ? 3 : 5,
            right: Platform.OS === 'android' ? 3 : 5,
            bottom: 0,
            top: Platform.OS === 'android' ? 19 : 20,
            zIndex: 9,
        },
        middleCont: {
            flex: 3,
        },
        playBtnCont: {
            flex: 1,
            borderWidth: 2,
        },
        bottomContainer: {
            position: 'absolute',
            bottom: 0,
            alignSelf: 'flex-end',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            zIndex: 9,
            flex: 1,
            // height: '20%',
        },
        bottomWrapper: {
            backgroundColor: appColors.primaryVariant1,
            paddingTop: 20,
            paddingBottom: insets.bottom ? insets.bottom : 10,
            width: '100%',
            // padding: selectDeviceType({ Tablet: appPadding.xs() }, appPadding.sm()),
            paddingHorizontal: selectDeviceType({ Tablet: '15%' }, appPadding.sm()),
            // height: '100%',
        },
        bottomContentInfo: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingBottom: appPadding.sm(),
            //minHeight: '40%',
        },
        bottomContentInfoText: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.lg,
        },
        bottomContentInfoWCText: {
            color: appColors.brandTint,
        },
        bottomBtnSmt: {
            marginVertical: 20,
            justifyContent: selectDeviceType({ Tablet: isPortrait ? 'space-evenly' : 'center' }, 'space-evenly'),
        },
        bottomBtnSkip: {
            // marginBottom: insets.bottom + 10,
            alignSelf: selectDeviceType({ Tablet: 'auto' }, 'stretch'),
            marginBottom: 8,
        },
        bottomBtnSkipText: {
            color: appColors.caption,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
        },
        darkOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.7)',
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 2,
        },
    });
};

export const onboardingStep2Style = ({ insets }: any) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const headerHeight = useHeaderTabBarHeight();

    return StyleSheet.create({
        creditsButtonContainer: {
            position: 'absolute',
            top: insets.top + 10,
            zIndex: 10,
        },
        storeFrontCardContainer: {
            position: 'absolute',
            top: headerHeight, //selectDeviceType({ Tablet: '10%' }, '23%'),
            zIndex: 1,
            left: 0,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        darkOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 2,
        },
        radialGradient: {
            height: '100%',
        },
        radialGradientcontainer: {
            flex: 1,
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 9,
        },
    });
};

export const onboardingStep4Style = ({ appColors, appPadding, isPortrait, insets, width }: any) => {
    const headerHeight = modalHeaderHeight(insets);
    const buttonPosition = headerHeight + width / AspectRatio._16by9 + 15;
    return StyleSheet.create({
        step4Wrapper: {
            flex: 1,
            position: 'relative',
            justifyContent: 'space-between',
        },
        fadeInWrapper: {
            flex: 1,
        },
        redeemButtonContainer: {
            zIndex: 99,
            width: selectDeviceType({ Handset: '100%' }, '35%'),
            flexDirection: 'row',
            position: 'absolute',
            top: buttonPosition, //'46%',
            paddingHorizontal: 15,
            alignSelf: 'flex-end',
            right: selectDeviceType({ Handset: 0 }, 50),
        },
        creditsButtonContainer: {
            position: 'absolute',
            top: selectDeviceType({ Tablet: 50 }, insets.top + 10),
            zIndex: 10,
            left: selectDeviceType({ Tablet: 40 }, 0),
        },
        watchCreditBtnCont: {
            top: selectDeviceType({ Tablet: isPortrait ? '40%' : '56%' }, '44%'),
            right: selectDeviceType({ Tablet: isPortrait ? appPadding.md() : appPadding.xxl() }, 0),
            alignItems: selectDeviceType({ Tablet: 'flex-end' }, 'stretch'),
        },
        watchCreditBtnHigh: {
            borderRadius: 4,
            backgroundColor: appColors.brandTint,
            justifyContent: 'center',
            alignItems: 'center',
            height: 55,
            marginLeft: appPadding.sm(),
            marginRight: appPadding.sm(),
        },
        watchCreditBtnWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: appPadding.xs(),
        },

        watchCreditBtnText: {
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
            fontWeight: '500',
            color: appColors.secondary,
            paddingHorizontal: 4,
        },
    });
};

export const onboardingStep5Style = ({ appColors, appPadding, insets, isPortrait, width }: any) => {
    const headerHeight = modalHeaderHeight(insets);
    const buttonPosition = headerHeight + width / AspectRatio._16by9 + 15;
    return StyleSheet.create({
        step5Wrapper: {
            flex: 1,
            position: 'relative',
            justifyContent: 'space-between',
        },
        availCreditBtnCont: {
            top: selectDeviceType({ Tablet: isPortrait ? '27%' : '37%' }, '35%'),
            right: selectDeviceType({ Tablet: isPortrait ? appPadding.md() : appPadding.xxl() }, 0),
            justifyContent: 'center',
            alignItems: selectDeviceType({ Tablet: 'flex-end' }, 'flex-start'),
        },
        creditsButtonContainer: {
            position: 'absolute',
            top: selectDeviceType({ Tablet: 50 }, insets.top + 10),
            zIndex: 10,
            left: selectDeviceType({ Tablet: 40 }, 0),
        },
        redeemButtonContainer: {
            zIndex: 99,
            width: selectDeviceType({ Handset: '100%' }, '35%'),
            flexDirection: 'row',
            position: 'absolute',
            top: buttonPosition,
            paddingHorizontal: 15,
            alignSelf: 'flex-end',
            right: selectDeviceType({ Handset: 0 }, 50),
        },
        downloadButtonContainer: {
            marginLeft: appPadding.md(),
        },
        availCreditBtnHigh: {
            borderRadius: 4,
            backgroundColor: appColors.brandTint,
            justifyContent: 'center',
            height: selectDeviceType({ Tablet: 55 }, 25),
            marginLeft: appPadding.sm(),
            marginRight: appPadding.sm(),
        },
        availCreditBtnWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: appPadding.xs(),
            paddingRight: appPadding.xs(),
        },
        availCreditBtnText: {
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxs,
            fontWeight: '500',
            color: appColors.secondary,
            paddingHorizontal: 4,
        },
        playCreditBtnCont: {
            top: insets.top + 90,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: appPadding.md(),
        },
        playCreditBtnHigh: {
            backgroundColor: appColors.brandTint,
            justifyContent: 'center',
            alignItems: 'center',
            height: 50,
            width: 50,
            marginLeft: appPadding.sm(),
        },
        playCreditBtnWrapper: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: appPadding.xs(),
            paddingRight: appPadding.xs(),
        },
    });
};

export const onboardingSpet1Style = ({ appColors, appPadding, insets }: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        logoContainer: {
            alignSelf: 'center',
            paddingTop: insets.top + 20,
            zIndex: 1,
        },
        step1Container: {
            flex: 1,
            paddingHorizontal: appPadding.sm(true),
            backgroundColor: appColors.primary,
            height: '100%',
            position: 'absolute',
            justifyContent: selectDeviceType({ Tablet: 'center' }, 'space-evenly'),
            paddingTop: selectDeviceType({ Tablet: 0 }, appPadding.sm(true)),
        },
        step1Wrapper: {
            justifyContent: selectDeviceType({ Tablet: 'space-around' }, 'space-evenly'),
            paddingTop: selectDeviceType({ Tablet: '10%' }, '5%'),
            paddingBottom: '10%',
            marginHorizontal: selectDeviceType({ Tablet: appPadding.lg(true) }, appPadding.sm(true)),
        },
        getStarted: {
            textAlign: 'left',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '100%',
            top: appPadding.sm(),
            marginBottom: selectDeviceType({ Tablet: 0 }, appPadding.xxl()),
        },
        getStartedText: {
            color: appColors.brandTint,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxlg,
        },
        getStartedSubtitle: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxlg,
        },
        creditsContainer: {
            flexWrap: 'wrap',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: selectDeviceType({ Tablet: appPadding.md() }, appPadding.sm()),
        },
        credits: {},
        creditsText: {
            color: appColors.tertiary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.lg,
        },
        tickerWrapper: {
            marginLeft: appPadding.md(),
            marginTop: appPadding.xxl(),
            flexDirection: 'row',
            alignItems: 'center',
            zIndex: 2,
        },
        pillWrapper: {
            marginLeft: appPadding.sm(),
            zIndex: 2,
        },
        lottieContainer: {
            width: 725,
            backgroundColor: 'transparent',
            position: 'absolute',
            left: Platform.OS === 'android' ? -95 : -65,
            top: Platform.OS === 'android' ? -50 : -36,
        },
        lottieContainerExit: {
            width: 725,
            backgroundColor: 'transparent',
            position: 'absolute',
            left: Platform.OS === 'android' ? -95 : -65,
            top: Platform.OS === 'android' ? -50 : -36,
        },
        tickerText: {
            textAlign: 'center',
            fontSize: 80,
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            zIndex: 2,
        },
        step1BottomContainer: {
            marginTop: selectDeviceType({ Tablet: 0 }, appPadding.lg()),
        },
        creditInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
        },
        creditInfoText: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.lg,
        },
        freeCreditInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: appPadding.md(),
        },
        freeCreditInfoText: {
            marginTop: appPadding.lg(),
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.lg,
        },
    });
};
export const onboardingSpet6Style = ({ appColors, appPadding }: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        step6Container: {
            flex: 1,
            justifyContent: 'center',
            paddingBottom: appPadding.sm(),
            backgroundColor: appColors.primary,
        },
        step6Wrapper: {
            flex: 1,
            justifyContent: 'space-between',
            paddingHorizontal: selectDeviceType({ Tablet: '25%' }, appPadding.sm()),
            paddingVertical: selectDeviceType({ Tablet: '5%' }, appPadding.sm()),
        },
        radialGradientcontainer: {
            flex: 1,
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0,
        },
        radialGradient: {
            height: '100%',
        },
        lottieView: {
            width: 725,
            backgroundColor: 'transparent',
            position: 'absolute',
            left: -90,
            top: -44,
        },
        creditsAnimatedContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
        },
        headerCreditBtn6Cont: {
            position: 'absolute',
            top: 0,
            width: 300,
            backgroundColor: 'red',
            zIndex: 9,
            alignSelf: 'flex-start',
            height: 40,
            marginTop: appPadding.lg(),
        },
        creditsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        credits: {
            paddingLeft: appPadding.md(),
        },
        creditsText: {
            color: appColors.brandTint,
            fontWeight: 'bold',
            fontFamily: appFonts.primary,
            fontSize: 70,
        },
        tickerWrapper: {
            marginLeft: appPadding.md(),
            flexDirection: 'row',
            alignItems: 'center',
        },
        pillWrapper: {
            marginLeft: appPadding.sm(),
        },
        tickerText: {
            textAlign: 'center',
            fontSize: 80,
            color: appColors.secondary,
            fontFamily: appFonts.primary,
        },
        step6BottomContaner: {},
        creditInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            marginBottom: appPadding.sm(),
        },
        creditInfoText: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.lg,
        },
        creditInfoTextTint: {
            color: appColors.brandTint,
        },
    });
};
export const onboardingStep7Style = ({ appColors, appPadding, insets }: any) => {
    const headerHeight = modalHeaderHeight(insets);

    return StyleSheet.create({
        logoContainer: {
            alignSelf: 'center',
            paddingTop: insets.top + 20,
            zIndex: 1,
        },
        step7Wrapper: {
            flex: 1,
            justifyContent: 'space-between',
            paddingHorizontal: selectDeviceType({ Tablet: appPadding.lg() }, appPadding.sm()),
            paddingBottom: insets.bottom ? insets.bottom : 10,
        },
        step7MiddleContainer: {
            marginTop: selectDeviceType({ Tablet: 0 }, appPadding.md()),
        },
        step7BottomContainer: {
            paddingHorizontal: selectDeviceType({ Tablet: '25%' }, appPadding.sm()),
            marginVertical: selectDeviceType({ Tablet: 0 }, appPadding.md()),
        },
        completedInfo: {
            flexDirection: 'row',
            width: '100%',
            paddingRight: selectDeviceType({ Tablet: '15%' }, '10%'),
        },
        completedText: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxlg,
        },
        step7VisitText: {
            color: appColors.brandTint,
            fontFamily: appFonts.primary,
            fontSize: appFonts.md,
            textAlign: 'center',
        },
        step7QuestionsText: {
            marginTop: appPadding.sm(),
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.md,
        },
        storeFrontCardContainer: {
            position: 'absolute',
            top: headerHeight,
            zIndex: 1,
            left: 0,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        opaqueOverlay: {
            flex: 1,
            backgroundColor: appColors.primary,
            opacity: 0.95,
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 2,
        },
        textOverlay: {
            flex: 1,
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 2,
        },
    });
};
