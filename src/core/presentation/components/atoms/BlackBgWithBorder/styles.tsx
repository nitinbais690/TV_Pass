import { StyleSheet } from 'react-native';
import { appDimensionValues, appFontStyle } from 'core/styles/AppStyles';
import { scale } from 'qp-common-ui';

export const styles = (appColors: any) => {
    return StyleSheet.create({
        containerStyle: {
            borderRadius: appDimensionValues.lg / 2,
            elevation: appDimensionValues.xxxxs,
            borderWidth: scale(1),
            borderStyle: 'solid',
            borderColor: appColors.secondaryButtonBorder,
            backgroundColor: appColors.secondaryButton,
            height: appDimensionValues.lg,
            alignItems: 'center',
            justifyContent: 'center',
        },
        titleStyle: {
            color: appColors.secondary,
            ...appFontStyle.smallText1,
        },
    });
};
