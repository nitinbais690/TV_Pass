import { FLHeader } from 'core/config/domain/entities/fl-header';

export interface FLFlatTokenResponse {
    data: FLTokenData;
    header: FLHeader;
}

export interface FLTokenData {
    token: string;
    expiry: string;
}
