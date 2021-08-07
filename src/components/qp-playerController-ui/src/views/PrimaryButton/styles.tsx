import { StyleSheet } from 'react-native';
import { appDimensionValues, appFontStyle } from 'core/styles/AppStyles';
import { scale } from 'qp-common-ui';

export const styles = (appColors: any) => {
    return StyleSheet.create({
        buttonStyle: {
            elevation: appDimensionValues.xxxxs,
            borderRadius: appDimensionValues.commonButtonHeight / 2,
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
    });
};
