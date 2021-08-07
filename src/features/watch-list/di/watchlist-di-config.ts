import 'reflect-metadata';
import { ContainerModule, interfaces } from 'inversify';
import { WATCHLIST_DI_TYPES } from './watchlist-di-types';
import {
    WatchListRemoteDataSource,
    WatchListRemoteDataSourceImpl,
} from '../data/data-sources/watch-list-remote-data-source';
import { WatchListRepository } from '../domain/repositories/watch-list-repository';
import { WatchListRepositoryImpl } from '../data/repositories/watch-list-repository-impl';
import { FetchWatchList } from '../domain/use-cases/fetch-watch-list';
import { RemoveAllWatchList } from '../domain/use-cases/remove-all-watch-list';
import { RemoveSingleWatchList } from '../domain/use-cases/remove-single-watch-list';
/**
 */
let watchListDIModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<WatchListRemoteDataSource>(WATCHLIST_DI_TYPES.WatchListRemoteDataSource).to(WatchListRemoteDataSourceImpl);
    bind<WatchListRepository>(WATCHLIST_DI_TYPES.WatchListRepository).to(WatchListRepositoryImpl);
    bind<FetchWatchList>(WATCHLIST_DI_TYPES.FetchWatchList).to(FetchWatchList);
    bind<RemoveAllWatchList>(WATCHLIST_DI_TYPES.RemoveAllWatchList).to(RemoveAllWatchList);
    bind<RemoveSingleWatchList>(WATCHLIST_DI_TYPES.RemoveSingleWatchList).to(RemoveSingleWatchList);
});

// Export the configure
export default watchListDIModule;
