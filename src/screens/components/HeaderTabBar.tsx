import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useSafeArea } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import { TabView, TabBar as RNTabBar, Route, SceneRendererProps, NavigationState } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';

import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useAppState } from 'utils/AppContextProvider';
import { useAppPreview } from 'contexts/AppPreviewContextProvider';
import { HeaderContextProvider } from 'contexts/HeaderContextProvider';
import { useCastContext } from 'utils/CastContextProvider';

import { BrandLogo } from 'screens/components/BrandLogo';
import { CreditsButton } from 'screens/components/CreditsButton';
import HeaderGradient from 'screens/components/HeaderGradient';
import SearchIcon from '../../../assets/images/search.svg';
import CloseIcon from '../../../assets/images/close.svg';
import { appFonts, appPadding, appDimensions } from '../../../AppStyles';
import { NAVIGATION_TYPE } from '../Navigation/NavigationConstants';
import { selectDeviceType } from 'qp-common-ui';
import { AppEvents } from 'utils/ReportingUtils';
import CastButtonComponent from '../components/CastButtonComponent';

// const ENABLE_TAB_SCROLL = false;
const DEFAULT_CENTERED_TAB_WIDTH = 110;
const DEFAULT_TAB_INICATOR_WIDTH = 80;

interface HeaderTabBarProps<T extends Route> {
    routes: T[];
    renderScene: (
        props: SceneRendererProps & {
            route: T;
        },
    ) => React.ReactNode;
    timingConfig?: {};
    swipeEnabled?: boolean;
    autoWidth?: boolean;
    centerTabs?: boolean;
    scrollEnabled?: boolean;
    lazy?: boolean;
    lazyPreloadDistance?: number;
    removeClippedSubviews?: boolean;
    initialTab?: number;
    recordEvent?: (_: AppEvents | undefined, _attributes?: any) => {};
    analyticsEvent?: AppEvents;
}

interface RNTabBarProps<T extends Route> {
    tabBarProps: SceneRendererProps & {
        navigationState: NavigationState<T>;
    };
}

const HeaderTitle = () => {
    const styles = StyleSheet.create({
        headerTitleContainer: {
            width: '100%',
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            bottom: 25,
            left: 0,
            right: 0,
            zIndex: 0,
        },
    });
    return (
        <View style={styles.headerTitleContainer}>
            <BrandLogo />
        </View>
    );
};

