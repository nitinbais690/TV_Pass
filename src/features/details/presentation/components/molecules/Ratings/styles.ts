import { scale } from 'qp-common-ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    ratings: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: scale(16),
        marginBottom: scale(16),
        marginHorizontal: scale(16),
    },
});
