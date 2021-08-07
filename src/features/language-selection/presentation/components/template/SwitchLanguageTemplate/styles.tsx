import { scale, selectDeviceType } from 'qp-common-ui';
import { appDimensionValues, isTablet, percentageOfHeight } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export const switchLanguageTemplateStyle = StyleSheet.create({
    parent: {
        flex: 1,
        marginTop: percentageOfHeight(10, true),
        marginBottom: scale(24, 0),
        ...(isTablet ? { marginHorizontal: '20%' } : { marginHorizontal: scale(24, 0) }),
        justifyContent: 'space-between',
    },
    contentLanguageTitle: {
        marginBottom: selectDeviceType({ Handset: scale(16, 0) }, scale(24, 0)),
    },
    item: {
        marginBottom: selectDeviceType({ Handset: scale(10, 0) }, scale(12, 0)),
    },
    appLanguageTitle: {
        marginTop: appDimensionValues.mlg,
        marginBottom: appDimensionValues.xmd,
    },
    appLanguageSwitch: {
        marginBottom: appDimensionValues.mlg,
    },
    saveButton: {
        marginTop: 'auto',
        alignSelf: selectDeviceType({ Handset: 'flex-end' }, 'center'),
        width: selectDeviceType({ Handset: scale(142, 0) }, scale(196, 0)),
    },
    closeBtnStyle: {
        width: scale(24),
        height: scale(24),
        alignSelf: 'flex-end',
    },
    loaderStyle: {
        position: 'absolute',
        alignSelf: 'center',
        justifyContent: 'center',
        bottom: 0,
        top: 0,
    },
});
