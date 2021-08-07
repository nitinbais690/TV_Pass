import { Platform, StyleSheet } from 'react-native';
import { appFonts, tvPixelSizeForLayout } from '../../AppStyles';

export const ErrorMessageBoxStyle = ({ appColors, appPadding }: any) => {
    return StyleSheet.create({
        container: {
            width: '100%',
            marginVertical: Platform.isTV ? 0 : appPadding.sm(),
        },
        text: {
            fontFamily: appFonts.primary,
            fontSize: Platform.isTV ? tvPixelSizeForLayout(24) : appFonts.xxs,
            color: appColors.error,
            fontWeight: '500',
            lineHeight: Platform.isTV ? tvPixelSizeForLayout(24) : 0,
        },
    });
};
