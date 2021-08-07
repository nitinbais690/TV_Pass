import { default as newRelic } from 'rn-qp-nxg-newrelic';
import CleverTap from 'clevertap-react-native';
import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { useAuth } from 'contexts/AuthContextProvider';
import { ResourceVm } from 'qp-discovery-ui';
import { PlayerConfig } from 'rn-qp-nxg-player';
import { AppEvents, Attributes, removeUndefined, RN_INTERACTION, TABLE } from './ReportingUtils';
import { AppState } from 'react-native';
import { getStreamQuality } from './UserPreferenceUtils';
import DeviceInfo from 'react-native-device-info';

interface State {
    connectionBandwidthSpeed?: number;
}
interface Action {
    type: string;
    connectionBandwidthSpeed?: number;
}

const initialState: State = {
    connectionBandwidthSpeed: undefined,
};

const AnalyticsReducer = (state: State, action: Action): any => {
    switch (action.type) {
        default:
            return {
                ...state,
            };
    }
};

const AnalyticsContext = React.createContext({
    ...initialState,
    recordEvent: async (_: AppEvents | RN_INTERACTION, _attributes?: any) => {},
    condensePlayerData: async (_playerConfig?: PlayerConfig, _resource?: ResourceVm, _attributes?: any) => {},
    recordErrorEvent: async (_: string, _attributes?: any) => {},
});

type AnalyticsContextProviderChildren = { children: React.ReactNode };

const AnalyticsContextProvider = ({ children }: AnalyticsContextProviderChildren) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [state, dispatch] = useReducer(AnalyticsReducer, initialState);
    const { accountProfile, silentLogin } = useAuth();
    const appState = useRef(AppState.currentState);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    useEffect(() => {
        AppState.addEventListener('change', _handleAppStateChange);
        return () => {
            AppState.removeEventListener('change', _handleAppStateChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const _handleAppStateChange = (nextAppState: any) => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
            recordEvent(AppEvents.APP_FOREGROUND);
        } else if (nextAppState === 'background') {
            recordEvent(AppEvents.APP_BACKGROUND);
        }
        appState.current = nextAppState;
        setAppStateVisible(appState.current);
    };

    const recordEvent = async (event: AppEvents | RN_INTERACTION, attributes?: any) => {
        const condenseData = event === AppEvents.SIGN_UP ? {} : removeUndefined(await condenseUserData());
        let attribute = attributes ? removeUndefined(attributes) : {};
        const table = event === RN_INTERACTION.RECORD_INTERACTION ? TABLE.INTERACTION : TABLE.TVPASS;
        //table = Screen_Tracking / TvPass
        console.log(`CleverTap.recordEvent  : ${event} ${attributes}`);

        newRelic.report(table, {
            name: event,
            ...condenseData,
            ...attribute,
        });
        CleverTap.setDebugLevel(3);
        CleverTap.profileGetCleverTapID((err, res) => {
            console.log('CleverTapID', res, err);
        });
    };

    const recordErrorEvent = async (event: string, attributes?: any) => {
        const condenseData = condenseUserData ? removeUndefined(await condenseUserData()) : {};
        let attribute = attributes ? removeUndefined(attributes) : {};
        //table = DevLogs
        newRelic.report(TABLE.ERROR, {
            event: event,
            ...condenseData,
            ...attribute,
        });
    };
    const fetchQuality = async () => {
        try {
            const prefQuality = await getStreamQuality();
            return prefQuality !== null ? prefQuality : undefined;
        } catch {
            console.debug('Unable to fetch Stream Quality');
        }
    };

    const condenseUserData = async () => {
        const prefQuality = await fetchQuality();
        let userDataAttributes: Attributes = {};
        if (accountProfile) {
            if (accountProfile.contactMessage && accountProfile.contactMessage.length > 0) {
                userDataAttributes.profileID = accountProfile.contactMessage[0].contactID;
            }
            if (accountProfile.accountId) {
                userDataAttributes.userID = accountProfile.accountId;
            }
            if (accountProfile.withinGracePeriod !== undefined) {
                userDataAttributes.withinGracePeriod = accountProfile.withinGracePeriod;
            }
            if (accountProfile.isUserFreeTrial) {
                userDataAttributes.isFreeTrial = accountProfile.isUserFreeTrial === 'N' ? false : true;
            }
            if (accountProfile.baseSubscription) {
                userDataAttributes.baseSubscription = accountProfile.baseSubscription;
            }
            if (accountProfile.addonSubscriptionOneTime) {
                userDataAttributes.addonSubscriptionOneTime = accountProfile.addonSubscriptionOneTime;
            }
            if (accountProfile.addonSubscriptionRecurring) {
                userDataAttributes.addonSubscriptionRecurring = accountProfile.addonSubscriptionRecurring;
            }
        }
        if (prefQuality) {
            userDataAttributes.prefPlaybackQuality = prefQuality;
        }
        userDataAttributes.silentLogin = silentLogin;
        userDataAttributes.deviceID = DeviceInfo.getUniqueId();

        return userDataAttributes;
    };

    return (
        <>
            <AnalyticsContext.Provider
                value={{
                    ...state,
                    recordEvent: recordEvent,
                    recordErrorEvent: recordErrorEvent,
                }}>
                {children}
            </AnalyticsContext.Provider>
        </>
    );
};

export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    if (context === undefined) {
        throw new Error('useAnalyticsContextState must be used within a AnalyticsContextProvider');
    }
    return context;
};

export { AnalyticsContext, AnalyticsContextProvider };
