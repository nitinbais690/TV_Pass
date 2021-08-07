import { StyleSheet } from 'react-native';
import { scale, selectDeviceType } from 'qp-common-ui';
import { appFontStyle } from 'core/styles/AppStyles';

export function downloadSettingsSheetStyle(appColors: any) {
    return StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column-reverse',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
            paddingStart: scale(30, 0),
            paddingEnd: scale(30, 0),
            paddingBottom: scale(20, 0),
        },
        radioIcon: {
            width: scale(16, 0),
            height: scale(16, 0),
        },
        title: {
            ...appFontStyle.body1,
            color: appColors.secondary,
            paddingTop: scale(25, 0),
            paddingBottom: scale(20, 0),
        },
        list: {
            paddingBottom: scale(20, 0),
        },
        switch: {
            paddingBottom: scale(26, 0),
        },
    });
}
