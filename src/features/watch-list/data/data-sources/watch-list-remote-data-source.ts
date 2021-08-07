import 'reflect-metadata';
import { APIHandler } from 'core/api/api-handler';
import { validateResponse } from 'core/api/utils/response-validate';
import { WatchListIdsResponse } from 'features/watch-list/domain/entities/watch-list-ids';
import {
    DiscoveryActionExt,
    fetchContentIdsLookup,
    metaDataResourceAdapter,
    ResourceResponse,
    ResourceVm,
} from 'qp-discovery-ui';
import { Client } from 'react-fetching-library';
import { injectable } from 'inversify';

export interface WatchListRemoteDataSource {
    fetchWatchListIds(
        flAuthToken: string,
        flatToken: string,
        pageNumber: number,
        pageSize: number,
    ): Promise<WatchListIdsResponse | undefined>;

    fetchWatchList(
        flAuthToken: string,
        flatToken: string,
        pageNumber: number,
        pageSize: number,
    ): Promise<ResourceVm[] | undefined>;

    removeAllWatchList(flAuthToken: string, flatToken: string): Promise<any>;
    removeSingleWatchList(flAuthToken: string, flatToken: string, itemId: string): Promise<any>;
}

@injectable()
export class WatchListRemoteDataSourceImpl implements WatchListRemoteDataSource {
    client: Client | undefined;

    constructor() {
        this.client = APIHandler.getInstance().getClient();
    }

    public async fetchWatchListIds(
        flAuthToken: string,
        flatToken: string,
        pageNumber: number,
        pageSize: number,
    ): Promise<WatchListIdsResponse | undefined> {
        if (this.client) {
            const params = {
                pageNumber: pageNumber,
                pageSize: pageSize,
            };
            const favAction: DiscoveryActionExt = {
                method: 'GET',
                endpoint: 'list',
                params: params,
                headers: { Authorization: `Bearer ${flAuthToken}`, 'X-Authorization': flatToken || '' },
                clientIdentifier: 'favorite',
            };
            const response = await this.client.query<WatchListIdsResponse>(favAction);
            validateResponse(response.status);
            return response.payload;
        } else {
            throw new Error('Client Identifer undefined');
        }
    }

    public async fetchWatchList(
        flAuthToken: string,
        flatToken: string,
        pageNumber: number,
        pageSize: number,
    ): Promise<ResourceVm[] | undefined> {
        if (this.client) {
            const watchListIds = await this.fetchWatchListIds(flAuthToken, flatToken, pageNumber, pageSize);
            const assetIds = this.getAssetIds(watchListIds);
            if (assetIds) {
                const action = fetchContentIdsLookup(assetIds);
                const response = await this.client.query<ResourceResponse>(action);
                validateResponse(response.status);
                return this.getResources(response.payload);
            } else {
                return undefined;
            }
        } else {
            throw new Error('Client Identifer undefined');
        }
    }
    public async removeAllWatchList(flAuthToken: string, flatToken: string): Promise<any> {
        if (this.client) {
            const favAction: DiscoveryActionExt = {
                method: 'DELETE',
                endpoint: 'delete',
                headers: { Authorization: `Bearer ${flAuthToken}`, 'X-Authorization': flatToken || '' },
                clientIdentifier: 'favorite',
            };
            const response = await this.client.query<any>(favAction);
            validateResponse(response.status);
            return response.payload;
        }
    }

    public async removeSingleWatchList(flAuthToken: string, flatToken: string, itemId: string): Promise<any> {
        if (this.client) {
            const favAction: DiscoveryActionExt = {
                method: 'DELETE',
                endpoint: 'delete/' + itemId,
                headers: { Authorization: `Bearer ${flAuthToken}`, 'X-Authorization': flatToken || '' },
                clientIdentifier: 'favorite',
            };
            const response = await this.client.query<any>(favAction);
            validateResponse(response.status);
            return response.payload;
        }
    }

    private getResources(payload: ResourceResponse | undefined): ResourceVm[] | undefined {
        if (payload && payload.data) {
            return payload.data.map(content => {
                return {
                    ...metaDataResourceAdapter(content),
                    get title() {
                        return this.seriesTitle ? this.seriesTitle : this.name;
                    },
                    get subtitle() {
                        return this.seasonNumber && this.episodeNumber
                            ? `S${this.seasonNumber} E${this.episodeNumber}: ${this.name}`
                            : undefined;
                    },
                } as ResourceVm;
            });
        }

        return undefined;
    }

    private getAssetIds(watchListIdsResponse: WatchListIdsResponse | undefined): string[] | undefined {
        if (watchListIdsResponse && watchListIdsResponse.data) {
            return watchListIdsResponse.data.map(item => item.itemId);
        } else {
            return undefined;
        }
    }
}
