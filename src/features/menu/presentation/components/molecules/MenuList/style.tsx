import { scale } from 'qp-common-ui';
import { appPaddingValues } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export default function MenuListStyle() {
    return StyleSheet.create({
        container: { paddingTop: appPaddingValues.xlg, flexGrow: 1 },
        iconStyle: {
            width: scale(24),
            height: scale(24),
        },
    });
}
