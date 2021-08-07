import { DeviceMessage } from './device-message';

export interface CreateUserRequest {
    email: string;
    dmaId?: string;
    country?: string;
    isGenerateJWT?: boolean;
    customerUsername?: string;
    customerPassword?: string;
    deviceMessage?: DeviceMessage;
}
