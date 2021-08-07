import { appDimensionValues } from 'core/styles/AppStyles';
import { scale, selectDeviceType } from 'qp-common-ui';
import { StyleSheet } from 'react-native';

export const profileSelectionTemplateStyle = () => {
    return StyleSheet.create({
        container: {
            marginStart: appDimensionValues.lg,
            marginEnd: appDimensionValues.lg,
        },
        titleStyle: {
            marginTop: selectDeviceType({ Handset: scale(76, 0) }, scale(100, 0)),
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
