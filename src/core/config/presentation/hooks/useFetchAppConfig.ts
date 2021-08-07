import { useEffect, useReducer, useRef, useCallback } from 'react';
import { TimerType, useTimer } from 'utils/TimerContext';
import { FetchOptions, FetchConfigs } from 'core/config';
import diContainer from 'di/di-config';
import { CORE_DI_TYPES } from 'core/di/core-di-types';
import { FetchConfigsParams } from 'core/config/domain/use-cases/fetching-configs';

const TYPE_FETCHING = 'fetching';
const TYPE_FETCHED = 'fetched';
const TYPE_ERROR = 'error';

export const useFetchAppConfig = (endPoint: string, options: FetchOptions) => {
    const isMounted = useRef(true);

    const initialState = {
        loading: true,
        status: 'idle',
        error: undefined,
        configData: undefined,
    };
    const { startTimer, stopTimer } = useTimer();

    const [state, dispatch] = useReducer((prevState, action) => {
        switch (action.type) {
            case TYPE_FETCHING:
                return { ...prevState, loading: true, error: undefined };
            case TYPE_FETCHED:
                return { ...prevState, configData: action.payload, loading: false };
            case TYPE_ERROR:
                return { ...prevState, error: action.payload, loading: false };
            default:
                return prevState;
        }
    }, initialState);

    const fetchData = useCallback(async () => {
        try {
            if (isMounted.current) {
                dispatch({ type: TYPE_FETCHING });
            }
            let fetchConfigsInstance = diContainer.get<FetchConfigs>(CORE_DI_TYPES.FetchConfigs);
            let configData = await fetchConfigsInstance.execute(new FetchConfigsParams(endPoint, options));
            if (!isMounted.current) {
                return;
            }
            dispatch({ type: TYPE_FETCHED, payload: configData });
        } catch (error) {
            if (!isMounted.current) {
                return;
            }
            dispatch({ type: TYPE_ERROR, payload: error.message });
        }
    }, [endPoint, options]);

    useEffect(() => {
        isMounted.current = true;
        if (!endPoint || !isMounted.current) {
            return;
        }
        startTimer(TimerType.AppConfig);
        fetchData();
        stopTimer(TimerType.AppConfig);
        return () => {
            isMounted.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endPoint, options, fetchData]);

    return { ...state, retry: fetchData };
};
