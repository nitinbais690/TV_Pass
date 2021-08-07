import { Dimensions, Platform, StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { selectDeviceType, percentage, scale, createStyles, AspectRatio, padding } from 'qp-common-ui';
import { AppPreferencesContextProps } from './src/utils/AppPreferencesContext';

export function AppTheme(appPreferences: Partial<AppPreferencesContextProps>) {
    return {
        appContainerStyle: appContainerStyle(appPreferences),
        appDimensions: appDimensions,
        appPadding: appPadding,
        appColors: appColors(appPreferences.useDefaultStyle!),
        appBaseStyles: appBaseStyles(appPreferences),
        playerViewStyle: playerViewStyle(appPreferences),
        dropDownMenuStyle: dropDownMenuStyle(appPreferences),
        epgGuideViewStyle: epgGuideViewStyle(appPreferences),
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
    brandTint: '#E66625',
    brandTintLight: '#FF803F',
    brandTintDark: '#CD4D0C',
    brandTintTranslucent: '#E666254D',
    overlayText: '#fff',
    primary: '#E5E5E5',
    secondary: '#2D2D2D',
    tertiary: '#333333',
    caption: '#666',
    captionLight: '#999',
    backgroundGrey: '#D3D3D3',
    primaryVariant1: '#EEEEEE',
    primaryVariant2: '#BDBDBD',
    primaryVariant3: '#333333',
    primaryVariant4: '#666871',
    primaryVariant5: '#2D2D2D',
    primaryVariant6: '#101211',
    primaryVariant7: '#1A1D1E',
    border: '#434343',
    error: '#CA0519',
    success: '#2ea44f',
    warning: '#E6CF63',
    backgroundInactive: '#272727',
    backgroundInactiveSelected: '#0A0A0A',
    backgroundActive: '#414141',
    shadow: '#40000000',
};

const darkThemeColors = {
    brandTint: '#FF6D2E',
    brandTintLight: '#FF6D2E',
    brandTintDark: '#B61A09',
    brandTintTranslucent: '#572C1C',
    overlayText: '#ddd',
    background: '#0000',
    primary: '#202325',
    primaryEnd: '#7F7E86',
    secondary: '#FF6D2E',
    primaryTextColor: '#FFFFFF',
    secondaryTextColor: '#FFFFFF',
    tertiary: '#A8A8A8',
    caption: '#FFFFFF66',
    captionLight: '#FFFFFF4D',
    primaryVariant1: '#3B4046',
    primaryVariant2: '#2D3037',
    primaryVariant3: '#2f2f33',
    primaryVariant4: '#666871',
    primaryVariant5: '#2D2D2D',
    primaryVariant6: '#101211',
    primaryVariant7: '#1A1D1E',
    border: '#393E46',
    error: '#CA0519',
    success: '#2ea44f',
    warning: '#E6CF63',
    headerGradientStart: '#222124',
    headerGradientEnd: Platform.OS === 'android' ? '#1F1E20F2' : '#1F1E2080',
    bottomNavGradientStart: Platform.OS === 'android' ? '#0E0E0EF2' : '#0E0E0E80',
    bottomNavGradientEnd: '#0C0C0C',
    backgroundInactive: '#272727',
    backgroundInactiveSelected: '#0A0A0A',
    backgroundActive: '#414141',
    shadow: '#40000000',
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

export const appFonts = {
    xxs: selectDeviceType({ Handset: scale(12, 0) }, scale(14, 0)),
    xs: selectDeviceType({ Handset: scale(14, 0) }, scale(18, 0)),
    sm: selectDeviceType({ Handset: scale(16, 0) }, scale(20, 0)),
    md: selectDeviceType({ Handset: scale(18, 0) }, scale(22, 0)),
    lg: selectDeviceType({ Handset: scale(24, 0) }, scale(28, 0)),
    xlg: selectDeviceType({ Handset: scale(36, 0) }, scale(40, 0)),
    xxlg: selectDeviceType({ Handset: scale(40, 0) }, scale(44, 0)),
    xxxlg: scale(46, 0),
    headline: scale(70, 0),
    primary: 'ProximaNova-Regular',
    light: 'ProximaNova-Light',
    medium: 'ProximaNova-Regular',
    semibold: 'ProximaNova-Semibold',
    bold: 'ProximaNova-Black',
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

const dropDownMenuStyle = (appPreferences: Partial<AppPreferencesContextProps>) => {
    return StyleSheet.create({
        modalInsideView: {
            backgroundColor: appColors(appPreferences.useDefaultStyle!).primaryVariant1,
            height: '50%',
            width: selectDeviceType({ Handset: '80%' }, '40%'),
            borderRadius: 10,
        },
        modelContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        rootContainerStyle: {
            flexDirection: 'row',
            //   width: selectDeviceType({ Handset: 120 }, 160),
            backgroundColor: 'transparent',
            borderBottomWidth: 1,
            borderBottomColor: appColors(appPreferences.useDefaultStyle!).backgroundInactive,
        },
        dropDownOverlayStyle: {
            zIndex: 10,
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, .6)',
        },
        touchableContainerStyle: {
            flex: 1,
            height: undefined,
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: appPadding.sm(true),
            paddingVertical: 10,
            marginVertical: 0,
        },
        dropDownMenuButtonStyle: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center',
        },
        titleTextStyle: {
            color: appColors(appPreferences.useDefaultStyle!).secondary,
            fontSize: appFonts.sm,
            fontWeight: '500',
        },
        itemStyle: {
            flex: 1,
            height: undefined,
            width: appDimensions.fullWidth,
            justifyContent: 'center',
            backgroundColor: appColors(appPreferences.useDefaultStyle!).backgroundInactive,
        },
        itemSeparatorStyle: {
            flex: 1,
            backgroundColor: appColors(appPreferences.useDefaultStyle!).captionLight,
            marginLeft: 0,
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 0,
        },
        itemRowStyle: {
            flex: 1,
            flexDirection: 'row',
            paddingHorizontal: 40,
            alignItems: 'center',
            justifyContent: 'flex-start',
        },
        dropDownArrowStyle: {
            width: 10,
            height: 5,
            marginLeft: percentage(2, true),
        },
        itemTextStyle: {
            fontFamily: appFonts.primary,
            fontSize: appFonts.md,
            color: appColors(appPreferences.useDefaultStyle!).secondary,
            paddingVertical: selectDeviceType({ Handset: 10 }, 0),
        },
        closeButton: {
            marginHorizontal: selectDeviceType({ Handset: padding.sm(true) }, padding.xs(true)),
            paddingTop: selectDeviceType({ Handset: padding.sm(true) }, padding.xs(true)),
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            alignContent: 'flex-end',
        },
    });
};

const largeScreen = DeviceInfo.getDeviceType() !== 'Handset';
const scheduleHeight = largeScreen ? percentage(12, true) : percentage(22, true);
const epgBorderSize = StyleSheet.hairlineWidth;

const epgGuideViewStyle = (appPreferences: Partial<AppPreferencesContextProps>) => {
    const borderColor = appColors(appPreferences.useDefaultStyle!).primaryVariant3;

    return StyleSheet.create({
        rootContainerStyle: {
            // flex: 1,
            flexDirection: 'row',
            backgroundColor: 'transparent', //appColors(appPreferences.useDefaultStyle!).primary,
        },
        timeBarContainerStyle: {
            // flex: 1,
            flexDirection: 'row',
            height: 40,
            alignItems: 'flex-end',
            paddingBottom: 5,
            backgroundColor: appColors(appPreferences.useDefaultStyle!).primaryVariant5,
            zIndex: 10,
            borderColor: appColors(appPreferences.useDefaultStyle!).primaryEnd,
            borderBottomWidth: epgBorderSize,
        },
        channelViewStyle: {
            // flexShrink: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: scheduleHeight,
            borderColor: appColors(appPreferences.useDefaultStyle!).primaryEnd,
            marginTop: 0,
            borderRightWidth: 1,
            borderTopWidth: 0,
            borderLeftWidth: 0,
            borderBottomWidth: 1,
        },
        scheduleConatainerStyle: {
            // flex: 1,
        },
        scheduleViewStyle: {
            // flex: 4,
            flexDirection: 'column',
        },
        scheduleStyle: {
            backgroundColor: 'transparent',
        },
        scheduleItemStyle: {
            backgroundColor: 'transparent',
            alignContent: 'flex-start',
            alignItems: 'flex-start',
            height: scheduleHeight,
            // padding: percentage(2, true),
            marginTop: 0,
            marginRight: 0,
            marginLeft: 0,
            marginBottom: 0,
            borderColor: borderColor,
            borderRightWidth: epgBorderSize,
            borderTopWidth: 0,
            borderLeftWidth: 0,
            borderBottomWidth: epgBorderSize,
        },
        scheduleActiveItemStyle: {
            backgroundColor: 'transparent',
            alignContent: 'flex-start',
            alignItems: 'flex-start',
            height: scheduleHeight,
            // padding: percentage(2, true),
            marginTop: 0,
            marginRight: 0,
            marginLeft: 0,
            marginBottom: 0,
            borderColor: borderColor,
            borderRightWidth: epgBorderSize,
            borderTopWidth: 0,
            borderLeftWidth: 0,
            borderBottomWidth: epgBorderSize,
        },
        scheduleItemTextStyle: {
            color: appColors(appPreferences.useDefaultStyle!).tertiary,
            fontSize: appFonts.xs,
            fontFamily: appFonts.primary,
            fontWeight: '500',
            alignContent: 'center',
            alignItems: 'center',
            textTransform: 'capitalize',
        },
        scheduleItemSubtitleTextStyle: {
            color: appColors(appPreferences.useDefaultStyle!).captionLight,
            alignContent: 'center',
            alignItems: 'center',
            fontSize: appFonts.xxs,
            fontFamily: appFonts.light,
            marginTop: appPadding.xs(true),
        },
        channelItemStyle: {
            backgroundColor: 'transparent',
            height: scheduleHeight,
        },
        channelImageStyle: {},
        timeBarItemStyle: {
            width: 100,
            fontSize: appFonts.xs,
            color: appColors(appPreferences.useDefaultStyle!).tertiary,
        },
        progressStyle: {},
        nowTimelineIndicator: {
            left: -1,
            zIndex: 10,
            width: 1,
            height: 37,
            backgroundColor: appColors(appPreferences.useDefaultStyle!).brandTint,
            position: 'absolute',
            top: 0,
            bottom: 0,
        },
    });
};
