export interface FLHeader {
    source: string;
    code: number;
    message: string;
    system_time: number;
    tracking_id: string;
    errors: Error[];
}

export interface Error {
    code: string;
    description: string;
}
