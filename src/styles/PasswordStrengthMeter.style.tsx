import { Platform, StyleSheet } from 'react-native';
import { appFonts, tvPixelSizeForLayout } from '../../AppStyles';

export const defaultPasswordStrengthMetertyle = ({ appColors, appPadding }: any) => {
    return StyleSheet.create({
        barContainer: {
            marginTop: Platform.isTV ? tvPixelSizeForLayout(20) : appPadding.xxs(),
            marginBottom: Platform.isTV ? tvPixelSizeForLayout(0) : appPadding.xxs(),
            width: '100%',
            flexDirection: 'row',
            textAlign: 'left',
            alignItems: 'center',
        },
        bar: {
            marginHorizontal: Platform.isTV ? tvPixelSizeForLayout(1) : 1,
            height: Platform.isTV ? tvPixelSizeForLayout(8) : 6,
            flex: 1,
            backgroundColor: appColors.primaryVariant2,
        },
        barWeak: {
            backgroundColor: appColors.error,
        },
        barAverage: {
            backgroundColor: appColors.warning,
        },
        barSecure: {
            backgroundColor: appColors.success,
        },
        barTextContainer: {
            marginTop: Platform.isTV ? tvPixelSizeForLayout(12) : appPadding.xs(),
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
        },
        barTextTV: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: tvPixelSizeForLayout(32),
        },
        barText: {
            color: appColors.secondary,
            height: 20,
            fontFamily: appFonts.primary,
        },
    });
};
