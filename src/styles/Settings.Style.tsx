import { StyleSheet } from 'react-native';
import { selectDeviceType } from 'qp-common-ui';
import { appFonts, appPadding } from '../../AppStyles';

export const settingStyle = ({ appColors, isPortrait }: { appColors: any; isPortrait?: boolean }) => {
    return StyleSheet.create({
        // Common Setting Style
        mainContainer_mv: {
            marginVertical: isPortrait ? 10 : 0,
        },
        profileContainer_mh: {
            marginHorizontal: selectDeviceType({ Tablet: isPortrait ? '20%' : '25%' }, '0%'),
        },
        mainContainer_mh: {},

        // Preference Page
        container: {
            marginHorizontal: appPadding.sm(true),
        },
        margin_sm: {
            marginRight: 20,
        },
        margin_h: {
            marginHorizontal: appPadding.sm(true),
        },
        margin_v: {
            marginVertical: appPadding.sm(true),
        },
        margin_toggle: {},
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: appPadding.md(true),
        },
        row_center: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: appPadding.md(true),
            paddingRight: appPadding.sm(true),
        },
        row_between: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: appColors.primaryVariant2,
            height: selectDeviceType({ Handset: 70 }, 100),
            right: 0,
        },
        row_between_container: {
            width: '80%',
            flexGrow: 1,
        },
        row_between_noColor: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: selectDeviceType({ Handset: 70 }, 100),
        },
        borderTop: {
            borderTopWidth: StyleSheet.hairlineWidth,
            borderColor: appColors.border,
        },
        marginTop: {
            marginTop: 26,
        },
        pageMarginTop: {
            marginTop: appPadding.md(true),
        },
        borderBottom: {
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: appColors.border,
        },
        text_md_lg: {
            color: appColors.tertiary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
            marginBottom: 14,
        },
        text_md_sm: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
        },
        text_md_xs: {
            color: appColors.caption,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
        },
        text_md_xxs: {
            color: appColors.caption,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxs,
        },
        top_Underline: {
            borderBottomColor: appColors.border,
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginVertical: appPadding.md(true),
        },
        top_Underline_sm: {
            borderBottomColor: appColors.border,
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginVertical: appPadding.sm(true),
        },
        toggle: {
            marginRight: 20,
        },
        qpCont: {
            paddingVertical: 20,
            width: '80%',
        },
        qpOverlay: {
            paddingHorizontal: selectDeviceType({ Tablet: isPortrait ? '25%' : '30%' }, '5%'),
            justifyContent: 'flex-end',
        },
        qpText: {
            marginRight: appPadding.xs(),
            color: appColors.tertiary,
            fontFamily: appFonts.semibold,
        },
        FD_row_spaceB: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        fullWidth: {
            marginHorizontal: appPadding.sm(true),
        },
        button: {
            borderRadius: 10,
        },
        paddingTop: {
            paddingTop: appPadding.xs(),
        },

        // Profile Page
        image: {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: appColors.primaryVariant1,
            flex: 0.3,
            aspectRatio: 1,
            borderRadius: 100,
            borderWidth: StyleSheet.hairlineWidth,
        },
        image_banner: {
            marginLeft: 20,
            justifyContent: 'center',
            flex: 0.7,
        },
        profile_header: {
            flexDirection: 'row',
            marginTop: appPadding.xs(true),
            alignItems: 'center',
            justifyContent: 'flex-start',
        },
        center: {
            textAlign: 'center',
            color: appColors.secondary,
            fontSize: appFonts.xxxlg,
            fontFamily: appFonts.medium,
        },
        formSpacing: {
            marginBottom: 40,
        },

        //Main Page
        padding_twenty: {
            padding: appPadding.md(true),
        },

        //Billing & Payment Page
        mainText: {
            fontSize: appFonts.xs,
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            lineHeight: appPadding.md(true),
        },
        subText: {
            fontSize: appFonts.xs,
            color: appColors.captionLight,
            fontFamily: appFonts.primary,
            lineHeight: 22,
        },
        active_inactive: {
            marginTop: appPadding.lg(true),
            marginLeft: appPadding.xxs(true),
            fontSize: appFonts.md,
            color: appColors.secondary,
            fontFamily: appFonts.primary,
        },
        active: {
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6,
            paddingVertical: 4,
            paddingHorizontal: 8,
        },
        activeColor: {
            backgroundColor: appColors.brandTint,
        },
        inactiveColor: {
            backgroundColor: appColors.error,
        },
        activeText: {
            color: appColors.secondary,
            fontSize: appFonts.xs,
            fontWeight: '500',
        },
        brandColor: {
            backgroundColor: appColors.brandTint,
        },

        brandColorDisable: {
            backgroundColor: appColors.brandTint,
            opacity: 0.5,
        },

        // Manage Devices
        text_manageD: {
            color: appColors.secondary,
            fontFamily: appFonts.bold,
            fontSize: appFonts.xs,
            marginHorizontal: appPadding.sm(true),
        },
        text_manage_light: {
            color: appColors.caption,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxs,
            marginHorizontal: appPadding.sm(true),
            marginTop: 2,
        },
        manageContainer: {
            height: selectDeviceType({ Handset: 70 }, 100),
            justifyContent: 'center',
        },
        buttonCover: {
            color: appColors.tertiary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxs,
            marginHorizontal: 20,
            alignSelf: 'center',
        },
        // the below styles should be static
        containerHeight: {
            height: selectDeviceType({ Handset: 70 }, 100),
        },
        removeButtonContainer: {
            marginRight: 20,
            color: appColors.brandTint,
        },
        removeButton: {
            paddingHorizontal: 15,
            paddingVertical: 6,
            borderRadius: 5,
            backgroundColor: appColors.brandTint,
            minWidth: 120,
        },
    });
};
