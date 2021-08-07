import { StyleSheet } from 'react-native';
import { appDimensionValues, appPaddingValues } from 'core/styles/AppStyles';
import { scale } from 'qp-common-ui';

export const onboardNavigationStyle = (appColors: any) => {
    return StyleSheet.create({
        back: {
            color: appColors.white,
            flex: 1,
            justifyContent: 'flex-start',
            textAlign: 'left',
            alignContent: 'center',
            lineHeight: appDimensionValues.xlg,
            paddingLeft: scale(12.5, 0),
        },
        skip: {
            color: appColors.white,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            textAlign: 'right',
            lineHeight: appDimensionValues.xlg,
        },
        navigationContainer: {
            position: 'absolute',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: appPaddingValues.xxxlg,
            marginEnd: appPaddingValues.lg,
            marginStart: appPaddingValues.lg,
            alignItems: 'center',
        },
    });
};
