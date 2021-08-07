import { StyleSheet } from 'react-native';
import { selectDeviceType } from 'qp-common-ui';
import { appFonts } from '../../AppStyles';

export const headerStyle = () => {
    return StyleSheet.create({
        headerTitle: { fontSize: appFonts.md, fontFamily: appFonts.primary, fontWeight: '600' },
    });
};

export const formStyle = ({ appColors, appPadding, isPortrait }: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: selectDeviceType({ Tablet: isPortrait ? '25%' : '32%' }, appPadding.sm()),
        },
        formContainer: {
            flex: 1,
            justifyContent: 'flex-start',
            marginTop: appPadding.sm(),
            width: '100%',
        },
        formLabel: {
            marginBottom: 30,
        },
        formGroup: {
            marginTop: 30,
        },
        userProfileGroup: {
            marginTop: 10,
        },
        passEyeView: {
            paddingRight: 6,
        },
        passEyeButton: {
            padding: 10,
        },
        inputLabel: {
            paddingBottom: 10,
            textAlign: 'left',
        },
        inputLabelText: {
            color: appColors.tertiary,
            fontSize: appFonts.xs,
            fontFamily: appFonts.primary,
        },
        inputContainer: {
            backgroundColor: appColors.primaryVariant2,
            borderRadius: 14,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
        },
        userProfileInputContainer: {
            backgroundColor: appColors.primaryVariant1,
            borderRadius: 14,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
        },
        otpInputContainer: {
            width: '100%',
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
        },
        inputs: {
            flex: 1,
            padding: 5,
            marginHorizontal: 16,
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
            height: 50,
        },
        buttonContainer: {
            marginVertical: 30,
            width: '100%',
        },
        btnActive: {
            opacity: 1,
        },
        btnDisable: {
            opacity: 0.5,
        },
    });
};
