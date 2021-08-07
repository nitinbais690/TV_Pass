import { requestInterceptor } from '../../../src/api/requestInterceptors/requestInterceptor';
import { createClient } from 'react-fetching-library';
import { fetchStorefrontTabs } from '../../../src/api/actions/fetchDiscoveryResource';

describe('requestInterceptor', function() {
    it('should form a proper url', async function() {
        const client = createClient({});
        const action = fetchStorefrontTabs('1212', {
            baseKey: 'baseValue',
        });
        const finalAction = await requestInterceptor('discovery', 'http://example.com/', 'apicontainer/', {
            key: 'value',
            key1: 'value 1',
            key2: ['value', '2'],
        })(client)(action);
        expect(finalAction.endpoint).toBe(
            'http://example.com/apicontainer/1212/tabs?key=value&key1=value%201&key2=value%2C2&policy_evaluate=false&baseKey=baseValue',
        );
    });

    it('should skip when the clientIdentifier does not match', async function() {
        const client = createClient({});
        const action = fetchStorefrontTabs('1212', {
            baseKey: 'baseValue',
            clientIdentifier: 'discovery',
        });
        const finalAction = await requestInterceptor('personalization', 'http://example.com', '/api', {
            key: 'value',
            key1: 'value 1',
            key2: ['value', '2'],
        })(client)(action);
        expect(finalAction.endpoint).toBe('1212/tabs');
    });
});
