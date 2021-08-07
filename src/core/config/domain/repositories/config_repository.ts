import { FetchOptions } from '../entities/fetching_options';
import { KeyValuePair } from '../entities/key-value-pair';

export interface ConfigRepository {
    fetchConfig(endPoint: string, options: FetchOptions): Promise<KeyValuePair>;
}
