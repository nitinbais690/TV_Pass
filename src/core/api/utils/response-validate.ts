import { BadRequest, BAD_REQUEST } from '../errors/bad-request';
import { InternalServerError, INTERNAL_SERVER_ERROR } from '../errors/internal-server-error';
import { UnauthorizedError, UNAUTHORIZED_ERROR } from '../errors/unauthorized-error';
import { ServiceNotAvailable } from '../errors/service-not-available';

export function validateResponse(responseCode: number | undefined): boolean {
    switch (responseCode) {
        case 200:
            return true;
        case BAD_REQUEST:
            throw new BadRequest('Please check your request data');
        case INTERNAL_SERVER_ERROR:
            throw new InternalServerError('Service is not working');
        case UNAUTHORIZED_ERROR:
            throw new UnauthorizedError('Not authorized to do this request');
        default:
            throw new ServiceNotAvailable('Currently not able to serve');
    }
}
