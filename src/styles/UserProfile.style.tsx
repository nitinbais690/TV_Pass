import { StyleSheet, Platform } from 'react-native';
import { appFonts, appPadding, tvPixelSizeForLayout } from '../../AppStyles';

export const userProfileStyle = ({ appColors }: any) => {
    return StyleSheet.create({
        text_md_PV: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.md,
            marginVertical: appPadding.sm(true),
        },
        text_sm: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.sm,
            marginVertical: appPadding.sm(true),
        },
        text_xxs: {
            color: appColors.caption,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxs,
            marginVertical: 10,
            marginLeft: 20,
        },
        text_md: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
            marginBottom: appPadding.xs(true),
        },
        text_xxlg: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: Platform.isTV ? tvPixelSizeForLayout(75) : appFonts.xxlg,
            fontWeight: Platform.isTV ? '600' : undefined,
        },
        text_xlg_header: {
            color: appColors.brandTint,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xlg,
        },
        text_xlg: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xlg,
        },
        underline: {
            borderBottomColor: appColors.secondary,
            borderBottomWidth: 1,
            marginHorizontal: appPadding.lg(true),
        },
        slide: {
            flex: 0.78,
            justifyContent: 'center',
        },
        preview: {
            textAlign: 'center',
            marginTop: appPadding.sm(true),
        },
        button: {
            marginVertical: 30,
        },
        help: {
            flexDirection: 'row-reverse',
            marginLeft: appPadding.md(true),
        },
        marginLogo: {
            marginLeft: appPadding.md(true),
        },
        logoWrapper: {
            marginVertical: appPadding.xxs(true),
        },
        logo: {
            height: 60,
            width: 180,
        },
        carousal: {
            width: '100%',
            aspectRatio: 1,
        },
        carousalHeight: {
            width: '100%',
            aspectRatio: 1,
        },
        picker: {
            margin: appPadding.sm(true),
            padding: appPadding.sm(true),
            backgroundColor: appColors.secondary,
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: 'center',
            position: 'absolute',
            borderRadius: 10,
        },
    });
};
