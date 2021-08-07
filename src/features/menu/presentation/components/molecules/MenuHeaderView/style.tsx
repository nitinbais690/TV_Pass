import { scale } from 'qp-common-ui';
import { appPaddingValues } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export default function MenuHeaderViewStyle() {
    return StyleSheet.create({
        container: {
            flexDirection: 'row',
        },
        closeBtnStyle: {
            marginTop: scale(47),
            marginStart: appPaddingValues.lg,
            marginEnd: appPaddingValues.lg,
            width: scale(24),
            height: scale(24),
        },
    });
}
