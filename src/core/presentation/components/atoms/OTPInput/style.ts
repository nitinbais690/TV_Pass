import { scale, selectDeviceType } from 'qp-common-ui';
import { appFlexStyles } from 'core/styles/FlexStyles';
import { StyleSheet } from 'react-native';
import { appDimensionValues, appFonts, appPaddingValues } from 'core/styles/AppStyles';

export const otpInputStyles = (appColors: any) => {
    return StyleSheet.create({
        otpContainer: {
            width: '100%',
            ...appFlexStyles.rowVerticalAlignCenter,
        },
        otpBox: {
            width: scale(46),
            height: scale(46),
            marginRight: appDimensionValues.xxxs,
            borderRadius: appDimensionValues.xxxs,
        },
        otpInputBox: {
            width: '100%',
            height: '100%',
            textAlign: 'center',
            borderRadius: appDimensionValues.xxxs,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: scale(1),
            color: appColors.white,
            fontFamily: appFonts.medium,
            paddingHorizontal: 0,
            paddingVertical: appPaddingValues.xxxxs,
            fontSize: selectDeviceType({ Handset: scale(33, 0) }, scale(35, 0)),
        },
    });
};
