import { StyleSheet } from 'react-native';
import { appFonts } from 'core/styles/AppStyles';

export const styles = () => {
    return StyleSheet.create({
        titleStyle: {
            color: '#ECECEC',
            fontSize: appFonts.lg,
            fontFamily: appFonts.bold,
            fontWeight: '900',
            textTransform: 'uppercase',
        },
    });
};
