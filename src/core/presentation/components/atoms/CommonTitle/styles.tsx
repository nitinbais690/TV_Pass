import { StyleSheet } from 'react-native';

export const headerTextStyle = (appColors: any) => {
    return StyleSheet.create({
        dotText: {
            color: appColors.brandTintLight,
        },

        textStyle: {
            color: appColors.white,
        },
    });
};
