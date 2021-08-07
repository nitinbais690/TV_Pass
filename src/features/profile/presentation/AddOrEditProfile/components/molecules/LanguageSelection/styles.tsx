import { appDimensionValues, appFonts } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';
import { scale, selectDeviceType } from 'qp-common-ui';

export const selectionStyle = (appColors: any) => {
    return StyleSheet.create({
        label: {
            color: appColors.secondary,
            fontSize: appFonts.sm,
            fontFamily: appFonts.primary,
            fontWeight: '600',
            marginBottom: appDimensionValues.sm,
        },
        value: {
            color: appColors.tertiary,
            fontSize: appFonts.xs,
            fontFamily: appFonts.primary,
            fontWeight: '600',
            marginBottom: selectDeviceType({ Handset: scale(6) }, scale(10)),
        },
    });
};
