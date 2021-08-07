import { appFonts } from 'core/styles/AppStyles';
import { scale } from 'qp-common-ui';
import { StyleSheet } from 'react-native';

export const VideoDetailsStyle = (appColors: any) => {
    return StyleSheet.create({
        container: {
            flexDirection: 'row',
            paddingTop: scale(5),
        },
        details: {
            color: appColors.sublineTextColor,
            fontSize: appFonts.xxs,
        },
    });
};
