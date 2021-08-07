import { StyleSheet } from 'react-native';
import { selectDeviceType } from 'qp-common-ui';
import { appFonts, appFontStyle, appPaddingValues } from 'core/styles/AppStyles';

export default function MenuFooterViewStyle(appColors: any) {
    return StyleSheet.create({
        container: {
            left: 0,
            right: 0,
            alignItems: 'center',
        },
        buttonStyle: {
            width: selectDeviceType({ Tablet: '50%' }, '100%'),
            paddingHorizontal: appPaddingValues.lg,
        },
        versionTextStyle: {
            ...appFontStyle.body3,
            color: appColors.secondary,
            opacity: 0.3,
            marginVertical: appPaddingValues.sm,
            fontSize: appFonts.xxs,
        },
        marginBottom13: {
            marginBottom: appPaddingValues.xs,
        },
    });
}
