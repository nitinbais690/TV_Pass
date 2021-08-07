import { StyleSheet } from 'react-native';
import { scale, selectDeviceType } from 'qp-common-ui';

export const BRAND_LOGO_WIDTH = selectDeviceType({ Handset: scale(48) }, scale(75, 0));
export const BRAND_LOGO_HEIGHT = selectDeviceType({ Handset: scale(25) }, scale(39, 0));

export const headerTitleStyle = StyleSheet.create({
    headerTitleContainer: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 0,
    },
});
