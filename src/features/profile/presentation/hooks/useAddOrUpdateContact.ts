import diContainer from 'di/di-config';
import { useCallback } from 'react';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { PROFILE_DI_TYPES } from 'features/profile/di/profile-di-types';
import { useAuth } from 'contexts/AuthContextProvider';
import { AddOrUpdateContact, AddOrUpdateContactParams } from 'features/profile/domain/use-cases/app-update-contact';
import { Profile } from 'features/profile/domain/entities/profile';

export function useAddOrUpdateContact() {
    const { appConfig } = useAppPreferencesState();
    const { accessToken } = useAuth();

    const state: AddOrUpdateContactState = {
        loading: true,
        success: false,
        error: undefined,
    };

    const addOrUpdateContact = useCallback(
        async (profile: Profile) => {
            let addOrUpdateContactDI = diContainer.get<AddOrUpdateContact>(PROFILE_DI_TYPES.AddOrUpdateContact);
            try {
                if (appConfig && accessToken) {
                    await addOrUpdateContactDI.execute(new AddOrUpdateContactParams(profile, accessToken, appConfig));
                    state.success = true;
                    state.loading = false;
                }
            } catch (e) {
                state.success = false;
                state.loading = false;
                state.error = e;
            }
            return state;
        },
        [accessToken, appConfig, state],
    );

    interface AddOrUpdateContactState {
        loading?: boolean;
        success?: boolean;
        error?: Error;
    }

    return {
        addOrUpdateContact,
    };
}
