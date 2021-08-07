import { appDimensionValues } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export const passwordInputBoxStyle = StyleSheet.create({
    passwordToggleStyle: {
        position: 'absolute',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        end: appDimensionValues.xxs,
        alignContent: 'center',
        top: 0,
        bottom: 0,
        zIndex: 1,
    },
});
