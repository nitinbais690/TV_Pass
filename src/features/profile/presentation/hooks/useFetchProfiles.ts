import { useCallback, useReducer, useEffect } from 'react';
import { useAuth } from 'contexts/AuthContextProvider';
import diContainer from 'di/di-config';
import { PROFILE_DI_TYPES } from 'features/profile/di/profile-di-types';
import { Profile } from 'features/profile/domain/entities/profile';
import { GetProfiles, GetProfilesParams } from 'features/profile/domain/use-cases/get-profiles';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { API_STATUS } from 'features/profile/api/profile-api-constants';

export function useFetchProfiles() {
    const { appConfig } = useAppPreferencesState();
    const { accessToken } = useAuth();

    const fetchProfiles = useCallback(async () => {
        updateState({ actionName: API_STATUS.LOADING });
        let getProfiles = diContainer.get<GetProfiles>(PROFILE_DI_TYPES.GetProfiles);
        try {
            if (appConfig && accessToken) {
                const response = await getProfiles.execute(new GetProfilesParams(accessToken, appConfig));
                // adding country since country calling code is needed when displaying profile's mobile number
                if (response.country) {
                    const contactsWithCountry = response.contactMessage.map(profile => {
                        profile.country = response.country;
                        return profile;
                    });
                    response.contactMessage = contactsWithCountry;
                }
                updateState({ actionName: API_STATUS.FETCHED, profiles: response.contactMessage });
            }
        } catch (e) {
            updateState({ actionName: API_STATUS.ERROR, error: e });
        }
    }, [accessToken, appConfig]);

    const initialState: FetchProfileState = {
        loading: true,
        profiles: [],
        error: undefined,
    };
    const updateState = ({
        actionName,
        loading,
        error,
        profiles,
    }: {
        actionName: string;
        loading?: boolean;
        error?: Error;
        profiles?: Profile[];
    }) => {
        const action: FetchProfileStateAction = {
            name: actionName,
            value: {
                loading: loading,
                error: error,
                profiles: profiles,
            },
        };
        dispatch(action);
    };

    const responseReducer = (current: FetchProfileState, action: FetchProfileStateAction): FetchProfileState => {
        switch (action.name) {
            case API_STATUS.LOADING: {
                return {
                    ...current,
                    loading: true,
                };
            }
            case API_STATUS.ERROR: {
                return {
                    ...current,
                    loading: false,
                    error: action.value ? action.value.error : undefined,
                };
            }
            case API_STATUS.FETCHED: {
                return {
                    ...current,
                    loading: false,
                    profiles: action.value ? action.value.profiles : undefined,
                    error: undefined,
                };
            }
            case API_STATUS.ON_UPDATE: {
                fetchProfiles();
                return {
                    ...current,
                    loading: true,
                };
            }
        }
        return current;
    };

    const [state, dispatch] = useReducer(responseReducer, initialState);

    useEffect(() => {
        fetchProfiles();
    }, [appConfig, fetchProfiles]);

    return [state, dispatch];
}

interface FetchProfileState {
    loading?: boolean;
    profiles?: Profile[];
    error?: Error;
}

interface FetchProfileStateAction {
    name: string;
    value?: FetchProfileState;
}
