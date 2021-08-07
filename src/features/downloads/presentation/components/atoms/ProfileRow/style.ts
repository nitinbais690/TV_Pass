import { StyleSheet } from 'react-native';
import { appFonts, appFontStyle } from 'core/styles/AppStyles';
import { scale, selectDeviceType } from 'qp-common-ui';
import { appFlexStyles } from 'core/styles/FlexStyles';

export const profileRowStyle = (appColor: any) => {
    return StyleSheet.create({
        container: {
            ...appFlexStyles.rowHorizontalAlignSpaceBetween,
            alignItems: 'center',
            paddingHorizontal: selectDeviceType({ Handset: scale(24, 0) }, scale(29, 0)),
        },
        deleteLabel: {
            ...appFontStyle.sublineText,
            fontFamily: appFonts.semibold,
            color: appColor.secondary,
        },
    });
};
