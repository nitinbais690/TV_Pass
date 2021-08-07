import { StyleSheet } from 'react-native';
import { scale, selectDeviceType } from 'qp-common-ui';

export function settingsTemplateStyle() {
    return StyleSheet.create({
        container: {
            paddingStart: selectDeviceType({ Handset: scale(24, 0) }, scale(32, 0)),
            paddingEnd: selectDeviceType({ Handset: scale(24, 0) }, scale(32, 0)),
        },
        loaderStyle: {
            position: 'absolute',
            alignSelf: 'center',
            justifyContent: 'center',
            bottom: 0,
            top: 0,
        },
    });
}
