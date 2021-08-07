import React, { createContext, useContext, useEffect, useReducer, Dispatch } from 'react';
import GoogleCast, { CastDevice } from 'react-native-google-cast';

export interface CastMessage {
    messageName: MessageName;
    messageType: MessageType;
    messageOrigin: MessageOrigin;
    message: any;
}

enum MessageOrigin {
    SENDER = 'sender',
    RECEIVER = 'receiver',
}

enum MessageType {
    ERROR = 'error',
    INFO = 'info',
    SUCCESS = 'success',
}

enum MessageName {
    USER_CONTEXT = 'userContext',
    PLAYBACK_AUTHORISATION = 'playbackAuthorisation',
    DEVICE_REGISTRATION = 'deviceRegistration',
    CUSTOM = 'custom',
}

export interface CastState {
    isCastSessionActive: boolean;
    device?: CastDevice;
    dispatch: Dispatch<any>;
}

export const initialState: CastState = {
    isCastSessionActive: false,
    device: undefined,
    dispatch: () => {},
};

export const CastContext = createContext(initialState);

export const castReducer = (castState: CastState, action: any): CastState => {
    switch (action.type) {
        case 'SESSION_STARTED':
            return { ...castState, isCastSessionActive: true };
        case 'SESSION_ENDED':
            return { ...castState, isCastSessionActive: false };
        case 'DEVICE_INFO':
            return { ...castState, device: action.value };
        default:
            return castState;
    }
};

export const CastContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(castReducer, initialState);

    useEffect(() => {
        console.debug('[CastContextProvider] setup cast listeners');

        // Cast might have resumed while this context loads, so need this check
        const autoDiscover = async () => {
            const castState = await GoogleCast.getCastState();
            console.debug('[GoogleCast] autoDisover state', castState);
            if (castState === 'Connected') {
                dispatch({
                    type: 'SESSION_STARTED',
                });
            }
        };

        GoogleCast.EventEmitter.addListener(GoogleCast.SESSION_ENDED, () => {
            console.debug('[CastContextProvider][GoogleCast] Session ended');
            dispatch({
                type: 'SESSION_ENDED',
            });
        });

        GoogleCast.EventEmitter.addListener(GoogleCast.SESSION_RESUMED, () => {
            console.debug('[GoogleCast] Session resumed');
            dispatch({
                type: 'SESSION_STARTED',
            });
        });

        autoDiscover();

        return () => {
            GoogleCast.EventEmitter.removeAllListeners(GoogleCast.SESSION_ENDED);
            GoogleCast.EventEmitter.removeAllListeners(GoogleCast.SESSION_RESUMED);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchDeviceInfo = async () => {
            const device = await GoogleCast.getCastDevice();
            dispatch({ type: 'DEVICE_INFO', value: device });
        };

        if (state.isCastSessionActive) {
            fetchDeviceInfo();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.isCastSessionActive]);

    return <CastContext.Provider value={{ ...state, dispatch }}>{children}</CastContext.Provider>;
};

export const useCastContext = () => {
    const context = useContext(CastContext);
    if (context === undefined) {
        throw new Error('useCastContext must be used within a CastContext');
    }
    return context;
};
