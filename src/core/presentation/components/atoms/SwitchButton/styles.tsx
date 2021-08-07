import { StyleSheet } from 'react-native';
import { scale, selectDeviceType } from 'qp-common-ui';
import { appFonts } from 'core/styles/AppStyles';

export const buttonStyle = (appColors: any, width: number) => {
    const height = selectDeviceType({ Handset: scale(45) }, scale(45));
    const sliderWidth = width / 2;
    const radius = height / 2;
    return StyleSheet.create({
        container: {
            shadowColor: appColors.shadow,
            shadowOffset: { width: 0, height: scale(2.7) },
            shadowRadius: radius,
            elevation: scale(3),
            width: '100%',
            height: height,
            borderRadius: radius,
        },
        textPos: {
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
        },
        leftText: {
            width: sliderWidth,
            height: height,
            left: 0,
        },
        rightText: {
            width: sliderWidth,
            height: height,
            right: 0,
        },
        rtl: {
            flexDirection: 'row-reverse',
        },
        ltr: {
            flexDirection: 'row',
        },
        wayBtnActive: {
            width: sliderWidth,
            height: height,
            borderRadius: radius,
            shadowColor: appColors.shadow,
            shadowOffset: { width: 0, height: scale(2.7) },
            shadowRadius: radius,
            elevation: scale(3),
            borderColor: 'transparent',
            borderWidth: 1,
        },
        gradientBackground: {
            borderRadius: radius,
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
        },
        selectedGradient: {
            width: sliderWidth,
            height: height,
        },
        text: {
            fontSize: appFonts.xs,
            fontFamily: appFonts.primary,
            fontWeight: '600',
        },
        textActive: {
            color: appColors.secondary,
        },
        textInActive: {
            color: appColors.tertiary,
        },
    });
};
