import { appDimensionValues } from 'core/styles/AppStyles';
import { scale, selectDeviceType } from 'qp-common-ui';
import { StyleSheet } from 'react-native';

export const manageProfileStyle = () => {
    return StyleSheet.create({
        container: {
            marginHorizontal: appDimensionValues.lg,
        },
        titleStyle: {
            marginTop: selectDeviceType({ Handset: scale(76, 0) }, scale(18, 0)),
        },
        manageProfileStyle: {
            position: 'absolute',
            bottom: 0,
            start: 0,
            end: 0,
            width: 'auto',
            marginBottom: appDimensionValues.xxxxlg,
        },
        loaderStyle: {
            position: 'absolute',
            alignSelf: 'center',
            justifyContent: 'center',
            bottom: 0,
            top: 0,
        },
    });
};
