import { AddSearchHistoryResponse } from '../entities/add-search-history-response';
import { GetSearchHistoryListResponse } from '../entities/get-search-history-list-response';

export interface SearchRepository {
    addSearchHistory(
        text: string,
        flAuthToken: string,
        flatToken: string,
    ): Promise<AddSearchHistoryResponse | undefined>;
    getSearchHistoryList(flAuthToken: string, flatToken: string): Promise<GetSearchHistoryListResponse | undefined>;
}
