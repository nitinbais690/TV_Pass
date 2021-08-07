import { StyleSheet } from 'react-native';
import { scale, selectDeviceType } from 'qp-common-ui';
import { appDimensionValues, appPaddingValues, appFonts } from 'core/styles/AppStyles';

export const styles = (appColors: any) => {
    return StyleSheet.create({
        footerViewStyle: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: appPaddingValues.xxxs,
            backgroundColor: 'transparent',
        },
        footerTextStyle: {
            color: appColors.secondary,
            maxWidth: '60%',
            fontFamily: appFonts.semibold,
            fontSize: selectDeviceType({ Handset: scale(12, 0) }, scale(16, 0)),
            paddingRight: appPaddingValues.xxxs,
            lineHeight: appDimensionValues.xs,
        },
        progressContainer: {
            height: 3,
            width: '100%',
            marginTop: 10,
            backgroundColor: appColors.caption,
            borderRadius: scale(10),
        },
        progress: {
            backgroundColor: appColors.brandTint,
            height: '100%',
            borderRadius: scale(10),
        },
    });
};
