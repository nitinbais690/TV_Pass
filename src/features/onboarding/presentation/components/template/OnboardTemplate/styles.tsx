import { appDimensionValues, appPaddingValues, percentageOfHeight } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export const marketingTemplateStyle = (win: any, appColors: any) => {
    return StyleSheet.create({
        overlay: {
            flex: 1,
            position: 'absolute',
            width: win.width,
            height: percentageOfHeight(25, true),
        },
        indicatiorContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: appPaddingValues.xmd,
            marginStart: appPaddingValues.lg,
            marginRight: appPaddingValues.lg,
            backgroundColor: appColors.transparent,
        },
        paginationDots: {
            height: appDimensionValues.sm,
            flexDirection: 'row',
        },
        dot: {
            width: appDimensionValues.xxxs,
            height: appDimensionValues.xxxs,
            borderRadius: appDimensionValues.xxxxs,
            marginHorizontal: appDimensionValues.xxxxs,
        },
        activeIndicator: {
            backgroundColor: appColors.white,
        },
        inActiveIndicator: {
            backgroundColor: appColors.white,
            opacity: 0.3,
        },
    });
};