const HeaderTabBar = <T extends Route>(props: HeaderTabBarProps<T>): JSX.Element => {
    const navigation = useNavigation();
    const insets = useSafeArea();
    const { toggleModal } = useAppPreview();
    const { appNavigationState, triggerAuthFlow } = useAppState();
    const { isCastSessionActive } = useCastContext();
    //Note: Below two lines are for analytics
    const { recordEvent, analyticsEvent } = props;
    const [previousScreen, setPreviousScreen] = React.useState<String | undefined>('');
    const prefs = useAppPreferencesState();
    let { appColors } = prefs.appTheme!(prefs);
    const [index, setIndex] = React.useState(props.initialTab || 0);

    let type = DeviceInfo.getDeviceType();
    const isMobile = type === 'Handset';
    const autoWidth = props.autoWidth || selectDeviceType({ Handset: false }, true);
    const topInset = insets.top ? insets.top : 22; //include Status bar height for non-notch devices.

    // const left = React.useRef(new Animated.Value(-100)).current;

    const headerStyles = StyleSheet.create({
        headerContainer: {
            position: 'absolute',
            width: '100%',
        },
        container: {
            zIndex: 10,
            height: 66 + topInset,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: topInset,
            backgroundColor: 'transparent',
        },
        headerLeftContainerStyle: {
            left: 0,
            marginVertical: 13,
            zIndex: 1,
            justifyContent: 'center',
            alignItems: 'center',
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
        },
        castIcon: { width: 24, height: 24, tintColor: appColors.brandTint },
        titleStyle: {
            fontSize: appFonts.xlg,
            fontFamily: appFonts.primary,
            fontWeight: '500',
            color: appColors.secondary,
        },
        tabBarWrapperMobile: {
            height: 50,
            zIndex: 2,
            flexDirection: 'row',
            justifyContent: 'center',
        },
        tabBarWrapper: {
            flexGrow: 1,
            height: 50,
            alignSelf: 'flex-end',
            justifyContent: 'flex-start',
        },
        innerContainer: {
            marginHorizontal: 30,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    const tabStyle = StyleSheet.create({
        container: {
            flex: 1,
        },
        tabBarContainer: {
            backgroundColor: 'transparent',
            height: 50,
            width: props.centerTabs ? props.routes.length * DEFAULT_CENTERED_TAB_WIDTH : '100%',
        },
        tabBar: {
            marginBottom: -5,
            borderBottomColor: '#333',
            borderBottomWidth: 0,
            width: props.centerTabs ? DEFAULT_CENTERED_TAB_WIDTH : autoWidth ? 'auto' : undefined,
            paddingHorizontal: autoWidth ? 30 : undefined,
        },
        contentContainerStyle: {
            justifyContent: props.centerTabs ? 'center' : undefined,
        },
        indicatorContainerStyle: {
            marginHorizontal: props.centerTabs ? 15 : undefined,
        },
        tabBarIndicatorStyle: {
            backgroundColor: appColors.brandTint,
            height: 2,
            ...(props.centerTabs && {
                width: DEFAULT_TAB_INICATOR_WIDTH,
            }),
        },
        tabBarLabelStyle: {
            fontSize: appFonts.xs,
            fontFamily: appFonts.medium,
            bottom: appPadding.xxs(),
            textTransform: 'none',
        },
        sceneContainerStyle: {},
    });

    const state = {
        index: index,
        routes: props.routes,
    };

    useEffect(() => {
        if (props.initialTab !== null && props.initialTab !== undefined) {
            setIndex(props.initialTab);
        }
    }, [props.initialTab]);

    const HeaderTitleLarge = ({ tabBarProps }: RNTabBarProps<Route>) => {
        return (
            <View style={headerStyles.headerTitleContainerStyle}>
                <View style={headerStyles.innerContainer}>
                    <BrandLogo />
                </View>
                {props.routes && props.routes.length > 1 && (
                    <View style={headerStyles.tabBarWrapper}>
                        <TabBar tabBarProps={tabBarProps} />
                    </View>
                )}
            </View>
        );
    };

    const TabBar = ({ tabBarProps }: RNTabBarProps<Route>) => {
        return (
            <RNTabBar
                {...tabBarProps}
                scrollEnabled={false}
                activeColor={appColors.secondary}
                inactiveColor={appColors.tertiary}
                pressColor={appColors.brandTint}
                style={tabStyle.tabBarContainer}
                labelStyle={tabStyle.tabBarLabelStyle}
                tabStyle={tabStyle.tabBar}
                indicatorStyle={tabStyle.tabBarIndicatorStyle}
                indicatorContainerStyle={tabStyle.indicatorContainerStyle}
                contentContainerStyle={tabStyle.contentContainerStyle}
                getLabelText={({ route }) => route.title}
                onTabPress={scene => {
                    const { route } = scene;
                    tabBarProps.jumpTo(route.key);
                }}
            />
        );
    };

    const onCreditsPress = React.useCallback(() => {
        {
            if (appNavigationState !== 'PREVIEW_APP') {
                navigation.navigate(NAVIGATION_TYPE.CREDITS);
            } else {
                toggleModal();
            }
        }
    }, [appNavigationState, navigation, toggleModal]);

    // useEffect(() => {
    //     Animated.timing(left, {
    //         delay: 0,
    //         toValue: 0,
    //         duration: 800,
    //         useNativeDriver: false,
    //         easing: Easing.inOut(Easing.circle),
    //     }).start();
    // }, [left]);

    // const renderCastButton = React.useCallback(() => {
    //     if (isCastSessionActive && !Platform.isTV) {
    //         const { CastButton } = require('react-native-google-cast');
    //         return <CastButton style={headerStyles.castIcon} />;
    //     }
    // }, [headerStyles.castIcon, isCastSessionActive]);

    const defaultRenderTabBar = React.useMemo(
        () => (
            tabBarProps: SceneRendererProps & {
                navigationState: NavigationState<T>;
            },
        ) => (
            <View style={headerStyles.headerContainer}>
                <HeaderGradient style={StyleSheet.absoluteFillObject} />
                <View style={headerStyles.container}>
                    <View style={[headerStyles.headerLeftContainerStyle]}>
                        {appNavigationState !== 'PREVIEW_APP' ? (
                            <CreditsButton onPress={onCreditsPress} />
                        ) : (
                            <BorderlessButton
                                onPress={() => triggerAuthFlow()}
                                style={{ paddingHorizontal: appPadding.sm(true) }}>
                                <CloseIcon />
                            </BorderlessButton>
                        )}
                    </View>
                    {isMobile ? <HeaderTitle /> : <HeaderTitleLarge tabBarProps={tabBarProps} />}
                    <View style={headerStyles.headerRightContainerStyle}>
                        {isCastSessionActive && <CastButtonComponent style={headerStyles.castIcon} />}
                        <BorderlessButton
                            onPress={() => navigation.navigate(NAVIGATION_TYPE.SEARCH)}
                            style={{ paddingHorizontal: appPadding.sm(true) }}>
                            <SearchIcon />
                        </BorderlessButton>
                    </View>
                </View>

                {isMobile && props.routes && props.routes.length > 1 && (
                    <View style={headerStyles.tabBarWrapperMobile}>
                        <TabBar tabBarProps={tabBarProps} />
                    </View>
                )}
            </View>
        ),
        [
            headerStyles.headerContainer,
            headerStyles.container,
            headerStyles.headerLeftContainerStyle,
            headerStyles.headerRightContainerStyle,
            headerStyles.castIcon,
            headerStyles.tabBarWrapperMobile,
            appNavigationState,
            onCreditsPress,
            isMobile,
            isCastSessionActive,
            props.routes,
            triggerAuthFlow,
            navigation,
        ],
    );

    useEffect(() => {
        if (recordEvent && analyticsEvent) {
            if (props.routes && props.routes[index]) {
                if (props.routes[index].title) {
                    recordEvent(analyticsEvent, {
                        current_screen: props.routes[index].title,
                        previous_screen: previousScreen,
                    });
                    setPreviousScreen(props.routes[index].title);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index]);

    return (
        <HeaderContextProvider offset={20}>
            <View style={tabStyle.container}>
                <TabView
                    lazy={true}
                    tabBarPosition={'bottom'}
                    navigationState={state}
                    renderScene={props.renderScene}
                    onIndexChange={setIndex}
                    swipeEnabled={false}
                    timingConfig={props.timingConfig}
                    initialLayout={{ height: 0, width: appDimensions.fullWidth }}
                    sceneContainerStyle={tabStyle.sceneContainerStyle}
                    renderTabBar={defaultRenderTabBar}
                />
            </View>
        </HeaderContextProvider>
    );
};

export default React.memo(HeaderTabBar);

export const useHeaderTabBarHeight = () => {
    let type = DeviceInfo.getDeviceType();
    const isHandset = type === 'Handset';
    const insets = useSafeArea();
    const topInset = insets.top ? insets.top : 22; //include Status bar height for non-notch devices.
    return 66 + topInset + (isHandset ? 50 : 0);
};

export const useHeaderTabBarLessHeight = () => {
    const insets = useSafeArea();
    const topInset = insets.top ? insets.top : 22; //include Status bar height for non-notch devices.
    return 66 + topInset;
};
