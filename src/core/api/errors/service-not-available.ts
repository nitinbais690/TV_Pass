export const SERVICE_NONT_AVAILABLE_ERROR = 503;
export class ServiceNotAvailable extends Error {
    code = SERVICE_NONT_AVAILABLE_ERROR;
    constructor(message: string) {
        super(message);
    }
}
