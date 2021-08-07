import { StyleSheet } from 'react-native';
import { appFonts } from 'core/styles/AppStyles';
import { scale } from 'qp-common-ui';

export const defaultStyles = (appColors: any) => {
    return StyleSheet.create({
        detailsButton: {
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.07)',
            marginTop: scale(16),
        },
        detailButtonContainer: {
            width: '100%',
            flexDirection: 'row',
            paddingHorizontal: scale(16),
            height: scale(40),
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        detailsText: {
            fontSize: appFonts.xxs,
            fontWeight: '600',
            color: appColors.secondary,
        },
    });
};
