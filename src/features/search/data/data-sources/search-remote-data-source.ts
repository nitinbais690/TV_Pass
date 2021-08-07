import 'reflect-metadata';
import { injectable } from 'inversify';
import { Client, DiscoveryActionExt } from 'components/qp-discovery-ui';
import { APIHandler } from 'core/api/api-handler';
import { AddSearchHistoryResponse } from 'features/search/domain/entities/add-search-history-response';
import { AddSearchHistoryRequest } from 'features/search/domain/entities/add-search-history-request';
import { validateResponse } from 'core/api/utils/response-validate';
import { GetSearchHistoryListResponse } from 'features/search/domain/entities/get-search-history-list-response';

export interface SearchRemoteDataSource {
    addSearchHistory(
        text: string,
        flAuthToken: string,
        flatToken: string,
    ): Promise<AddSearchHistoryResponse | undefined>;
    getSearchHistoryList(flAuthToken: string, flatToken: string): Promise<GetSearchHistoryListResponse | undefined>;
}

@injectable()
export class SearchRemoteDataSourceImpl implements SearchRemoteDataSource {
    client: Client | undefined;

    constructor() {
        this.client = APIHandler.getInstance().getClient();
    }

    async addSearchHistory(
        text: string,
        flAuthToken: string,
        flatToken: string,
    ): Promise<AddSearchHistoryResponse | undefined> {
        if (!this.client) {
            throw new Error('Client Identifer undefined');
        }
        const request: AddSearchHistoryRequest = {
            text: text,
        };
        const action: DiscoveryActionExt = {
            endpoint: 'create',
            method: 'PUT',
            body: request,
            clientIdentifier: 'searchHistory',
        };
        action.headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + flAuthToken,
            'X-Authorization': flatToken,
        };
        const response = await this.client.query<AddSearchHistoryResponse>(action);
        // Validate this response code and throw exception if it is not 200
        validateResponse(response.status);
        return response.payload;
    }

    async getSearchHistoryList(
        flAuthToken: string,
        flatToken: string,
    ): Promise<GetSearchHistoryListResponse | undefined> {
        if (!this.client) {
            throw new Error('Client Identifer undefined');
        }
        const params = {
            pageNumber: 1,
            pageSize: 3,
        };
        const action: DiscoveryActionExt = {
            endpoint: 'list',
            params: params,
            method: 'GET',
            clientIdentifier: 'searchHistory',
        };
        action.headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + flAuthToken,
            'X-Authorization': flatToken,
        };
        const response = await this.client.query<GetSearchHistoryListResponse>(action);
        // Validate this response code and throw exception if it is not 200
        validateResponse(response.status);
        return response.payload;
    }
}
