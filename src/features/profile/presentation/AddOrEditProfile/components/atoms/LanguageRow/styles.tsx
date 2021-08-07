import { appFonts } from 'core/styles/AppStyles';
import { scale, selectDeviceType } from 'qp-common-ui';
import { StyleSheet } from 'react-native';

export const languageStyle = (appColors: any) => {
    return StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            height: selectDeviceType({ Handset: scale(48) }, scale(60)),
            paddingHorizontal: selectDeviceType({ Handset: scale(12) }, scale(16)),
            borderRadius: selectDeviceType({ Handset: scale(11) }, scale(11)),
            shadowColor: appColors.shadow,
            shadowOffset: { width: 0, height: scale(2.7) },
            shadowRadius: scale(16),
            elevation: scale(3),
        },
        radioContainer: {
            backgroundColor: 'transparent',
            borderWidth: 0,
            margin: 0,
            padding: 0,
            marginLeft: 0,
            marginEnd: scale(6),
        },
        text: {
            fontSize: appFonts.xs,
            fontFamily: appFonts.semibold,
            fontWeight: '600',
            color: appColors.secondary,
            marginStart: selectDeviceType({ Handset: scale(4) }, scale(8)),
        },
        gradient: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            borderRadius: selectDeviceType({ Handset: scale(11) }, scale(11)),
        },
        letterImage: {
            zIndex: 101,
            position: 'absolute',
            right: -scale(6),
            top: scale(6),
        },
    });
};
