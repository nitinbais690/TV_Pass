import { StyleSheet } from 'react-native';
import { scale, selectDeviceType } from 'qp-common-ui';

export const popupStyle = () => {
    return StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column-reverse',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
        menuProvider: {
            justifyContent: 'flex-end',
        },
        scrollViewContainer: {
            flex: 1,
            flexDirection: 'column-reverse',
        },
        closeButton: {
            alignSelf: 'flex-end',
            marginBottom: selectDeviceType({ Handset: scale(8) }, scale(12)),
            marginEnd: selectDeviceType({ Handset: scale(19) }, scale(30)),
            width: selectDeviceType({ Handset: scale(24) }, scale(40)),
            height: selectDeviceType({ Handset: scale(24) }, scale(40)),
        },
        gradientContainer: {
            borderTopRightRadius: scale(16),
            borderTopLeftRadius: scale(16),
        },
    });
};
