import { StyleSheet } from 'react-native';
import { scale, selectDeviceType } from 'qp-common-ui';
import { appDimensionValues, appFonts, appFontStyle, appPaddingValues } from 'core/styles/AppStyles';
import { appFlexStyles } from './FlexStyles';

export const alertStyles = (appColors: any, isPortrait: boolean) => {
    return StyleSheet.create({
        textContainer: {
            ...appFlexStyles.rowHorizontalAlignStart,
            alignItems: 'center',
            width: '100%',
        },
        iconContainer: {
            width: selectDeviceType({ Handset: scale(32) }, scale(32)),
            height: selectDeviceType({ Handset: scale(32) }, scale(32)),
            borderRadius: selectDeviceType({ Handset: scale(8) }, scale(8)),
            marginEnd: selectDeviceType({ Handset: scale(15) }, scale(15)),
            alignItems: 'center',
            justifyContent: 'center',
        },
        textStyle: {
            color: appColors.secondary,
            fontSize: appFonts.xs,
            fontFamily: appFonts.primary,
            fontWeight: '400',
            flexWrap: 'wrap',
            width: '80%',
        },
        buttons: {
            marginTop: selectDeviceType({ Handset: scale(24) }, scale(24)),
        },
        content: {
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: scale(14),
            marginHorizontal: selectDeviceType({ Tablet: isPortrait ? '20%' : '30%' }, isPortrait ? '0%' : '25%'),
            padding: appPaddingValues.lg,
        },
        title: {
            color: appColors.secondary,
            ...appFontStyle.header3,
            width: '100%',
            paddingBottom: appPaddingValues.sm,
        },
        message: {
            color: appColors.caption,
            ...appFontStyle.sublineText,
        },
        infoAlertFooter: {
            ...appFlexStyles.rowHorizontalAlignEnd,
            alignItems: 'center',
            marginTop: appDimensionValues.lg,
            width: '100%',
        },
        confirmationAlertFooter: {
            ...appFlexStyles.rowHorizontalAlignSpaceBetween,
            alignItems: 'center',
            marginTop: appDimensionValues.lg,
            width: '100%',
        },
        buttonStyle: {
            width: selectDeviceType({ Tablet: isPortrait ? '30%' : '18%' }, isPortrait ? '48%' : '30%'),
        },
    });
};
