import { StyleSheet } from 'react-native';
import { appFonts, appPadding } from 'core/styles/AppStyles';
import { scale, selectDeviceType } from 'qp-common-ui';

export const styles = (appColors: any) => {
    const paddingHorizontal = selectDeviceType({ Handset: scale(4) }, scale(7));
    return StyleSheet.create({
        container: {
            flexDirection: 'row',
            height: scale(18),
            backgroundColor: appColors.primaryVariant7,
            borderColor: '#35393F',
            borderRadius: scale(5),
            borderStyle: 'solid',
            borderWidth: scale(1),
            shadowColor: appColors.shadow,
            shadowOffset: { width: 0, height: scale(2.7) },
            shadowRadius: scale(5),
            elevation: scale(2.7),
            paddingHorizontal: paddingHorizontal,
            justifyContent: 'center',
            alignItems: 'center',
            marginEnd: appPadding.xs(),
        },
        textStyle: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxxs,
            letterSpacing: 0.13,
            fontWeight: '600',
        },
        image: {
            marginEnd: paddingHorizontal,
        },
    });
};
