import { StyleSheet } from 'react-native';
import { appFonts } from 'core/styles/AppStyles';
import { scale } from 'qp-common-ui';

export const styles = (appColors: any) => {
    return StyleSheet.create({
        margin16: {
            marginTop: scale(16),
        },
        marginBottom16: {
            marginBottom: scale(16),
        },
        seriesTitleStyle: {
            fontSize: appFonts.xs,
            fontFamily: appFonts.primary,
            color: appColors.secondary,
            marginVertical: 5,
        },
    });
};
