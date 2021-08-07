import { useCallback } from 'react';
import diContainer from 'di/di-config';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { SEARCH_DI_TYPES } from 'features/search/di/search-di-types';
import {
    GetSearchHistoryList,
    GetSearchHistoryListParams,
} from 'features/search/domain/use-cases/get-search-history-list';
import { GetSearchHistoryListItem } from 'features/search/domain/entities/get-search-history-list-response';

export function useGetSearchHistoryList() {
    const { appConfig } = useAppPreferencesState();

    const state: GetSearchHistoryListState = {
        loading: true,
        isSuccess: false,
        error: undefined,
        searchHistoryList: [],
    };

    const getSearchHistoryListCall = useCallback(
        async (flAuthToken: string, flatToken: string) => {
            const getSearchHistoryList = diContainer.get<GetSearchHistoryList>(SEARCH_DI_TYPES.GetSearchHistoryList);
            try {
                if (appConfig) {
                    const response = await getSearchHistoryList.execute(
                        new GetSearchHistoryListParams(flAuthToken, flatToken),
                    );
                    state.isSuccess = true;
                    if (response && response.data) {
                        state.searchHistoryList = response.data;
                    }
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

    interface GetSearchHistoryListState {
        loading?: boolean;
        isSuccess?: boolean;
        error?: Error;
        searchHistoryList: GetSearchHistoryListItem[];
    }

    return {
        getSearchHistoryListCall,
    };
}
