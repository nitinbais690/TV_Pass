import 'reflect-metadata';
import { UseCase } from 'core/use-case/use-case';
import { inject, injectable } from 'inversify';
import { WATCHLIST_DI_TYPES } from 'features/watch-list/di/watchlist-di-types';
import { WatchListRepository } from '../repositories/watch-list-repository';

@injectable()
export class RemoveSingleWatchList implements UseCase<Promise<any>, RemoveSingleWatchListParams> {
    @inject(WATCHLIST_DI_TYPES.WatchListRepository)
    private watchListRespository: WatchListRepository | undefined;

    async execute(params: RemoveSingleWatchListParams) {
        if (this.watchListRespository) {
            return await this.watchListRespository.removeSingleWatchList(
                params.flAuthToken,
                params.flatToken,
                params.resourceId,
            );
        } else {
            throw new Error('WatchList Repository instance not found');
        }
    }
}
export class RemoveSingleWatchListParams {
    flAuthToken: string;
    flatToken: string;
    resourceId: string;

    constructor(flAuthToken: string, flatToken: string, resourceId: string) {
        this.flAuthToken = flAuthToken;
        this.flatToken = flatToken;
        this.resourceId = resourceId;
    }
}
