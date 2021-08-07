export const INTERNAL_SERVER_ERROR = 500;
export class InternalServerError extends Error {
    code = INTERNAL_SERVER_ERROR;
    constructor(message: string) {
        super(message);
    }
}
