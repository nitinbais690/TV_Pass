import 'reflect-metadata';
import { KeyValuePair, FetchOptions } from 'core/config';
import { injectable } from 'inversify';
import { validateResponse } from 'core/api/utils/response-validate';

export interface ConfigRemoteDataSource {
    fetchConfig(endPoint: string, options: FetchOptions): Promise<KeyValuePair>;
}

@injectable()
export class ConfigRemoteDataSourceImpl implements ConfigRemoteDataSource {
    async fetchConfig(endPoint: string, options: FetchOptions): Promise<KeyValuePair> {
        try {
            const queryParams = '?' + this.getQueryString(options.queryParams);
            let url = endPoint + queryParams;
            const response = await fetch(url);
            // Validate this response code and throw exception if it is not 200
            validateResponse(response.status);
            const payload = await response.json();
            const payloadData = payload.data.flatMap((obj: any) => obj.attrs);
            return this.processConfigResponse(payloadData);
        } catch (error) {
            throw error;
        }
    }

    getQueryString(params: any): string {
        return Object.keys(params)
            .map(k => k + '=' + params[k])
            .join('&');
    }

    processConfigResponse(response: any): KeyValuePair {
        let appConfig: { [key: string]: string } = {};
        response.forEach((item: any) => {
            appConfig[item.key] = item.value;
        });
        return appConfig;
    }
}
