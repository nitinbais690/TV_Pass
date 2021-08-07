import { typography } from 'qp-common-ui';
import { appDimensions, appFontStyle, appPaddingValues } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export const playerScreenStyles = (appColors: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 1)',
            flexDirection: 'column',
        },
        textWrapperStyle: {
            flex: 1,
            alignSelf: 'stretch',
            flexGrow: 1,
            margin: appPaddingValues.xs,
        },
        infoContainerStyle: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        titleContainerStyle: {
            flex: 1,
            flexDirection: 'column',
        },
        titleStyle: {
            ...typography.title,
            color: appColors.secondary,
            marginTop: appPaddingValues.xs,
            marginLeft: appPaddingValues.xs,
            marginRight: appPaddingValues.xs,
        },
        infoTextStyle: {
            ...typography.body,
            color: appColors.tertiary,
            flexWrap: 'wrap',
            marginTop: appPaddingValues.xs,
            marginLeft: appPaddingValues.xs,
            marginRight: appPaddingValues.xs,
            marginBottom: appPaddingValues.xs,
        },
        potraitControlsContainerBackground: {
            width: appDimensions.fullWidth,
            height: (appDimensions.fullWidth * 9) / 16,
            backgroundColor: appColors.primary,
            position: 'absolute',
            opacity: 0.5,
        },
        landscapeControlsContainerBackground: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            alignSelf: 'flex-end',
            backgroundColor: appColors.primary,
            opacity: 0.5,
        },
        selectionContainerStyle: {
            height: appDimensions.fullHeight - (appDimensions.fullWidth * 9) / 16,
            alignItems: 'flex-start',
            backgroundColor: appColors.primary,
        },
        buttonText: {
            color: appColors.secondary,
            ...appFontStyle.buttonText,
            alignSelf: 'center',
        },
        captionText: {
            color: appColors.secondary,
            ...appFontStyle.buttonText,
            alignSelf: 'center',
        },
        headingText: {
            color: appColors.caption,
            ...appFontStyle.buttonText,
            alignSelf: 'center',
            marginTop: appPaddingValues.sm,
        },
        selectedButtonStyle: {
            height: 45,
            width: 100,
            backgroundColor: appColors.brandTint,
            marginTop: appPaddingValues.sm,
            alignSelf: 'center',
            justifyContent: 'center',
        },
        unselectedButtonStyle: {
            height: 45,
            width: 150,
            backgroundColor: appColors.primaryVariant1,
            marginTop: appPaddingValues.sm,
            alignSelf: 'center',
            justifyContent: 'center',
            opacity: 1,
        },
        close: {
            position: 'absolute',
            top: '5%',
            right: '5%',
            alignSelf: 'flex-end',
        },
    });
};
