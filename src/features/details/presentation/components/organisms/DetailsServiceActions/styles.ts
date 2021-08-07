import { StyleSheet } from 'react-native';
import { scale } from 'qp-common-ui';

export const ROUND_BUTTON_SIZE = scale(40);
export const ICON_SIZE = scale(20);
export const SHARE_ICON_SIZE = scale(24);

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: scale(16),
        marginTop: scale(30),
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexDirection: 'row',
    },
    hide: {
        opacity: 0,
    },
});
