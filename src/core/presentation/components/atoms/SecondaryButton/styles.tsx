import { StyleSheet } from 'react-native';
import { appDimensionValues, appFontStyle } from 'core/styles/AppStyles';
import { scale } from 'qp-common-ui';

export const styles = (appColors: any) => {
    return StyleSheet.create({
        buttonStyle: {
            borderRadius: appDimensionValues.commonButtonHeight / 2,
            elevation: appDimensionValues.xxxxs,
            borderWidth: scale(1),
            borderStyle: 'solid',
            borderColor: appColors.secondaryButtonBorder,
            backgroundColor: appColors.secondaryButton,
            height: appDimensionValues.commonButtonHeight,
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
    });
};
