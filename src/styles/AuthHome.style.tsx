import React from 'react';
import { StyleSheet, View } from 'react-native';
import { selectDeviceType } from 'qp-common-ui';
import { appDimensions, appFonts, appPadding } from '../../AppStyles';
import { BrandLogo } from '../screens/components/BrandLogo';
import CreditsIcon from '../../assets/images/brand_symbol.svg';

export const carouselSlidePadding = 0;

export const authStackScreenOptions = () => ({
    headerTransparent: true,
    headerTitle: () => (
        <View style={{ flexDirection: 'row' }}>
            <CreditsIcon width={20} height={selectDeviceType({ Handset: 18 }, 28)} />
            <View style={{ marginRight: 7 }} />
            <BrandLogo />
        </View>
    ),
    headerStyle: {
        shadowColor: 'transparent',
        shadowOffset: { height: 0, width: 0 },
        borderBottomWidth: 0,
        shadowOpacity: 0,
        borderBottomColor: 'transparent',
    },
});

export const authHomeStyle = ({ appColors, isPortrait }: { appColors: any; isPortrait?: boolean }) => {
    return StyleSheet.create({
        container: {
            marginHorizontal: selectDeviceType(
                { Tablet: isPortrait ? appPadding.md(true) : '25%' },
                appPadding.md(true),
            ),
            marginVertical: isPortrait ? 10 : 0,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        mainTextContainer: {},
        titleText: {
            color: appColors.brandTint,
        },
        mainText: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
        },
        caption: {
            color: appColors.caption,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxs,
            marginHorizontal: appPadding.xxs(true),
        },
        largeText: {
            color: appColors.secondary,
            fontSize: appFonts.xxlg,
            fontFamily: appFonts.light,
            textAlign: 'left',
        },
        carouselWrapper: {
            aspectRatio: 16 / 9,
            width: '100%',
            flexShrink: 1,
            borderRadius: appDimensions.cardRadius,
            overflow: 'hidden',
            marginHorizontal: selectDeviceType(
                { Tablet: isPortrait ? appPadding.md(true) : '25%' },
                appPadding.md(true),
            ),
        },
        slide: {
            borderRadius: appDimensions.cardRadius,
            paddingHorizontal: carouselSlidePadding,
        },
        button: {
            marginTop: 40,
        },
        previewButton: {
            marginTop: 10,
        },
        buttonWrapper: {
            alignSelf: selectDeviceType({ Tablet: 'center' }, 'stretch'),
            width: selectDeviceType({ Tablet: 300 }, undefined),
            marginBottom: 25,
        },
        help: {
            // marginHorizontal: appPadding.sm(true),
        },
        carousal: {
            aspectRatio: 16 / 9,
            backgroundColor: appColors.primaryVariant1,
            borderRadius: appDimensions.cardRadius,
        },
        indicatorStyle: {
            marginVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        dotStyle: {
            width: 6,
            height: 6,
            borderRadius: 6,
            backgroundColor: '#FFFFFF4A',
            marginHorizontal: 6,
        },
        activeDotStyle: {
            width: 10,
            height: 10,
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
            marginHorizontal: 5,
        },
        footer: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 50,
        },
    });
};
