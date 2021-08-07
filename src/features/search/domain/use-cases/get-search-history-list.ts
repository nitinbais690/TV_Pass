import 'reflect-metadata';
import { UseCase } from 'core/use-case/use-case';
import { inject, injectable } from 'inversify';
import { SEARCH_DI_TYPES } from 'features/search/di/search-di-types';
import { SearchRepository } from '../repositories/search-repository';
import { GetSearchHistoryListResponse } from '../entities/get-search-history-list-response';

@injectable()
export class GetSearchHistoryList
    implements UseCase<Promise<GetSearchHistoryListResponse | undefined>, GetSearchHistoryListParams> {
    @inject(SEARCH_DI_TYPES.SearchRepository)
    private searchRespository: SearchRepository | undefined;

    execute(params: GetSearchHistoryListParams) {
        if (this.searchRespository) {
            return this.searchRespository.getSearchHistoryList(params.flAuthToken, params.flatToken);
        } else {
            throw new Error('Search Repository instance not found');
        }
    }
}
export class GetSearchHistoryListParams {
    flAuthToken: string;
    flatToken: string;

    constructor(flAuthToken: string, flatToken: string) {
        this.flAuthToken = flAuthToken;
        this.flatToken = flatToken;
    }
}
