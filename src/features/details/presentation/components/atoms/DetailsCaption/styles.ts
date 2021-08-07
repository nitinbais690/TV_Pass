import { appFonts } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export const styles = (appColors: any) => {
    return StyleSheet.create({
        titleStyle: {
            color: appColors.secondary,
            opacity: 0.3,
            fontFamily: appFonts.semibold,
        },
    });
};
