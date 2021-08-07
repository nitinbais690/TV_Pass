export const BAD_REQUEST = 400;
export class BadRequest extends Error {
    code = BAD_REQUEST;
    constructor(message: string) {
        super(message);
    }
}
