import { scale } from '../components/qp-common-ui';
import { StyleSheet, Platform } from 'react-native';
import { appFonts, tvPixelSizeForLayout } from '../../AppStyles';

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
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
        },
        subscribeLabel: {
            marginTop: 10,
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
            marginTop: 10,
            paddingTop: 10,
            marginBottom: 30,
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

export const defaultSigninTVStyle = ({ appColors, appPadding }: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'row',
        },
        columnLeft: {
            flex: 1.5,
            alignItems: 'flex-start',
            paddingLeft: Platform.isTV ? tvPixelSizeForLayout(160) : appPadding.sm(),
        },
        formGroupTv: {
            marginTop: tvPixelSizeForLayout(108),
        },
        buttonsContainer: {
            width: tvPixelSizeForLayout(452),
            marginTop: tvPixelSizeForLayout(54),
        },
        buttonStyle: {
            marginBottom: 20,
        },
        buttonStyleTv: {
            height: 60,
            borderRadius: 32.5,
            borderWidth: 0,
            borderColor: 'white',
        },
        iphoneContainer: {
            flex: 1.2,
        },
        titleLabel: {
            fontSize: appFonts.xxlg,
            fontFamily: appFonts.primary,
            color: appColors.secondary,
            fontWeight: '600',
            textAlign: 'left',
        },
        titleLabelTVLogin: {
            fontSize: tvPixelSizeForLayout(75),
            fontFamily: appFonts.primary,
            color: appColors.secondary,
            fontWeight: '600',
            textAlign: 'left',
        },
        titleContainer: {
            marginTop: Platform.OS === 'ios' ? appPadding.md() : appPadding.xxs(),
            marginBottom: 10,
            width: '60%',
        },
        titleContainerTV: {
            marginBottom: tvPixelSizeForLayout(33),
            width: tvPixelSizeForLayout(930),
        },
        formContainer: {
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
        },
        subscribeLabel: {
            marginTop: 10,
            paddingTop: 10,
            paddingBottom: 10,
            textAlign: 'left',
            flexDirection: 'row',
            alignItems: 'center',
        },
        subscribeLabelTV: {
            textAlign: 'left',
            flexDirection: 'row',
            alignItems: 'center',
            width: tvPixelSizeForLayout(900),
        },
        subscribeLabelText: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: Platform.isTV ? tvPixelSizeForLayout(32) : appFonts.xs,
            fontWeight: '500',
        },
        subscribeSignupLabelText: {
            color: appColors.brandTint,
            fontFamily: appFonts.semibold,
            fontSize: Platform.isTV ? tvPixelSizeForLayout(32) : appFonts.xs,
        },
        forgotPasswordContainer: {
            marginTop: 10,
            paddingTop: 10,
            marginBottom: 30,
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
        absoluteText: {
            width: '50%',
            alignSelf: 'center',
            position: 'absolute',
            top: 435,
            right: 290,
            height: 80,
            backgroundColor: 'green',
        },
        activationText: {
            alignSelf: 'center',
            color: 'white',
            height: '100%',
            width: '100%',
            fontFamily: appFonts.primary,
            fontSize: scale(50, 0),
            fontWeight: '500',
            textAlign: 'center',
            backgroundColor: 'transparent',
        },
    });
};
