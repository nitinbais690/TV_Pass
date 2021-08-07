import { StyleSheet } from 'react-native';
import { appFonts } from '../../AppStyles';
import { selectDeviceType } from 'qp-common-ui';

export const onboardingStyle = ({ appColors, appPadding, insets, isPortrait }: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            margin: 0,
            padding: 0,
        },
        wrapper: {
            flex: 1,
            paddingTop: insets.top,
            justifyContent: 'space-between',
        },
        headerCreditBtnCont: {
            alignSelf: 'flex-start',
            height: 40,
            marginVertical: 2,
        },
        headerCreditBtnCont1: {
            top: selectDeviceType({ Tablet: 35 }, 20),
            left: selectDeviceType({ Tablet: isPortrait ? 40 : '15%' }, 0),
        },
        vPlaceholderCont: {
            marginTop: selectDeviceType({ Tablet: 1 }, 50),
            flex: 3,
            alignItems: 'center',
        },
        middleCont: {
            flex: 3,
        },
        playBtnCont: {
            flex: 1,
            borderWidth: 2,
        },
        bottomContainer: {
            alignSelf: 'flex-end',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
        },
        bottomWrapper: {
            backgroundColor: appColors.primaryVariant1,
            width: '100%',
            padding: selectDeviceType({ Tablet: appPadding.xs() }, appPadding.sm()),
            paddingHorizontal: selectDeviceType({ Tablet: '25%' }, appPadding.sm()),
        },
        bottomContentInfo: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingBottom: appPadding.sm(),
        },
        bottomContentInfoText: {
            color: appColors.tertiary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.lg,
        },
        bottomContentInfoWCText: {
            color: appColors.brandTint,
        },
        bottomBtnSmt: {},
        bottomBtnSkip: {},
        bottomBtnSkipText: {
            fontSize: appFonts.xs,
        },
    });
};

export const onboardingStep4Style = ({ appColors, appPadding, isPortrait }: any) => {
    return StyleSheet.create({
        step4Wrapper: {
            justifyContent: 'space-between',
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

export const onboardingStep5Style = ({ appColors, appPadding, insets, isPortrait }: any) => {
    return StyleSheet.create({
        step5Wrapper: {
            justifyContent: 'space-between',
        },
        availCreditBtnCont: {
            top: selectDeviceType({ Tablet: isPortrait ? '27%' : '37%' }, '35%'),
            right: selectDeviceType({ Tablet: isPortrait ? appPadding.md() : appPadding.xxl() }, 0),
            justifyContent: 'center',
            alignItems: selectDeviceType({ Tablet: 'flex-end' }, 'flex-start'),
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

export const onboardingSpet1Style = ({ appColors, appPadding, isPortrait }: any) => {
    return StyleSheet.create({
        step1Container: {
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: appPadding.sm(),
            paddingVertical: appPadding.sm(),
            backgroundColor: appColors.primary,
        },
        step1Wrapper: {
            flex: 1,
            justifyContent: 'space-between',
            paddingHorizontal: selectDeviceType({ Tablet: '25%' }, appPadding.xxs()),
            paddingVertical: selectDeviceType({ Tablet: isPortrait ? '25%' : '10%' }, appPadding.lg()),
        },
        getStarted: {
            textAlign: 'left',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            top: appPadding.sm(),
        },
        getStartedText: {
            color: appColors.tertiary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.lg,
        },
        creditsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: appPadding.xxxl(),
            marginBottom: appPadding.xxxl(),
        },
        credits: {},
        creditsText: {
            color: appColors.tertiary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.lg,
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
        step1BottomContaner: {},
        creditInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
        },
        creditInfoText: {
            color: appColors.tertiary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xlg,
        },
        freeCreditInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: appPadding.md(),
        },
        freeCreditInfoText: {
            color: appColors.caption,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xlg,
        },
    });
};
export const onboardingSpet6Style = ({ appColors, appPadding, insets }: any) => {
    return StyleSheet.create({
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
        headerCreditBtn6Cont: {
            alignSelf: 'flex-start',
            height: 40,
            marginTop: insets.top,
        },
        creditsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        credits: {},
        creditsText: {
            color: appColors.tertiary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.lg,
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
            color: appColors.tertiary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.lg,
        },
    });
};
