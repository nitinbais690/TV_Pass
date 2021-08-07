import { Platform, StyleSheet } from 'react-native';
import { appFonts } from '../../AppStyles';

export const defaultSigninStyle = ({ appColors }: any) => {
    return StyleSheet.create({
        titleLabel: {
            fontSize: appFonts.xxlg,
            fontFamily: appFonts.primary,
            color: appColors.secondary,
            fontWeight: '600',
            textAlign: 'left',
        },
        titleContainer: {
            marginBottom: 30,
        },
        formContainer: {
            borderRadius: Platform.isTV ? 5 : 0,
            backgroundColor: Platform.isTV ? 'rgba(0, 0, 0, .6)' : 'transparent',
            justifyContent: Platform.isTV ? 'center' : 'flex-start',
            alignItems: Platform.isTV ? 'center' : 'flex-start',
        },
        subscribeLabel: {
            marginTop: 30,
            paddingTop: 10,
            paddingBottom: 10,
            textAlign: 'left',
            flexDirection: 'row',
            alignItems: 'center',
        },
        subscribeLabelText: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
            fontWeight: '500',
        },
        subscribeSignupLabelText: {
            color: appColors.brandTint,
            fontFamily: appFonts.semibold,
            fontSize: appFonts.xs,
        },
        forgotPasswordContainer: {
            marginVertical: 30,
            flexDirection: 'row',
        },
        forgotPasswordText: {
            color: appColors.brandTint,
            fontFamily: appFonts.semibold,
            fontSize: appFonts.xs,
        },
        errorMessageContainer: {
            marginBottom: 30,
            width: '100%',
        },
    });
};
