import { Dimensions, StyleSheet, PixelRatio } from 'react-native';
import { selectDeviceType, percentage, scale, createStyles, AspectRatio } from 'qp-common-ui';
import { AppPreferencesContextProps } from './src/utils/AppPreferencesContext';

export function AppTheme(appPreferences: Partial<AppPreferencesContextProps>) {
    return {
        appContainerStyle: appContainerStyle(appPreferences),
        appDimensions: appDimensions,
        appPadding: appPadding,
        appColors: appColors(appPreferences.useDefaultStyle!),
        appBaseStyles: appBaseStyles(appPreferences),
        playerViewStyle: playerViewStyle(appPreferences),
    };
}

export function mixin(base: any, overrides: any, shouldOverride: boolean): any {
    if (!shouldOverride) {
        return base;
    }
    return { ...base, ...overrides };
}

export const appDimensions = {
    fullHeight: Dimensions.get('window').height,
    fullWidth: Dimensions.get('window').width,
    cardRadius: 22,
    cardAspectRatio: AspectRatio._16by9,
    carouselAspectRatio: AspectRatio._16by9,
};

const lightThemeColors = {
    brandTint: '#558FCC',
    brandTintLight: '#76a5d6',
    brandTintDark: '#3979bd',
    brandTintDarked: '#686EFF',
    brandTintTranslucent: '#558FCC4D',
    overlayText: '#ddd',
    primary: '#ffffff',
    primaryLight: 'rgba(255, 255, 255, 0.5)',
    primaryMoreLight: 'rgba(255, 255, 255, 0.3)',
    secondary: '#111',
    tertiary: '#333333',
    caption: '#666',
    captionLight: '#999',
    backgroundGrey: '#D3D3D3',
    primaryVariant1: '#EEEEEE',
    primaryVariant2: '#BDBDBD',
    primaryVariant3: '#333333',
    primaryVariant4: '#666871',
    border: '#434343',
    error: '#CA0519',
    success: '#2ea44f',
    warning: '#E6CF63',
    iconBackgroundTv: '#9BADBE80',
    blueLight: 'rgba(155, 173, 190, 0.5)',
    blueMid: 'rgba(46, 66, 89, 0.5)',
};

const darkThemeColors = {
    brandTint: '#686EFF',
    brandTintLight: '#76a5d6',
    brandTintDark: '#3979bd',
    brandTintDarked: '#686EFF',
    brandTintTranslucent: '#558FCC4D',
    overlayText: '#ddd',
    background: '#000',
    primary: '#0C1021',
    primaryEnd: '#27384E',
    headerGradientStart: '#0D1122',
    headerGradientEnd: '#10162780',
    bottomNavGradientStart: '#25344A80',
    bottomNavGradientEnd: '#27384E',
    secondary: '#FFFFFF',
    primaryLight: 'rgba(255, 255, 255, 0.5)',
    primaryMoreLight: 'rgba(255, 255, 255, 0.3)',
    tertiary: '#9BADBE',
    caption: '#9BADBE80',
    captionLight: '#FFFFFF4D',
    primaryVariant1: '#2E4259',
    primaryVariant2: '#2E425980',
    primaryVariant3: '#434343',
    primaryVariant4: '#0C102180',
    primaryVariant5: '#43617C80',
    primaryVariant6: '#27384E80',
    border: '#2E4259',
    error: '#ba2d2d',
    success: '#2ea44f',
    warning: '#E6CF63',
    iconBackgroundTv: '#9BADBE80',
    blueLight: 'rgba(155, 173, 190, 0.5)',
    blueMid: 'rgba(46, 66, 89, 0.5)',
};

export const appColors = (useDefaultStyle: boolean) => {
    return useDefaultStyle ? lightThemeColors : darkThemeColors;
};

type PaddingMetric = <T extends boolean>(absoluteValue?: T | boolean) => T extends true ? number : string;

