import diContainer from 'di/di-config';
import { useCallback } from 'react';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { DeleteContact, DeleteContactParams } from 'features/profile/domain/use-cases/delete-contact';
import { PROFILE_DI_TYPES } from 'features/profile/di/profile-di-types';
import { useAuth } from 'contexts/AuthContextProvider';

export function useDeleteContact() {
    const { appConfig } = useAppPreferencesState();
    const { accessToken } = useAuth();

    const state: DeleteContactState = {
        loading: true,
        accountDeleted: false,
        error: undefined,
    };

    const deleteContact = useCallback(
        async (contactId: string) => {
            let deleteContactDI = diContainer.get<DeleteContact>(PROFILE_DI_TYPES.DeleteContact);
            try {
                if (appConfig && accessToken) {
                    await deleteContactDI.execute(new DeleteContactParams(accessToken, contactId, appConfig));
                    state.accountDeleted = true;
                    state.loading = false;
                }
            } catch (e) {
                state.accountDeleted = false;
                state.loading = false;
                state.error = e;
            }
            return state;
        },
        [accessToken, appConfig, state],
    );

    interface DeleteContactState {
        loading?: boolean;
        accountDeleted?: boolean;
        error?: Error;
    }

    return {
        deleteContact,
    };
}
