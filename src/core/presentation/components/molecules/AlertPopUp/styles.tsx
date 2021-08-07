import { StyleSheet } from 'react-native';
import { scale, selectDeviceType } from 'qp-common-ui';
import { appDimensionValues, appFonts } from 'core/styles/AppStyles';

export const popupStyle = (appColors: {}) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        gradientContainer: {
            borderRadius: selectDeviceType({ Handset: scale(12) }, scale(12)),
            maxWidth: selectDeviceType({ Handset: '85%' }, '60%'),
            padding: selectDeviceType({ Handset: scale(24) }, scale(24)),
            elevation: appDimensionValues.xxxxs,
            shadowColor: 'rgba(0, 0, 0, 0.25)',
            shadowOffset: { width: 0, height: scale(3) },
        },
        textContainer: {
            flexDirection: 'row',
            width: '100%',
        },
        iconContainer: {
            width: selectDeviceType({ Handset: scale(32) }, scale(32)),
            height: selectDeviceType({ Handset: scale(32) }, scale(32)),
            borderRadius: selectDeviceType({ Handset: scale(8) }, scale(8)),
            marginEnd: selectDeviceType({ Handset: scale(15) }, scale(15)),
            alignItems: 'center',
            justifyContent: 'center',
        },
        textStyle: {
            color: appColors.secondary,
            fontSize: appFonts.xs,
            fontFamily: appFonts.primary,
            fontWeight: '400',
            flex: 1,
        },
        buttons: {
            marginTop: selectDeviceType({ Handset: scale(24) }, scale(24)),
        },
    });
};
