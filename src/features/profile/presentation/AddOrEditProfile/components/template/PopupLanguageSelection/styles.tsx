import { appDimensionValues, appFonts } from 'core/styles/AppStyles';
import { scale, selectDeviceType } from 'qp-common-ui';
import { StyleSheet } from 'react-native';

export const languageStyle = (appColors: any) => {
    return StyleSheet.create({
        container: {
            marginHorizontal: selectDeviceType({ Handset: appDimensionValues.lg }, scale(appDimensionValues.xxlg)),
            marginVertical: selectDeviceType({ Handset: appDimensionValues.xxlg }, scale(38)),
        },
        headText: {
            color: appColors.secondary,
            fontSize: appFonts.md,
            fontFamily: appFonts.primary,
            fontWeight: '600',
            marginBottom: appDimensionValues.sm,
        },
        button: {
            width: '50%',
            alignSelf: 'flex-end',
        },
        checkboxContainer: {
            marginBottom: appDimensionValues.xmd,
            marginTop: scale(10),
            marginLeft: scale(0),
        },
        languageRow: {
            marginBottom: appDimensionValues.xs,
        },
    });
};
