import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, LayoutAnimation } from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { useAppState } from 'utils/AppContextProvider';
import { AppConfig, useAppPreferencesState } from 'utils/AppPreferencesContext';
import { OnboardingContext } from 'contexts/OnboardingContext';
import { useCredits } from 'utils/CreditsContextProvider';
import { useAuth } from 'contexts/AuthContextProvider';
import OnboardingIntroScreen from 'screens/Onboarding/OnboardingIntroScreen';
import OnboardingCreditsButtonScreen from 'screens/Onboarding/OnboardingCreditsButtonScreen';
import OnboardingSelectContentScreen from 'screens/Onboarding/OnboardingSelectContentScreen';
import OnboardingRedeemContentScreen from 'screens/Onboarding/OnboardingRedeemContentScreen';
import OnboardingRulesIntroScreen from 'screens/Onboarding/OnboardingRulesIntroScreen';
import OnboardingReceiveCreditScreen from 'screens/Onboarding/OnboardingReceiveCreditScreen';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { ErrorEvents } from 'utils/ReportingUtils';
import DetailPopup from 'features/details/presentation/components/template/DetailPopupScreen';

/**
 * OnboardingContextProvider manages onboarding functionalities and modal overlay
 */

const screenTypes: any = {
    '1': 'onboardingIntro',
    '2': 'onboardingCreditButton',
    '3': 'onboardingSelectContent',
    '4': 'onboardingRedeemContent',
    '5': 'onboardingRulesIntro',
    '6': 'onboardingReceiveCredit',
};

const ONBOARD_COMPLETED_KEY = 'COMPLETED';

export const OnboardingContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [detailModelResource, setDetailModelResource] = useState({});
    const [navigateTo, setNavigateTo] = useState('');
    const [initScreen, setInitScreen] = useState('');
    const [serverOnboardStatus, setServerOnboardStatus] = useState<string | undefined>(undefined);
    const userAction = useAuth();
    const navigation = useNavigation();
    const { setString } = userAction;
    const { signedUpInSession } = useAppState();
    const { appConfig } = useAppPreferencesState();
    const { fetchCredits } = useCredits();
    const { recordErrorEvent } = useAnalytics();

    useEffect(() => {
        if (signedUpInSession) {
            onboardNavigation('onboardingIntro');
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signedUpInSession]);

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
            screenTypes[index];
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

    const navigateToDetail = () => {
        const resource = onboardMetadata(appConfig);
        setDetailModelResource({
            resource: resource,
            resourceId: resource.id,
            resourceType: resource.type,
        });
    };

    const onModelClosed = () => {
        setDetailModelResource({});
    };

    const onboardToggleModal = (toggle = '') => {
        const toggled = toggle !== '' ? (toggle === 'true' ? true : false) : !isModalVisible;
        setModalVisible(toggled);
    };

    const onboardNavigation = useCallback(
        (sName = '') => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setModalVisible(true);
            if (sName === '') {
                let onboardStatus = '1';
                // if (serverOnboardStatus) {
                //     onboardStatus = serverOnboardStatus;
                // }
                sName = screenTypes[onboardStatus];
            }

            if (sName === 'Settings') {
                setInitScreen(sName);
            }

            if (
                [
                    'onboardingIntro',
                    'onboardingCreditButton',
                    'onboardingSelectContent',
                    'onboardingReceiveCredit',
                ].includes(sName)
            ) {
                navigation.navigate(NAVIGATION_TYPE.BROWSE);
            }
            if (['onboardingRedeemContent', 'onboardingRulesIntro'].includes(sName)) {
                navigateToDetail();
            }
            setNavigateTo(sName);
        },
        //eslint-disable-next-line react-hooks/exhaustive-deps
        [navigation, serverOnboardStatus],
    );

    const onboardSkip = () => {
        setModalVisible(false);
        const thisRoute = initScreen === 'Settings' ? NAVIGATION_TYPE.SETTINGS : NAVIGATION_TYPE.BROWSE;
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
            case 'onboardingReceiveCredit':
                thisScreen = <OnboardingReceiveCreditScreen />;
                break;
        }

        return thisScreen;
    };

    const handleSetString = (onboardStatus: string) => {
        setString({
            attributeName: 'onboardStatus',
            attributeValue: onboardStatus,
            objectTypeName: 'Account',
        })
            .then(() => {
                setServerOnboardStatus(onboardStatus);

                if (onboardStatus === ONBOARD_COMPLETED_KEY) {
                    fetchCredits();
                }
            })
            .catch((err: any) => {
                console.debug('[OnboardContext] Error setting string:', err);
            });
    };

    const onboardMetadata = (appConfig: AppConfig | undefined) => {
        if (!(appConfig && appConfig.onboardingResource)) {
            return {};
        }

        try {
            const resourceJsonString = global.Buffer.from(appConfig.onboardingResource, 'base64').toString('ascii');
            const resourceJson = JSON.parse(resourceJsonString);
            return resourceJson;
        } catch (e) {
            recordErrorEvent(ErrorEvents.ONBOARD_RESOURCE_ERROR, { error: e });
            console.error('[Onboard Resource] Error parsing onboard meta-data: ', e);
        }
        return {};
    };
    return (
        <OnboardingContext.Provider
            value={{
                isModalVisible,
                onboardToggleModal,
                onboardNavigation,
                onboardSkip,
            }}>
            <>
                {children}
                <Modal
                    supportedOrientations={['portrait', 'portrait-upside-down', 'landscape-left', 'landscape-right']}
                    style={styles.modal}
                    backdropOpacity={navigateTo === 'onboardingIntro' ? 1 : 0.6}
                    isVisible={isModalVisible}
                    useNativeDriver={true}>
                    {isModalVisible && OnboardScreen(navigateTo)}
                </Modal>

                <DetailPopup onModelClosed={onModelClosed} data={detailModelResource} />
            </>
        </OnboardingContext.Provider>
    );
};
