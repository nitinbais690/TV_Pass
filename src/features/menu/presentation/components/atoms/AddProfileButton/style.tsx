import { appDimensionValues, appFontStyle, appPaddingValues } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export function AddProfileButtonStyle(appColors: any) {
    return StyleSheet.create({
        mainContainer: { justifyContent: 'center', alignItems: 'center' },
        container: {
            backgroundColor: appColors.primaryVariant7,
            width: appDimensionValues.xxxxxlg,
            height: appDimensionValues.xxxxxlg,
            borderWidth: 1,
            borderColor: appColors.secondaryButtonBorder,
            borderRadius: appDimensionValues.xxxs,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: appColors.blackShadow,
            shadowOpacity: 1,
            shadowOffset: { width: 0, height: appDimensionValues.xxxxs },
            shadowRadius: appDimensionValues.xxxxs,
        },
        textStyle: {
            ...appFontStyle.body1,
            color: appColors.secondary,
            paddingTop: appPaddingValues.xxxs,
        },
    });
}
