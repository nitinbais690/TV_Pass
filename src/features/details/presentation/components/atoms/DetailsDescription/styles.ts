import { StyleSheet } from 'react-native';
import { appPadding, appFonts, appPaddingValues } from 'core/styles/AppStyles';

export const styles = (appColors: any) => {
    return StyleSheet.create({
        textStyle: {
            color: appColors.secondary,
            fontSize: appFonts.xs,
            fontFamily: appFonts.primary,
            fontWeight: '400',
            marginTop: appPaddingValues.md,
        },
        readMoreStyle: {
            fontSize: appFonts.xs,
            fontFamily: appFonts.semibold,
            color: appColors.caption,
            marginTop: appPadding.xxs(),
        },
        tvReadMoreSize: { width: 100, borderRadius: 5 },
    });
};
