import { StyleSheet } from 'react-native';
import { appFlexStyles } from 'core/styles/FlexStyles';

export const styles = StyleSheet.create({
    originals: {
        flex: 1,
        ...appFlexStyles.rowHorizontalAlignStart,
    },
    premium: {
        flex: 1,
        ...appFlexStyles.rowHorizontalAlignEnd,
    },
});
