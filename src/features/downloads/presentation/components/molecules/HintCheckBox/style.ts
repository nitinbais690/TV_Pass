import { StyleSheet } from 'react-native';
import { appFonts, appFontStyle, appPaddingValues } from 'core/styles/AppStyles';
import { appFlexStyles } from 'core/styles/FlexStyles';
import { scale } from 'qp-common-ui';

export const hintCheckBoxStyle = (appColors: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            ...appFlexStyles.rowVerticalAlignCenter,
            paddingTop: scale(12, 0),
            paddingBottom: scale(12, 0),
        },
        checkboxContainer: {
            flex: 0.6,
        },
        checkbox: {
            backgroundColor: appColors.transparent,
            padding: 0,
            margin: 0,
            borderWidth: 0,
        },
        text: {
            ...appFontStyle.body3,
            fontFamily: appFonts.semibold,
            color: appColors.secondary,
            marginStart: appPaddingValues.xmd,
        },
        hintContainer: {
            flex: 0.4,
        },
        hintText: {
            ...appFontStyle.body3,
            fontFamily: appFonts.semibold,
            color: appColors.secondary,
            opacity: 0.3,
        },
    });
};
