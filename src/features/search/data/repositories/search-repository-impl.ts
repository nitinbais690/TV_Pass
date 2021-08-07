import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { NetworkInfo } from 'core/network/network-info';
import { CORE_DI_TYPES } from 'core/di/core-di-types';
import { NetworkError } from 'core/api/errors/network-error';
import { SearchRepository } from 'features/search/domain/repositories/search-repository';
import { SEARCH_DI_TYPES } from 'features/search/di/search-di-types';
import { SearchRemoteDataSource } from '../data-sources/search-remote-data-source';
import { AddSearchHistoryResponse } from 'features/search/domain/entities/add-search-history-response';
import { GetSearchHistoryListResponse } from 'features/search/domain/entities/get-search-history-list-response';

@injectable()
export class SearchRepositoryImpl implements SearchRepository {
    @inject(SEARCH_DI_TYPES.SearchRemoteDataSource)
    private dataSource!: SearchRemoteDataSource;

    @inject(CORE_DI_TYPES.NetworkInfo)
    private networkInfo!: NetworkInfo;

    addSearchHistory(
        text: string,
        flAuthToken: string,
        flatToken: string,
    ): Promise<AddSearchHistoryResponse | undefined> {
        this.assert();
        this.assetNetworkError();
        return this.dataSource.addSearchHistory(text, flAuthToken, flatToken);
    }

    getSearchHistoryList(flAuthToken: string, flatToken: string): Promise<GetSearchHistoryListResponse | undefined> {
        this.assert();
        this.assetNetworkError();
        return this.dataSource.getSearchHistoryList(flAuthToken, flatToken);
    }
    private assetNetworkError() {
        this.assert();
        if (!this.networkInfo.isConnected()) {
            throw new NetworkError();
        }
    }

    // Throw error if network | datasource undefined undefined
    private assert() {
        if (!(this.dataSource || this.networkInfo)) {
            throw new Error('Data source || Network info not found');
        }
    }
}
