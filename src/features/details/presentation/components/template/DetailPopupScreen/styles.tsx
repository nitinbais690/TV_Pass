import { StyleSheet, Platform, Dimensions } from 'react-native';
import { AspectRatio } from 'qp-common-ui';
import { appDimensionValues, appFonts } from 'core/styles/AppStyles';
import { scale } from 'qp-common-ui';

export const imageAspectRatio = AspectRatio._2by3;

export const defaultContentDetailsPopupStyle = ({ appColors }: any) => {
    return StyleSheet.create({
        height50: {
            height: Dimensions.get('window').height / 2,
        },
        metaInfoWrapperStyle: {
            ...(Platform.isTV && {
                flexDirection: 'row-reverse',
            }),
        },
        playButtonContainer: {
            marginTop: scale(16),
            marginLeft: scale(16),
            marginRight: scale(16),
        },
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
        contentDetails: {
            flexDirection: 'row',
            width: '100%',
            marginTop: scale(16),
            marginHorizontal: scale(16),
        },
        contentText: {
            marginHorizontal: scale(16),
        },
        loadingIndicator: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            elevation: appDimensionValues.xxxs,
        },
        continueWatchingOverlayContainer: {
            position: 'absolute',
            zIndex: 100,
            width: '100%',
            height: '100%',
            borderRadius: 20,
            overflow: 'hidden',
        },
        continueWatchingOverlayGradient: {
            width: '100%',
            height: '100%',
        },
        continueWatchingOverlayView: {
            height: '100%',
        },
    });
};
