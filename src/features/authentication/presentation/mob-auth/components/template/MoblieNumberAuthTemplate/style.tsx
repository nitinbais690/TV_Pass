import { StyleSheet } from 'react-native';
import { appFonts, appPaddingValues } from 'core/styles/AppStyles';

export const mobileAuthTemplateStyle = (appColors: any) => {
    return StyleSheet.create({
        mobileDropDownSection: {
            paddingTop: appPaddingValues.xxxlg,
            paddingBottom: appPaddingValues.lg,
        },
        mobileNumberLabel: {
            color: appColors.white,
            fontSize: appFonts.md,
            fontFamily: appFonts.medium,
            paddingBottom: appPaddingValues.md,
        },
        commonTitleStyle: {
            width: '80%',
        },
    });
};
