import { appDimensionValues } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export const manageProfileOptionsStyle = (appColor: any) => {
    return StyleSheet.create({
        dividerStyle: {
            borderBottomColor: appColor.white,
            borderBottomWidth: 1,
            opacity: 0.07,
            marginBottom: appDimensionValues.xxs,
            marginTop: appDimensionValues.xxs,
        },
    });
};
