import React, { useContext, useEffect, useReducer } from 'react';

export enum TimerType {
    Storefront = 'timeToStoreFront',
    AppConfig = 'timeToAppConfig',
    Splash = 'timeToSplash',
}

enum TimerEvents {
    START = 'start',
    STOP = 'stop',
}

type TimerMap = { [key in TimerType]?: number };

interface State {
    timerStartMap: TimerMap;
    elapsedTime: TimerMap;
}

interface Action {
    type: string;
    event: TimerType;
    timer: number;
}

const initialState: State = {
    timerStartMap: {},
    elapsedTime: {},
};

const AnalyticsReducer = (state: State, action: Action): any => {
    switch (action.type) {
        case TimerEvents.START:
            state.timerStartMap[action.event] = action.timer;
            return {
                ...state,
            };
        case TimerEvents.STOP:
            const startTime = state.timerStartMap[action.event];
            state.timerStartMap[action.event] = undefined;
            if (startTime) {
                state.elapsedTime[action.event] = action.timer - startTime;
            }
            return {
                ...state,
            };
        default:
            return {
                ...state,
            };
    }
};

const TimerContext = React.createContext({
    ...initialState,
    startTimer: async (_: TimerType) => {},
    stopTimer: async (_: TimerType) => {},
});

type TimerContextProviderChildren = { children: React.ReactNode };

const TimerContextProvider = ({ children }: TimerContextProviderChildren) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [state, dispatch] = useReducer(AnalyticsReducer, initialState);

    useEffect(() => {
        const startTime = new Date().getTime();
        dispatch({
            type: TimerEvents.START,
            event: TimerType.Splash,
            timer: startTime,
        });
    }, []);

    const startTimer = (dispatchEvent: TimerType) => {
        const time = new Date().getTime();
        dispatch({
            type: TimerEvents.START,
            event: dispatchEvent,
            timer: time,
        });
    };

    const stopTimer = (dispatchEvent: TimerType) => {
        const elapsedTime = new Date().getTime();
        dispatch({
            type: TimerEvents.STOP,
            event: dispatchEvent,
            timer: elapsedTime,
        });
    };

    return (
        <TimerContext.Provider
            value={{
                ...state,
                startTimer: startTimer,
                stopTimer: stopTimer,
            }}>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = () => {
    const context = useContext(TimerContext);
    if (context === undefined) {
        throw new Error('useTimerContextState must be used within a TimerContextProvider');
    }
    return context;
};

export { TimerContext, TimerContextProvider };
