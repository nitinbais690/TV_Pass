import { StyleSheet } from 'react-native';
import { appFonts, appFontStyle, appPaddingValues } from 'core/styles/AppStyles';
import { appFlexStyles } from 'core/styles/FlexStyles';
import { scale, selectDeviceType } from 'qp-common-ui';

export function storageUsageStyles(appColors: any) {
    return StyleSheet.create({
        container: {
            ...appFlexStyles.flexColumn,
            paddingHorizontal: selectDeviceType({ Handset: scale(24, 0) }, scale(29, 0)),
        },
        labelContainer: {
            ...appFlexStyles.rowHorizontalAlignSpaceBetween,
        },
        label: {
            ...appFontStyle.sublineText,
            fontFamily: appFonts.semibold,
            color: appColors.secondary,
            opacity: 0.3,
        },
        bar: {
            flex: 1, // workaround for hiding the overflow caused by width in %
            height: selectDeviceType({ Handset: scale(1, 0) }, scale(2, 0)),
            backgroundColor: appColors.secondary,
            opacity: 0.1,
        },
        barUsed: {
            height: selectDeviceType({ Handset: scale(2, 0) }, scale(4, 0)),
            borderRadius: selectDeviceType({ Handset: scale(1, 0) }, scale(2, 0)),
            backgroundColor: appColors.storageBarColor,
        },
        barWrapper: {
            ...appFlexStyles.rowVerticalAlignEnd,
            marginTop: appPaddingValues.xxxs,
            marginBottom: appPaddingValues.xxxs,
        },
    });
}
