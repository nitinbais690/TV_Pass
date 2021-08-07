import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableNativeFeedback } from 'react-native';
import { Route } from 'react-native-tab-view';
import MaterialTabs from 'react-native-material-tabs';
import { useNavigation } from '@react-navigation/native';
import { useFetchRootContainerQuery, TabVm } from 'qp-discovery-ui';

import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from '../contexts/LocalizationContext';
import { AppEvents } from 'utils/ReportingUtils';
import { useAnalytics } from 'utils/AnalyticsReporterContext';

import CatalogScreen from './CatalogScreen';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';
import { TimerType, useTimer } from 'utils/TimerContext';
import { selectDeviceType } from './../../src/components/qp-common-ui';
import SearchIcon from '../../assets/images/search.svg';
import { appFonts, appPadding } from '../../AppStyles';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import EpgGuideScreen from './EpgGuideScreen';
import AppLoadingIndicator from './components/AppLoadingIndicator';
import AppErrorComponent from 'utils/AppErrorComponent';
import PurchasedScreen from './MyContent/PurchasedScreen';
import TabIconSettingsOff from '../../assets/images/tab_off_settings.svg';
import { useGeoData } from '../contexts/GeoDataProviderContext';
import { useProfiles } from '../contexts/ProfilesContextProvider';
import BrandLogo from 'core/presentation/components/atoms/BrandLogo';
import { APP_LANGUAGE_CONSTANTS } from 'features/language-selection/utils/app-language-constants';
import { useContentLanguage } from 'features/language-selection/presentation/hooks/use-content-language';
import { useAuth } from 'contexts/AuthContextProvider';

const ERROR_KEY = 'error_tab_key';

const StorefrontTVScreen = (): JSX.Element => {
    const { strings } = useLocalization();
    const navigation = useNavigation();
    const [selectedTab, setSelectedTab] = useState(0);
    const prefs = useAppPreferencesState();
    const { appConfig } = prefs;
    let { appColors } = prefs.appTheme!(prefs);
    //const storefrontId = (appConfig && appConfig.storefrontId) || '66690354-4FB4-46B2-84F7-F910DAC176AE';

    const { preferredContentLang } = useProfiles();
    const catalogueLanguage = useContentLanguage();
    const { accessToken } = useAuth();

    const { elapsedTime, startTimer } = useTimer();
    const { recordEvent } = useAnalytics();
    const { region } = useGeoData();
    const [isFocused, setIsFocused] = useState(false);
    type TabRoute = {
        data?: any;
    } & Route;

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
        container: {
            flex: 1,
        },
        tabBarContainer: {
            backgroundColor: appColors.backgroundInactive,
            shadowOffset: { width: 0, height: 3 },
            shadowColor: 'black',
            shadowOpacity: 0.6,
            shadowRadius: 5,
        },
        tabBar: {
            // shadowOffset: { width: 0, height: 3 },
            // shadowColor: appColors(useDefaultStyle!).tertiary,
            // shadowOpacity: 0.6,
            // shadowRadius: 5,
            // elevation: 4,
            marginBottom: 0,
            borderBottomColor: '#333',
            borderBottomWidth: 0,
            width: 'auto',
        },
        tabBarIndicatorStyle: {
            backgroundColor: appColors.brandTint,
        },
        tabBarLabelStyle: {
            fontSize: 17, //appFonts.xs,
            fontFamily: appFonts.medium,
        },
        sceneContainerStyle: {},
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const MY_CONTENT = strings['tabs.my_content'];
    const EPG_KEY = strings['guide.header'];

    const conditionalRoutes: Route[] = [
        { key: EPG_KEY, title: EPG_KEY },
        { key: MY_CONTENT, title: MY_CONTENT },
    ];

    const routes = error ? [{ key: ERROR_KEY }] : [...containerRoutes, ...conditionalRoutes];

    const renderScene = (tabIndex: number) => {
        const route = routes[tabIndex];

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

        if (route.key === EPG_KEY) {
            return (
                <EpgGuideScreen
                    LoadingComponent={<AppLoadingIndicator />}
                    ErrorComponent={<AppErrorComponent />}
                    navigation={navigation}
                />
            );
        } else if (route.key === MY_CONTENT) {
            return <PurchasedScreen />;
        }

        return <CatalogScreen storefrontId={storeFrontId} tabId={route.key} tabName={route.title || ''} />;
    };

    useEffect(() => {
        startTimer(TimerType.Storefront);
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

    useEffect(
        () =>
            navigation.addListener('focus', () => {
                setIsFocused(true);
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );
    useEffect(
        () =>
            navigation.addListener('blur', () => {
                setIsFocused(false);
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    return (
        <BackgroundGradient>
            <>
                <View style={[styles.tabBar, { flexDirection: 'row', height: 48, justifyContent: 'space-between' }]}>
                    <View
                        style={{
                            marginHorizontal: appPadding.sm(true),
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            // width: 100,
                        }}>
                        <BrandLogo />
                    </View>
                    <View style={{ height: 48, flexShrink: 1, width: routes.length * 120, alignSelf: 'center' }}>
                        {!loading && !error && routes.length > 0 && isFocused && (
                            <MaterialTabs
                                allowFontScaling={false}
                                items={routes.map(i => (
                                    <Text style={styles.tabBarLabelStyle} accessibilityLabel={i.title} key={i.title}>
                                        {i.title}
                                    </Text>
                                ))}
                                selectedIndex={selectedTab}
                                onChange={setSelectedTab}
                                barColor={'transparent'}
                                indicatorColor={appColors.brandTint}
                                activeTextColor={appColors.secondary}
                                inactiveTextColor={appColors.caption}
                                textStyle={styles.tabBarLabelStyle}
                                background={TouchableNativeFeedback.Ripple('rgba(256, 256, 256, 0.2)', true)}
                            />
                        )}
                    </View>
                    <View
                        style={{
                            paddingHorizontal: appPadding.sm(true),
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                        <View style={{ marginRight: 16 }}>
                            <TouchableNativeFeedback
                                onPress={() => navigation.navigate(NAVIGATION_TYPE.SEARCH)}
                                background={TouchableNativeFeedback.Ripple(appColors.brandTint, true)}>
                                <SearchIcon width={26} height={26} />
                            </TouchableNativeFeedback>
                        </View>
                        <TouchableNativeFeedback
                            onPress={() => navigation.navigate(NAVIGATION_TYPE.SETTINGS)}
                            background={TouchableNativeFeedback.Ripple(appColors.brandTint, true)}>
                            <TabIconSettingsOff width={30} height={30} />
                        </TouchableNativeFeedback>
                    </View>
                </View>
                {!loading && !error && routes.length > 0 && renderScene(selectedTab)}
            </>
        </BackgroundGradient>
    );
};

export default StorefrontTVScreen;
