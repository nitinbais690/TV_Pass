import { DeviceMessage } from 'features/profile/domain/entities/device-message';

export interface ConfirmOTPRequest {
    mobileNumber: string;
    country: string;
    otp: string;
    dmaId: string;
    canCreateAccount: boolean;
    isGenerateJWT: boolean;
    deviceDetails?: DeviceMessage;
}
