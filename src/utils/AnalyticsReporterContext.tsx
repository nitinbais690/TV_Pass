import { default as newRelic } from 'rn-qp-nxg-newrelic';
import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { useAuth } from 'contexts/AuthContextProvider';
import { ResourceVm } from 'qp-discovery-ui';
import { Download, PlayerConfig } from 'rn-qp-nxg-player';
import {
    ActionEvents,
    AppEvents,
    Attributes,
    PageEvents,
    removeUndefined,
    RN_INTERACTION,
    TABLE,
} from './ReportingUtils';
import { AppState } from 'react-native';
import { getStreamQuality } from './UserPreferenceUtils';
import DeviceInfo from 'react-native-device-info';
import { useSwrve } from 'contexts/SwrveContextProvider';

interface State {
    connectionBandwidthSpeed?: number;
    downloadTracker?: any;
}
interface Action {
    type: string;
    connectionBandwidthSpeed?: number;
    downloadItem: Download;
}
//NOTE: DownloadTracker added to stop the re-reporting of Download events to NR in the scenario of multiple concurrent downloads
const initialState: State = {
    connectionBandwidthSpeed: undefined,
    downloadTracker: {},
};

const AnalyticsReducer = (state: State, action: Action): any => {
    switch (action.type) {
        case 'DOWNLOAD_TRACK_UPDATE':
            state.downloadTracker[action.downloadItem.id] = action.downloadItem.state;
            return {
                ...state,
            };
        default:
            return {
                ...state,
            };
    }
};

const AnalyticsContext = React.createContext({
    ...initialState,
    recordEvent: async (
        _: AppEvents | RN_INTERACTION | ActionEvents | PageEvents,
        _attributes?: any,
        _isSwrveEvent?: boolean,
    ) => {},
    condensePlayerData: async (_playerConfig?: PlayerConfig, _resource?: ResourceVm, _attributes?: any) => {},
    recordErrorEvent: async (_: string, _attributes?: any) => {},
    downloadTrackUpdate: async (_: Download) => {},
});

type AnalyticsContextProviderChildren = { children: React.ReactNode };

const AnalyticsContextProvider = ({ children }: AnalyticsContextProviderChildren) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [state, dispatch] = useReducer(AnalyticsReducer, initialState);
    const { accountProfile, silentLogin } = useAuth();
    const appState = useRef(AppState.currentState);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const { swrveEvent } = useSwrve();
    const reportingDeviceID = DeviceInfo.getUniqueId();

    useEffect(() => {
        AppState.addEventListener('change', _handleAppStateChange);
        return () => {
            AppState.removeEventListener('change', _handleAppStateChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountProfile !== undefined]);

    const _handleAppStateChange = (nextAppState: any) => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
            recordEvent(AppEvents.APP_FOREGROUND);
        } else if (nextAppState === 'inactive' || nextAppState === 'background') {
            recordEvent(ActionEvents.ACTION_APP_BACKGROUND);
        }
        appState.current = nextAppState;
        setAppStateVisible(appState.current);
    };

    const recordEvent = async (
        event: AppEvents | RN_INTERACTION | ActionEvents | PageEvents,
        attributes?: any,
        isSwrveEvent?: boolean,
    ) => {
        const condenseData =
            event === ActionEvents.ACTION_USER_SETUP_COMPLETE ? {} : removeUndefined(await condenseUserData());
        let attribute = attributes ? removeUndefined(attributes) : {};
        const table = event === RN_INTERACTION.RECORD_INTERACTION ? TABLE.INTERACTION : TABLE.TVPASS;
        //table = Screen_Tracking / TvPass

        newRelic.report(table, {
            name: event,
            ...condenseData,
            ...attribute,
        });

        if (isSwrveEvent !== undefined && isSwrveEvent === true) {
            swrveEvent(event, attributes);
        }
    };

    const recordErrorEvent = async (event: string, attributes?: any) => {
        const condenseData = condenseUserData ? await condenseUserData() : {};
        let attribute = attributes ? attributes : {};
        //table = DevLogs
        newRelic.report(TABLE.ERROR, {
            event: event,
            ...condenseData,
            ...attribute,
        });
    };

    const downloadTrackUpdate = (download: Download) => {
        dispatch({
            type: 'DOWNLOAD_TRACK_UPDATE',
            downloadItem: download,
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
                userDataAttributes.isGracePeriod = accountProfile.withinGracePeriod;
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
            if (accountProfile.subscriptionStatus) {
                userDataAttributes.subscriptionStatus = accountProfile.subscriptionStatus;
            }
        }
        if (prefQuality) {
            userDataAttributes.prefPlaybackQuality = prefQuality;
        }
        userDataAttributes.silentLogin = silentLogin;
        userDataAttributes.deviceID = reportingDeviceID;

        return userDataAttributes;
    };

    return (
        <>
            <AnalyticsContext.Provider
                value={{
                    ...state,
                    recordEvent: recordEvent,
                    recordErrorEvent: recordErrorEvent,
                    downloadTrackUpdate: downloadTrackUpdate,
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
