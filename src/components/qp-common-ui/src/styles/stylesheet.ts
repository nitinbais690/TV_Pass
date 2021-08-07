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
    _18by12 = 18 / 12,
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
            case '18x12':
                return AspectRatio._18by12;
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
            case AspectRatio._18by12:
                return '18x12';
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
    brandTint: '#686EFF',
    brandTintLight: '#76a5d6',
    brandTintDark: '#3979bd',
    brandTintTranslucent: '#558FCC4D',
    overlayText: '#fff',
    primary: '#ffffff',
    secondary: '#111',
    tertiary: '#333333',
    caption: '#666',
    captionLight: '#999',
    captionMedium: '#9BADBE',
    backgroundGrey: '#D3D3D3',
    backgroundVariant1: '#2E425980',
    backgroundInactive: '#EEEEEE',
    backgroundInactiveSelected: '#BDBDBD',
    backgroundActive: '#FFFFFF',
    borderLineColor: '#2E4259',
    primaryVariant1: '#0C1021',
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

export const fonts = {
    xxs: selectDeviceType({ Handset: scale(11, 0) }, scale(12, 0.2)),
    xs: selectDeviceType({ Handset: scale(14, 0) }, scale(18, 0)),
    sm: selectDeviceType({ Handset: scale(16, 0) }, scale(20, 0)),
    md: selectDeviceType({ Handset: scale(18, 0) }, scale(22, 0)),
    lg: selectDeviceType({ Handset: scale(20, 0) }, scale(24, 0)),
    xlg: selectDeviceType({ Handset: scale(22, 0) }, scale(26, 0)),
    xxlg: scale(28, 0),
    xxxlg: scale(34, 0),
    headline: scale(70, 0),
    primary: 'Inter-Regular',
    light: 'Inter-Light',
    medium: 'Inter-Medium',
    bold: 'Inter-Bold',
    semibold: 'Inter-SemiBold',
};
