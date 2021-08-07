import { appDimensionValues } from 'core/styles/AppStyles';
import { AspectRatio, scale, selectDeviceType } from 'qp-common-ui';
import { StyleSheet } from 'react-native';

export const WatchListCardStyle = (appColors: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'row',
            paddingLeft: scale(25),
            paddingRight: scale(41),
            paddingTop: selectDeviceType({ Handset: scale(12) }, scale(18)),
            paddingBottom: selectDeviceType({ Handset: scale(12) }, scale(18)),
        },
        imageContainer: {
            backgroundColor: appColors.primaryVariant2,
            borderRadius: appDimensionValues.xxxxs,
            marginRight: scale(16),
            height: selectDeviceType({ Handset: scale(77) }, scale(85)),
            width: selectDeviceType({ Handset: scale(134) }, scale(165)),
        },
        image: {
            aspectRatio: AspectRatio._16by9,
            borderRadius: appDimensionValues.xxxxs,
        },
        videoContainer: {},
    });
};
