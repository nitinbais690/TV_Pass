import 'reflect-metadata';
import { ContainerModule, interfaces } from 'inversify';
import { SEARCH_DI_TYPES } from './search-di-types';
import { AddSearchHistory } from '../domain/use-cases/add-search-history';
import { GetSearchHistoryList } from '../domain/use-cases/get-search-history-list';
import { SearchRepositoryImpl } from '../data/repositories/search-repository-impl';
import { SearchRepository } from '../domain/repositories/search-repository';
import { SearchRemoteDataSource, SearchRemoteDataSourceImpl } from '../data/data-sources/search-remote-data-source';
/**
 */
let searchDIModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<SearchRepository>(SEARCH_DI_TYPES.SearchRepository).to(SearchRepositoryImpl);
    bind<SearchRemoteDataSource>(SEARCH_DI_TYPES.SearchRemoteDataSource).to(SearchRemoteDataSourceImpl);
    bind<AddSearchHistory>(SEARCH_DI_TYPES.AddSearchHistory).to(AddSearchHistory);
    bind<GetSearchHistoryList>(SEARCH_DI_TYPES.GetSearchHistoryList).to(GetSearchHistoryList);
});

// Export the configure
export default searchDIModule;
