import { StyleSheet } from 'react-native';
import { scale } from 'qp-common-ui';
import { appDimensions, appDimensionValues, appFonts } from 'core/styles/AppStyles';

export const searchCardStyles = (
    width: number,
    cardsPerRow: number,
    customPadding: number,
    aspectRatio: number,
    appColors: any,
) => {
    const cardRadius = scale(8);

    return StyleSheet.create({
        container: {
            width: width / cardsPerRow,
            marginLeft: customPadding / 2,
            marginRight: customPadding / 2,
            marginBottom: appDimensionValues.xxxs,
            shadowOffset: { width: 0, height: 2 },
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 1,
            elevation: 0,
            borderRadius: cardRadius,
        },
        wrapperStyle: {
            width: width / cardsPerRow,
            aspectRatio: aspectRatio,
            borderRadius: cardRadius,
            overflow: 'hidden',
        },
        imageStyle: {
            borderTopLeftRadius: appDimensions.cardRadius,
            borderTopRightRadius: appDimensions.cardRadius,
            flex: 1,
        },
        gradientOverlayStyle: {
            backgroundColor: 'transparent',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: appDimensions.cardRadius,
        },
        footer: {
            flex: 1,
            justifyContent: 'space-between',
            borderBottomLeftRadius: appDimensions.cardRadius,
            borderBottomRightRadius: appDimensions.cardRadius,
        },
        footerTitle: {
            fontSize: appFonts.xxs,
            fontFamily: appFonts.primary,
            color: appColors.secondary,
            fontWeight: '500',
        },
        footerSubtitle: {
            fontSize: appFonts.xxs,
            fontFamily: appFonts.primary,
            color: appColors.caption,
            fontWeight: '500',
            paddingTop: 5,
        },
    });
};
