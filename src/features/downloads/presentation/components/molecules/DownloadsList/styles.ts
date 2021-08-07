import { StyleSheet } from 'react-native';
import { AspectRatio, scale, selectDeviceType } from 'qp-common-ui';
import { appDimensionValues, appFonts, appFontStyle, appPaddingValues } from 'core/styles/AppStyles';

export function downloadListStyles(appColors: any) {
    return StyleSheet.create({
        listContainer: {},
        container: {
            flex: 1,
            flexDirection: 'row',
            paddingHorizontal: selectDeviceType({ Handset: scale(24, 0) }, scale(29, 0)),
            paddingBottom: selectDeviceType({ Handset: scale(12, 0) }, scale(18, 0)),
        },
        imageWrapper: {
            height: selectDeviceType({ Handset: scale(77) }, scale(85)),
            width: selectDeviceType({ Handset: scale(134) }, scale(165)),
            aspectRatio: AspectRatio._16by9,
            borderRadius: appDimensionValues.xxxxs,
        },
        image: {
            aspectRatio: AspectRatio._16by9,
            borderRadius: appDimensionValues.xxxxs,
        },
        textContainer: {
            flex: 1,
            flexDirection: 'column',
            marginStart: appPaddingValues.md,
        },
        titleTypography: {
            ...appFontStyle.body3,
            fontFamily: appFonts.semibold,
            color: appColors.secondary,
        },
        title: {
            marginBottom: appDimensionValues.xxxxs,
        },
        captionTypography: {
            ...appFontStyle.sublineText,
            fontFamily: appFonts.semibold,
            color: appColors.sublineTextColor,
            textTransform: 'none',
        },
        button: {
            height: selectDeviceType({ Handset: scale(32, 0) }, scale(40, 0)),
            width: selectDeviceType({ Handset: scale(32, 0) }, scale(40, 0)),
            marginStart: appDimensionValues.sm,
        },
        buttonIcon: {
            height: selectDeviceType({ Handset: scale(16, 0) }, scale(24, 0)),
            width: selectDeviceType({ Handset: scale(16, 0) }, scale(24, 0)),
        },
        deleteButton: {
            marginStart: appDimensionValues.sm,
        },
        buttonsWrapper: {
            flexDirection: 'row',
            marginTop: appDimensionValues.xxs,
        },
    });
}
