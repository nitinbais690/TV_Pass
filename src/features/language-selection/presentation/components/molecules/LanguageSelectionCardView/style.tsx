import { StyleSheet } from 'react-native';
import { appDimensionValues, appFonts, appPaddingValues, isTablet } from 'core/styles/AppStyles';
import { AspectRatio, scale, selectDeviceType } from 'qp-common-ui';

export const languageBackgroundSize = selectDeviceType({ Tablet: scale(150, 0), Tv: scale(108, 0) }, scale(75, 0));
export const LanguageSelectionCardViewStyles = (appColors: any, isCardSelected: boolean, parentViewheight: number) => {
    return StyleSheet.create({
        mainContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignContent: 'flex-end',
        },

        gradientCommonStyle: {
            flex: 1,
            justifyContent: 'flex-end',
            alignContent: 'flex-end',
            flexDirection: 'row',
            shadowColor: appColors.blackShadow,
            shadowOffset: { width: 0, height: appDimensionValues.xxxxs },
        },

        gradientStyleMobile: isCardSelected
            ? {
                  borderRadius: appDimensionValues.xxs,
                  shadowRadius: appDimensionValues.lg,
                  aspectRatio: AspectRatio._3by1,
              }
            : {
                  borderRadius: appDimensionValues.xxs,
                  shadowRadius: appDimensionValues.xxxxs,
                  aspectRatio: AspectRatio._3by1,
              },
        gradientStyleTV: isCardSelected
            ? {
                  aspectRatio: 3.8,
                  borderRadius: appDimensionValues.xxxxxs,
                  shadowRadius: appDimensionValues.xmd,
              }
            : {
                  aspectRatio: 3.8,
                  borderColor: '#ffffff1a',
                  borderWidth: 2,
                  borderRadius: appDimensionValues.xxxxxs,
                  shadowRadius: appDimensionValues.xmd,
              },

        cardContainer: {
            flex: 1,
            flexDirection: 'row',
        },
        topTextStyle: {
            flex: 7,
            paddingHorizontal: appPaddingValues.xxs,
            paddingTop: appPaddingValues.sm,
        },
        descTextStyle: {
            fontFamily: appFonts.primary,
            ...(isTablet
                ? { fontSize: appFonts.md }
                : { fontSize: selectDeviceType({ Handset: scale(10, 0), Tv: scale(12, 0) }, scale(12, 0)) }),
            fontWeight: '400',
            lineHeight: selectDeviceType({ Handset: scale(14, 0), Tablet: scale(26, 0) }, scale(20, 0)),
            color: appColors.secondary,
            paddingTop: selectDeviceType({ Handset: scale(14, 0), Tv: scale(18, 0) }, scale(20, 0)),
            paddingLeft: selectDeviceType({ Tablet: scale(12, 0) }, 0),
        },
        cardFocussedStyle: {
            borderColor: '#ffffff',
            borderWidth: 2,
            borderRadius: appDimensionValues.xxxxs,
        },
        cardUnfocussedStyle: {
            borderWidth: 0,
        },

        cardBackgroundStyle: {
            flex: selectDeviceType({ Tv: scale(10, 0) }, scale(5, 0)),
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
        },
        backgroundImageStyle: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
        },
        actorImageStyle: {
            width: '80%',
            height: '80%',
        },
        tamilActorImageStyle: {
            borderBottomRightRadius: appDimensionValues.xxs,
        },
        teluguActorImageStyle: {
            height: parentViewheight,
            borderBottomRightRadius: appDimensionValues.xxs,
        },
        tamilLetterStyle: {
            bottom: -20,
        }, //Todo -  need to change it later
        teluguStyle: {
            width: selectDeviceType({ Tablet: scale(300, 0) }, scale(180, 0)),
        },
    });
};
