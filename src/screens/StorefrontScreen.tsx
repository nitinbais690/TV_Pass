import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useFetchRootContainerQuery, TabVm } from 'qp-discovery-ui';

import { useAppPreferencesState } from '../utils/AppPreferencesContext';
import { useAppState } from '../utils/AppContextProvider';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAppPreview } from '../contexts/AppPreviewContextProvider';

import CatalogScreen from './CatalogScreen';
import AppErrorComponent from '../utils/AppErrorComponent';
import Button from './components/Button';
import SkeletonCatalog from './components/loading/SkeletonCatalog';
import { AppEvents } from 'utils/ReportingUtils';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { TimerType, useTimer } from 'utils/TimerContext';
import FooterGradient from './components/FooterGradient';
import { selectDeviceType } from './../../src/components/qp-common-ui';
import { useGeoData } from '../contexts/GeoDataProviderContext';
import { useProfiles } from '../contexts/ProfilesContextProvider';
import { useAuth } from 'contexts/AuthContextProvider';
import HeaderTabBar, { Route } from 'core/presentation/components/molecules/HeaderTabBar';
import { useContentLanguage } from 'features/language-selection/presentation/hooks/use-content-language';
import { APP_LANGUAGE_CONSTANTS } from 'features/language-selection/utils/app-language-constants';
import HomeBackgroundGradient from 'core/presentation/components/atoms/HomeBackgroundGradient';
import WelcomeBanner from 'features/welcome-banner/presentation/component/template';
import AsyncStorage from '@react-native-community/async-storage';
import { SHOW_WELCOME_BANNER } from 'features/authentication/utils/auth-constants';
const ERROR_KEY = 'error_tab_key';

const StorefrontScreen = (): JSX.Element => {
    const { toggleModal } = useAppPreview();
    const { strings } = useLocalization();
    const { appNavigationState } = useAppState();
    const catalogueLanguage = useContentLanguage();
    const prefs = useAppPreferencesState();
    const { appConfig } = prefs;
    const { elapsedTime, startTimer } = useTimer();
    const { recordEvent } = useAnalytics();
    const { region } = useGeoData();
    const { preferredContentLang } = useProfiles();
    const { accessToken } = useAuth();
    const [showBanner, setShowBanner] = useState<any>(null);
    type TabRoute = {
        data?: any;
    } & Route;

    async function getWelcomBannerStatus() {
        //TODO We need to change this logic after subscription integration.
        const status = await AsyncStorage.getItem(SHOW_WELCOME_BANNER);
        setShowBanner(status);
    }

    const styles = StyleSheet.create({
        footerGradient: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
        },
        button: {
            margin: 20,
            marginHorizontal: selectDeviceType({ Tablet: '20%' }, '5%'),
        },
    });
    const getStorefrontId = useCallback(
        (value: string) => {
            switch (value) {
                case 'tn':
                case 'tam':
                case APP_LANGUAGE_CONSTANTS.TAMIL:
                    return appConfig && appConfig.tamilSfid;
                case 'ap':
                case 'ts':
                case 'tel':
                case APP_LANGUAGE_CONSTANTS.TELUGU:
                    return appConfig && appConfig.teluguSfid;
                default:
                    return appConfig && appConfig.teluguSfid;
            }
        },
        [appConfig],
    );
    const [storeFrontId, setStoreFrontId] = useState<string>(getStorefrontId(region.toLowerCase()));

    useEffect(() => {
        if (preferredContentLang) {
            setStoreFrontId(getStorefrontId(preferredContentLang.toLowerCase()));
        } else {
            setStoreFrontId(getStorefrontId(catalogueLanguage));
        }
    }, [preferredContentLang, region, accessToken, getStorefrontId, catalogueLanguage]);

    const { loading, error, containers, reset, reload } = useFetchRootContainerQuery(storeFrontId);

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

    const renderScenePager = ({ route, index }: { route: any; index: number }) => {
        if (route.key === ERROR_KEY) {
            return (
                <View key={index.toString()}>
                    <AppErrorComponent
                        key={index}
                        reload={() => {
                            reset();
                            reload();
                        }}
                    />
                </View>
            );
        }

        return (
            <View key={index.toString()}>
                <CatalogScreen key={route.key} storefrontId={storeFrontId} tabId={route.key} tabName={route.title} />
            </View>
        );
    };

    useEffect(() => {
        startTimer(TimerType.Storefront);
        getWelcomBannerStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    console.log(`loading? ${loading}, error? ${error}`);

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

    return (
        <HomeBackgroundGradient>
            <HeaderTabBar
                routes={routes}
                renderScenePager={renderScenePager}
                centerTabs={DeviceInfo.getDeviceType() === 'Handset'}
            />

            {/* Loading State */}
            {loading && <SkeletonCatalog />}

            {/* Preview Mode */}
            {appNavigationState === 'PREVIEW_APP' && (
                <FooterGradient style={styles.footerGradient}>
                    <Button
                        type={'solid'}
                        containerStyle={styles.button}
                        title={strings.subscribe}
                        onPress={toggleModal}
                    />
                </FooterGradient>
            )}
            {showBanner && <WelcomeBanner />}
        </HomeBackgroundGradient>
    );
};

export default StorefrontScreen;
