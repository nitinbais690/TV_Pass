import { StyleSheet } from 'react-native';
import { appFontStyle } from 'core/styles/AppStyles';

export const inputErrorViewStyles = (appColors: any) => {
    return StyleSheet.create({
        inputErrorStyle: {
            color: appColors.errorTextColor,
            ...appFontStyle.errorText,
        },
    });
};
