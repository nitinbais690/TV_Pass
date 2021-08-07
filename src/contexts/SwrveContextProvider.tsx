import React, { createContext, useContext, useEffect } from 'react';
import { Linking } from 'react-native';
import { useAuth } from 'contexts/AuthContextProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const SWRVE_KEY = {
    opt_out_push: 'swrve.opt_out.push',
};

export interface SwrveState {
    swrveIdentify: (userId: string) => Promise<any>;
    swrveEvent: (eventName: string, payload?: any) => Promise<any>;
    swrveUserUpdate: (userObj: any) => Promise<any>;
}

export const initialState: SwrveState = {
    swrveIdentify: async () => {},
    swrveEvent: async () => {},
    swrveUserUpdate: async () => {},
};

export const SwrveContext = createContext(initialState);

export const SwrveContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { accountProfile } = useAuth();

    useEffect(() => {
        // setting this event to get the notification prompt
        swrveActions.swrveEvent('tvpass.app.start');
    }, [swrveActions]);

    useEffect(() => {
        if (accountProfile && accountProfile.accountId) {
            swrveActions.swrveIdentify(accountProfile.accountId);
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountProfile]);

    useEffect(() => {
        // if (!Platform.isTV) {
        const SwrveSDK = require('react-native-swrve-plugin');
        SwrveSDK.setListeners(
            /** Swrve listeners arg **/ null,
            { pushListener: onPushMessage, silentPushListener: onSilentPushMessage },
            /** in-app listeners arg **/ null,
        );
        // }

        Linking.addEventListener('url', event => {
            AsyncStorage.setItem('deeplink', event.url);
        });

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onPushMessage = async (payload: any) => {
        console.log('onPushMessage', payload);
    };

    const onSilentPushMessage = async (payload: any) => {
        console.log('onSilentPushMessage', payload);
    };

    const swrveActions = React.useMemo(
        () => ({
            swrveIdentify: async (userId: string) => {
                try {
                    // if (!Platform.isTV) {
                    const SwrveSDK = require('react-native-swrve-plugin');
                    let ident = await SwrveSDK.identify(userId);
                    console.log(`Identify successful - ident ${ident}`);
                    // }
                } catch (e) {
                    console.log('Identify failed', e);
                }
            },

            swrveEvent: async (eventName: string, payload?: any) => {
                try {
                    // if (!Platform.isTV) {
                    const SwrveSDK = require('react-native-swrve-plugin');
                    SwrveSDK.event(eventName, payload || {});
                    console.log(`Swrve event successful - ${eventName}`);
                    // }
                } catch (e) {
                    console.log(`Swrve event failed - ${eventName}`, e);
                }
            },

            swrveUserUpdate: async (userObj: any) => {
                try {
                    // if (!Platform.isTV) {
                    const SwrveSDK = require('react-native-swrve-plugin');
                    SwrveSDK.userUpdate(userObj);
                    console.log('Swrve userupdate successful');
                    // }
                } catch (e) {
                    console.log('Swrve userupdate failed', e);
                }
            },
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    return (
        <SwrveContext.Provider
            value={{
                ...swrveActions,
            }}>
            {children}
        </SwrveContext.Provider>
    );
};

export const useSwrve = () => {
    const context = useContext(SwrveContext);
    if (context === undefined) {
        throw new Error('useSwrve must be used within a SwrveContext');
    }
    return context;
};
