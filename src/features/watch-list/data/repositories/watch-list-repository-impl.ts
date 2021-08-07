import 'reflect-metadata';
import { NetworkError } from 'core/api/errors/network-error';
import { CORE_DI_TYPES } from 'core/di/core-di-types';
import { NetworkInfo } from 'core/network/network-info';
import { WATCHLIST_DI_TYPES } from 'features/watch-list/di/watchlist-di-types';
import { inject, injectable } from 'inversify';
import { ResourceVm } from 'qp-discovery-ui';
import { WatchListRepository } from '../../domain/repositories/watch-list-repository';
import { WatchListRemoteDataSource } from '../data-sources/watch-list-remote-data-source';

@injectable()
export class WatchListRepositoryImpl implements WatchListRepository {
    @inject(WATCHLIST_DI_TYPES.WatchListRemoteDataSource)
    private dataSource!: WatchListRemoteDataSource;

    @inject(CORE_DI_TYPES.NetworkInfo)
    private networkInfo!: NetworkInfo;

    constructor() {}

    fetchWatchList(
        flAuthToken: string,
        flatToken: string,
        pageNumber: number,
        pageSize: number,
    ): Promise<ResourceVm[] | undefined> {
        this.assert();
        this.assetNetworkError();
        return this.dataSource.fetchWatchList(flAuthToken, flatToken, pageNumber, pageSize);
    }

    public removeAllWatchList(flAuthToken: string, flatToken: string): Promise<any> {
        this.assert();
        this.assetNetworkError();
        return this.dataSource.removeAllWatchList(flAuthToken, flatToken);
    }

    public removeSingleWatchList(flAuthToken: string, flatToken: string, resourceId: string): Promise<any> {
        this.assert();
        this.assetNetworkError();
        return this.dataSource.removeSingleWatchList(flAuthToken, flatToken, resourceId);
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
