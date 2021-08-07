import { StyleSheet, Dimensions, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { percentage, scale, selectDeviceType } from './responsiveUtils';

export type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };
export const USE_ABSOLUTE_VALUE = true;

const mixin = (base: NamedStyles<any>, overrides: NamedStyles<any>): NamedStyles<any> => {
    return { ...base, ...overrides };
};

export function createStyles(baseStyles: NamedStyles<any> = {}, overrides: NamedStyles<any> = {}): NamedStyles<any> {
    return StyleSheet.create(mixin(baseStyles, overrides));
}

export enum AspectRatio {
    _1by1 = 1,
    _2by3 = 2 / 3,
    _3by4 = 3 / 4,
    _3by1 = 3 / 1,
    _16by9 = 16 / 9,
}

export class AspectRatioUtil {
    public static fromString = (aspectRatio: string): AspectRatio => {
        switch (aspectRatio) {
            case '1x1':
                return AspectRatio._1by1;
            case '2x3':
                return AspectRatio._2by3;
            case '4x3':
                return AspectRatio._3by4;
            case '3x1':
                return AspectRatio._3by1;
            case '16x9':
                return AspectRatio._16by9;
            default:
                return AspectRatio._1by1;
        }
    };

    public static asString = (aspectRatio: AspectRatio): string => {
        switch (aspectRatio) {
            case AspectRatio._1by1:
                return '1x1';
            case AspectRatio._2by3:
                return '2x3';
            case AspectRatio._3by4:
                return '4x3';
            case AspectRatio._3by1:
                return '3x1';
            case AspectRatio._16by9:
                return '16x9';
            default:
                return 'Unknown';
        }
    };
}

export enum ImageType {
    Poster = 0,
    Cover = 1,
    Banner = 2,
    Logo = 3,
    LogoSponsor = 4,
    LogoHeader = 5,
    Background = 6,
}

export class ImageTypeUtil {
    public static asString = (imageType: ImageType): string => {
        switch (imageType) {
            case ImageType.Poster:
                return '0';
            case ImageType.Cover:
                return '1';
            case ImageType.Banner:
                return '2';
            default:
                return '3';
        }
    };
}

export const constants = {
    catalogCardsPreview: selectDeviceType<number>({ Tv: 5, Tablet: 4 }, 2),
};

export const dimensions = {
    fullHeight: Dimensions.get('window').height,
    fullWidth: Dimensions.get('window').width,
    cardRadius: 0,
    cardAspectRatio: AspectRatio._16by9,
    cardImageType: ImageType.Poster,
    carouselAspectRatio: selectDeviceType<number>(
        { Tv: AspectRatio._16by9, Tablet: AspectRatio._16by9 },
        AspectRatio._16by9,
    ),
    epgOverlayImageWidth: '96%',
    epgOverlayImageHeight: '30%',
    epgOverlayImageHeightTV: '40%',
};

export const colors = {
    brandTint: '#FE6E2E',
    brandTintLight: '#FF6D2E',
    brandTintDark: '#B61A09',
    brandTintTranslucent: '#FE6E2E4D',
    overlayText: '#fff',
    secondary: '#111',
    primary: '#ffffff',
    primaryEnd: '#131313',
    tertiary: '#333333',
    caption: '#666',
    captionLight: '#999',
    greyText: '#7F7E86',
    backgroundGrey: '#D3D3D3',
    backgroundInactive: '#2D2D2D',
    backgroundInactiveSelected: '#0A0A0A',
    backgroundActive: '#393E46',
    primaryVariant1: '#262629',
    transparent: '#00000000',
    black: '#000000',
};

export const secondaryColors = ['#46ABAD', '#F0A46B', '#C90619', '#E5D063', '#FB5A33'];

type PaddingMetric = <T extends boolean>(absoluteValue?: T | boolean) => T extends true ? number : string;

export const padding: { [key: string]: PaddingMetric } = {
    xxs: absoluteValue => percentage(1, absoluteValue),
    xs: absoluteValue => percentage(2, absoluteValue),
    sm: absoluteValue => percentage(4, absoluteValue),
    md: absoluteValue => percentage(8, absoluteValue),
    lg: absoluteValue => percentage(10, absoluteValue),
};

