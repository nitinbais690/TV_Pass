import { scale, selectDeviceType } from 'qp-common-ui';
import { appFonts, appPaddingValues } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';
import { Route } from 'react-native-tab-view';
import { HeaderTabBarProps } from '.';

export const LANGUAGE_ICON_SIZE = selectDeviceType({ Handset: scale(21) }, scale(36, 0));
export const NOTIFICATION_ICON_SIZE = selectDeviceType({ Handset: scale(18) }, scale(27, 0));

const DEFAULT_CENTERED_TAB_WIDTH = 110;
export const TAB_INACTIVE_COLOR = '#7F7E86';
export const headerStyles = (topInset: number, appColors: any) => {
    return StyleSheet.create({
        headerContainer: {
            position: 'absolute',
            width: '100%',
        },
        pagerContainerStyle: {
            flex: 1,
        },
        headerContainerStyle: {
            flex: 1,
        },
        mobileContainer: {
            zIndex: 10,
            height: scale(38) + topInset,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: topInset,
            backgroundColor: 'transparent',
        },
        chromeCastIconStyle: {
            marginRight: appPaddingValues.xlg,
        },
        tabletContainer: {
            zIndex: 10,
            height: scale(64) + topInset,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: topInset,
            alignItems: 'center',
            backgroundColor: 'transparent',
        },
        headerLeftContainerStyle: {
            left: 0,
            alignItems: 'flex-start',
            marginVertical: 13,
            zIndex: 1,
            paddingLeft: appPaddingValues.xmd,
        },
        headerTitleContainerStyle: {
            flex: 1,
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row',
        },
        headerRightContainerStyle: {
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            paddingRight: appPaddingValues.xmd,
        },
        castIcon: { width: scale(24), height: scale(24), tintColor: appColors.brandTint },
        titleStyle: {
            fontSize: appFonts.xlg,
            fontFamily: appFonts.primary,
            fontWeight: '500',
            color: appColors.secondary,
        },
        tabBarWrapperMobile: {
            height: scale(38),
            zIndex: 2,
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: scale(16),
            marginHorizontal: scale(16),
        },
        tabBarWrapper: {
            flexGrow: 1,
            alignSelf: 'flex-end',
            justifyContent: 'flex-start',
            marginStart: scale(16),
        },
        headerIcons: {
            width: selectDeviceType({ Handset: scale(21) }, scale(36)),
            height: selectDeviceType({ Handset: scale(21) }, scale(36)),
        },
    });
};

export const tabStyles = <T extends Route>(props: HeaderTabBarProps<T>, autoWidth: boolean) => {
    return StyleSheet.create({
        container: {
            flex: 1,
        },
        tabBarContainer: {
            backgroundColor: 'transparent',
            height: scale(38),
            width: props.centerTabs ? props.routes.length * DEFAULT_CENTERED_TAB_WIDTH : '100%',
        },
        tabBarContainerPager: {
            backgroundColor: 'transparent',
            height: scale(38),
            width: '100%',
            alignSelf: 'center',
            paddingLeft: scale(32),
            marginRight: scale(32),
            marginTop: scale(8),
            marginBottom: scale(8),
        },
        tabBar: {
            borderBottomColor: '#333',
            borderBottomWidth: 0,
            paddingHorizontal: autoWidth ? scale(16) : undefined,
            width: getTabWidth(props, autoWidth),
        },
        shadow: {
            elevation: 5,
        },
        tabBarLabelStyle: {
            fontSize: appFonts.xs,
            fontFamily: appFonts.semibold,
            textTransform: 'none',
            color: TAB_INACTIVE_COLOR,
            textAlign: 'center',
            textAlignVertical: 'center',
            flex: 1,
        },
        tabBarLabelStyleSelected: {
            color: '#FFFFFF',
            backgroundColor: 'transparent',
            borderRadius: scale(20),
        },
        tabBarLabel: {
            width: scale(100),
            height: scale(36),
            paddingLeft: scale(10),
            paddingRight: scale(10),
            paddingTop: scale(10),
            paddingBottom: scale(10),
        },
        contentContainerStyle: {
            justifyContent: 'flex-start',
        },
    });
};

function getTabWidth<T extends Route>(props: HeaderTabBarProps<T>, autoWidth: boolean) {
    if (props.centerTabs) {
        return DEFAULT_CENTERED_TAB_WIDTH;
    } else {
        return autoWidth ? 'auto' : undefined;
    }
}
