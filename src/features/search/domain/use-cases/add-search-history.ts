import 'reflect-metadata';
import { UseCase } from 'core/use-case/use-case';
import { inject, injectable } from 'inversify';
import { AddSearchHistoryResponse } from '../entities/add-search-history-response';
import { SEARCH_DI_TYPES } from 'features/search/di/search-di-types';
import { SearchRepository } from '../repositories/search-repository';

@injectable()
export class AddSearchHistory
    implements UseCase<Promise<AddSearchHistoryResponse | undefined>, AddSearchHistoryParams> {
    @inject(SEARCH_DI_TYPES.SearchRepository)
    private searchRespository: SearchRepository | undefined;

    execute(params: AddSearchHistoryParams) {
        if (this.searchRespository) {
            return this.searchRespository.addSearchHistory(params.text, params.flAuthToken, params.flatToken);
        } else {
            throw new Error('Search Repository instance not found');
        }
    }
}
export class AddSearchHistoryParams {
    text: string;
    flAuthToken: string;
    flatToken: string;
    constructor(text: string, flAuthToken: string, flatToken: string) {
        this.text = text;
        this.flAuthToken = flAuthToken;
        this.flatToken = flatToken;
    }
}
