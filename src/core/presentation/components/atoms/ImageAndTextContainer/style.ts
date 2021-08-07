import { appDimensions } from 'core/styles/AppStyles';
import { scale, selectDeviceType } from 'qp-common-ui';
import { StyleSheet } from 'react-native';
export const ImageandTextContainerStyle = () => {
    return StyleSheet.create({
        container: {
            height: '90%',
            flexDirection: 'column',
        },
        imageContainer: {
            height: '80%',
        },
        textContainer: {
            height: '20%',
            paddingLeft: 18,
            paddingRight: 18,
            textAlign: 'center',
        },
        image: {
            width: appDimensions.fullWidth,
            height: '100%',
        },
        msg: {
            color: '#FFFFFF',
            lineHeight: selectDeviceType({ Handset: scale(21) }, scale(25)),
            textAlign: 'center',
            left: scale(18),
            bottom: scale(42),
            position: 'absolute',
            fontSize: selectDeviceType({ Handset: scale(14) }, scale(18)),
        },
    });
};
