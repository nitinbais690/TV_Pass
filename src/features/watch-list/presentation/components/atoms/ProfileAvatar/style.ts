import { StyleSheet } from 'react-native';
import { appFonts } from 'core/styles/AppStyles';
import { appFontStyle, scale, selectDeviceType } from 'qp-common-ui';

export const ProfileAvatarStyles = (appcolors: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
        },
        profileTitle: {
            ...appFontStyle.sublineText,
            fontFamily: appFonts.semibold,
            color: appcolors.secondary,
        },
        logo: {
            width: selectDeviceType({ Handset: scale(30, 0) }, scale(35, 0)),
            height: selectDeviceType({ Handset: scale(30, 0) }, scale(35, 0)),
            marginRight: selectDeviceType({ Handset: scale(8, 0) }, scale(12, 0)),
        },
    });
};
