import { appDimensionValues, appFontStyle, appPaddingValues } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export const selectedGradientStart = '#4E433F50';
export const selectedGradientEnd = '#FF6E4550';
export const unselectedGradientStart = '#3B4046';
export const unselectedGradientEnd = '#2D3037';

export function ProfileItemViewStyle(appColors: any) {
    return StyleSheet.create({
        mainContainer: { justifyContent: 'center', alignItems: 'center' },
        container: {
            backgroundColor: appColors.primaryVariant7,
            width: appDimensionValues.xxxxxlg,
            height: appDimensionValues.xxxxxlg,
            borderWidth: 1,
            borderColor: appColors.secondaryButtonBorder,
            borderRadius: appDimensionValues.xlg,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: appColors.blackShadow,
            shadowOpacity: 1,
            shadowOffset: { width: 0, height: appDimensionValues.xxxxs },
            shadowRadius: appDimensionValues.lg,
        },
        gradientContainer: {
            width: appDimensionValues.xxxxxlg,
            height: appDimensionValues.xxxxxlg,
            borderWidth: 1,
            borderColor: appColors.secondaryButtonBorder,
            borderRadius: appDimensionValues.xlg,
            justifyContent: 'center',
            alignItems: 'center',
        },
        iconStyle: {
            paddingTop: appPaddingValues.xs,
        },
        textStyle: {
            ...appFontStyle.body1,
            color: appColors.secondary,
            paddingTop: appPaddingValues.xxxs,
        },
    });
}
