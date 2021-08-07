/**
 * Application specific DI types here
 */
const CORE_DI_TYPES = {
    NetworkInfo: Symbol.for('NetworkInfo'),
    ConfigRemoteDataSource: Symbol.for('ConfigRemoteDataSource'),
    ConfigRepository: Symbol.for('ConfigRepository'),
    FetchConfigs: Symbol.for('FetchConfigs'),
    GetServiceConfigs: Symbol.for('GetServiceConfigs'),
};

// Export this types to whole application
export { CORE_DI_TYPES };
