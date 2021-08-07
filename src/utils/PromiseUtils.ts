const DEFAULT_TIMEOUT_MS = 10000;

export const promiseWithTimeout = <T>(
    promise: Promise<T>,
    timeoutMs: number = DEFAULT_TIMEOUT_MS,
    failureMessage?: string,
) => {
    let timeoutHandle: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((resolve, reject) => {
        timeoutHandle = setTimeout(() => reject(new Error(failureMessage)), timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]).then(result => {
        clearTimeout(timeoutHandle);
        return result;
    });
};
