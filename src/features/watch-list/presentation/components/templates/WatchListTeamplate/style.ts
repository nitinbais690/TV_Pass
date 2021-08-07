import { appPaddingValues } from 'core/styles/AppStyles';
import { scale } from 'qp-common-ui';
import { StyleSheet } from 'react-native';

export const WatchListTemplateStyles = (appColors: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            paddingBottom: appPaddingValues.sm,
        },
        titleContainer: {
            height: scale(30),
        },
        profileContainer: {
            flexDirection: 'row',
            paddingLeft: scale(25),
            paddingRight: scale(31),
            paddingBottom: appPaddingValues.xxs,
            alignItems: 'center',
        },
        profileWrapper: {
            flexGrow: 1,
        },
        textWrapper: {
            alignSelf: 'flex-end',
        },
        removeAllText: {
            lineHeight: scale(28),
            textAlign: 'right',
            color: appColors.secondary,
        },
        listContainer: {
            flex: 1,
        },
    });
};
