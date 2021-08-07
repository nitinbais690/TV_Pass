export interface ConfirmOTPResponse {
    mobileNumber: string;
    accessToken: string;
    isProfileComplete: boolean;
    cpCustomerID: string;
    refreshToken: string;
    expiresIn: string;
}
