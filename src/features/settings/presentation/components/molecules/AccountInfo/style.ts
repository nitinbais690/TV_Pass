import { StyleSheet } from 'react-native';
import { appDimensionValues } from 'core/styles/AppStyles';
import { scale, selectDeviceType } from 'qp-common-ui';

export function accountInfoStyle() {
    return StyleSheet.create({
        container: {
            paddingTop: scale(24, 0),
        },
        labelText: {
            paddingBottom: appDimensionValues.sm,
        },
        topLabelText: {
            paddingTop: selectDeviceType({ Handset: scale(16, 0) }, scale(24, 0)),
        },
        bottomLabelText: {
            paddingBottom: selectDeviceType({ Handset: scale(24, 0) }, scale(38, 0)),
        },
    });
}
