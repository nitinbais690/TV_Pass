import React, { createContext, useContext, useEffect } from 'react';
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo';

interface NetworkState {
    type: NetInfoStateType;
    isInternetReachable: boolean | null;
    retry: () => Promise<void>;
}

const initialState: NetworkState = {
    type: NetInfoStateType && NetInfoStateType.unknown,
    isInternetReachable: null,
    retry: async () => {},
};

export const NetworkContext = createContext<NetworkState>(initialState);

export const NetworkContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = React.useReducer((prevState, action) => {
        if (action.type === 'UPDATE_STATE') {
            return {
                ...prevState,
                type: action.value.type,
                isInternetReachable: action.value.isInternetReachable,
            };
        } else if (action.type === 'RESET_STATE') {
            return {
                ...initialState,
            };
        }
        return prevState;
    }, initialState);

    const fetchNetState = async () => {
        const netInfoState = await NetInfo.fetch();
        dispatch({ type: 'UPDATE_STATE', value: netInfoState });
    };

    const retry = async () => {
        dispatch({ type: 'RESET_STATE' });
        await fetchNetState();
    };

    useEffect(() => {
        fetchNetState();

        const unsubscribe = NetInfo.addEventListener(netInfoState => {
            dispatch({ type: 'UPDATE_STATE', value: netInfoState });
        });

        return () => unsubscribe();
    }, []);

    console.debug('[NetworkContext] changed: ', state);

    return (
        <NetworkContext.Provider
            value={{
                ...state,
                retry: retry,
            }}>
            {children}
        </NetworkContext.Provider>
    );
};

export const useNetworkStatus = () => {
    const context = useContext(NetworkContext);
    if (context === undefined) {
        throw new Error('useNetworkStatus must be used within a NetworkContextProvider');
    }
    return context;
};
