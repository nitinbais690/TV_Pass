import { appFlexStyles } from 'core/styles/FlexStyles';
import { StyleSheet } from 'react-native';
import { appDimensionValues, appFontStyle, appPaddingValues } from 'core/styles/AppStyles';
import { scale } from 'qp-common-ui';

export const otpTemplateStyles = (appColors: any) => {
    return StyleSheet.create({
        mobileButtonSection: {
            ...appFlexStyles.rowHorizontalAlignSpaceBetween,
            alignItems: 'center',
            width: '100%',
        },
        tabButtonSection: {
            ...appFlexStyles.flexColumn,
            width: '100%',
        },
        resendOTPCount: {
            ...appFontStyle.sublineText,
            paddingRight: appPaddingValues.xxxxs,
            color: appColors.white,
            opacity: 0.3,
        },
        tabPreloginScreenContent: {
            ...appFlexStyles.flexColumn,
            paddingBottom: appPaddingValues.xxs,
        },
        tabPreloginScreenButton: {
            width: '100%',
            elevation: appDimensionValues.xxxxxs,
            borderRadius: appDimensionValues.commonButtonHeight / 2,
            height: scale(40),
            marginTop: appDimensionValues.xxs,
        },
        commonTitleStyle: {
            width: scale(250, 0),
        },
    });
};
