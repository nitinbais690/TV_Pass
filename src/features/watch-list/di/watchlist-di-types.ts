/**
 * Watchlist specific DI types here
 */
const WATCHLIST_DI_TYPES = {
    WatchListRemoteDataSource: Symbol.for('WatchListRemoteDataSource'),
    WatchListRepository: Symbol.for('WatchListRepository'),
    FetchWatchList: Symbol.for('FetchWatchList'),
    RemoveAllWatchList: Symbol.for('RemoveAllWatchList'),
    RemoveSingleWatchList: Symbol.for('RemoveSingleWatchList'),
};

// Export this types to whole application
export { WATCHLIST_DI_TYPES };
