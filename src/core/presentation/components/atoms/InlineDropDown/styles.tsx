import { StyleSheet } from 'react-native';
import { scale } from 'qp-common-ui';
import { appFonts, isTablet } from 'core/styles/AppStyles';

export const DropDownOptionViewStyles = (appColors: any) => {
    const width = isTablet ? scale(145) : scale(118);
    const height = isTablet ? scale(45) : scale(40);
    const popupMarginBottom = isTablet ? scale(69) : scale(64);
    return StyleSheet.create({
        button: {
            marginHorizontal: scale(16),
            width: scale(width),
            height: scale(height),
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            marginVertical: scale(16),
            borderRadius: scale(8),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            ...(isTablet ? { paddingHorizontal: scale(12) } : { paddingHorizontal: scale(16) }),
        },
        buttonContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
        },
        buttonImage: {
            top: scale(1),
            ...(isTablet
                ? {
                      width: scale(27),
                      height: scale(27),
                  }
                : {
                      width: scale(24),
                      height: scale(24),
                  }),
        },
        buttonText: {
            color: '#FFFFFF',
            fontSize: appFonts.xs,
            fontWeight: '600',
            marginEnd: scale(8),
        },
        popup: {
            position: 'absolute',
            justifyContent: 'center',
            marginTop: scale(popupMarginBottom),
            marginHorizontal: scale(16),
            paddingVertical: scale(7),
            width: scale(width),
            maxHeight: scale(150),
            borderRadius: scale(16),
            zIndex: 101,
            shadowColor: appColors.shadow,
            shadowOffset: { width: 0, height: scale(2.7) },
            shadowRadius: scale(16),
            elevation: scale(3),
        },
        gradient: {
            borderRadius: scale(16),
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        },
        popupText: {
            color: 'white',
            fontSize: appFonts.xs,
            fontWeight: '600',
            flex: 1,
            textAlign: 'center',
            justifyContent: 'center',
            padding: scale(8),
        },
    });
};
