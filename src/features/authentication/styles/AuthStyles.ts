import { StyleSheet } from 'react-native';

import { appFlexStyles } from 'core/styles/FlexStyles';
import { scale, selectDeviceType } from 'qp-common-ui';
import { appDimensionValues, appFontStyle, appPaddingValues } from 'core/styles/AppStyles';

export const authStyles = (appColors: any) => {
    return StyleSheet.create({
        socialLoginButtonContainer: {
            width: '100%',
        },
        socialLoginButton: {
            width: '100%',
            backgroundColor: appColors.transparent,
            borderRadius: selectDeviceType({ Handset: scale(8, 0) }, scale(8, 0)),
            paddingHorizontal: appPaddingValues.sm,
            paddingVertical: appPaddingValues.xxs,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: scale(1),
            ...appFlexStyles.rowAlignCenter,
        },
        socailLoginText: {
            ...appFontStyle.sublineText,
            color: appColors.white,
            paddingLeft: appPaddingValues.xxxxxs,
        },
        mobilePreloginScreenContent: {
            ...appFlexStyles.flexColumn,
        },
        tabPreloginScreenContent: {
            ...appFlexStyles.flexColumn,
            paddingBottom: scale(25),
        },
        mobilePreloginScreenButton: {
            width: scale(160),
            elevation: appDimensionValues.xxxxs,
            borderRadius: appDimensionValues.commonButtonHeight / 2,
        },
        tabPreloginScreenButton: {
            width: '100%',
            elevation: appDimensionValues.xxxxxs,
            borderRadius: appDimensionValues.commonButtonHeight / 2,
            height: scale(40),
        },
        loaderStyle: {
            position: 'absolute',
            alignSelf: 'center',
            justifyContent: 'center',
            bottom: 0,
            top: 0,
        },
        inputErrorStyle: {
            marginTop: appDimensionValues.sm,
        },
    });
};
