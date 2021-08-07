import { StyleSheet } from 'react-native';
import { scale } from 'qp-common-ui';
import { appFontStyle, appPaddingValues, isTablet } from 'core/styles/AppStyles';
import { appFlexStyles } from 'core/styles/FlexStyles';

export const searchBoxStyles = (appColors: any) => {
    return StyleSheet.create({
        searchContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            flex: 1,
        },
        input: {
            ...appFontStyle.body3,
            width: '100%',
            color: appColors.white,
            borderWidth: scale(1),
            borderColor: appColors.secondaryButtonBorder,
            borderRadius: scale(8),
            paddingLeft: appPaddingValues.xmd,
            paddingRight: isTablet ? '10%' : '14%',
            paddingVertical: appPaddingValues.xxs,
        },
        iconSection: {
            position: 'absolute',
            width: isTablet ? '10%' : '14%',
            right: 0,
            bottom: 0,
            top: 0,
            height: '100%',
            ...appFlexStyles.rowAlignCenter,
            paddingRight: appPaddingValues.xxs,
            paddingLeft: appPaddingValues.xxxxs,
        },
        iconButton: {
            ...appFlexStyles.rowAlignCenter,
            width: '100%',
            height: '100%',
        },
    });
};
