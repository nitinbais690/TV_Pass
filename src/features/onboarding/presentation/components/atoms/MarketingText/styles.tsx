import { scale, selectDeviceType } from 'qp-common-ui';
import { appPaddingValues } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export const marketingTextContentStyle = (appColors: any) => {
    return StyleSheet.create({
        textContainer: {
            marginStart: appPaddingValues.lg,
            marginEnd: appPaddingValues.lg,
            marginTop: appPaddingValues.xxxlg,
        },
        descTextStyle: {
            color: appColors.white,
            opacity: 0.3,
            lineHeight: scale(24),
            letterSpacing: 0,
            textAlign: 'left',
            marginTop: appPaddingValues.sm,
            marginEnd: scale(96),
        },
        commonTitleStyle: {
            width: selectDeviceType({ Handset: scale(250, 0) }, scale(300, 0)),
        },
    });
};
