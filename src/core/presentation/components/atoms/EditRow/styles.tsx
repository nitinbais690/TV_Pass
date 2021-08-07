import { appFontStyle } from 'core/styles/AppStyles';
import { scale, selectDeviceType } from 'qp-common-ui';
import { StyleSheet } from 'react-native';

export const profileListItemStyle = (appColor: any) => {
    return StyleSheet.create({
        editText: {
            color: appColor.secondary,
            ...appFontStyle.sublineText,
            marginStart: selectDeviceType({ Handset: scale(7, 0) }, scale(10, 0)),
        },
        icon: {
            height: selectDeviceType({ Handset: scale(16) }, scale(17)),
            width: selectDeviceType({ Handset: scale(16) }, scale(17)),
        },
    });
};
