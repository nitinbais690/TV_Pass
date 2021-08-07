import 'reflect-metadata';
import { CORE_DI_TYPES } from 'core/di/core-di-types';
import { UseCase } from 'core/use-case/use-case';
import { inject, injectable } from 'inversify';
import { FetchOptions, KeyValuePair, ConfigRepository } from 'core/config';

@injectable()
export class FetchConfigs implements UseCase<Promise<KeyValuePair>, FetchConfigsParams> {
    @inject(CORE_DI_TYPES.ConfigRepository)
    private configRepository: ConfigRepository | undefined;

    execute(params: FetchConfigsParams): Promise<KeyValuePair> {
        if (this.configRepository) {
            return this.configRepository.fetchConfig(params.endPoint, params.options);
        } else {
            throw new Error('Config Repository instance not found');
        }
    }
}
export class FetchConfigsParams {
    endPoint: string;
    options: FetchOptions;

    constructor(endPoint: string, options: FetchOptions) {
        this.endPoint = endPoint;
        this.options = options;
    }
}
