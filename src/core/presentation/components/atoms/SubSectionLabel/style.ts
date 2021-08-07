import { StyleSheet } from 'react-native';
import { appFontStyle } from 'core/styles/AppStyles';

export const subSectionLabelStyle = (appColors: any) => {
    return StyleSheet.create({
        labelText: {
            color: appColors.white,
            ...appFontStyle.subTitle,
        },
    });
};
