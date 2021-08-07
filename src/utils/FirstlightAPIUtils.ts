import { createError } from './Error';

export interface PlatformResponse<T> {
    header: Header;
    data: T;
}

interface Header {
    source: string;
    code: number;
    message: string;
    system_time: number;
    tracking_id: string;
    errors?: Error[];
}

interface Error {
    code: number;
    description: string;
}

export const isSuccess = <T>(payload?: PlatformResponse<T>) => {
    if (payload && payload.header) {
        return payload.header.code === 0;
    }
    return false;
};

export const responsePayload = <T>(payload?: PlatformResponse<T>) => {
    if (payload && payload.data) {
        return payload.data as T;
    }
    return undefined;
};

export const error = <T>(payload?: PlatformResponse<T>) => {
    if (payload && payload.header && payload.header.errors && payload.header.errors.length > 0) {
        const err = payload.header.errors[0];
        return createError(err.code, err.description);
    }
    return undefined;
};
