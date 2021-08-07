import { appDimensionValues, appFontStyle } from 'core/styles/AppStyles';
import { scale } from 'qp-common-ui';
import { StyleSheet } from 'react-native';

export const manageProfileItemStyle = (appColor: any) => {
    return StyleSheet.create({
        container: {
            flexDirection: 'row',
        },
        titleContainer: {
            marginStart: appDimensionValues.md,
        },
        titleStyle: {
            color: appColor.secondary,
            ...appFontStyle.subTitle,
        },
        descStyle: {
            color: appColor.secondary,
            ...appFontStyle.subTitle,
            opacity: 0.3,
            marginTop: scale(3),
        },
    });
};
