import 'reflect-metadata';
import { UseCase } from 'core/use-case/use-case';
import { inject, injectable } from 'inversify';
import { WATCHLIST_DI_TYPES } from 'features/watch-list/di/watchlist-di-types';
import { WatchListRepository } from '../repositories/watch-list-repository';

@injectable()
export class RemoveAllWatchList implements UseCase<Promise<any>, RemoveAllWatchListParams> {
    @inject(WATCHLIST_DI_TYPES.WatchListRepository)
    private watchListRespository: WatchListRepository | undefined;

    async execute(params: RemoveAllWatchListParams) {
        if (this.watchListRespository) {
            return await this.watchListRespository.removeAllWatchList(params.flAuthToken, params.flatToken);
        } else {
            throw new Error('WatchList Repository instance not found');
        }
    }
}
export class RemoveAllWatchListParams {
    flAuthToken: string;
    flatToken: string;

    constructor(flAuthToken: string, flatToken: string) {
        this.flAuthToken = flAuthToken;
        this.flatToken = flatToken;
    }
}
