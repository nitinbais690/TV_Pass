import React, { Context, useEffect, useContext, useCallback } from 'react';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useFetchProfiles } from 'features/profile/presentation/hooks/useFetchProfiles';
import { API_STATUS, PROFILE_ACTION_TYPES } from 'features/profile/api/profile-api-constants';
import { Profile } from 'features/profile/domain/entities/profile';
import { useAddOrUpdateContact } from 'features/profile/presentation/hooks/useAddOrUpdateContact';
import {
    getActiveProfileId,
    removeActiveProfile,
    setActiveProfile,
    setAppDisplayLanguage,
    setContentLanguage,
} from 'utils/UserPreferenceUtils';
import { useLocalization } from './LocalizationContext';
import { updateActiveProfileInProfileList } from 'features/profile/data/utils/ProfileUtils';
import { getLocalizedKey } from 'features/language-selection/utils';

interface ProfileState {
    loading: boolean;
    profiles: Profile[];
    activeProfile: Profile | null;
    error: boolean;
    errorObject: Error | undefined;
    preferredLang: string | null;
    preferredContentLang: string | null;
    setActiveProfile: (activeProfile: Profile) => Promise<void>;
    onProfileUpdated: () => Promise<void>;
    updateActiveAppLanguage: (language: string) => Promise<void>;
    updateActiveContentLanguage: (language: string) => Promise<void>;
    cleanupProfiles: () => Promise<void>;
}

const initialState: ProfileState = {
    loading: true,
    profiles: [],
    activeProfile: null,
    error: false,
    errorObject: undefined,
    preferredLang: null,
    preferredContentLang: null,
    setActiveProfile: async () => {},
    onProfileUpdated: async () => {},
    updateActiveAppLanguage: async () => {},
    updateActiveContentLanguage: async () => {},
    cleanupProfiles: async () => {},
};

const ProfilesContext: Context<ProfileState> = React.createContext({
    ...initialState,
});

const ProfilesContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { appConfig } = useAppPreferencesState();
    const [fetchState, fetchDispatch] = useFetchProfiles();
    const { profiles, loading } = fetchState;
    const { addOrUpdateContact } = useAddOrUpdateContact();
    const { setAppLanguage } = useLocalization();

    const [state, dispatch] = React.useReducer((prevState, action) => {
        switch (action.type) {
            case PROFILE_ACTION_TYPES.UPDATE_PROFILES:
                return {
                    ...prevState,
                    loading: false,
                    profiles: action.value,
                };
            case PROFILE_ACTION_TYPES.UPDATE_ACTIVE_PROFILE:
                return {
                    ...prevState,
                    activeProfile: action.value,
                    preferredLang: action.value.language,
                    preferredContentLang: action.value.contentLanguage,
                };
            case PROFILE_ACTION_TYPES.UPDATE_APP_LANG:
                return {
                    ...prevState,
                    preferredLang: action.value,
                };
            case PROFILE_ACTION_TYPES.UPDATE_CONTENT_LANG:
                return {
                    ...prevState,
                    preferredContentLang: action.value,
                };
            case PROFILE_ACTION_TYPES.PROFILE_ERROR:
            case PROFILE_ACTION_TYPES.LANGUAGE_ERROR:
                return {
                    ...prevState,
                    loading: false,
                    error: true,
                    errorObject: action.value,
                };
            case PROFILE_ACTION_TYPES.CLEANUP_PROFILES:
                return {
                    ...prevState,
                    loading: false,
                    profiles: [],
                    activeProfile: null,
                };
            default:
                return prevState;
        }
    }, initialState);

    const updateActiveProfile = useCallback(async () => {
        const profileId = await getActiveProfileId();
        const [profileList, activeProfile] = updateActiveProfileInProfileList(profiles, profileId);
        dispatch({ type: PROFILE_ACTION_TYPES.UPDATE_PROFILES, value: profileList });
        if (activeProfile) {
            dispatch({ type: PROFILE_ACTION_TYPES.UPDATE_ACTIVE_PROFILE, value: activeProfile });
        }
    }, [profiles]);

    useEffect(() => {
        if (!appConfig) {
            return;
        }
        if (!loading && profiles.length > 0) {
            updateActiveProfile();
        }
    }, [appConfig, loading, profiles, updateActiveProfile]);

    const profileContext = React.useMemo(
        () => ({
            onProfileUpdated: async () => {
                fetchDispatch({ name: API_STATUS.ON_UPDATE });
            },
            updateActiveContentLanguage: async (language: string) => {
                return new Promise(async resolve => {
                    let resState;
                    if (state.activeProfile) {
                        let profile = state.activeProfile;
                        profile.contentLanguage = language;
                        resState = await addOrUpdateContact(profile);
                        await setActiveProfile(profile);
                    } else {
                        await setContentLanguage(language);
                    }
                    dispatch({ type: PROFILE_ACTION_TYPES.UPDATE_CONTENT_LANG, value: language });
                    resolve(resState);
                });
            },
            updateActiveAppLanguage: async (language: string) => {
                return new Promise(async resolve => {
                    let resState;
                    if (state.activeProfile) {
                        let profile = state.activeProfile;
                        profile.language = language;
                        resState = await addOrUpdateContact(profile);
                        await setActiveProfile(profile);
                    } else {
                        await setAppDisplayLanguage(language);
                    }
                    setAppLanguage(getLocalizedKey(language));
                    dispatch({ type: PROFILE_ACTION_TYPES.UPDATE_APP_LANG, value: language });
                    resolve(resState);
                });
            },
            setActiveProfile: async (activeProfile: Profile) => {
                if (!activeProfile) {
                    return;
                }
                setAppLanguage(getLocalizedKey(activeProfile.language));
                await setActiveProfile(activeProfile);
                const [profileList] = updateActiveProfileInProfileList(profiles, activeProfile.contactID);
                dispatch({ type: PROFILE_ACTION_TYPES.UPDATE_PROFILES, value: profileList });
                dispatch({ type: PROFILE_ACTION_TYPES.UPDATE_ACTIVE_PROFILE, value: activeProfile });
            },
            cleanupProfiles: async () => {
                await removeActiveProfile();
                dispatch({ type: PROFILE_ACTION_TYPES.CLEANUP_PROFILES });
            },
        }),
        [addOrUpdateContact, fetchDispatch, profiles, setAppLanguage, state.activeProfile],
    );

    return <ProfilesContext.Provider value={{ ...state, ...profileContext }}>{children}</ProfilesContext.Provider>;
};

export { ProfilesContextProvider, ProfilesContext };

export const useProfiles = () => {
    const context = useContext(ProfilesContext);
    if (context === undefined) {
        throw new Error('useProfiles must be used within a ProfilesContext');
    }
    return context;
};
