import { RequestInterceptor } from 'react-fetching-library';
import { ClientIdentifer } from '../Client';
import { queryString } from '../../utils/URLBuilder';
import { DiscoveryActionExt } from '../actions/fetchDiscoveryResource';

export const requestInterceptor: (
    clientIdentifier: ClientIdentifer,
    host: string,
    rootPath: string,
    baseParams: { [key: string]: any },
) => RequestInterceptor = (clientIdentifier, host, rootPath, baseParams) => () => async (
    action: DiscoveryActionExt,
) => {
    if (clientIdentifier !== action.clientIdentifier) {
        return action;
    }

    const queryParams = queryString({ ...baseParams, ...action.params });
    const queryDelimiter = queryParams.length > 0 ? '?' : '';
    const modifiedAction = {
        ...action,
        endpoint: `${host}${rootPath}${action.endpoint}${queryDelimiter}${queryParams}`,
    };
    console.log(`clientIdentifier = ${clientIdentifier}, endpoint = ${modifiedAction.endpoint}`);
    return modifiedAction;
};
