import { appPaddingValues } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export const style = ({ appColors }: { appColors: any }) => {
    return StyleSheet.create({
        textStyle: {
            color: appColors.secondary,
            paddingVertical: appPaddingValues.xmd,
        },
    });
};
