import { appDimensionValues } from 'core/styles/AppStyles';
import { scale } from 'qp-common-ui';
import { StyleSheet } from 'react-native';

export const validateUserStyle = (appColor: any) => {
    return StyleSheet.create({
        container: {
            marginStart: appDimensionValues.lg,
            marginEnd: appDimensionValues.lg,
        },
        backArrowStyle: {
            marginTop: scale(50),
        },

        subTitleStyle: {
            color: appColor.secondary,
            marginTop: appDimensionValues.xxxlg,
        },
        forgotPasswordLb: {
            marginTop: appDimensionValues.xxs,
        },
        emailBoxStyle: {
            marginTop: appDimensionValues.xxxs,
        },
        buttonstyle: {
            marginTop: appDimensionValues.xlg,
            alignSelf: 'flex-end',
            width: scale(146),
            marginHorizontal: scale(5),
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
        },
        loaderStyle: {
            position: 'absolute',
            alignSelf: 'center',
            justifyContent: 'center',
            bottom: 0,
            top: 0,
        },
        commonTitleStyle: {
            width: '80%',
        },
    });
};
