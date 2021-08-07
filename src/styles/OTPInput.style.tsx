import { StyleSheet } from 'react-native';
import { appFonts } from '../../AppStyles';

export const OTPInputStyle = ({ appColors, appPadding, errorMessage }: any) => {
    return StyleSheet.create({
        otpContainer: {
            borderColor: errorMessage ? appColors.error : appColors.brandTint,
            borderWidth: 2,
        },
        otpInput: {
            paddingLeft: 45,
            paddingRight: 45,
        },
        errorMessageContainer: {
            paddingTop: appPadding.xs(),
            paddingLeft: appPadding.sm(),
            width: '100%',
        },
        errorMessageText: {
            color: appColors.error,
        },
        underlineStyleBase: {
            width: 30,
            height: 45,
            borderWidth: 0,
            fontSize: appFonts.xxlg,
            fontWeight: 'bold',
        },
        underlineStyleHighLighted: {
            borderColor: appColors.secondary,
        },
    });
};
