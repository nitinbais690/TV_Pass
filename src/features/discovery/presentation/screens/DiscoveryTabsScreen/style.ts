import { appDimensionValues, appFontStyle } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export const discoveryTabsStyles = StyleSheet.create({
    tabsStyle: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        elevation: 0,
        borderTopLeftRadius: appDimensionValues.xmd,
        borderTopRightRadius: appDimensionValues.xmd,
    },
    labelStyle: {
        ...appFontStyle.smallText1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: appDimensionValues.xxxxs,
    },
    tabLabelStyle: {
        ...appFontStyle.smallText1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: appDimensionValues.xxxxs,
    },
    tabIconStyle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
