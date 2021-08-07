import { scale, selectDeviceType } from 'qp-common-ui';
import { appFonts, appFontStyle, appPaddingValues } from 'core/styles/AppStyles';
import { appFlexStyles } from 'core/styles/FlexStyles';
import { StyleSheet } from 'react-native';

export function SettingsMenuRowStyles(appColors: any) {
    return StyleSheet.create({
        container: {
            ...appFlexStyles.flexColumn,
        },
        divider: {
            width: '100%',
            borderBottomWidth: scale(1, 0),
            opacity: 0.07,
            borderColor: appColors.secondary,
        },
        titleRowContainer: {
            ...appFlexStyles.rowVerticalAlignCenter,
            paddingTop: selectDeviceType({ Handset: scale(19, 0) }, scale(32, 0)),
        },
        titleText: {
            color: appColors.secondary,
            paddingLeft: appPaddingValues.sm,
            ...appFontStyle.body2,
            fontFamily: appFonts.semibold,
        },
        subTitleText: {
            color: appColors.secondary,
            ...appFontStyle.body3,
            fontFamily: appFonts.semibold,
            paddingTop: scale(9, 0),
            paddingBottom: selectDeviceType({ Handset: scale(16, 0) }, scale(26, 0)),
            opacity: 0.3,
        },
        arrowIcon: {
            marginStart: 'auto',
            width: selectDeviceType({ Handset: scale(24, 0) }, scale(34, 0)),
            height: selectDeviceType({ Handset: scale(24, 0) }, scale(34, 0)),
        },
    });
}
