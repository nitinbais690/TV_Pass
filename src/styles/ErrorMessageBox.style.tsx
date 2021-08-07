import { StyleSheet } from 'react-native';
import { appFonts } from '../../AppStyles';

export const ErrorMessageBoxStyle = ({ appColors, appPadding }: any) => {
    return StyleSheet.create({
        container: {
            width: '100%',
            marginVertical: appPadding.sm(),
        },
        text: {
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxs,
            color: appColors.error,
        },
    });
};
