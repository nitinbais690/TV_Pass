import { scale, selectDeviceType } from 'qp-common-ui';
import { appDimensionValues } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export const welcomeBannerStyle = (appColors: any) => {
    return StyleSheet.create({
        container: {
            marginTop: appDimensionValues.xxxxlg,
        },
        ahaLogoStyle: {
            width: selectDeviceType({ Handset: scale(60, 0) }, scale(72, 0)),
            height: selectDeviceType({ Handset: scale(30, 0) }, scale(36, 0)),
            marginStart: appDimensionValues.xxxs,
        },
        logoContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginStart: appDimensionValues.mlg,
        },
        titleStyle: {
            marginStart: appDimensionValues.mlg,
        },
        descTextStyle: {
            color: appColors.white,
            opacity: 0.3,
            lineHeight: scale(24),
            letterSpacing: 0,
            textAlign: 'left',
            marginStart: appDimensionValues.mlg,
            marginTop: appDimensionValues.xxxs,
        },
        welcomeBannerImageStyle: {
            position: 'absolute',
            bottom: 0,
            width: '100%',
            alignItems: 'center',
            height: selectDeviceType({ Handset: scale(400, 0) }, scale(450, 0)),
        },
        welcomeBannerBgStyle: {
            opacity: 0.5,
        },
        bannerImageStyle: {
            width: '100%',
            height: selectDeviceType({ Handset: scale(400, 0) }, scale(450, 0)),
        },
    });
};
