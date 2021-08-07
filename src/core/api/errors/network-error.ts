export class NetworkError extends Error {
    constructor() {
        super('internet not available');
    }
}
