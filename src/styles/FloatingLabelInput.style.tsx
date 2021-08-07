import { StyleSheet, Platform } from 'react-native';
import { appFonts, tvPixelSizeForLayout } from '../../AppStyles';

export const FloatingLabelInputStyle = ({ appColors, appPadding, isFocused }: any) => {
    return StyleSheet.create({
        container: {
            borderWidth: 2,
            borderColor: isFocused ? appColors.brandTint : 'transparent',
            height: Platform.isTV ? tvPixelSizeForLayout(100) : 55,
            alignItems: 'flex-end',
        },
        hintContainer: {
            paddingTop: appPadding.xs(),
            paddingLeft: appPadding.sm(),
            width: '100%',
        },
        textHint: {
            color: appColors.tertiary,
        },
        errorMessageText: {
            color: appColors.error,
        },
        labelStyle: {
            color: appColors.caption,
            position: 'absolute',
            left: 12,
            fontFamily: appFonts.primary,
            backgroundColor: 'transparent',
        },
        passEyeView: {
            alignSelf: 'center',
            marginRight: 10,
        },
        inputTextContainer: {
            flex: 1,
        },
        inputText: {
            padding: 0,
            paddingLeft: appPadding.sm(),
            alignItems: 'flex-end',
            backgroundColor: 'transparent',
        },
    });
};
