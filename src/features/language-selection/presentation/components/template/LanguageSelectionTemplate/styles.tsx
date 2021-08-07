import { scale, selectDeviceType } from 'qp-common-ui';
import { appDimensionValues, appFonts, appPaddingValues, percentageOfHeight, isTablet } from 'core/styles/AppStyles';
import { StyleSheet, Platform } from 'react-native';

export const contentLanguageTemplateStyle = StyleSheet.create({
    parent: {
        flex: 1,
        marginTop: Platform.isTV ? percentageOfHeight(15, true): percentageOfHeight(10, true),
        marginBottom: Platform.isTV ? scale(40, 0) : scale(24, 0),
        ...(isTablet
            ? { marginHorizontal: '12%' }
            : Platform.isTV
            ? { marginHorizontal: '24%' }
            : { marginHorizontal: scale(24, 0) }),
        justifyContent: 'space-between',
    },
    listStyle: {
        marginTop: appDimensionValues.xmd,
    },
    otherLanguage: {
        fontSize: appFonts.md,
        fontFamily: appFonts.primary,
        fontWeight: '400',
    },
    item: {
        marginBottom: selectDeviceType({ Handset: scale(10, 0) }, scale(12, 0)),
    },
    title: {
        padding: appPaddingValues.xxxs,
    },
    nextButton: {
        alignSelf: selectDeviceType({ Handset: 'flex-end' }, 'center'),
        width: selectDeviceType({ Handset: scale(142, 0), Tv: scale(188,0) }, scale(196, 0)),
    },
    buttonTV: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    actorImageStyle: { width: '80%', height: '100%' },
});

export function appLanguageTemplateStyle(imageSize?: number) {
    return StyleSheet.create({
        parent: {
            flex: 1,
            marginTop: percentageOfHeight(10, true),
            margin: appDimensionValues.lg,
        },
        languageTitleStyle: {
            marginTop: selectDeviceType({ Handset: scale(18, 0) }, scale(38, 0)),
            marginBottom: appDimensionValues.xmd,
        },
        languageFirstTitleStyle: {
            marginBottom: appDimensionValues.xmd,
        },
        contentLanguageTitleStyle: {
            marginBottom: selectDeviceType({ Tablet: appDimensionValues.lg }, appDimensionValues.xmd),
        },
        item: {
            marginVertical: appDimensionValues.xxs,
            borderRadius: selectDeviceType({ Handset: scale(10, 0) }, scale(12, 0)),
        },
        appLanguageItem: {
            marginVertical: appDimensionValues.xxs,
            borderRadius: selectDeviceType({ Handset: scale(10, 0) }, scale(12, 0)),
        },
        title: {
            padding: appPaddingValues.xxxs,
        },

        backButtonStyle: {
            flex: 1,
        },
        proceedButtonStyle: {
            flex: 1,
        },
        actorImageStyle: { height: imageSize, width: imageSize },
        bottomBtnViewStyle: { flexDirection: 'row', width: '100%', flex: 2, justifyContent: 'space-evenly' },
    });
}
