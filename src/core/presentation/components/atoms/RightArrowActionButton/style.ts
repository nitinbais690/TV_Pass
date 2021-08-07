import { StyleSheet } from 'react-native';
import { appFlexStyles } from 'core/styles/FlexStyles';
import { appFontStyle } from 'core/styles/AppStyles';

export const rightArrowActionButtonStyles = (appColors: any) => {
    return StyleSheet.create({
        container: {
            width: '100%',
            ...appFlexStyles.rowVerticalAlignCenter,
        },
        textStyle: {
            color: appColors.white,
            ...appFontStyle.sublineText,
        },
    });
};
