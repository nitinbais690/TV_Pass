import 'reflect-metadata';
import { UseCase } from 'core/use-case/use-case';
import { inject, injectable } from 'inversify';
import { ResourceVm } from 'components/qp-discovery-ui';
import { WATCHLIST_DI_TYPES } from 'features/watch-list/di/watchlist-di-types';
import { WatchListRepository } from '../repositories/watch-list-repository';

@injectable()
export class FetchWatchList implements UseCase<Promise<ResourceVm[] | undefined>, FetchWatchListParams> {
    @inject(WATCHLIST_DI_TYPES.WatchListRepository)
    private watchListRespository: WatchListRepository | undefined;

    async execute(params: FetchWatchListParams) {
        if (this.watchListRespository) {
            return await this.watchListRespository.fetchWatchList(
                params.flAuthToken,
                params.flatToken,
                params.pageNumber,
                params.pageSize,
            );
        } else {
            throw new Error('WatchList Repository instance not found');
        }
    }
}
export class FetchWatchListParams {
    flAuthToken: string;
    flatToken: string;
    pageNumber: number;
    pageSize: number;

    constructor(flAuthToken: string, flatToken: string, pageNumber: number, pageSize: number) {
        this.flAuthToken = flAuthToken;
        this.flatToken = flatToken;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
}
