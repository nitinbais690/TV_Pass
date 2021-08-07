import { StyleSheet } from 'react-native';
import { scale } from 'qp-common-ui';

export const FooterActionStyle = () => {
    return StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
        },
        primaryButton: {
            width: '43.33%',
        },
        secondaryButton: {
            width: '43.33%',
            marginRight: scale(8),
        },
    });
};
