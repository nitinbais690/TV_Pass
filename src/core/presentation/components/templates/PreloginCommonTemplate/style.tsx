import { scale } from 'qp-common-ui';
import { appDimensionValues, appPaddingValues } from 'core/styles/AppStyles';
import { appFlexStyles } from 'core/styles/FlexStyles';
import { StyleSheet } from 'react-native';

export const preloginCommonTemplateStyles = StyleSheet.create({
    mobileScreenContainer: {
        ...appFlexStyles.flexColumnFill,
        ...appFlexStyles.columnVerticalAlignSpaceBetween,
        paddingHorizontal: appPaddingValues.lg,
        paddingBottom: appPaddingValues.xxxlg,
    },
    tabScreenContainer: {
        ...appFlexStyles.columnVerticalAlignSpaceBetween,
        paddingHorizontal: scale(70),
        paddingBottom: appPaddingValues.xxxlg,
        width: '80%',
        minHeight: '55%',
        borderRadius: appDimensionValues.xxs,
        backgroundColor: '#1A1D1E',
        paddingTop: scale(45),
    },
});
