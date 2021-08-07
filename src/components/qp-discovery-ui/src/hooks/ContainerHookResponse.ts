import { ContainerVm, ResourceVm } from '../models/ViewModels';
/**
 * @typedef {Object} ContainerHookResponse
 * @property {boolean} loading - Indicates if processing is still in progress.
 * @property {boolean} error - Indicates if an error occurred in processing the request.
 * @property {any} errorObject - (Optional) The actual error object, if an error occurs.
 * @property {ContainerVm[]} containers - The fetched container list.
 * @property {boolean} hasMore - Incidates if there are more results in the response for pagination
 */
export interface ContainerHookResponse {
    loading: boolean;
    error: boolean;
    errorObject?: any;
    containers: ContainerVm[];
    resources?: ResourceVm[];
    reload?: () => Promise<void>;
    reset?: () => Promise<void>;
    pageOffset: number;
    hasMore?: boolean;
    loadMore?: (pageOffset: number) => Promise<void>;
    loadMoreResources?: (container: ContainerVm) => Promise<void>;
}
