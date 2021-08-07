import { scale, selectDeviceType } from 'qp-common-ui';
import { appDimensionValues, appFontStyle } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export const AddProfileStyles = (appColor: any) => {
    return StyleSheet.create({
        container: {
            paddingVertical: appDimensionValues.xmd,
        },
        profileNameStyle: {
            flex: 1,
            color: appColor.secondary,
            ...appFontStyle.body3,
            marginStart: appDimensionValues.xs,
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
        addContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            height: selectDeviceType({ Handset: scale(48) }, scale(69)),
            width: selectDeviceType({ Handset: scale(48) }, scale(69)),
        },
        addWrapper: {
            width: selectDeviceType({ Handset: scale(48) }, scale(69)),
            height: selectDeviceType({ Handset: scale(48) }, scale(69)),
            borderWidth: 1,
            borderRadius: appDimensionValues.xxs,
            justifyContent: 'center',
            alignItems: 'center',

            shadowColor: appColor.blackShadow,
            shadowOpacity: 1,
            shadowOffset: { width: 0, height: appDimensionValues.xmd },
            shadowRadius: appDimensionValues.xxs,
        },
        gradient: {
            height: selectDeviceType({ Handset: scale(48) }, scale(69)),
            width: selectDeviceType({ Handset: scale(48) }, scale(69)),
            borderRadius: appDimensionValues.xxs,
        },
        plusIcon: {
            width: selectDeviceType({ Handset: scale(30) }, scale(45)),
            height: selectDeviceType({ Handset: scale(30) }, scale(45)),
        },
    });
};

export const GRADIENT_COLOR_GRAY = 'rgba(78, 67, 63, 0.5) 3.92%';
export const GRADIENT_COLOR_RED = 'rgba(255, 110, 69, 0.5) 111.82%';
export const ANGLE = 131.81;
