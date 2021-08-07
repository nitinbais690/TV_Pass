import { appFlexStyles } from 'core/styles/FlexStyles';
import { StyleSheet } from 'react-native';
import { appPaddingValues } from 'core/styles/AppStyles';

export const otpOrganismStyles = StyleSheet.create({
    otpContainer: {
        width: '100%',
        ...appFlexStyles.flexColumn,
        paddingTop: appPaddingValues.xlg,
    },
    otpInputSection: {
        paddingVertical: appPaddingValues.xlg,
    },
});
