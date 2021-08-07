import React from 'react';
import DeviceInfo from 'react-native-device-info';
import HeaderTabBar from './components/HeaderTabBar';
import PurchasedScreen from './MyContent/PurchasedScreen';
import DownloadsScreen from './MyContent/DownloadsScreen';
import { SceneRendererProps } from 'react-native-tab-view';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

type Route = {
    key: string;
};

type Props = SceneRendererProps & {
    index: number;
    length: number;
    route: Route;
    storefrontId: string;
};

const SceneStyles = StyleSheet.create({
    page: {
        flex: 1,
    },
});

const PurchaseScene = ({ position, layout, index, length }: Props) => {
    const coverflowStyle: any = React.useMemo(() => {
        const { width } = layout;

        const inputRange = Array.from({ length }, (_, i) => i);
        const translateOutputRange = inputRange.map(i => {
            return (width / 200) * (index - i) * -1;
        });
        const opacityOutputRange = inputRange.map(i => {
            if (index === i) {
                return 1;
            } else {
                return 0;
            }
        });

        const translateX = Animated.interpolate(position, {
            inputRange,
            outputRange: translateOutputRange,
            extrapolate: Animated.Extrapolate.CLAMP,
        });

        const opacity = Animated.interpolate(position, {
            inputRange,
            outputRange: opacityOutputRange,
            extrapolate: Animated.Extrapolate.CLAMP,
        });

        return {
            transform: [{ translateX }],
            opacity,
        };
    }, [index, layout, length, position]);

    return (
        <Animated.View style={[SceneStyles.page, coverflowStyle]}>
            <PurchasedScreen />
        </Animated.View>
    );
};

const DownloadScene = ({ position, layout, index, length }: Props) => {
    const coverflowStyle: any = React.useMemo(() => {
        const { width } = layout;

        const inputRange = Array.from({ length }, (_, i) => i);
        const translateOutputRange = inputRange.map(i => {
            return (width / 100) * (index - i) * -1;
        });
        // console.log('INPUTRANGE: ', inputRange);
        const opacityOutputRange = inputRange.map(i => {
            // console.log('INDEX: ', index);
            // console.log('I: ', i);
            if (index === i) {
                return 1;
            } else {
                return 0;
            }
        });

        const translateX = Animated.interpolate(position, {
            inputRange,
            outputRange: translateOutputRange,
            extrapolate: Animated.Extrapolate.CLAMP,
        });

        const opacity = Animated.interpolate(position, {
            inputRange,
            outputRange: opacityOutputRange,
            extrapolate: Animated.Extrapolate.CLAMP,
        });

        return {
            transform: [{ translateX }],
            opacity,
        };
    }, [index, layout, length, position]);

    return (
        <Animated.View style={[SceneStyles.page, coverflowStyle]}>
            <DownloadsScreen />
        </Animated.View>
    );
};

const MyContentScreen = ({ route }: { route: any }): JSX.Element => {
    const REDEEMED_KEY = 'Redeemed';
    const DOWNLOADS_KEY = 'Downloads';
    let initialTab = route.params.routeToDownloads ? 1 : 0;

    if (route.params.type != undefined) {
        initialTab = route.params.type === 'downloads' ? 1 : 0;
    }

    const routes = [
        { key: REDEEMED_KEY, title: REDEEMED_KEY },
        { key: DOWNLOADS_KEY, title: DOWNLOADS_KEY },
    ];

    const renderScene = ({ route, position, layout }: { route: any; position: any; layout: any }) => {
        switch (route.key) {
            case REDEEMED_KEY:
                return (
                    <PurchaseScene
                        route={route}
                        position={position}
                        layout={layout}
                        index={routes.indexOf(route)}
                        length={routes.length}
                    />
                );
            case DOWNLOADS_KEY:
                return (
                    <DownloadScene
                        route={route}
                        position={position}
                        layout={layout}
                        index={routes.indexOf(route)}
                        length={routes.length}
                    />
                );
        }
    };

    return (
        <HeaderTabBar
            routes={routes}
            renderScene={renderScene}
            initialTab={initialTab}
            centerTabs={DeviceInfo.getDeviceType() === 'Handset'}
        />
    );
};

export default MyContentScreen;
