import React, { useState, useCallback, useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { metaDataResourceAdapter } from 'qp-discovery-ui';
import { AppConfig, useAppPreferencesState } from 'utils/AppPreferencesContext';
import { OnboardingContext } from 'contexts/OnboardingContext';
import { useCredits } from 'utils/CreditsContextProvider';
import { useAuth } from 'contexts/AuthContextProvider';
import OnboardingIntroScreen from 'screens/Onboarding/OnboardingIntroScreen';
import OnboardingCreditsButtonScreen from 'screens/Onboarding/OnboardingCreditsButtonScreen';
import OnboardingSelectContentScreen from 'screens/Onboarding/OnboardingSelectContentScreen';
import OnboardingRedeemContentScreen from 'screens/Onboarding/OnboardingRedeemContentScreen';
import OnboardingRulesIntroScreen from 'screens/Onboarding/OnboardingRulesIntroScreen';
import OnboardingHelpScreen from 'screens/Onboarding/OnboardingHelpScreen';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import detailsMockData from '../configs/MovieSelectionMockData.json';

/**
 * OnboardingContextProvider manages onboarding functionalities and modal overlay
 */

const screenTypes: any = {
    '1': 'onboardingIntro',
    '2': 'onboardingCreditButton',
    '3': 'onboardingSelectContent',
    '4': 'onboardingRedeemContent',
    '5': 'onboardingRulesIntro',
    // '6': 'onboardingReceiveCredit',
    '7': 'onboardingHelpScreen',
};

const ONBOARD_KEY = 'onboardStatus';
const ONBOARD_COMPLETED_KEY = 'COMPLETED';

export const OnboardingContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [navigateTo, setNavigateTo] = useState('');
    const [initScreen, setInitScreen] = useState('');
    const [onboardingResource, setOnboardingResource] = useState(undefined);
    const [finishedOnboarding, setFinishedOnboarding] = useState(false);
    const userAction = useAuth();
    const navigation = useNavigation();
    const { setString, accountProfile } = userAction;
    const { appConfig } = useAppPreferencesState();
    const { fetchCredits } = useCredits();

    useEffect(() => {
        // We should show onboarding flow if the account profile
        // does not have any flags indicating `onboardStatus`
        // We should show the onboarding in following cases:
        // 1. User sign up and subscribed in current session
        // 2. User completed subscription in current session
        // 3. We should not show onboarding even if
        // user skipped onboarding on the very first step
        if (accountProfile) {
            let onboardingAttribute;
            const hasViewedOnboarding =
                accountProfile.stringAttribute &&
                accountProfile.stringAttribute.filter(
                    attribute => attribute.attributeType.attributeName === ONBOARD_KEY,
                ).length > 0;
            if (
                accountProfile.stringAttribute &&
                accountProfile.stringAttribute.filter(
                    attribute => attribute.attributeType.attributeName === ONBOARD_KEY,
                ).length > 0
            ) {
                onboardingAttribute = accountProfile.stringAttribute.filter(
                    attribute => attribute.attributeType.attributeName === ONBOARD_KEY,
                );
                setFinishedOnboarding(onboardingAttribute[0].value === ONBOARD_COMPLETED_KEY);
            }
            if (!hasViewedOnboarding) {
                if (Platform.isTV) {
                    navigation.navigate(NAVIGATION_TYPE.CREDITS_WALKTHROUGH);
                } else {
                    onboardNavigation('onboardingIntro');
                }
            }
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let resource = onboardMetadata(appConfig);
        if (!resource) {
            // fallback to pre-defined resource
            resource = {
                ...metaDataResourceAdapter(detailsMockData as any),
                layout: 'banner',
                showFooter: false,
            };
        }
        setOnboardingResource(resource as any);
    }, [appConfig]);

    useEffect(() => {
        if (navigateTo) {
            const keys = Object.keys(screenTypes);
            const values = Object.values(screenTypes);
            const index = values.indexOf(navigateTo);
            if (index === values.length - 1) {
                handleSetString(ONBOARD_COMPLETED_KEY);
            } else {
                handleSetString(keys[index]);
            }
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigateTo]);

    const styles = StyleSheet.create({
        modal: {
            flex: 1,
            margin: 0,
            padding: 0,
            zIndex: 0,
        },
    });

    const onboardToggleModal = (toggle = '') => {
        const toggled = toggle !== '' ? (toggle === 'true' ? true : false) : !isModalVisible;
        setModalVisible(toggled);
    };

    const onboardNavigation = useCallback(
        (sName = '') => {
            //sName === 'onboardingCreditButton' && setModalVisible(false);
            setModalVisible(true);
            /*LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);*/
            if (sName === '') {
                let onboardStatus = '1';
                // if (serverOnboardStatus) {
                //     onboardStatus = serverOnboardStatus;
                // }
                sName = screenTypes[onboardStatus];
            }

            if (sName === NAVIGATION_TYPE.SETTINGS) {
                setInitScreen(sName);
            }

            setNavigateTo(sName);
        },
        //eslint-disable-next-line react-hooks/exhaustive-deps
        [navigation],
    );

    const onboardSkip = () => {
        setModalVisible(false);
        const thisRoute = initScreen === NAVIGATION_TYPE.SETTINGS ? NAVIGATION_TYPE.SETTINGS : NAVIGATION_TYPE.BROWSE;
        navigation.navigate(thisRoute);
    };

    const OnboardScreen = (navigateToScreen: string): any => {
        let thisScreen = <OnboardingIntroScreen />;
        switch (navigateToScreen) {
            case 'onboardingIntro':
                thisScreen = <OnboardingIntroScreen />;
                break;
            case 'onboardingCreditButton':
                thisScreen = <OnboardingCreditsButtonScreen />;
                break;
            case 'onboardingSelectContent':
                thisScreen = <OnboardingSelectContentScreen />;
                break;
            case 'onboardingRedeemContent':
                thisScreen = <OnboardingRedeemContentScreen />;
                break;
            case 'onboardingRulesIntro':
                thisScreen = <OnboardingRulesIntroScreen />;
                break;
            // case 'onboardingReceiveCredit':
            //     thisScreen = <OnboardingReceiveCreditScreen />;
            //     break;
            case 'onboardingHelpScreen':
                thisScreen = <OnboardingHelpScreen />;
                break;
        }

        return thisScreen;
    };

    const handleSetString = (onboardStatus: string) => {
        setString({
            attributeName: ONBOARD_KEY,
            attributeValue: onboardStatus,
            objectTypeName: 'Account',
        })
            .then(() => {
                if (onboardStatus === ONBOARD_COMPLETED_KEY) {
                    fetchCredits();
                }
            })
            .catch((err: any) => {
                console.debug('[OnboardContext] Error setting string:', err);
            });
    };

    const onboardMetadata = (appConfig: AppConfig | undefined) => {
        if (!(appConfig && appConfig.onboardingResourceNew)) {
            return undefined;
        }

        try {
            const resourceJsonString = global.Buffer.from(appConfig.onboardingResourceNew, 'base64').toString('ascii');
            const resourceJson = JSON.parse(resourceJsonString);
            return {
                ...metaDataResourceAdapter(resourceJson),
                layout: 'banner',
                showFooter: false,
            };
        } catch (e) {
            console.error('[Onboard Resource] Error parsing onboard meta-data: ', e);
        }
        return undefined;
    };

    return (
        <OnboardingContext.Provider
            value={{
                isModalVisible,
                onboardToggleModal,
                onboardNavigation,
                onboardSkip,
                onboardingResource,
                finishedOnboarding,
            }}>
            <>
                {children}
                <Modal
                    supportedOrientations={['portrait', 'portrait-upside-down', 'landscape-left', 'landscape-right']}
                    style={styles.modal}
                    animationIn={'fadeIn'}
                    backdropOpacity={1}
                    hardwareAccelerated
                    hideModalContentWhileAnimating
                    isVisible={isModalVisible}
                    useNativeDriver={true}
                    onRequestClose={() => {
                        if (navigateTo === NAVIGATION_TYPE.SETTINGS) {
                            onboardSkip();
                        }
                    }}>
                    {isModalVisible && OnboardScreen(navigateTo)}
                </Modal>
            </>
        </OnboardingContext.Provider>
    );
};
