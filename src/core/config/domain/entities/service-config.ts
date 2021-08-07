import { APIClient, ClientIdentifer } from 'qp-discovery-ui';

export interface ServiceConfig {
    apiConfigs: { [key in ClientIdentifer]: APIClient };
}
