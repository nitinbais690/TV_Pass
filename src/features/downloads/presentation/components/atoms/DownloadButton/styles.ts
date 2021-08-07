import { StyleSheet } from 'react-native';
import { scale } from 'qp-common-ui';
import { appFonts, appFontStyle } from 'core/styles/AppStyles';
import { DownloadButtonProps } from '.';

export const ICON_SIZE = scale(20);

export const menuOptionsStyles = {
    optionsContainer: {
        backgroundColor: 'transparent',
    },
    optionsWrapper: {
        padding: 0,
    },
    optionWrapper: {
        padding: 0,
    },
};

export const DownloadButtonStyles = (props: DownloadButtonProps, appColors: any) => {
    return StyleSheet.create({
        containerStyle: {
            alignItems: 'center',
        },
        circle: {
            flex: 1,
            width: props.width,
            height: props.height,
            borderRadius: props.width / 2,
            shadowColor: appColors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: props.width / 2,
            elevation: 4,
            justifyContent: 'center',
            alignItems: 'center',
        },
        circleBorderless: {
            flex: 1,
            width: props.width,
            height: props.height,
            borderRadius: props.width / 2,
            justifyContent: 'center',
            alignItems: 'center',
        },
        downloadProgress: {},
        actionTextStyle: {
            color: '#ECECEC',
            marginTop: scale(8),
            fontSize: appFonts.xxxs,
            fontFamily: appFonts.primary,
            fontWeight: '600',
        },
        gradient: {
            borderRadius: scale(16, 0),
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        },
        popupListContainer: {
            paddingHorizontal: scale(16, 0),
            paddingVertical: scale(8, 0),
        },
        popupText: {
            ...appFontStyle.menuText,
            fontFamily: appFonts.semibold,
            color: appColors.secondary,
            flex: 1,
            justifyContent: 'center',
            paddingVertical: scale(12, 0),
        },
        popupAnchor: {
            backgroundColor: 'transparent',
            width: 0,
            height: 0,
        },
    });
};
