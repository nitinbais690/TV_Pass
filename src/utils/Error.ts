/**
 * A Class that contains contextual information about a particular error occurrence.
 */
export interface Error {
    /**
     * Unique Error Code with all Category Masking Set.
     */
    errorCode: number;
    /**
     * Error message describing the Error.
     */
    errorMessage?: string;
    /**
     * The internal root-cause of the Error if any.
     */
    internalError?: Error;
    /**
     * The internal Contextual description of the Error if any.
     * This is usually set if the error is from a third-party source.
     */
    contextDescription?: string;
}

export function createError(
    errorCode: number,
    errorMessage?: string,
    internalError?: Error,
    contextDescription?: string,
): Error {
    return {
        errorCode,
        errorMessage: errorMessage || 'Unknown error occured',
        internalError,
        contextDescription,
    };
}

export function isError(result: Error | any): result is Error {
    return (result as Error).errorCode !== undefined;
}
