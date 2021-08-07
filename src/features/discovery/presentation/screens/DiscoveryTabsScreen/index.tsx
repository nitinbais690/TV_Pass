import React from 'react';
import { discoveryTabsStyles } from './style';
import { useAppState } from 'utils/AppContextProvider';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useLocalization } from 'contexts/LocalizationContext';
import StorefrontScreen from 'screens/StorefrontScreen';
import TabHomeIcon from 'assets/images/tab_home.svg';
import TabHomeIconSelected from 'assets/images/tab_home_selected.svg';
import TabDownloadsIcon from 'assets/images/tab_downloads.svg';
import TabDownloadsIconSelected from 'assets/images/tab_downloads_selected.svg';
import TabWatchlistIcon from 'assets/images/tab_watchlist.svg';
import TabWatchlistIconSelected from 'assets/images/tab_watchlist_selected.svg';
import TabSearchIcon from 'assets/images/tab_search.svg';
import TabSearchIconSelected from 'assets/images/tab_search_selected.svg';
import TabMenuIcon from 'assets/images/tab_menu.svg';
import TabMenuIconSelected from 'assets/images/tab_menu_selected.svg';
import TabBarBackground from 'features/discovery/presentation/components/atoms/TabBarBackground';
import SearchStackScreen from 'screens/Navigation/SearchStackScreen';
import DownloadsStackScreen from 'screens/Navigation/DownloadsStackScreen';
import WatchListStackScreen from 'screens/Navigation/WatchListStackScreen';
import DeviceInfo from 'react-native-device-info';
import MenuScreen from 'features/menu/presentation/screens/MenuScreen';

/**
 * Tab configuration
 */
const DiscoveryTabs = createBottomTabNavigator();
export default function DiscoveryTabsScreen() {
    const { strings } = useLocalization();
    const { routeToDownloads } = useAppState();
    const initialRouteName = routeToDownloads ? strings['tabs.downloads'] : strings['tabs.home'];
    let labelStyle =
        DeviceInfo.getDeviceType() === 'Handset' ? discoveryTabsStyles.labelStyle : discoveryTabsStyles.tabLabelStyle;
    let iconStyle =
        DeviceInfo.getDeviceType() === 'Handset' ? discoveryTabsStyles.iconStyle : discoveryTabsStyles.tabIconStyle;

    return (
        <DiscoveryTabs.Navigator
            backBehavior="initialRoute"
            tabBar={props => <TabBarBackground {...props} />}
            initialRouteName={initialRouteName}
            tabBarOptions={{
                iconStyle: {
                    ...iconStyle,
                },
                labelStyle: {
                    ...labelStyle,
                },
                safeAreaInsets: {},
                style: {
                    ...discoveryTabsStyles.tabsStyle,
                },
            }}>
            <DiscoveryTabs.Screen
                name={strings['tabs.home']}
                component={StorefrontScreen}
                options={{
                    tabBarIcon: props =>
                        props.focused ? (
                            <TabHomeIconSelected width={props.size} height={props.size} fill={props.color} />
                        ) : (
                            <TabHomeIcon width={props.size} height={props.size} fill={props.color} />
                        ),
                }}
            />
            <DiscoveryTabs.Screen
                name={strings['tabs.downloads']}
                component={DownloadsStackScreen}
                initialParams={{
                    routeToDownloads: routeToDownloads,
                }}
                options={{
                    tabBarVisible: false,
                    tabBarIcon: props =>
                        props.focused ? (
                            <TabDownloadsIconSelected width={props.size} height={props.size} fill={props.color} />
                        ) : (
                            <TabDownloadsIcon width={props.size} height={props.size} fill={props.color} />
                        ),
                }}
            />
            <DiscoveryTabs.Screen
                name={strings['tabs.watchlist']}
                component={WatchListStackScreen}
                initialParams={{
                    routeToDownloads: routeToDownloads,
                }}
                options={{
                    tabBarVisible: false,
                    tabBarIcon: props =>
                        props.focused ? (
                            <TabWatchlistIconSelected width={props.size} height={props.size} fill={props.color} />
                        ) : (
                            <TabWatchlistIcon width={props.size} height={props.size} fill={props.color} />
                        ),
                }}
            />
            <DiscoveryTabs.Screen
                name={strings['tabs.search']}
                component={SearchStackScreen}
                options={{
                    tabBarVisible: false,
                    tabBarIcon: props =>
                        props.focused ? (
                            <TabSearchIconSelected width={props.size} height={props.size} fill={props.color} />
                        ) : (
                            <TabSearchIcon width={props.size} height={props.size} fill={props.color} />
                        ),
                }}
            />

            <DiscoveryTabs.Screen
                name={strings['tabs.menu']}
                component={MenuScreen}
                options={{
                    tabBarVisible: false,
                    tabBarIcon: props =>
                        props.focused ? (
                            <TabMenuIconSelected width={props.size} height={props.size} fill={props.color} />
                        ) : (
                            <TabMenuIcon width={props.size} height={props.size} fill={props.color} />
                        ),
                }}
            />
        </DiscoveryTabs.Navigator>
    );
}
