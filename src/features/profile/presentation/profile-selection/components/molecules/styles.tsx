import { appDimensionValues, appFontStyle } from 'core/styles/AppStyles';
import { scale, selectDeviceType } from 'qp-common-ui';
import { StyleSheet, Dimensions } from 'react-native';

export const profileListItemStyle = (appColor: any, numberOfColumns: number = 1) => {
    return StyleSheet.create({
        container: {
            width: (Dimensions.get('window').width - appDimensionValues.lg * 2) / numberOfColumns,
            flexDirection: 'column',
            alignItems: 'flex-start',
        },
        profileNameStyle: {
            color: appColor.secondary,
            ...appFontStyle.subTitle,
            marginTop: appDimensionValues.xxxs,
        },
        profileLogoSize: {
            marginTop: appDimensionValues.xxlg,
            height: selectDeviceType({ Handset: scale(72, 0) }, scale(108, 0)),
            width: selectDeviceType({ Handset: scale(72, 0) }, scale(108, 0)),
        },
        profileItemStyle: {
            flex: 1,
            alignItems: 'center',
        },
    });
};
