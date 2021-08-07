import { StyleSheet } from 'react-native';
import { appDimensionValues, appFonts, appFontStyle, isTablet } from 'core/styles/AppStyles';
import { scale, selectDeviceType } from 'qp-common-ui';

export const accountEditRowStyle = (appColor: any) => {
    return StyleSheet.create({
        profileNameStyle: {
            color: appColor.secondary,
            ...appFontStyle.subTitle,
            fontFamily: appFonts.semibold,
            marginStart: appDimensionValues.sm,
            ...(isTablet ? { marginEnd: scale(38, 0) } : { flex: 1 }),
        },
        content: {
            ...(isTablet ? {} : { flex: 1 }),
        },
        profileLogoSize: {
            height: selectDeviceType({ Handset: scale(50, 0) }, scale(69, 0)),
            width: selectDeviceType({ Handset: scale(50, 0) }, scale(69, 0)),
        },
        editIconSize: {
            height: selectDeviceType({ Handset: scale(24, 0) }, scale(28, 0)),
            width: selectDeviceType({ Handset: scale(24, 0) }, scale(28, 0)),
        },
    });
};
