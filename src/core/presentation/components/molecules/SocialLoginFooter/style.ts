import { appFontStyle, appPaddingValues } from 'core/styles/AppStyles';
import { appFlexStyles } from 'core/styles/FlexStyles';
import { StyleSheet } from 'react-native';

export const socialLoginFooter = (appColors: any) => {
    return StyleSheet.create({
        container: {
            width: '100%',
            ...appFlexStyles.flexColumn,
        },
        footerText: {
            color: appColors.white,
            ...appFontStyle.body3,
        },
        socialLoginButtons: {
            width: '100%',
            alignItems: 'center',
            paddingTop: appPaddingValues.md,
            ...appFlexStyles.rowHorizontalAlignSpaceBetween,
        },
        socialButtonStyle: {
            width: '32%',
        },
    });
};
