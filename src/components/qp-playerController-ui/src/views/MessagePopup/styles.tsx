import { appFontStyle, colors, dimentionsValues, scale, selectDeviceType } from 'qp-common-ui';
import { StyleSheet } from 'react-native';

export const messagePopupStyles = StyleSheet.create({
    lockMessageContainer: {
        position: 'absolute',
        top: 0,
        width: selectDeviceType({ Handset: scale(320, 0) }, scale(350, 0)),
        height: selectDeviceType({ Handset: scale(68, 0) }, scale(80, 0)),
        padding: dimentionsValues.sm,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: dimentionsValues.lg,
        borderRadius: dimentionsValues.xxxs,
    },
    messageText: {
        color: colors.primary,
        ...appFontStyle.body3,
        lineHeight: dimentionsValues.md,
        marginStart: dimentionsValues.sm,
    },
});
