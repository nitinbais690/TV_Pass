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
            margin: selectDeviceType({ Tablet: '15%' }, '0%'),
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
            padding: selectDeviceType({ Handset: 20 }, 40),
            borderColor: appColors.border,
            borderBottomWidth: StyleSheet.hairlineWidth,
            backgroundColor: appColors.primaryVariant6,
            marginBottom: 16,
            marginHorizontal: selectDeviceType({ Handset: 20 }, 60),
            borderRadius: appDimensions.cardRadius,
            overflow: 'hidden',
        },
        logoContainer: {
            flex: selectDeviceType({ Handset: 0.2 }, 0.5),
            justifyContent: 'center',
            marginLeft: selectDeviceType({ Handset: appPadding.md(true) }, 0),
        },
        logo: {
            borderRadius: 4,
            aspectRatio: selectDeviceType({ Handset: 1 }, 16 / 9),
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
            alignItems: 'center',
            justifyContent: 'center',
            flex: 0.8,
            marginLeft: appPadding.md(true),
        },
        title: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxxlg,
            fontWeight: '600',
            textAlign: 'center',
        },
        description: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.md,
            fontWeight: '500',
            textAlign: 'center',
            marginVertical: 5,
        },
        caption: {
            color: appColors.caption,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxs,
            alignSelf: 'center',
            paddingLeft: appPadding.xxs(true),
        },
        glow: {
            position: 'absolute',
            width: 400,
            aspectRatio: 1,
            top: -350,
            left: -400,
            backgroundColor: appColors.brandTint,
            borderRadius: 400,
            shadowColor: appColors.brandTint,
            shadowRadius: 100,
            shadowOffset: { width: 200, height: 200 },
        },
    });
};
