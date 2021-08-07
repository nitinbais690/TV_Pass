import { StyleSheet } from 'react-native';
import { scale } from 'qp-common-ui';
import { appFontStyle, appPaddingValues } from 'core/styles/AppStyles';

export const textInputBoxStyle = (appColors: any) => {
    return StyleSheet.create({
        container: {
            borderRadius: scale(8),
            width: '100%',
        },
        textInputStyle: {
            color: appColors.white,
            ...appFontStyle.buttonText,
            paddingStart: appPaddingValues.md,
            paddingEnd: appPaddingValues.md,
            height: scale(46),
        },
    });
};
