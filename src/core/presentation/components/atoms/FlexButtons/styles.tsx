import { StyleSheet } from 'react-native';
import { appPaddingValues } from 'core/styles/AppStyles';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    spanEven: {
        flex: 1,
    },
    marginEnd: {
        marginEnd: appPaddingValues.xxxs,
    },
});
