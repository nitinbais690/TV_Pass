import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import Animated from 'react-native-reanimated';
import { useFetchRootContainerQuery } from 'qp-discovery-ui';

import { useAppPreferencesState } from '../utils/AppPreferencesContext';
import { useAppState } from '../utils/AppContextProvider';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAppPreview } from '../contexts/AppPreviewContextProvider';

import CatalogScreen from '../screens/CatalogScreen';
import Button from '../screens//components/Button';
import BackgroundGradient from '../screens//components/BackgroundGradient';
import { AppEvents } from 'utils/ReportingUtils';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { TimerType, useTimer } from 'utils/TimerContext';
import FooterGradient from '../screens//components/FooterGradient';
import { selectDeviceType } from '../../src/components/qp-common-ui';
import { useOnboarding } from 'contexts/OnboardingContext';
import Menu from './components/Menu';
// import AppContant from 'utils/AppContant';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';

const SceneStyles = StyleSheet.create({
    page: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    initialFocusBtnTV: {
        height: 1,
        width: '100%',
        position: 'absolute',
        top: 0,
    },
});

const StorefrontScreenTV = ({ route }: { route?: any }): JSX.Element => {
    const { toggleModal } = useAppPreview();
    const { strings } = useLocalization();
    const { appNavigationState } = useAppState();
    const prefs = useAppPreferencesState();
    const { appConfig } = prefs;
    const storefrontId = (appConfig && appConfig.storefrontId) || '';
    const { loading, error, containers: tabContainers } = useFetchRootContainerQuery(storefrontId);
    const { elapsedTime, startTimer } = useTimer();
    const { recordEvent } = useAnalytics();
    const { onboardNavigation } = useOnboarding();
    const [initialHasTVPreferredFocusOnCarousel, setInitialHasTVPreferredFocusOnCarousel] = useState(true);
    const [hasMenuFocus, setHasMenuFocus] = useState(false);

    let { tabName, tabId }: { tabName: string; tabId: string } = '';
    if (route && route.params) {
        ({ tabName, tabId } = route.params);
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

    // const tvEventHandler = new TVEventHandler();

    // useEffect(() => {
    //     tvEventHandler.enable(this, function(cmp, evt) {
    //         if (evt && (evt.eventType === 'left' || evt.eventType === 'swipeLeft')) {
    //             sethasTVPreferredFocus(false);
    //         }
    //     });
    // }, [sethasTVPreferredFocus, tvEventHandler]);

    // useEffect(() => {
    //     return () => {
    //         tvEventHandler.disable();
    //     };
    // }, [tvEventHandler]);

    // const myTVEventHandler = (evt: { eventType: string }) => {
    //     if (evt.eventType === AppContant.down && !initialHasTVPreferredFocusOnCarousel) {
    //     } else if (evt.eventType === AppContant.left && initialHasTVPreferredFocusOnCarousel) {
    //         setHasMenuFocus(true);
    //         setInitialHasTVPreferredFocusOnCarousel(false);
    //     }
    // };

    // useTVEventHandler(myTVEventHandler);

    const onSetInitialFocus = () => {
        setHasMenuFocus(false);
        setInitialHasTVPreferredFocusOnCarousel(true);
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
        <>
            <BackgroundGradient>
                {/* Record event added for analytics */}
                <Animated.View style={[SceneStyles.page]}>
                    {tabContainers.length > 0 && (
                        <CatalogScreen
                            storefrontId={storefrontId}
                            tabId={tabId ? tabId : tabContainers[0].id}
                            tabName={tabName ? tabName : tabContainers[0].name}
                            blockFocusDownListReachedEnd={true}
                            initialHasTVPreferredFocusOnCarousel={initialHasTVPreferredFocusOnCarousel}
                            onSetInitialFocus={onSetInitialFocus}
                        />
                    )}
                </Animated.View>
                {/* Loading State */}
                {loading && !error && tabContainers.length === 0 ? <AppLoadingIndicator /> : null}

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

                <Menu
                    hasMenuFocus={hasMenuFocus}
                    isTabOn={tabName ? tabName : tabContainers && tabContainers.length > 0 && tabContainers[0].name}
                />
            </BackgroundGradient>
            {/* For Initial focus purpose */}
            <TouchableHighlight hasTVPreferredFocus={true} style={SceneStyles.initialFocusBtnTV}>
                <></>
            </TouchableHighlight>
        </>
    );
};

export default StorefrontScreenTV;
