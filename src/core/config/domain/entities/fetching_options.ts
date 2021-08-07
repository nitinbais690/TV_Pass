import { KeyValuePair } from './key-value-pair';

export interface FetchOptions {
    queryParams?: KeyValuePair;
    headers?: KeyValuePair;
}
