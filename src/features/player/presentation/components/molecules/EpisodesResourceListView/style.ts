import { appFontStyle, appPaddingValues } from 'core/styles/AppStyles';
import { AspectRatio, scale, selectDeviceType } from 'qp-common-ui';
import { StyleSheet } from 'react-native';

export const episodesResourceListStyle = (appColors: any) => {
    return StyleSheet.create({
        listContainer: {},
        container: {
            flex: 1,
            paddingHorizontal: scale(8),
            paddingVertical: scale(4), // We want same vertical spacing on tablets, so this shld be hard-code
        },
        imageWrapper: {
            width: selectDeviceType({ Handset: scale(152, 0) }, scale(162, 0)),
            height: selectDeviceType({ Handset: scale(88, 0) }, scale(98, 0)),
            aspectRatio: AspectRatio._16by9,
            borderRadius: scale(8),
        },
        inlinePlay: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            marginBottom: selectDeviceType({ Handset: scale(6, 0) }, scale(9, 0)),
            marginEnd: selectDeviceType({ Handset: scale(10, 0) }, scale(8, 0)),
            width: selectDeviceType({ Handset: scale(16, 0) }, scale(21, 0)),
            height: selectDeviceType({ Handset: scale(16, 0) }, scale(21, 0)),
        },
        image: {
            flex: 1,
            aspectRatio: AspectRatio._16by9,
            backgroundColor: appColors.primaryVariant2,
            borderRadius: 10,
        },

        overviewWrapperStyle: {
            flex: 1,
            width: '100%',
            position: 'absolute',
            bottom: 0,
            height: '50%',
        },
        imageWrapperStyle: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: appColors.secondary,
            alignSelf: 'center',
            flexShrink: 0,
        },
        overlayContainer: {
            flex: 1,
        },
        gradient: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            borderBottomLeftRadius: scale(8),
            borderBottomRightRadius: scale(8),
            opacity: 0.5,
        },
        episodesItemText: {
            paddingTop: appPaddingValues.xxxs,
            color: appColors.white,
            ...appFontStyle.sublineText,
            fontWeight: '600',
        },
    });
};
