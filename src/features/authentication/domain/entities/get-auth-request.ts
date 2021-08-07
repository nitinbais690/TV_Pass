import { DeviceMessage } from 'features/profile/domain/entities/device-message';

export interface GetAuthRequest {
    Email?: string;
    contactUserName?: string;
    contactPassword?: string;
    socialLoginID?: string;
    socialLoginType?: string;
    deviceMessage?: DeviceMessage;
}
