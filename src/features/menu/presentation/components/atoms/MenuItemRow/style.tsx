import { scale } from 'qp-common-ui';
import { appFonts, appFontStyle, appPaddingValues } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export function MenuItemRowStyles(appColors: any) {
    return StyleSheet.create({
        container: {
            height: scale(50),
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingHorizontal: appPaddingValues.xlg,
        },
        imageAndTextContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        textStyle: {
            color: appColors.secondary,
            paddingLeft: appPaddingValues.sm,
            ...appFontStyle.body3,
            fontFamily: appFonts.semibold,
        },
        borderStyle: {
            paddingTop: appPaddingValues.xs,
            width: '100%',
            borderBottomWidth: 1,
            opacity: 0.07,
            borderColor: appColors.secondary,
        },
    });
}
