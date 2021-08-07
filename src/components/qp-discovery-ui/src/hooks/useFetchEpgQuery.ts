import { useEffect, useContext, useReducer, useRef } from 'react';
import { ClientContext } from 'react-fetching-library';
import {
    fetchChannels as fetchChannelsAction,
    fetchEpgGrid as fetchEpgGridAction,
} from '../api/actions/fetchDiscoveryResource';
import { ResourceVm } from '../models/ViewModels';
import { ResourceResponse, EpgResponse } from '../models/Storefront.types';
import { metaDataResourceAdapter, epgChannelAdapter, epgAiringAdapter } from '../models/Adapters';

const initialState: State = {
    loading: true,
    containers: new Map<string, ResourceVm[]>(),
    timeSlotData: [],
    error: false,
    hasMore: false,
    channels: [],
};

interface Action {
    containers?: Map<string, ResourceVm[]>;
    channels?: ResourceVm[];
    type: string;
    errorObject?: any;
    hasMore?: boolean;
    loadMore?: () => Promise<void>;
}

export interface State {
    loading: boolean;
    error: boolean;
    errorObject?: any;
    containers: Map<string, ResourceVm[]>;
    channels: ResourceVm[];
    timeSlotData: string[];
    hasMore: boolean;
}

export interface EpgHookResponse extends State {
    loadMore: () => Promise<void>;
}

const RESET_STATE = 'response/reset';
const SET_LOADING = 'response/loading';
const SET_ERROR = 'response/error';
const ADD_CHANNELS = 'response/addChannels';

const EPG_TIMELINE_HRS: number = 24;
const EPG_TIMELINE_GAP_INTERVAL = 30; //in minutes
let EpgTimelineStartHrs: number = 6 * 60; //in minutes
let params: { [key: string]: any } = {};

const timeBarSlotListArr: string[] = [];

const responseReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case RESET_STATE: {
            return initialState;
        }
        case SET_ERROR: {
            return {
                ...state,
                loading: false,
                error: true,
                errorObject: action.errorObject,
            };
        }
        case ADD_CHANNELS: {
            const containers = state.containers;
            action.containers &&
                action.containers.forEach((value: ResourceVm[], key: string) => {
                    containers.set(key, value);
                });

            const newState = {
                ...state,
                loading: false,
                hasMore: action.hasMore || false,
                channels: [...state.channels, ...(action.channels ? action.channels : [])],
                timeSlotData: timeBarSlotListArr,
                containers: containers,
            };

            return newState;
        }
        case SET_LOADING: {
            return {
                ...state,
                loading: true,
            };
        }
    }
    return state;
};

export const useFetchEpgQuery = (startDate: string, endDate: string, pageSize: number): EpgHookResponse => {
    const { query } = useContext(ClientContext);
    const isMounted = useRef(true);
    var pageNumber = useRef(0);

    const [state, dispatch] = useReducer(responseReducer, initialState);

    const fetchEpgGridView = async (channelIds: string[]) => {
        const action = fetchEpgGridAction(channelIds, startDate, endDate);
        const epgResponse = await query<EpgResponse>(action);
        if (!epgResponse.payload) {
            return Promise.reject(epgResponse);
        }
        return processEpgResponse(epgResponse.payload);
    };

    const processEpgResponse = (resource: EpgResponse): [ResourceVm[], Map<string, ResourceVm[]>] => {
        const initialValue = new Map<string, ResourceVm[]>();
        if (!resource.data) {
            return [[], initialValue];
        }
        let uniq = {};
        let channels: ResourceVm[] = resource.data.map(dat => epgChannelAdapter(dat));
        channels = channels.filter(obj => !uniq[obj.id] && (uniq[obj.id] = true));
        const epgSchedules = resource.data.reduce((acc, channel) => {
            acc.set(
                channel.cId,
                channel.airings.map(airing => epgAiringAdapter(airing)),
            );
            return acc;
        }, initialValue);

        return [channels, epgSchedules];
    };

    const calculateEpgTimeBarSlots = () => {
        for (var i = 6; EpgTimelineStartHrs < (EPG_TIMELINE_HRS + 6) * 60; i++) {
            let time: string;
            var hh = Math.floor(EpgTimelineStartHrs / 60); // getting hours of day in 0-24 format
            var mm = EpgTimelineStartHrs % 60; // getting minutes of the hour in 0-55 format
            time = ('0' + (hh % 24)).slice(-2) + ':' + ('0' + mm).slice(-2); // + EPG_TIMELINE_FORMAT[Math.floor(hh / 12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
            EpgTimelineStartHrs = EpgTimelineStartHrs + EPG_TIMELINE_GAP_INTERVAL;
            timeBarSlotListArr.push(time);
        }
    };

    const handleQuery = async (): Promise<void> => {
        if (!isMounted.current) {
            return;
        }

        pageNumber.current++;

        params.pageSize = pageSize;
        params.pageNumber = pageNumber.current || 0;
        params.sortBy = 'cn';
        params.st = 'published';

        dispatch({ type: SET_LOADING });

        try {
            const action = fetchChannelsAction(params);
            const queryResponse = await query<ResourceResponse>(action);
            const resources = queryResponse.payload;
            if (!resources) {
                dispatch({ type: SET_ERROR });
                return;
            }

            const totalResults = (resources && resources.header && resources.header.count) || 0;
            const hasMore = totalResults > pageSize * pageNumber.current;

            if (resources && resources.data) {
                const channelIds: string[] = [];
                resources.data.forEach(r => {
                    if (r.ex_id) {
                        channelIds.push(r.ex_id);
                    }
                    return metaDataResourceAdapter(r);
                });

                const [channels, epgPrograms] = await fetchEpgGridView(channelIds);

                if (isMounted.current) {
                    dispatch({ type: ADD_CHANNELS, channels: channels, containers: epgPrograms, hasMore: hasMore });
                }
            } else if (isMounted.current) {
                dispatch({ type: ADD_CHANNELS, channels: [], containers: new Map(), hasMore: hasMore });
            }
        } catch (e) {
            dispatch({ type: SET_ERROR, errorObject: e });
        }
    };

    useEffect(() => {
        isMounted.current = true;
        calculateEpgTimeBarSlots();
        pageNumber.current = 0;
        dispatch({ type: RESET_STATE });
        handleQuery();
        return () => {
            isMounted.current = false;
        }; // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate]);

    const loadMore = (): Promise<void> => handleQuery();

    return {
        ...state,
        loadMore: loadMore,
    };
};
