import React from 'react';
import DeviceInfo from 'react-native-device-info';
import HeaderTabBar from './components/HeaderTabBar';
import ContentUsageScreen from './Usage/ContentUsageScreen';
import ServicesUsageScreen from './Usage/ServicesUsageScreen';

const UsageScreen = (): JSX.Element => {
    const CONTENT_KEY = 'Content';
    const SERVICES_KEY = 'Services';

    const routes = [
        // { key: CONTENT_KEY, title: CONTENT_KEY },
        { key: SERVICES_KEY, title: SERVICES_KEY },
    ];
    const renderScene = ({ route }: { route: any }) => {
        switch (route.key) {
            case CONTENT_KEY:
                return <ContentUsageScreen />;
            case SERVICES_KEY:
                return <ServicesUsageScreen />;
        }
    };

    return (
        <HeaderTabBar routes={routes} renderScene={renderScene} centerTabs={DeviceInfo.getDeviceType() === 'Handset'} />
    );
};

export default UsageScreen;
