import { StyleSheet } from 'react-native';

import { scale } from 'qp-common-ui';
import { appFlexStyles } from 'core/styles/FlexStyles';
import { appFontStyle, appPaddingValues } from 'core/styles/AppStyles';

export const mobileDropDownStyle = (appColors: any) => {
    return StyleSheet.create({
        clickableDropdownContainer: {
            width: '35%',
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            borderRadius: scale(8),
            ...appFlexStyles.rowAlignCenter,
            paddingHorizontal: appPaddingValues.sm,
            zIndex: 1000,
        },
        dropdownContainer: {
            width: '100%',
            height: '100%',
            ...appFlexStyles.rowAlignCenter,
            paddingHorizontal: appPaddingValues.sm,
        },
        dropdownLineContainer: {
            width: '35%',
            position: 'absolute',
            left: 0,
            top: '5%',
            height: '90%',
            bottom: 0,
            borderRadius: scale(8),
            ...appFlexStyles.rowHorizontalAlignEnd,
            alignItems: 'center',
        },
        countryCode: {
            color: appColors.white,
            paddingLeft: appPaddingValues.xxxs,
            paddingRight: appPaddingValues.xxxxxs,
            ...appFontStyle.body3,
        },
        countryIcon: {
            width: scale(35),
            height: scale(20),
        },
        verticalLine: {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            height: '90%',
            width: scale(2),
        },
        mobileTextInputLayoutStyle: {
            paddingLeft: '36%',
            borderWidth: scale(1),
            borderColor: '#35393F',
            borderRadius: scale(8),
            height: scale(46),
            color: appColors.secondary,
        },
        tabTextInputLayoutStyle: {
            paddingLeft: '36%',
            borderWidth: scale(1),
            borderColor: '#35393F',
            borderRadius: scale(8),
            height: scale(38),
            color: appColors.secondary,
        },
    });
};
