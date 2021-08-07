import { appDimensionValues, appFontStyle } from 'core/styles/AppStyles';
import { scale, selectDeviceType } from 'qp-common-ui';
import { StyleSheet } from 'react-native';

export const profileListItemStyle = (appColor: any, borderWidth: number) => {
    return StyleSheet.create({
        container: {
            paddingVertical: appDimensionValues.xmd,
            borderBottomWidth: borderWidth,
            borderColor: 'rgba(255, 2555, 255, 0.07)',
        },
        profileNameStyle: {
            flex: 1,
            color: appColor.secondary,
            ...appFontStyle.body1,
            marginStart: appDimensionValues.sm,
        },
        content: {
            flex: 1,
        },
        profileLogoSize: {
            height: selectDeviceType({ Handset: scale(48) }, scale(69)),
            width: selectDeviceType({ Handset: scale(48) }, scale(69)),
        },
        profileItemStyle: {
            flex: 1,
            flexDirection: 'row',
        },
        editText: {
            color: appColor.secondary,
            ...appFontStyle.sublineText,
            marginStart: selectDeviceType({ Handset: scale(7, 0) }, scale(10, 0)),
        },
    });
};
