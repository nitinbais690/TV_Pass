import { selectDeviceType } from 'qp-common-ui';
import { appFontStyle, appPadding, appPaddingValues } from 'core/styles/AppStyles';
import { appFlexStyles } from 'core/styles/FlexStyles';
import { StyleSheet } from 'react-native';

export const searchResultsTemplateStyles = (appColors: any, insets: any) => {
    return StyleSheet.create({
        container: {
            ...appFlexStyles.flexColumnFill,
        },
        headerContainer: {
            ...appFlexStyles.rowHorizontalAlignStart,
            alignItems: 'center',
            paddingHorizontal: appPaddingValues.sm,
            width: '100%',
            paddingBottom: selectDeviceType({ Handset: 24 }, 28),
            paddingTop: selectDeviceType({ Handset: appPadding.md(true) }, appPadding.xs(true)) + insets.top,
        },
        backArrowSection: {
            paddingLeft: appPaddingValues.xxxs,
            paddingRight: appPaddingValues.sm,
        },
        searchHeaderSection: {
            ...appFlexStyles.flexColumn,
            paddingHorizontal: appPaddingValues.xs,
        },
        searhNotFound: {
            ...appFontStyle.header3,
            color: appColors.white,
            fontWeight: '700',
            paddingBottom: appPaddingValues.lg,
            paddingHorizontal: appPaddingValues.xs,
        },
        titleHeader: {
            ...appFontStyle.body3,
            color: appColors.white,
            fontWeight: '700',
            paddingBottom: appPaddingValues.xxxxs,
        },
        recentSearchConatiner: {
            ...appFlexStyles.flexColumn,
            alignContent: 'flex-start',
            paddingBottom: appPaddingValues.sm,
        },
        recentSearchText: {
            ...appFontStyle.body3,
            color: appColors.white,
            paddingBottom: appPaddingValues.xxxxs,
        },
    });
};
