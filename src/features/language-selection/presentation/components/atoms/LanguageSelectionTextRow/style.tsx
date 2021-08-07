import { StyleSheet } from 'react-native';
import { appFontStyle } from 'core/styles/AppStyles';
import { scale, selectDeviceType } from 'qp-common-ui';

export const selectedTickIconSize = selectDeviceType({ Tablet: scale(30, 0), Tv: scale(18, 0) }, scale(14, 0));
export const unselectedTickIconSize = selectDeviceType({ Tablet: scale(28, 0), Tv: scale(18, 0) }, scale(14, 0));
export const langualgeLogoWidth = selectDeviceType({ Tablet: scale(80, 0), Tv: scale(47, 0) }, scale(30, 0));
export const langualgeLogoHeight = selectDeviceType({ Tablet: scale(30, 0), Tv: scale(19, 0) }, scale(20, 0));

export const LanguageSelectionTextRowStyle = (appColors: any) => {
    return StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            width: '80%',
            marginBottom: selectDeviceType({ Tablet: scale(10, 0) }, scale(0, 0)),
            paddingLeft: selectDeviceType({ Tablet: scale(10, 0) }, scale(0, 0)),
        },

        tickIconStyle: {
            paddingRight: selectDeviceType({ Handset: scale(14, 0), Tv: scale(10, 0) }, scale(18, 0)),
        },

        languageTextStyle: {
            color: appColors.secondary,
            ...appFontStyle.body3,
            fontSize: selectDeviceType({ Tablet: scale(32, 0), Tv: scale(16, 0) }, scale(16, 0)),
            textAlign: 'center',
            paddingRight: selectDeviceType({ Handset: scale(10, 0), Tv: scale(13, 0) }, scale(12, 0)),
        },
    });
};
