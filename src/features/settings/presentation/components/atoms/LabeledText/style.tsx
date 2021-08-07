import { StyleSheet } from 'react-native';
import { scale } from 'qp-common-ui';
import { appFonts, appFontStyle } from 'core/styles/AppStyles';

export function labeledTextStyle(appColors: any) {
    return StyleSheet.create({
        label: {
            color: appColors.secondary,
            ...appFontStyle.body3,
            fontFamily: appFonts.semibold,
            opacity: 0.3,
        },
        title: {
            paddingTop: scale(4, 0),
            color: appColors.secondary,
            ...appFontStyle.body3,
            fontFamily: appFonts.semibold,
        },
    });
}
