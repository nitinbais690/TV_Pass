import { appDimensionValues, appFonts, appPaddingValues } from 'core/styles/AppStyles';
import { Platform, StyleSheet } from 'react-native';

export function PremiumTagViewStyles(appColors: any) {
    return StyleSheet.create({
        parentContainer: {
            alignItems: 'flex-end',
        },
        container: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        tickIconStyle: {
            alignContent: 'center',
            paddingHorizontal: appPaddingValues.xxxxs,
            width: appDimensionValues.xxxs,
            height: appDimensionValues.xxxxs,
            marginEnd: Platform.isTV ? 2 : 0,
            marginStart: Platform.isTV ? 4 : 0,
        },
        textStyle: {
            textAlign: 'center',
            fontFamily: appFonts.primary,
            fontWeight: 'bold',
            fontSize: appFonts.xxxxs,
            color: appColors.secondary,
            marginEnd: Platform.isTV ? 5.3 : 0,
        },
        gradientStyle: {
            width: Platform.isTV ? 97 : appDimensionValues.xxxxxxlg,
            height: Platform.isTV ? 28 : appDimensionValues.sm,
            borderTopRightRadius: Platform.isTV ? 0 : appDimensionValues.xxxs,
            borderBottomLeftRadius: appDimensionValues.xxxs,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
}
