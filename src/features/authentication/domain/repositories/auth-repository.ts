import { AppConfig } from 'utils/AppPreferencesContext';
import { AccountExistsResponse } from '../entities/account-exists-response';
import { AuthReponse } from '../entities/auth-response';
import { FLOAuth2Response } from '../entities/fl-auth-response';
import { ConfirmOTPResponse } from '../entities/confirm-otp-response';
import { CreateOTPResponse } from '../entities/create-otp-response';
import { LogoutUserResponse } from '../entities/logout-user-response';
import { FLFlatTokenResponse } from '../entities/fl-flat-token-response';
import { EntitlementResponse } from '../entities/entitlement-response';

export interface AuthRepository {
    login(
        appConfig: AppConfig,
        email?: string,
        password?: string,
        socialLoginId?: string,
        socialLoginType?: string,
    ): Promise<AuthReponse>;
    createUser(email: string, password: string, appConfig: AppConfig): Promise<AuthReponse>;
    accountExists(email: string, appConfig: AppConfig): Promise<AccountExistsResponse>;
    createOTP(mobileNumber: string, country: string, appConfig: AppConfig): Promise<CreateOTPResponse>;
    confirmOTP(mobileNumber: string, country: string, otp: string, appConfig: AppConfig): Promise<ConfirmOTPResponse>;
    logout(accessToken: string, appConfig: AppConfig): Promise<LogoutUserResponse>;
    flOAuth2(appConfig: AppConfig): Promise<FLOAuth2Response | undefined>;
    flFlatToken(flAuthToken: string): Promise<FLFlatTokenResponse | undefined>;
    flatToken(accessToken: string, contactId: string, appConfig: AppConfig): Promise<EntitlementResponse | undefined>;
}
