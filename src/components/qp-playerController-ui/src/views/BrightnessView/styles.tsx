import { StyleSheet } from 'react-native';
import { appDimensionValues, appFontStyle } from 'core/styles/AppStyles';
import { scale, selectDeviceType } from 'qp-common-ui';

export const styles = (appColors: any) => {
    return StyleSheet.create({
        containerStyle: {
            borderRadius: appDimensionValues.xxxxlg / 2,
            borderWidth: scale(1),
            borderColor: 'rgba(255, 255, 255, 0.2)',
            width: appDimensionValues.xxxxlg,
            alignItems: 'center',
            justifyContent: 'center',
        },
        brightnessIconStyle: {
            marginBottom: appDimensionValues.xxxs,
        },
        minusTextStyle: {
            ...appFontStyle.body2,
            color: appColors.secondary,
        },
        plusTextStyle: {
            ...appFontStyle.body2,
            color: appColors.secondary,
            marginTop: appDimensionValues.xxxs,
        },
        sliderStyle: {
            width: selectDeviceType({ Handset: scale(100, 0) }, scale(120, 0)),
            transform: [{ rotate: '-90deg' }],
            paddingVertical: appDimensionValues.xlg,
        },
    });
};
