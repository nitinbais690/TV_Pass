import { BadRequest } from 'core/api/errors/bad-request';
import { InternalServerError } from 'core/api/errors/internal-server-error';
import { ServiceNotAvailable } from 'core/api/errors/service-not-available';
import { UnauthorizedError } from 'core/api/errors/unauthorized-error';
import { validateResponse } from 'core/api/utils/response-validate';

it('Return true if response code 200', () => {
    expect(validateResponse(200)).toBe(true);
});

it('Bad request', () => {
    const validate = () => validateResponse(400);
    expect(validate).toThrow(BadRequest);
    expect(validate).toThrow('Please check your request data');
});

it('Unhandle status code should', () => {
    const validate = () => validateResponse(3211);
    expect(validate).toThrow(ServiceNotAvailable);
    expect(validate).toThrow('Currently not able to serve');
});

it('Service unavailable', () => {
    const validate = () => validateResponse(503);
    expect(validate).toThrow(ServiceNotAvailable);
    expect(validate).toThrow('Currently not able to serve');
});

it('Check unauthorized access response', () => {
    const validate = () => validateResponse(401);
    expect(validate).toThrow(UnauthorizedError);
    expect(validate).toThrow('Not authorized to do this request');
});

it('Check internal server error', () => {
    const validate = () => validateResponse(500);
    expect(validate).toThrow(InternalServerError);
    expect(validate).toThrow('Service is not working');
});
