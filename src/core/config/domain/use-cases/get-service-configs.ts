import 'reflect-metadata';
import { AppConfigKeys } from '../entities/app-config-keys';
import { ServiceConfig } from '../entities/service-config';
import decrypt from 'utils/SecurityUtil';
import { UseCase } from 'core/use-case/use-case';
import { KeyValuePair } from '../entities/key-value-pair';
import { injectable } from 'inversify';

@injectable()
export class GetServiceConfigs implements UseCase<ServiceConfig, KeyValuePair> {
    execute(appConfig: KeyValuePair): ServiceConfig {
        return {
            apiConfigs: {
                discovery: {
                    host: appConfig[AppConfigKeys.STOREFRONT_SERVICE_KEY],
                    basePath: '/storefront/',
                },
                catalog: {
                    host: appConfig[AppConfigKeys.CATALOG_SERVICE_KEY],
                    basePath: '/catalog/',
                },
                metadata: {
                    host: appConfig[AppConfigKeys.VOD_METADATA_SERVICE_KEY],
                    basePath: '/content',
                },
                checkRedeem: {
                    host: appConfig[AppConfigKeys.CHECK_REDEEM_SERVICE_KEY],
                    basePath: '/media/',
                },
                ums: {
                    host: appConfig[AppConfigKeys.UMS_SERVICE_KEY],
                    basePath: '/aha/',
                },
                ovat: {
                    host: appConfig[AppConfigKeys.OVAT_SERVICE_KEY],
                    basePath: '/user/authz/token',
                },
                flOAuth2: {
                    host: appConfig[AppConfigKeys.OAUTH_SERVICE_KEY],
                    basePath: '',
                },
                flFlat: {
                    host: appConfig[AppConfigKeys.GUEST_FLAT_URL],
                    basePath: '/user/accesstoken/generate',
                },
                usage: {
                    host: appConfig[AppConfigKeys.CONTENT_USAGE_SERVICE_KEY],
                    basePath: '/user/usage/',
                },
                history: {
                    host: appConfig[AppConfigKeys.CONTENT_HISTORY_SERVICE_KEY],
                    basePath: '/user/history/',
                },
                geo: {
                    host: appConfig[AppConfigKeys.GEO_SERVICE_KEY],
                    basePath: '/',
                    defaultQueryParams: {
                        key: decrypt(appConfig[AppConfigKeys.GEO_SERVICE_TOKEN]),
                    },
                },
                channel: {
                    host: appConfig[AppConfigKeys.CHANNEL_SERVICE_KEY],
                    basePath: '/content/urn/resource/catalog/',
                },
                epg: {
                    host: appConfig[AppConfigKeys.EPG_SERVICE_KEY],
                    basePath: '/epg/',
                },
                profile: {
                    host: appConfig[AppConfigKeys.PROFILE_SERVICE_KEY],
                    basePath: '/user/',
                },
                favorite: {
                    host: appConfig[AppConfigKeys.FAVORITE_SERVICE_KEY],
                    basePath: '/user/favorite/',
                },
                searchHistory: {
                    host: appConfig[AppConfigKeys.SEARCH_HISTORY_URL],
                    basePath: '/user/search/',
                },
            },
        };
    }
}
