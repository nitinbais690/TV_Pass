import { appFonts } from 'core/styles/AppStyles';
import { scale, selectDeviceType } from 'qp-common-ui';
import { StyleSheet } from 'react-native';

export const checkBoxStyle = (appColors: any) => {
    return StyleSheet.create({
        container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
            margin: 0,
            padding: 0,
        },
        text: {
            fontSize: appFonts.xxs,
            fontFamily: appFonts.primary,
            color: appColors.secondary,
            marginStart: selectDeviceType({ Handset: scale(12) }, scale(16)),
        },
    });
};
