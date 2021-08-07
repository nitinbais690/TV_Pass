import { appDimensionValues, appFontStyle, appPaddingValues } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export const style = ({ appColors }: { appColors: any }) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'row',
            paddingLeft: appPaddingValues.lg,
            justifyContent: 'space-between',
        },
        titleTextStyle: {
            flex: 4,
            color: appColors.secondary,
            ...appFontStyle.sublineText,
            opacity: 0.3,
            lineHeight: appDimensionValues.lg,
        },
        descTextStyle: {
            color: appColors.secondary,
            ...appFontStyle.sublineText,
            lineHeight: appDimensionValues.lg,
        },
        learnMoreViewStyle: {
            flex: 6,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignContent: 'space-between',
        },
    });
};
