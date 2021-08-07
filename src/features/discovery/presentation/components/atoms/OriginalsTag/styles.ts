import { StyleSheet } from 'react-native';
import { scale, selectDeviceType } from 'qp-common-ui';

export const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',

        height: selectDeviceType({ Tv: scale(43, 0) }, scale(38, 0)),
        width: selectDeviceType({ Tv: scale(55, 0) }, scale(44, 0)),
    },
});
