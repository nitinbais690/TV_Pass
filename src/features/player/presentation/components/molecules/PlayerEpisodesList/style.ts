import { appDimensionValues, appFontStyle, appPaddingValues } from 'core/styles/AppStyles';
import { appFlexStyles } from 'core/styles/FlexStyles';
import { StyleSheet } from 'react-native';

export const playerEpisodesListStyle = (appColors: any) => {
    return StyleSheet.create({
        episodesListHeader: {
            ...appFlexStyles.rowHorizontalAlignSpaceBetween,
            alignItems: 'center',
            width: '100%',
            paddingBottom: appPaddingValues.xxxxs,
            paddingLeft: appPaddingValues.xxs,
        },
        episodesListHeaderText: {
            color: appColors.white,
            ...appFontStyle.body3,
            fontWeight: '600',
        },
        closeIcon: {
            marginRight: appDimensionValues.lg,
        },
    });
};
