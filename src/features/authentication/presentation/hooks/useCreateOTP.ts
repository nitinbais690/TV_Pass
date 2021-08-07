import { useCallback } from 'react';
import diContainer from 'di/di-config';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { AUTH_DI_TYPES } from 'features/authentication/di/auth-di-types';
import { CreateOTP, CreateOTPParams } from 'features/authentication/domain/use-cases/create-otp';

export function useCreateOTP() {
    const { appConfig } = useAppPreferencesState();

    const state: CreateOTPState = {
        loading: true,
        isSuccess: false,
        error: undefined,
    };

    const createOTPCall = useCallback(
        async (mobileNumber: string, country: string) => {
            let createOTP = diContainer.get<CreateOTP>(AUTH_DI_TYPES.CreateOTP);

            try {
                if (appConfig) {
                    await createOTP.execute(new CreateOTPParams(mobileNumber, country, appConfig));
                    state.isSuccess = true;
                }
                state.loading = false;
            } catch (e) {
                state.error = e;
                state.loading = false;
            }
            return state;
        },
        [appConfig, state],
    );

    interface CreateOTPState {
        loading?: boolean;
        isSuccess?: boolean;
        error?: Error;
    }

    return {
        createOTPCall,
    };
}
