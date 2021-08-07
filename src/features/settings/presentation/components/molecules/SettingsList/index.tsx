import React from 'react';
import { View } from 'react-native';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import SettingsItemRow from '../../atoms/SettingsItemRow';
import { settingsListStyle } from './style';
import Payment from 'assets/images/payment_outline.svg';
import Device from 'assets/images/vibration_outline.svg';
import Account from 'assets/images/account_outline.svg';
import Padlock from 'assets/images/padlock_outline.svg';
import Gear from 'assets/images/settings.svg';
import { useLocalization } from 'contexts/LocalizationContext';

const SettingsList = (props: SettingsListProps) => {
    const { strings } = useLocalization();
    const styles = settingsListStyle();

    const rowItems: Array<RowItem> = [
        {
            title: `${strings['settings.list.subscription_details.title']}`,
            subtitle: `${strings['settings.list.subscription_details.subtitle']}`,
            screen: NAVIGATION_TYPE.SUBSCRIPTION_DETAILS,
        },
        {
            title: `${strings['settings.list.device_management.title']}`,
            subtitle: `${strings['settings.list.device_management.subtitle']}`,
            screen: NAVIGATION_TYPE.MANAGE_DEVICES,
        },
        {
            title: `${strings['settings.list.user_profiles.title']}`,
            subtitle: `${strings['settings.list.user_profiles.subtitle']}`,
            screen: NAVIGATION_TYPE.USER_PROFILE,
        },
        {
            title: `${strings['settings.list.parental_controls.title']}`,
            subtitle: `${strings['settings.list.parental_controls.subtitle']}`,
            screen: NAVIGATION_TYPE.PARENTAL_CONTROLS,
        },
        {
            title: `${strings['settings.list.app_settings.title']}`,
            subtitle: `${strings['settings.list.app_settings.subtitle']}`,
            screen: NAVIGATION_TYPE.APP_SETTINGS,
        },
    ];

    function getRowIcon(row: string) {
        switch (row) {
            case NAVIGATION_TYPE.SUBSCRIPTION_DETAILS:
                return <Payment height={styles.iconStyle.height} width={styles.iconStyle.width} />;
            case NAVIGATION_TYPE.MANAGE_DEVICES:
                return <Device height={styles.iconStyle.height} width={styles.iconStyle.width} />;
            case NAVIGATION_TYPE.USER_PROFILE:
                return <Account height={styles.iconStyle.height} width={styles.iconStyle.width} />;
            case NAVIGATION_TYPE.PARENTAL_CONTROLS:
                return <Padlock height={styles.iconStyle.height} width={styles.iconStyle.width} />;
            case NAVIGATION_TYPE.APP_SETTINGS:
                return <Gear height={styles.iconStyle.height} width={styles.iconStyle.width} />;
        }
    }

    const renderItem = (item: RowItem) => {
        return (
            <SettingsItemRow
                key={item.screen}
                title={item.title}
                subtitle={item.subtitle}
                image={getRowIcon(item.screen)}
                onPress={() => {
                    props.onPress(item);
                }}
            />
        );
    };

    return <View>{rowItems.map(item => renderItem(item))}</View>;
};

export interface RowItem {
    title: string;
    subtitle: string;
    [key: string]: any;
}

interface SettingsListProps {
    onPress: (screen: RowItem) => void;
}

export default SettingsList;
