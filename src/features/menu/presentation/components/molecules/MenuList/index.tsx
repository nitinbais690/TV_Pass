import { useLocalization } from 'contexts/LocalizationContext';
import React from 'react';
import { FlatList, View } from 'react-native';
import { MenuItemRow } from '../../atoms/MenuItemRow';
import Help from 'assets/images/menu_help.svg';
import TermsAndCondition from 'assets/images/menu_terms_and_conditions.svg';
import LinkDevice from 'assets/images/link_device.svg';
import Logout from 'assets/images/logout.svg';
import MyPurchases from 'assets/images/my_purchases.svg';
import ReferAndEarn from 'assets/images/refer_and_earn.svg';
import Settings from 'assets/images/settings.svg';

import MenuListStyle from './style';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { useAuth } from 'contexts/AuthContextProvider';

export default function MenuList(props: MenuListProps) {
    const { strings } = useLocalization();
    const styles = MenuListStyle();
    const { userType } = useAuth();
    const isLoggedIn = userType === 'LOGGED_IN' || userType === 'SUBSCRIBED';

    const nonSubscribedUserMenuList: Array<MenuItemProps> = [
        {
            type: 'ACTION_BUTTON',
            key: `${strings.menu_screen_help}`,
            screen: NAVIGATION_TYPE.HELP,
        },
        {
            type: 'ACTION_BUTTON',
            key: `${strings.menu_screen_termsAndConditions}`,
            screen: NAVIGATION_TYPE.TERMS_CONDITIONS,
        },
    ];

    const registeredUserMenuList: Array<MenuItemProps> = [
        {
            type: 'ACTION_BUTTON',
            key: `${strings.menu_my_purchases}`,
            screen: NAVIGATION_TYPE.MY_PURCHASES,
        },
        {
            type: 'ACTION_BUTTON',
            key: `${strings.menu_link_a_device}`,
            screen: NAVIGATION_TYPE.LINK_A_DEVICE,
        },
        {
            type: 'ACTION_BUTTON',
            key: `${strings.menu_settings}`,
            screen: NAVIGATION_TYPE.MENU_SETTINGS,
        },
        {
            type: 'ACTION_BUTTON',
            key: `${strings.menu_refer_and_earn}`,
            screen: NAVIGATION_TYPE.REFER_AND_EARN,
        },
        {
            type: 'ACTION_BUTTON',
            key: `${strings.menu_screen_help}`,
            screen: NAVIGATION_TYPE.HELP,
        },
        {
            type: 'ACTION_BUTTON',
            key: `${strings.menu_Logout}`,
            screen: NAVIGATION_TYPE.LOGOUT,
        },
    ];

    function getMenuIcons(menuItem: string) {
        switch (menuItem) {
            case strings.menu_screen_help:
                return <Help width={styles.iconStyle.width} height={styles.iconStyle.height} />;
            case strings.menu_screen_termsAndConditions:
                return <TermsAndCondition width={styles.iconStyle.width} height={styles.iconStyle.height} />;
            case strings.menu_my_purchases:
                return <MyPurchases width={styles.iconStyle.width} height={styles.iconStyle.height} />;
            case strings.menu_link_a_device:
                return <LinkDevice width={styles.iconStyle.width} height={styles.iconStyle.height} />;
            case strings.menu_settings:
                return <Settings width={styles.iconStyle.width} height={styles.iconStyle.height} />;
            case strings.menu_refer_and_earn:
                return <ReferAndEarn width={styles.iconStyle.width} height={styles.iconStyle.height} />;
            case strings.menu_screen_help:
                return <Help width={styles.iconStyle.width} height={styles.iconStyle.height} />;
            case strings.menu_Logout:
                return <Logout width={styles.iconStyle.width} height={styles.iconStyle.height} />;
        }
    }

    const renderItem = (item: MenuItemProps) => {
        return (
            <MenuItemRow
                title={item.key}
                image={getMenuIcons(item.key)}
                onPress={() => {
                    props.onPress(item.screen);
                }}
            />
        );
    };

    return (
        <View style={styles.container}>
            {isLoggedIn && (
                <FlatList<MenuItemProps>
                    data={registeredUserMenuList}
                    renderItem={({ item }) => renderItem(item)}
                    horizontal={false}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item: MenuItemProps) => item.key}
                />
            )}
            {!isLoggedIn && (
                <FlatList<MenuItemProps>
                    data={nonSubscribedUserMenuList}
                    renderItem={({ item }) => renderItem(item)}
                    horizontal={false}
                    showsHorizontalScrollIndicator={false}
                />
            )}
        </View>
    );
}

interface MenuItemProps {
    type: any;
    key: string;
    [key: string]: any;
}

interface MenuListProps {
    onPress: (screen: string) => void;
}
