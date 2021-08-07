import { appDimensionValues } from 'core/styles/AppStyles';
import { scale } from 'qp-common-ui';
import { StyleSheet } from 'react-native';

export const emailAuthViewStyle = (appColor: any) => {
    return StyleSheet.create({
        emailTitleeStyle: {
            color: appColor.secondary,
            marginTop: appDimensionValues.xxxlg,
        },
        passwordTitleStyle: {
            color: appColor.secondary,
            marginTop: appDimensionValues.xxlg,
        },
        forgotPasswordLb: {
            color: appColor.secondary,
            marginEnd: appDimensionValues.xxs,
            lineHeight: scale(28),
        },
        forgotPasswordContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: appDimensionValues.xxs,
        },
        inputBoxStyle: {
            marginTop: appDimensionValues.xxxs,
        },
        buttonstyle: {
            marginTop: appDimensionValues.xlg,
            alignSelf: 'flex-end',
            width: scale(146),
        },
        inputErrorStyle: {
            marginTop: appDimensionValues.sm,
        },
    });
};
