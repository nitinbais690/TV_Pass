import { ResourceVm } from 'qp-discovery-ui';

export interface WatchListRepository {
    fetchWatchList(
        flAuthToken: string,
        flatToken: string,
        pageNumber: number,
        pageSize: number,
    ): Promise<ResourceVm[] | undefined>;

    removeAllWatchList(flAuthToken: string, flatToken: string): Promise<any>;

    removeSingleWatchList(flAuthToken: string, flatToken: string, resourceId: string): Promise<any>;
}
