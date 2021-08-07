import { appPaddingValues, scale, selectDeviceType } from 'qp-common-ui';
import { StyleSheet } from 'react-native';

export const VideoActionStyles = () => {
    return StyleSheet.create({
        container: {
            flexDirection: 'row',
            marginTop: scale(10),
        },
        hide: {
            opacity: 0,
        },
        button: {
            marginRight: appPaddingValues.xxxs,
        },
    });
};

export const ROUND_BUTTON_SIZE = selectDeviceType({ Handset: scale(32), Tablet: scale(40) }, scale(40));
export const PLAY_ICON_SIZE = {
    width: selectDeviceType({ Handset: scale(9), Tablet: scale(14) }, scale(14)),
    height: selectDeviceType({ Handset: scale(12), Tablet: scale(17) }, scale(17)),
};
export const DOWNLOAD_ICON_SIZE = {
    width: selectDeviceType({ Handset: scale(19), Tablet: scale(24) }, scale(24)),
    height: selectDeviceType({ Handset: scale(19), Tablet: scale(24) }, scale(24)),
};
export const DELETE_ICON_SIZE = {
    width: selectDeviceType({ Handset: scale(16), Tablet: scale(21) }, scale(21)),
    height: selectDeviceType({ Handset: scale(16), Tablet: scale(21) }, scale(21)),
};
