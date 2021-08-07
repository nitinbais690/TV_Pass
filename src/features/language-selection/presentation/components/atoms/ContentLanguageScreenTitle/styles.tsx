import { StyleSheet } from 'react-native';
import { selectDeviceType, scale } from 'qp-common-ui';
export const languageSelectionTitleTextStyle = (appColors: any) => {
    return StyleSheet.create({
        textContainer: {
            flexDirection: 'row',
        },
        textStyle: {
            color: appColors.white,
            fontSize: selectDeviceType({ Handset: scale(18, 0), Tablet: scale(32, 0), Tv: scale(20,0) }, scale(24, 0)),
        },
        highLightedtextStyle: {
            color: appColors.brandTintLight,
            fontSize: selectDeviceType({ Handset: scale(18, 0), Tablet: scale(32, 0) }, scale(24, 0)),
        },
    });
};
