import { useEffect, useReducer, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimerType, useTimer } from 'utils/TimerContext';
import { KeyValuePair } from '../AppConfigModel';

const TYPE_FETCHING = 'fetching';
const TYPE_FETCHED = 'fetched';
const TYPE_ERROR = 'error';

const APP_CONFIG_CACHE_KEY = 'AppConfigCacheKey';

export interface FetchOptions {
    queryParams?: KeyValuePair;
    headers?: KeyValuePair;
}

const getQueryString = (params: any) => {
    const obj = Object.keys(params)
        .map(k => k + '=' + params[k])
        .join('&');
    return obj;
};

export const useFetchAppConfig = (endPoint: string, options: FetchOptions) => {
    const isMounted = useRef(true);
    const queryParams = '?' + getQueryString(options.queryParams);
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

    const processConfigResponse = (response: any): { [key: string]: string } => {
        let appConfig: { [key: string]: string } = {};
        response.forEach((item: any) => {
            appConfig[item.key] = item.value;
        });
        return appConfig;
    };
    const fetchData = useCallback(async () => {
        try {
            if (isMounted.current) {
                dispatch({ type: TYPE_FETCHING });
            }
            const response = await fetch(endPoint + queryParams);
            const payload = await response.json();
            const payloadData = payload.data.flatMap((obj: any) => obj.attrs);
            const configData = processConfigResponse(payloadData);
            if (!isMounted.current) {
                return;
            }
            await AsyncStorage.setItem(APP_CONFIG_CACHE_KEY, JSON.stringify(configData));
            dispatch({ type: TYPE_FETCHED, payload: configData });
        } catch (error) {
            if (!isMounted.current) {
                return;
            }

            const cachedConfigString = await AsyncStorage.getItem(APP_CONFIG_CACHE_KEY);
            if (cachedConfigString) {
                const cachedConfigData = JSON.parse(cachedConfigString);
                dispatch({ type: TYPE_FETCHED, payload: cachedConfigData });
            } else {
                dispatch({ type: TYPE_ERROR, payload: error.message });
            }
        }
    }, [endPoint, queryParams]);

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
    }, [endPoint, queryParams, fetchData]);

    return { ...state, retry: fetchData };
};
