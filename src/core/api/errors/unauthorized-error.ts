export const UNAUTHORIZED_ERROR = 401;
export class UnauthorizedError extends Error {
    code = UNAUTHORIZED_ERROR;
    constructor(message: string) {
        super(message);
        this.message = message;
    }
}
