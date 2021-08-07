import diContainer from 'di/di-config';
import { EvergentAPIError } from 'features/profile/api/evergent-api-error';
import { LOGIN_ERROR_CODES } from 'features/profile/api/profile-api-constants';
import { AccountExists, AccountExistsParams } from 'features/authentication/domain/use-cases/account-exists';
import { useCallback } from 'react';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { AUTH_DI_TYPES } from 'features/authentication/di/auth-di-types';

export function useFetchAccountExists() {
    const { appConfig } = useAppPreferencesState();

    const state: FetchAccountExistState = {
        loading: true,
        accountExist: false,
        error: undefined,
    };

    const fetchAccountExists = useCallback(
        async (email: string) => {
            let fetchAccountExist = diContainer.get<AccountExists>(AUTH_DI_TYPES.AccountExists);

            try {
                if (appConfig) {
                    await fetchAccountExist.execute(new AccountExistsParams(email, appConfig));
                    state.accountExist = true;
                    state.loading = false;
                }
            } catch (e) {
                if (e instanceof EvergentAPIError && e.code === LOGIN_ERROR_CODES.LOGIN_NO_USER_FOUND) {
                    state.accountExist = false;
                    state.loading = false;
                } else {
                    state.error = e;
                }

                state.loading = false;
            }
            return state;
        },
        [appConfig, state],
    );

    interface FetchAccountExistState {
        loading?: boolean;
        accountExist?: boolean;
        error?: Error;
    }

    return {
        fetchAccountExists,
    };
}
