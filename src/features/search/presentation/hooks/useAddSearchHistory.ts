import { useCallback } from 'react';
import diContainer from 'di/di-config';
import { AddSearchHistory, AddSearchHistoryParams } from 'features/search/domain/use-cases/add-search-history';
import { SEARCH_DI_TYPES } from 'features/search/di/search-di-types';

export function useAddSearchHistory() {
    const state: AddSearchHistoryState = {
        loading: true,
        isSuccess: false,
        error: undefined,
    };

    const addSearchHistoryCall = useCallback(
        async (text: string, flAuthToken: string, flatToken: string) => {
            const addSearchHistory = diContainer.get<AddSearchHistory>(SEARCH_DI_TYPES.AddSearchHistory);
            try {
                await addSearchHistory.execute(new AddSearchHistoryParams(text, flAuthToken, flatToken));
                state.isSuccess = true;
                state.loading = false;
            } catch (e) {
                state.error = e;
                state.loading = false;
            }
            return state;
        },
        [state],
    );

    interface AddSearchHistoryState {
        loading?: boolean;
        isSuccess?: boolean;
        error?: Error;
    }

    return {
        addSearchHistoryCall,
    };
}
