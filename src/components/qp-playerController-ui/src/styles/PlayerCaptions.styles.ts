import { defaultFont, dimensions, dimentionsValues, fonts } from 'qp-common-ui';
import { StyleSheet } from 'react-native';

export const styles = (colors: any) => {
    return StyleSheet.create({
        rootContainer: {
            position: 'absolute',
        },
        landscaperootContainer: {
            flex: 1,
            flexDirection: 'row-reverse',
            width: '100%',
            height: '100%',
            position: 'absolute',
        },
        potraitControlsContainer: {
            width: dimensions.fullWidth,
            height: (dimensions.fullWidth * 9) / 16,
        },
        potraitControlsContainerBackground: {
            width: dimensions.fullWidth,
            height: (dimensions.fullWidth * 9) / 16,
            backgroundColor: colors.secondary,
            position: 'absolute',
            opacity: 0.5,
        },
        landscapeControlsContainer: {
            width: '100%',
            height: '100%',
            alignSelf: 'flex-end',
        },
        landscapeControlsContainerBackground: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            alignSelf: 'flex-end',
            backgroundColor: colors.secondary,
            opacity: 0.5,
        },
        reducedLandscapeControlsContainer: {
            width: '40%',
            height: '100%',
            alignSelf: 'flex-end',
        },
        selectionContainerStyle: {
            height: dimensions.fullHeight - (dimensions.fullWidth * 9) / 16,
            alignItems: 'flex-start',
            backgroundColor: colors.primary,
        },
        landscapeSelectionContainer: {
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
        },
        selectionContainerWrapper: {
            flexDirection: 'column',
        },
        landscapeSelectionContainerWrapper: {
            flexDirection: 'row',
        },
        languageContainer: {
            flex: 1,
            marginTop: dimentionsValues.xxxs,
        },
        captionContainer: {
            flex: 1,
            marginTop: dimentionsValues.xxxs,
        },
        qualityContainer: {
            flex: 1,
            width: dimensions.fullWidth,
            marginTop: dimentionsValues.xxxs,
        },
        iconContainer: {
            alignItems: 'center',
        },
        closeContainer: {
            alignItems: 'flex-end',
            zIndex: 1,
        },
        centerIconsContainer: {
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            height: '100%',
            position: 'absolute',
        },
        centerIcons: {
            width: '70%',
            flexDirection: 'row',
            justifyContent: 'space-around',
        },
        captionIcon: {
            marginLeft: dimentionsValues.lg,
        },
        qualityIcon: {
            marginRight: dimentionsValues.lg,
        },
        buttonTextContainer: {
            flexDirection: 'row',
            alignSelf: 'center',
            marginBottom: 5,
        },
        buttonText: {
            color: colors.primary,
            fontFamily: defaultFont.bold,
            alignSelf: 'center',
        },
        captionText: {
            color: colors.primary,
            fontFamily: defaultFont.bold,
            alignSelf: 'center',
            fontSize: fonts.xs,
        },
        headingText: {
            color: colors.backgroundGrey,
            fontFamily: defaultFont.bold,
            alignSelf: 'center',
            marginTop: dimentionsValues.sm,
        },
        tickStyle: {
            marginRight: dimentionsValues.sm,
        },
        selectedButtonStyle: {
            height: 45,
            width: 100,
            backgroundColor: colors.brandTint,
            marginTop: dimentionsValues.sm,
            alignSelf: 'center',
            justifyContent: 'center',
        },
        unselectedButtonStyle: {
            height: 45,
            width: 150,
            backgroundColor: colors.tertiary,
            marginTop: dimentionsValues.sm,
            alignSelf: 'center',
            justifyContent: 'center',
            opacity: 1,
        },
        itemSeparatorStyle: {
            backgroundColor: colors.caption,
            bottom: 0,
            left: 0,
            width: dimensions.fullWidth,
            height: 1,
            opacity: 0.1,
        },
        ScrollViewStyle: {
            alignSelf: 'center',
        },
    });
};
