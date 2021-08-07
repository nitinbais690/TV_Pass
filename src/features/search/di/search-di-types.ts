/**
 * Search specific DI types here
 */
const SEARCH_DI_TYPES = {
    SearchRemoteDataSource: Symbol.for('SearchRemoteDataSource'),
    SearchRepository: Symbol.for('SearchRepository'),
    AddSearchHistory: Symbol.for('AddSearchHistory'),
    GetSearchHistoryList: Symbol.for('GetSearchHistoryList'),
};

// Export this types to whole application
export { SEARCH_DI_TYPES };
