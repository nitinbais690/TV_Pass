import { StyleSheet } from 'react-native';
import { appFontStyle, appPaddingValues } from 'core/styles/AppStyles';

export const TAB_INACTIVE_COLOR = '#7F7E86';

export const componentsStyles = ({ appColors }: { appColors: any }) => {
    return StyleSheet.create({
        container: { paddingTop: 30, paddingHorizontal: appPaddingValues.sm, flexDirection: 'column' },
        textStyle: {
            paddingBottom: appPaddingValues.xxs,
            alignItems: 'center',
            textAlign: 'center',
            color: appColors.secondary,
            ...appFontStyle.body3,
        },
        textUnSelectedStyle: {
            paddingBottom: appPaddingValues.xxs,
            alignItems: 'center',
            textAlign: 'center',
            color: TAB_INACTIVE_COLOR,
            ...appFontStyle.body3,
        },
        lineStyle: {
            height: 2,
            width: '100%',
        },
    });
};
