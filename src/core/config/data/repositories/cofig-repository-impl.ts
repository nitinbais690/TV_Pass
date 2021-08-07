import 'reflect-metadata';
import { KeyValuePair, FetchOptions, ConfigRepository, ConfigRemoteDataSource } from 'core/config';
import AsyncStorage from '@react-native-community/async-storage';
import { inject, injectable } from 'inversify';
import { CORE_DI_TYPES } from 'core/di/core-di-types';
import { NetworkInfo } from 'core/network/network-info';
import { NetworkError } from 'core/api/errors/network-error';

const APP_CONFIG_CACHE_KEY = 'AppConfigCacheKey';

@injectable()
export class ConfigRepositoryImpl implements ConfigRepository {
    @inject(CORE_DI_TYPES.ConfigRemoteDataSource)
    private dataSource!: ConfigRemoteDataSource;

    @inject(CORE_DI_TYPES.NetworkInfo)
    private networkInfo!: NetworkInfo;

    async fetchConfig(endPoint: string, options: FetchOptions): Promise<KeyValuePair> {
        try {
            let configs = await this.fetchRemoteConfigs(endPoint, options);
            await AsyncStorage.setItem(APP_CONFIG_CACHE_KEY, JSON.stringify(configs));
            return configs;
        } catch (error) {
            return this.getCachedConfig();
        }
    }

    private async fetchRemoteConfigs(endPoint: string, options: FetchOptions): Promise<KeyValuePair> {
        if (this.dataSource && this.networkInfo) {
            if (this.networkInfo.isConnected()) {
                return this.dataSource.fetchConfig(endPoint, options);
            } else {
                throw new NetworkError();
            }
        } else {
            throw new Error('Data source || Network info not found');
        }
    }

    private async getCachedConfig(): Promise<KeyValuePair> {
        const cachedConfigString = await AsyncStorage.getItem(APP_CONFIG_CACHE_KEY);
        if (cachedConfigString) {
            return JSON.parse(cachedConfigString);
        } else {
            throw new Error('No Cache');
        }
    }
}
