import { StyleSheet } from 'react-native';
import { appDimensionValues } from 'core/styles/AppStyles';
import { appFlexStyles } from 'core/styles/FlexStyles';

export function downloadsTemplateStyle() {
    return StyleSheet.create({
        mainContainer: {
            ...appFlexStyles.flexColumnFill,
        },
        loaderStyle: {
            position: 'absolute',
            alignSelf: 'center',
            justifyContent: 'center',
            bottom: 0,
            top: 0,
        },
        storageWrapper: {
            marginTop: appDimensionValues.lg,
        },
        listWrapper: {
            marginTop: appDimensionValues.lg,
        },
    });
}