export const appPadding: { [key: string]: PaddingMetric } = {
    xxs: absoluteValue => percentage(1, absoluteValue),
    xs: absoluteValue => percentage(2, absoluteValue),
    sm: absoluteValue => percentage(4, absoluteValue),
    md: absoluteValue => percentage(6, absoluteValue),
    lg: absoluteValue => percentage(10, absoluteValue),
    xl: absoluteValue => percentage(12, absoluteValue),
    xxl: absoluteValue => percentage(14, absoluteValue),
    xxxl: absoluteValue => percentage(16, absoluteValue),
};

export const tvPixelSizeForLayout = (pixelSize: number) => {
    return Math.round((pixelSize * ((appDimensions.fullHeight * PixelRatio.get()) / 1080)) / PixelRatio.get());
};

export const appFonts = {
    xxxs: selectDeviceType({ Handset: scale(8, 0) }, scale(10, 0)),
    xxs: selectDeviceType({ Handset: scale(11, 0) }, scale(13, 0)),
    xs: selectDeviceType({ Handset: scale(14, 0) }, scale(18, 0)),
    sm: selectDeviceType({ Handset: scale(16, 0) }, scale(20, 0)),
    md: selectDeviceType({ Handset: scale(18, 0) }, scale(22, 0)),
    lg: selectDeviceType({ Handset: scale(20, 0) }, scale(24, 0)),
    xlg: selectDeviceType({ Handset: scale(22, 0) }, scale(26, 0)),
    xxlg: selectDeviceType({ Handset: scale(26, 0) }, scale(36, 0)),
    xxxlg: scale(34, 0),
    xxxxlg: scale(40, 0),
    headline: scale(70, 0),
    primary: 'Inter-Medium',
    light: 'Inter-Medium',
    medium: 'Inter-Medium',
    bold: 'Inter-SemiBold',
    semibold: 'Inter-SemiBold',
    boldtv: 'Inter-Bold',
    regular_tv: 'SF-Pro-Display-Regular',
    light_tv: 'SF-Pro-Display-Light',
    medium_tv: 'SF-Pro-Display-Medium',
    bold_tv: 'SF-Pro-Display-Bold',
    semibold_tv: 'SF-Pro-Display-Semibold',
    heavy_tv: 'SF-Pro-Display-Heavy',
    black_tv: 'SF-Pro-Display-Black',
    pro_text_tv: 'SF-Pro-Text-Regular',
};

export const appBaseStyles = (appPreferences: Partial<AppPreferencesContextProps>) => {
    return createStyles({
        container: {
            flex: 1,
            alignItems: 'center' as 'center',
            justifyContent: 'center' as 'center',
        },
        sectionHeader: {
            fontSize: appFonts.xs,
            fontFamily: appFonts.medium,
            fontWeight: undefined,
            paddingTop: appPadding.sm(),
            paddingLeft: 0,
            paddingBottom: selectDeviceType({ Handset: 10 }, 15),
            marginLeft: appPadding.sm(true),
            color: appColors(appPreferences.useDefaultStyle!).tertiary,
            textAlign: 'left',
            textTransform: 'capitalize',
        },
        loading: {
            position: 'absolute' as 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center' as 'center',
            justifyContent: 'center' as 'center',
        },
    });
};

const appContainerStyle = (appPreferences: Partial<AppPreferencesContextProps>) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: appColors(appPreferences.useDefaultStyle!).primary,
            flexDirection: 'column',
        },
        error: {
            height: '100%',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            textAlign: 'center',
            textAlignVertical: 'center',
        },
    });
};

const playerViewStyle = (appPreferences: Partial<AppPreferencesContextProps>) => {
    return StyleSheet.create({
        rootContainer: {
            flex: 1,
            alignItems: 'center',
            //justifyContent: 'center',
            backgroundColor: appColors(appPreferences.useDefaultStyle!).primary,
        },
    });
};
