import { StyleSheet } from 'react-native';
import { appDimensionValues, appFonts, appFontStyle, appPaddingValues } from 'core/styles/AppStyles';

export function MaturityRatingTagViewStyles(appColors: any) {
    return StyleSheet.create({
        textStyle: {
            ...appFontStyle.smallText1,
            textAlign: 'center',
            color: appColors.secondary,
            paddingHorizontal: appPaddingValues.xxxxs,
            paddingVertical: appDimensionValues.xxxxxs,
            lineHeight: appDimensionValues.xs,
            fontFamily: appFonts.semibold,
        },

        container: {
            shadowOffset: { width: 0, height: appDimensionValues.xxxxs },
            shadowColor: 'rgba(0, 0, 0, 0.25)',
            elevation: appDimensionValues.xxxxs,
            borderRadius: appDimensionValues.xxxs,
            shadowRadius: appDimensionValues.xxxxs,
            paddingHorizontal: appDimensionValues.xxxxs,
            paddingVertical: appDimensionValues.xxxxxs,
            justifyContent: 'center',
            alignContent: 'center',
        },
    });
}
