import { StyleSheet } from 'react-native';
import { appFonts, appFontStyle } from 'core/styles/AppStyles';
import { appFlexStyles } from 'core/styles/FlexStyles';

export function primarySwitchRowStyle(appColors: any) {
    return StyleSheet.create({
        rowContainer: {
            ...appFlexStyles.rowVerticalAlignCenter,
        },
        text: {
            ...appFontStyle.body3,
            fontFamily: appFonts.semibold,
            color: appColors.secondary,
        },
        switch: {
            marginStart: 'auto',
        },
        secondaryText: {
            ...appFontStyle.smallText1,
            color: '#515151',
        },
    });
}
