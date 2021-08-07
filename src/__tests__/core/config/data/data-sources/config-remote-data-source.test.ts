import { FetchOptions } from 'core/config';
import { ConfigRemoteDataSourceImpl } from 'core/config/data/data-sources/config-remote-data-source';

it('build config a request query', () => {
    const options: FetchOptions = { queryParams: { device: 'mobile' } };
    let configDataImpl = new ConfigRemoteDataSourceImpl();
    const queryString = configDataImpl.getQueryString(options.queryParams);
    expect(queryString).toBe('device=mobile');
});

it('build config the request queries', () => {
    const options: FetchOptions = { queryParams: { device: 'mobile', version: '1.0' } };
    let configDataImpl = new ConfigRemoteDataSourceImpl();
    const queryString = configDataImpl.getQueryString(options.queryParams);
    expect(queryString).toBe('device=mobile&version=1.0');
});

it('build config null query', () => {
    const options: FetchOptions = {};
    let configDataImpl = new ConfigRemoteDataSourceImpl();
    const queryString = () => configDataImpl.getQueryString(options.queryParams);
    expect(queryString).toThrow(TypeError);
    expect(queryString).toThrow('Cannot convert undefined or null to object');
});
