import { appFontStyle, appPaddingValues } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export const TabOptionViewStyles = ({ appColors }: { appColors: any }) => {
    return StyleSheet.create({
        container: {
            paddingVertical: appPaddingValues.xmd,
            paddingHorizontal: appPaddingValues.xmd,
        },
        textStyle: {
            color: appColors.secondary,
            textTransform: 'none',
            paddingBottom: appPaddingValues.xxs,
            ...appFontStyle.body3,
        },
        tabViewStyle: {
            flex: 1,
            flexDirection: 'row',
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: appColors.border,
        },
        tabStyle: {
            width: '25%',
        },
        tabViewBorder: {
            borderBottomWidth: 1,
            opacity: 0.07,
            borderColor: appColors.secondary,
        },
    });
};
