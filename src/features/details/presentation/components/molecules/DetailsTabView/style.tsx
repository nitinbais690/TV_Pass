import { appPaddingValues } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export const style = () => {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            paddingTop: appPaddingValues.sm,
        },
        maturityRatingViewStyle: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignContent: 'space-between',
        },
    });
};
