import React, { useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Route, SceneRendererProps } from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import { useFetchRootContainerQuery, TabVm } from 'qp-discovery-ui';

import { useAppPreferencesState } from '../utils/AppPreferencesContext';
import { useAppState } from '../utils/AppContextProvider';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAppPreview } from '../contexts/AppPreviewContextProvider';

import CatalogScreen from './CatalogScreen';
import AppErrorComponent from '../utils/AppErrorComponent';
import Button from './components/Button';
import HeaderTabBar from './components/HeaderTabBar';
import BackgroundGradient from './components/BackgroundGradient';
import SkeletonCatalog, { SkeletonCatalogType } from './components/loading/SkeletonCatalog';
import { AppEvents } from 'utils/ReportingUtils';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { TimerType, useTimer } from 'utils/TimerContext';
import FooterGradient from './components/FooterGradient';
import { selectDeviceType } from './../../src/components/qp-common-ui';
import { useOnboarding } from 'contexts/OnboardingContext';
import StorefrontScreenTV from '../TV/StorefrontScreenTV';

const ERROR_KEY = 'error_tab_key';
const SkeletonType: SkeletonCatalogType = 'Strorefront';

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
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const Scene = ({ route, position, layout, index, length, storefrontId }: Props) => {
    const coverflowStyle: any = React.useMemo(() => {
        const { width } = layout;

        let inputRange = Array.from({ length }, (_, i) => i);
        const translateOutputRange = inputRange.map(i => {
            return (width / 100) * (index - i) * -1;
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
            <CatalogScreen storefrontId={storefrontId} tabId={route.key} tabName={route.title} />
        </Animated.View>
    );
};

const StorefrontScreen = ({ route }: { route?: any }): JSX.Element => {
    const { toggleModal } = useAppPreview();
    const { strings } = useLocalization();
    const { appNavigationState } = useAppState();
    const prefs = useAppPreferencesState();
    const { appConfig } = prefs;
    const storefrontId = (appConfig && appConfig.storefrontId) || '';
    const { loading, error, containers, reset, reload } = useFetchRootContainerQuery(storefrontId);
    const { elapsedTime, startTimer } = useTimer();
    const { recordEvent } = useAnalytics();
    const { onboardNavigation } = useOnboarding();

    type TabRoute = {
        data?: any;
    } & Route;

    const styles = StyleSheet.create({
        footerGradient: {
            position: Platform.isTV ? 'absolute' : 'relative',
            bottom: 0,
            left: 0,
            right: 0,
        },
        button: {
            margin: 20,
            marginHorizontal: selectDeviceType({ Tablet: '20%' }, '5%'),
        },
    });

    const containerLoadingRoutes = [
        {
            key: '78C5A010-3FDB-4397-8993-1776C36532A2',
            title: 'All',
            accessibilityLabel: 'All',
            testID: 'All',
            data: { id: '78C5A010-3FDB-4397-8993-1776C36532A2', localizedName: { en: 'All' }, name: 'All' },
        },
        {
            key: '2DE1CBFC-8069-493F-A4C4-42659F08F3FC',
            title: 'TV',
            accessibilityLabel: 'TV',
            testID: 'TV',
            data: { id: '2DE1CBFC-8069-493F-A4C4-42659F08F3FC', localizedName: { en: 'TV' }, name: 'TV' },
        },
        {
            key: '1F8FCC50-F68C-46F2-87FE-447CC8EBB6A5',
            title: 'Movies',
            accessibilityLabel: 'Movies',
            testID: 'Movies',
            data: { id: '1F8FCC50-F68C-46F2-87FE-447CC8EBB6A5', localizedName: { en: 'Movies' }, name: 'Movies' },
        },
    ];

    const containerRoutes: TabRoute[] = containers.map((tabContainer: TabVm) => {
        return {
            key: tabContainer.id,
            title: tabContainer.name,
            accessibilityLabel: tabContainer.name,
            testID: tabContainer.name,
            data: tabContainer,
        };
    });

    const routes = error ? [{ key: ERROR_KEY }] : [...containerRoutes];

    const renderScene = ({ route, position, layout }: { route: any; position: any; layout: any }) => {
        if (route.key === ERROR_KEY) {
            return (
                <AppErrorComponent
                    reload={() => {
                        reset();
                        reload();
                    }}
                />
            );
        }

        return (
            <Scene
                route={route}
                position={position}
                layout={layout}
                index={loading ? containerLoadingRoutes.indexOf(route) : routes.indexOf(route)}
                length={loading ? containerLoadingRoutes.length : routes.length}
                storefrontId={storefrontId}
            />
        );
    };

    useEffect(() => {
        let routeType = '';
        if (route && route.params && route.params.tabIndex) {
            routeType = route.params.tabIndex;
        }
        if (routeType === 'onboard') {
            route.params.tabIndex = '';
            onboardNavigation('');
        }
    }, [onboardNavigation, route]);

    useEffect(() => {
        startTimer(TimerType.Storefront);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // console.log(`loading? ${loading}, error? ${error}`);

    useEffect(() => {
        if (elapsedTime.timeToStoreFront) {
            recordEvent(AppEvents.APP_START, {
                timeToSplash: elapsedTime.timeToSplash,
                timeToAppConfig: elapsedTime.timeToAppConfig,
                timeToLoadStorefront: elapsedTime.timeToStoreFront,
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elapsedTime.timeToStoreFront]);

    const initialTab = () => {
        let index = 0;
        if (route && route.params && route.params.tabIndex) {
            index = route.params.tabIndex;
        }

        return index;
    };

    if (Platform.isTV) {
        return <StorefrontScreenTV route={route} />;
    }

    return (
        <BackgroundGradient>
            {/* Record event added for analytics */}
            <HeaderTabBar
                analyticsEvent={AppEvents.STOREFRONT_TAB_CHANGE}
                recordEvent={recordEvent}
                routes={loading ? containerLoadingRoutes : routes}
                renderScene={renderScene}
                timingConfig={{ duration: Platform.OS === 'android' ? 450 : 300 }}
                initialTab={initialTab()}
            />

            {/* Loading State */}
            {loading && !error && containers.length === 0 ? <SkeletonCatalog type={SkeletonType} /> : null}

            {/* Preview Mode */}
            {appNavigationState === 'PREVIEW_APP' && (
                <FooterGradient style={styles.footerGradient}>
                    <Button
                        type={'solid'}
                        containerStyle={styles.button}
                        title={strings['preview.sign_up_btn_label']}
                        onPress={toggleModal}
                    />
                </FooterGradient>
            )}
        </BackgroundGradient>
    );
};

export default StorefrontScreen;
