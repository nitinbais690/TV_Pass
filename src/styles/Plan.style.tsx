import { StyleSheet } from 'react-native';
import { selectDeviceType } from 'qp-common-ui';
import { appFonts } from '../../AppStyles';

export const defaultPlanStyle = ({ appColors, appPadding, isPortrait }: any) =>
    StyleSheet.create({
        titleLabel: {
            fontSize: appFonts.xxlg,
            fontFamily: appFonts.primary,
            color: appColors.secondary,
            fontWeight: '600',
            textAlign: 'left',
        },
        titleContainer: {},
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: selectDeviceType({ Tablet: isPortrait ? '25%' : '32%' }, appPadding.sm()),
        },
        formContainer: {
            justifyContent: 'flex-start',
            paddingBottom: '10%',
        },
        billingInfo: {
            textAlign: 'left',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            marginVertical: 25,
        },
        billingInfoText: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
            fontWeight: '500',
        },
        planCardContainer: {
            borderRadius: selectDeviceType({ Tablet: 34 }, 14),
            backgroundColor: appColors.primaryVariant1,
        },
        planCardInfoText: {
            color: appColors.caption,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxs,
        },
        planCardInfoText1: {
            paddingBottom: 20,
        },
        planCardInfoTextLink: {
            color: appColors.brandTint,
        },
        topCardSection: {
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingVertical: selectDeviceType({ Tablet: 20 }, 20),
            paddingHorizontal: 30,
            backgroundColor: appColors.brandTint,
            borderTopLeftRadius: selectDeviceType({ Tablet: 34 }, 14),
            borderTopRightRadius: selectDeviceType({ Tablet: 34 }, 14),
        },
        bottomCardSection: {
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingVertical: selectDeviceType({ Tablet: 20 }, 20),
            paddingHorizontal: 30,
        },
        planType: {
            backgroundColor: appColors.secondary,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            width: 63,
            height: 22,
            marginBottom: 20,
        },
        planTypeText: {
            color: appColors.brandTint,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxs,
            fontWeight: '500',
        },
        planPerMonth: {
            marginBottom: 20,
        },
        planPerMonthText: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxlg,
            fontWeight: '600',
        },
        planSubscription: {},
        planSubscriptionText: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
        },
        buttonSection: {
            marginVertical: 30,
        },
    });
