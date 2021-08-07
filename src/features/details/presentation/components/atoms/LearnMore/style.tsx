import { appDimensionValues, appFontStyle } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export const style = ({ appColors }: { appColors: any }) => {
    return StyleSheet.create({
        textStyle: {
            color: appColors.brandTintLight,
            ...appFontStyle.sublineText,
            lineHeight: appDimensionValues.lg,
        },
    });
};