export const dimentionsValues = {
    xxxxxs: selectDeviceType({ Handset: scale(2, 0) }, scale(4, 0)),
    xxxxs: selectDeviceType({ Handset: scale(4, 0) }, scale(6, 0)),
    xxxs: selectDeviceType({ Handset: scale(8, 0) }, scale(10, 0)),
    xxs: selectDeviceType({ Handset: scale(12, 0) }, scale(14, 0)),
    xs: selectDeviceType({ Handset: scale(14, 0) }, scale(18, 0)),
    sm: selectDeviceType({ Handset: scale(16, 0) }, scale(20, 0)),
    md: selectDeviceType({ Handset: scale(18, 0) }, scale(22, 0)),
    xmd: selectDeviceType({ Handset: scale(20, 0) }, scale(24, 0)),
    lg: selectDeviceType({ Handset: scale(24, 0) }, scale(28, 0)),
    mlg: selectDeviceType({ Handset: scale(26, 0) }, scale(30, 0)),
    xlg: selectDeviceType({ Handset: scale(30, 0) }, scale(34, 0)),
    xxlg: selectDeviceType({ Handset: scale(32, 0) }, scale(36, 0)),
    xxxlg: selectDeviceType({ Handset: scale(36, 0) }, scale(40, 0)),
    xxxxlg: selectDeviceType({ Handset: scale(40, 0) }, scale(44, 0)),
    xxxxxlg: selectDeviceType({ Handset: scale(48, 0) }, scale(52, 0)),
    xxxxxxlg: selectDeviceType({ Handset: scale(52, 0) }, scale(56, 0)),
};

export const appPaddingValues = {
    xxxxxs: selectDeviceType({ Handset: scale(2, 0) }, scale(4, 0)),
    xxxxs: selectDeviceType({ Handset: scale(4, 0) }, scale(6, 0)),
    xxxs: selectDeviceType({ Handset: scale(8, 0) }, scale(10, 0)),
    xxs: selectDeviceType({ Handset: scale(12, 0) }, scale(14, 0)),
    xs: selectDeviceType({ Handset: scale(14, 0) }, scale(18, 0)),
    sm: selectDeviceType({ Handset: scale(16, 0) }, scale(20, 0)),
    md: selectDeviceType({ Handset: scale(18, 0) }, scale(22, 0)),
    xmd: selectDeviceType({ Handset: scale(20, 0) }, scale(24, 0)),
    lg: selectDeviceType({ Handset: scale(24, 0) }, scale(28, 0)),
    xlg: selectDeviceType({ Handset: scale(30, 0) }, scale(34, 0)),
    xxlg: selectDeviceType({ Handset: scale(32, 0) }, scale(36, 0)),
    xxxlg: selectDeviceType({ Handset: scale(40, 0) }, scale(44, 0)),
    xxxxxlg: selectDeviceType({ Handset: scale(54, 0) }, scale(58, 0)),
};

export const fonts = {
    xxs: selectDeviceType({ Handset: scale(12, 0) }, scale(14, 0.2)),
    xs: selectDeviceType({ Handset: scale(14, 0) }, scale(18, 0)),
    sm: selectDeviceType({ Handset: scale(16, 0) }, scale(20, 0)),
    md: selectDeviceType({ Handset: scale(18, 0) }, scale(22, 0)),
    lg: selectDeviceType({ Handset: scale(20, 0) }, scale(24, 0)),
    xlg: selectDeviceType({ Handset: scale(22, 0) }, scale(26, 0)),
    xxlg: scale(28, 0),
    xxxlg: scale(34, 0),
    headline: scale(70, 0),
    primary: 'ProximaNova-Regular',
    light: 'ProximaNova-Light',
    medium: 'ProximaNova-Regular',
    semibold: 'ProximaNova-Semibold',
    bold: 'ProximaNova-Black',
};

export const appFontStyle = StyleSheet.create({
    header1: {
        fontSize: fonts.xxlg,
        fontFamily: fonts.bold,
        fontWeight: '900',
    },
    header2: {
        fontSize: fonts.xlg,
        fontFamily: fonts.bold,
        fontWeight: '900',
    },
    header3: {
        fontSize: fonts.lg,
        fontFamily: fonts.medium,
        fontWeight: 'normal',
    },
    body: {
        fontSize: fonts.lg,
        fontFamily: fonts.semibold,
        fontWeight: '600',
    },
    body1: {
        fontSize: fonts.md,
        fontFamily: fonts.semibold,
        fontWeight: '600',
    },
    body2: {
        fontSize: fonts.sm,
        fontFamily: fonts.semibold,
        fontWeight: '600',
    },
    body3: {
        fontSize: fonts.xs,
        fontFamily: fonts.semibold,
        fontWeight: '600',
    },
    sublineText: {
        fontSize: fonts.xxs,
        fontFamily: fonts.semibold,
        fontWeight: '600',
    },
    subTitle: {
        fontSize: fonts.md,
        fontFamily: fonts.primary,
        fontWeight: '600',
    },
    menuText: {
        fontSize: fonts.xs,
        fontFamily: fonts.primary,
        fontWeight: '600',
    },
    buttonText: {
        fontSize: fonts.xs,
        fontFamily: fonts.primary,
        fontWeight: '600',
    },
});

export const appFlexStyles = StyleSheet.create({
    flexRow: {
        flexDirection: 'row',
    },
});
