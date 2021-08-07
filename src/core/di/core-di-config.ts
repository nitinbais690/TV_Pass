import 'reflect-metadata';
import { ContainerModule, interfaces } from 'inversify';
import { NetworkInfo, NetworkInfoImpl } from '../network/network-info';
import { CORE_DI_TYPES } from './core-di-types';
import {
    ConfigRemoteDataSource,
    ConfigRemoteDataSourceImpl,
    ConfigRepository,
    ConfigRepositoryImpl,
    FetchConfigs,
    GetServiceConfigs,
} from 'core/config';

/**
 * Configure Application specific DI objects here to manage the dependency properly for large projects
 */
let coreDIModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<NetworkInfo>(CORE_DI_TYPES.NetworkInfo).to(NetworkInfoImpl);
    bind<ConfigRemoteDataSource>(CORE_DI_TYPES.ConfigRemoteDataSource).to(ConfigRemoteDataSourceImpl);
    bind<ConfigRepository>(CORE_DI_TYPES.ConfigRepository).to(ConfigRepositoryImpl);
    bind<FetchConfigs>(CORE_DI_TYPES.FetchConfigs).to(FetchConfigs);
    bind<GetServiceConfigs>(CORE_DI_TYPES.GetServiceConfigs).to(GetServiceConfigs);
});

// Export the configure
export default coreDIModule;
