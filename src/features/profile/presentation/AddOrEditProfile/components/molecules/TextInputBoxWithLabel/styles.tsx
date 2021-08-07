import { appDimensionValues, appFonts } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export const textInputBoxStyle = (appColors: any) => {
    return StyleSheet.create({
        label: {
            color: appColors.secondary,
            fontSize: appFonts.sm,
            fontFamily: appFonts.primary,
            fontWeight: '600',
            marginBottom: appDimensionValues.sm,
        },
        inputErrorStyle: {
            marginTop: appDimensionValues.sm,
        },
    });
};
