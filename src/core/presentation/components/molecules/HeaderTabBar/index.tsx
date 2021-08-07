import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Animated, FlatList, Text, Platform } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useSafeArea } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import { SceneRendererProps, NavigationState } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { HeaderContextProvider } from 'contexts/HeaderContextProvider';
import LinearGradient from 'react-native-linear-gradient';
// import SearchIcon from 'assets/images/search.svg';
import NotificationIcon from 'assets/images/notification.svg';
import CatalogueIcon from 'assets/images/catalogue-icon.svg';
import PagerView from 'react-native-pager-view';

import { scale, selectDeviceType } from 'qp-common-ui';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { useAlert } from 'contexts/AlertContext';
import { useLocalization } from 'contexts/LocalizationContext';
import HeaderTitle from 'core/presentation/components/atoms/HeaderTitle';
import { headerStyles, tabStyles, LANGUAGE_ICON_SIZE, NOTIFICATION_ICON_SIZE } from './styles';

const HeaderTabBar = <T extends Route>(props: HeaderTabBarProps<T>): JSX.Element => {
    const navigation = useNavigation();
    const insets = useSafeArea();
    const prefs = useAppPreferencesState();
    let { appColors } = prefs.appTheme!(prefs);
    const { strings } = useLocalization();
    const { Alert } = useAlert();
    const [index, setIndex] = React.useState(props.initialTab || 0);

    const ref = useRef<PagerView>(null);

    const autoWidth = props.autoWidth || selectDeviceType({ Handset: false }, true);
    const topInset = insets.top ? insets.top : 22; //include Status bar height for non-notch devices.

    const headerStylesSet = headerStyles(topInset, appColors);
    const tabStylesSet = tabStyles(props, autoWidth);

    const showComingSoonAlert = React.useCallback((): void => {
        Alert.alert(
            'Coming Soon',
            undefined,
            [
                {
                    text: strings['global.okay'],
                },
            ],
            {
                cancelable: false,
            },
        );
    }, [Alert, strings]);

    const setHeaderInset = () => {};
    const onPress = (index: number) => {
        if (ref.current) {
            ref.current.setPage(index);
        }
        setIndex(index);
    };

    // Fix to load initial page on PagerView
    useEffect(() => {
        if (props.routes && props.routes.length > 0 && ref.current && Platform.OS === 'ios') {
            ref.current.setPageWithoutAnimation(0);
        }
    }, [props.routes]);

    const tabItem = (item: any) => {
        return (
            <TouchableOpacity
                key={item.key}
                onPress={() => {
                    onPress(item.index);
                }}>
                <View>
                    {item.index === index ? (
                        <View>
                            <LinearGradient
                                colors={['#3B4046', '#2D3037']}
                                locations={[0.09, 1]}
                                style={[
                                    tabStylesSet.shadow,
                                    tabStylesSet.tabBarLabelStyleSelected,
                                    tabStylesSet.tabBarLabel,
                                ]}>
                                <Text style={[tabStylesSet.tabBarLabelStyle, tabStylesSet.tabBarLabelStyleSelected]}>
                                    {item.item.data.name}
                                </Text>
                            </LinearGradient>
                        </View>
                    ) : (
                        <Animated.View style={[tabStylesSet.tabBarLabel]}>
                            <Text style={[tabStylesSet.tabBarLabelStyle]}>{item.item.data.name}</Text>
                        </Animated.View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const getPager = () => {
        let output = [];
        for (let i = 0; i < props.routes.length; i++) {
            const element = props.routes[i];
            output.push(props.renderScenePager({ route: element, index: i }));
        }
        return (
            <PagerView ref={ref} scrollEnabled={false} style={[headerStylesSet.pagerContainerStyle]} initialPage={0}>
                {output}
            </PagerView>
        );
    };

    return (
        <HeaderContextProvider offset={20} onScrollEvent={setHeaderInset}>
            <Animated.View style={[headerStylesSet.headerContainerStyle]}>
                <Animated.View style={headerStylesSet.mobileContainer}>
                    <View style={headerStylesSet.headerLeftContainerStyle}>
                        <BorderlessButton
                            onPress={() => {
                                showComingSoonAlert();
                            }}>
                            <NotificationIcon width={NOTIFICATION_ICON_SIZE} height={NOTIFICATION_ICON_SIZE} />
                        </BorderlessButton>
                    </View>
                    <HeaderTitle />
                    <View style={headerStylesSet.headerRightContainerStyle}>
                        <BorderlessButton style={headerStylesSet.chromeCastIconStyle}>
                            {/* Chrome Cast Icon Will Come Here */}
                        </BorderlessButton>
                        <BorderlessButton
                            onPress={() => {
                                navigation.navigate(NAVIGATION_TYPE.SWITCH_LANGUAGE);
                            }}>
                            <CatalogueIcon width={LANGUAGE_ICON_SIZE} height={LANGUAGE_ICON_SIZE} />
                        </BorderlessButton>
                    </View>
                </Animated.View>
                <View style={tabStylesSet.tabBarContainerPager}>
                    <FlatList
                        horizontal={true}
                        pagingEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        legacyImplementation={false}
                        data={props.routes}
                        renderItem={item => tabItem(item)}
                        keyExtractor={(item: T) => String(item.title)}
                    />
                </View>
                {getPager()}
            </Animated.View>
        </HeaderContextProvider>
    );
};

export default React.memo(HeaderTabBar);

export const useHeaderTabBarHeight = () => {
    let type = DeviceInfo.getDeviceType();
    const isHandset = type === 'Handset';
    const insets = useSafeArea();
    const topInset = insets.top ? insets.top : 22; //include Status bar height for non-notch devices.
    return isHandset ? scale(38) + topInset + scale(54) : scale(80);
};

export declare type Route = {
    key: string;
    icon?: string;
    title?: string;
    accessible?: boolean;
    accessibilityLabel?: string;
    testID?: string;
};

export interface HeaderTabBarProps<T extends Route> {
    routes: T[];
    renderScenePager: (props: { route: T; index: number }) => React.ReactNode;
    swipeEnabled?: boolean;
    autoWidth?: boolean;
    centerTabs?: boolean;
    scrollEnabled?: boolean;
    lazy?: boolean;
    lazyPreloadDistance?: number;
    removeClippedSubviews?: boolean;
    initialTab?: number;
}

export interface RNTabBarProps<T extends Route> {
    tabBarProps: SceneRendererProps & {
        navigationState: NavigationState<T>;
    };
}
