import { scale, selectDeviceType } from 'qp-common-ui';
import { appDimensionValues, appFonts } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export const contentLanguageTemplateStyle = StyleSheet.create({

    otherLanguage: {
        fontSize:selectDeviceType({ Handset: scale(18, 0), Tv: scale(20, 0) }, scale(22, 0)),
        fontFamily: appFonts.primary,
        fontWeight: '400',
    },
    item: {
        marginBottom: selectDeviceType({ Handset: scale(10, 0) }, scale(12, 0)),
    },
});

export function appLanguageTemplateStyle(imageSize?: number) {
    return StyleSheet.create({

        languageTitleStyle: {
            marginTop: selectDeviceType({ Handset: scale(18, 0) }, scale(25, 0)),
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
        }
    });
}
