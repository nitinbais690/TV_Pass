import { StyleSheet } from 'react-native';
import { scale, selectDeviceType } from 'qp-common-ui';

export function settingsListStyle() {
    return StyleSheet.create({
        iconStyle: {
            width: selectDeviceType({ Handset: scale(24, 0) }, scale(34, 0)),
            height: selectDeviceType({ Handset: scale(24, 0) }, scale(34, 0)),
        },
    });
}
