import { scale, selectDeviceType } from 'qp-common-ui';
import { appFontStyle, appFonts } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';

export const backNavigationStyle = (appColor: any, isFullScreen: boolean, insets: EdgeInsets) => {
    const containerHeight = 80 - insets.top;
    return StyleSheet.create({
        containerStyle: {
            paddingHorizontal: scale(16),
            ...(isFullScreen ? { marginTop: insets.top } : {}),
            height: scale(containerHeight),
            flexDirection: 'row',
            alignItems: 'center',
        },
        navigationTitleStyle: {
            color: appColor.secondary,
            marginStart: selectDeviceType({ Handset: scale(8, 0) }, scale(16, 0)),
            ...appFontStyle.header3,
            fontFamily: appFonts.medium,
            fontWeight: '700',
        },
    });
};
