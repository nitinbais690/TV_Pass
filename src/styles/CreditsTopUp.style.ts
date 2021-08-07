import { StyleSheet } from 'react-native';
import { selectDeviceType } from 'qp-common-ui';
import { appDimensions, appFonts, appPadding } from '../../AppStyles';
import DeviceInfo from 'react-native-device-info';

export const creditsTopUpPageStyles = ({ appColors, insets }: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: insets.top,
            backgroundColor: appColors.primary,
            margin: '0%',
            borderRadius: selectDeviceType({ Tablet: 10 }, 0),
        },
        creditsContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: appColors.border,
            backgroundColor: appColors.brandTint,
            marginHorizontal: selectDeviceType({ Handset: 20 }, 128),
            height: 120,
            borderRadius: 72,
        },
        creditsIconSpacing: {
            marginRight: 10,
        },
        creditsModalContainer: {
            marginTop: selectDeviceType({ Handset: DeviceInfo.hasNotch() ? 30 : 5 }, 0),
            flex: 1,
        },
        creditsLabel: {
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
            color: appColors.secondary,
            alignSelf: 'center',
            marginTop: 36,
            marginBottom: 20,
        },
        creditsCopyLabel: {
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxs,
            color: appColors.caption,
            alignSelf: 'center',
            marginTop: 10,
            marginLeft: 10,
        },
        credits: {
            fontFamily: appFonts.primary,
            fontSize: appFonts.headline,
            color: appColors.secondary,
            fontWeight: '500',
        },
        close: {
            position: 'absolute',
            top: selectDeviceType({ Handset: insets.top }, 0) + appPadding.sm(true),
            right: appPadding.sm(true),
            zIndex: 1000,
        },
        loadingContainer: {
            ...StyleSheet.absoluteFillObject,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(18, 18, 18, 0.75)',
            borderRadius: selectDeviceType({ Tablet: 10 }, 0),
        },
        glow: {
            position: 'absolute',
            width: 835,
            aspectRatio: 1,
            top: -880,
            left: -835 / 2,
            backgroundColor: appColors.brandTint,
            borderRadius: 835,
            shadowOpacity: 0.3,
            shadowColor: appColors.brandTint,
            shadowRadius: 150,
            shadowOffset: { width: 200, height: 200 },
        },
    });
};

export const topUpProductStyle = ({ appColors }: any) => {
    return StyleSheet.create({
        container: {
            flexDirection: 'row',
            paddingVertical: selectDeviceType({ Handset: 20 }, 30),
            borderColor: appColors.border,
            borderBottomWidth: StyleSheet.hairlineWidth,
            backgroundColor: appColors.primaryVariant6,
            marginBottom: 16,
            marginHorizontal: selectDeviceType({ Handset: 20 }, 128),
            borderRadius: appDimensions.cardRadius,
            overflow: 'hidden',
        },
        logoContainer: {
            flex: 0.4,
            justifyContent: 'center',
            alignItems: 'center',
        },
        logo: {
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        },
        creditScoreWrapper: {
            ...StyleSheet.absoluteFillObject,
            justifyContent: 'center',
            alignItems: 'center',
        },
        creditScore: {
            color: appColors.brandTint,
            fontFamily: appFonts.semibold,
            fontSize: selectDeviceType({ Handset: appFonts.xlg }, appFonts.xxxlg),
        },
        detailsContainer: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            flex: 0.6,
            marginLeft: 10,
        },
        title: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxlg,
            fontWeight: '600',
            textAlign: 'center',
        },
        description: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
            fontWeight: '500',
            textAlign: 'center',
            marginVertical: 5,
        },
        caption: {
            color: appColors.caption,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxs,
            alignSelf: 'center',
            paddingLeft: 10,
        },
        glow: {
            position: 'absolute',
            width: 400,
            aspectRatio: 1,
            top: -300,
            left: -400,
            backgroundColor: appColors.brandTint,
            borderRadius: 200,
            shadowColor: appColors.brandTint,
            shadowRadius: 120,
            shadowOffset: { width: 200, height: 200 },
        },
        loadingWrapper: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: appColors.primaryEnd,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
};
