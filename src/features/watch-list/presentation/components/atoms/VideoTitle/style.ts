import { appFonts } from 'core/styles/AppStyles';
import { scale } from 'qp-common-ui';
import { StyleSheet } from 'react-native';
export const VideoTitleStyle = (appColors: any) => {
    return StyleSheet.create({
        container: {},
        titleText: {
            color: appColors.secondary,
            lineHeight: scale(14),
            fontSize: appFonts.xs,
        },
    });
};
