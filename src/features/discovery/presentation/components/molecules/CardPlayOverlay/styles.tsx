import { appFlexStyles } from 'core/styles/FlexStyles';
import { StyleSheet } from 'react-native';
import { selectDeviceType, scale } from 'qp-common-ui';

export const styles = StyleSheet.create({
    container: {
        ...appFlexStyles.flexColumnFill,
        justifyContent: 'flex-end',
    },
    gradient: {
        ...appFlexStyles.flexColumn,
        height: '47%',
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        alignSelf: 'flex-end',
        opacity: 0.5,
    },

    playIcon: {
        marginEnd: selectDeviceType({ Handset: scale(11, 0) }, scale(13, 0)),
        marginBottom: selectDeviceType({ Handset: scale(10, 0) }, scale(12, 0)),
    },
});
