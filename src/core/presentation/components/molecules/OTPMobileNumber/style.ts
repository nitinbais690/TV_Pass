import { appFlexStyles } from 'core/styles/FlexStyles';
import { StyleSheet } from 'react-native';
import { appFontStyle, appPaddingValues } from 'core/styles/AppStyles';

export const otpMobileNumberStyles = (appColors: any) => {
    return StyleSheet.create({
        container: {
            width: '100%',
            ...appFlexStyles.flexColumn,
        },
        mobileNumberContainer: {
            width: '100%',
            ...appFlexStyles.rowHorizontalAlignSpaceBetween,
            alignItems: 'center',
            paddingTop: appPaddingValues.xxxs,
        },
        changeSection: {
            ...appFlexStyles.rowHorizontalAlignEnd,
            alignItems: 'center',
        },
        mobileNumberText: {
            ...appFontStyle.header3,
            color: appColors.pageTitleColor,
            opacity: 0.5,
        },
        changeText: {
            ...appFontStyle.body3,
            color: appColors.white,
            paddingLeft: appPaddingValues.xxxxs,
        },
    });
};
