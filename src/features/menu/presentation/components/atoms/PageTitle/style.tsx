import { scale } from 'qp-common-ui';
import { appPaddingValues } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export const PageTitleStyle = (appColors: any) => {
    return StyleSheet.create({
        textContainer: {
            marginStart: appPaddingValues.lg,
            marginEnd: appPaddingValues.lg,
            marginTop: scale(47),
            flex: 1,
        },
        dotText: {
            color: appColors.brandTintLight,
        },
        textStyle: {
            color: appColors.pageTitleColor,
        },
    });
};
