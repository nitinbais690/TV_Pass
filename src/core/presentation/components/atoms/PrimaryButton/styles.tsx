import { StyleSheet, Platform } from 'react-native';
import { appDimensionValues, appFontStyle } from 'core/styles/AppStyles';
import { scale, selectDeviceType } from 'qp-common-ui';

export const arrowRightIconWidth = selectDeviceType({ Tv: scale(16, 0) }, scale(16, 0));
export const arrowRightIconHeight = selectDeviceType({ Tv: scale(10, 0) }, scale(10, 0));

export const styles = (appColors: any) => {
    return StyleSheet.create({
        buttonStyle: {
            elevation: appDimensionValues.xxxxs,
            borderRadius: Platform.isTV ? appDimensionValues.xxxxxs : appDimensionValues.commonButtonHeight / 2,
            justifyContent: Platform.isTV ? 'flex-start' : 'center',
            paddingHorizontal: selectDeviceType({ Tv: scale(10, 0) }, scale(8, 0)),
        },
        containerStyle: {
            flex: 1,
            height: appDimensionValues.commonButtonHeight,
        },
        titleStyle: {
            color: appColors.secondary,
            ...appFontStyle.buttonText,
        },
        unfocused: {
            backgroundColor: appColors.primaryVariant3,
            elevation: 0,
        },
        buttonIconStyle: {
            marginEnd: scale(10),
        },
        iconStyle: {
            position: 'absolute',
            right: 14,
        },
        focusStyle: {
            borderColor: '#ffffff',
            borderWidth: 2,
        },
    });
};
