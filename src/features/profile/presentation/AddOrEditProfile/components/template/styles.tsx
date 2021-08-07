import { appDimensionValues } from 'core/styles/AppStyles';
import { scale, selectDeviceType } from 'qp-common-ui';
import { StyleSheet } from 'react-native';

export const editProfileStyle = () => {
    return StyleSheet.create({
        container: {
            flex: 1,
        },
        contentContainer: {
            flex: 1,
            marginHorizontal: selectDeviceType({ Handset: appDimensionValues.sm }, scale(appDimensionValues.xmd)),
            marginTop: appDimensionValues.lg,
        },
        content: {
            flex: 1,
        },
        buttonContainer: {
            marginBottom: selectDeviceType({ Handset: appDimensionValues.xxlg }, scale(appDimensionValues.xxxxlg)),
            marginTop: selectDeviceType({ Handset: appDimensionValues.sm }, scale(appDimensionValues.xmd)),
        },
        singleButton: {
            width: '50%',
            alignSelf: 'flex-end',
            marginBottom: selectDeviceType({ Handset: appDimensionValues.xxlg }, scale(appDimensionValues.xxxxlg)),
            marginTop: selectDeviceType({ Handset: appDimensionValues.sm }, scale(appDimensionValues.xmd)),
        },
        contentLanguage: {
            marginTop: appDimensionValues.lg,
            marginBottom: appDimensionValues.sm,
        },
        appLanguage: {
            marginTop: appDimensionValues.sm,
        },
        borderbottom: {
            width: '100%',
            borderBottomWidth: scale(1),
            borderColor: 'rgba(255, 255, 255, 0.07)',
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
