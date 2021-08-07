import React from 'react';
import DeviceInfo from 'react-native-device-info';
import PurchasedScreen from './MyContent/PurchasedScreen';
import DownloadsScreen from './MyContent/DownloadsScreen';
import HeaderTabBar from 'core/presentation/components/molecules/HeaderTabBar';

const MyContentScreen = ({ route }: { route: any }): JSX.Element => {
    const REDEEMED_KEY = 'Watchlist';
    const DOWNLOADS_KEY = 'Downloads';

    const routes = [
        { key: REDEEMED_KEY, title: REDEEMED_KEY },
        { key: DOWNLOADS_KEY, title: DOWNLOADS_KEY },
    ];

    const renderScene = ({ route }: { route: any }) => {
        switch (route.key) {
            case REDEEMED_KEY:
                return <PurchasedScreen />;
            case DOWNLOADS_KEY:
                return <DownloadsScreen />;
        }
    };

    return (
        <HeaderTabBar
            routes={routes}
            renderScene={renderScene}
            initialTab={route.params.routeToDownloads ? 1 : 0}
            centerTabs={DeviceInfo.getDeviceType() === 'Handset'}
        />
    );
};

export default MyContentScreen;
