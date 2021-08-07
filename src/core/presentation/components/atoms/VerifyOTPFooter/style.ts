import { StyleSheet } from 'react-native';

import { appFontStyle } from 'core/styles/AppStyles';
import { appFlexStyles } from 'core/styles/FlexStyles';

export const verifyOTPFooterStyle = (appColors: any) => {
    return StyleSheet.create({
        container: {
            ...appFlexStyles.flexColumn,
            width: '100%',
        },
        footerLinkSection: {
            ...appFlexStyles.rowVerticalAlignEnd,
        },
        footerNormalText: {
            color: appColors.white,
            ...appFontStyle.sublineText,
        },
        footerLinkText: {
            color: appColors.brandTint,
            ...appFontStyle.sublineText,
        },
    });
};
