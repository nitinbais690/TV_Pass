import 'reflect-metadata';
import { injectable } from 'inversify';
import { AppConfig } from 'utils/AppPreferencesContext';
import {
    requestBody,
    EvergentEndpoints,
    getDeviceInfo,
    getAction,
    parseResponse,
    dmaId,
} from '../../../profile/data/utils/EvergentAPIUtil';
import { APIHandler } from 'core/api/api-handler';
import { Client } from 'react-fetching-library';
import { DiscoveryActionExt } from 'qp-discovery-ui';
import { GetAuthRequest } from 'features/authentication/domain/entities/get-auth-request';
import { AuthReponse } from 'features/authentication/domain/entities/auth-response';
import { CreateUserRequest } from 'features/authentication/domain/entities/create-user-request';
import { GetProfileResponse } from 'features/profile/domain/entities/get-profiles-response';
import { AccountExistsResponse } from 'features/authentication/domain/entities/account-exists-response';
import { AccountExistsRequest } from 'features/authentication/domain/entities/account-exists-request';
import { CreateOTPResponse } from 'features/authentication/domain/entities/create-otp-response';
import { CreateOTPRequest } from 'features/authentication/domain/entities/create-otp-request';
import { ConfirmOTPResponse } from 'features/authentication/domain/entities/confirm-otp-response';
import { ConfirmOTPRequest } from 'features/authentication/domain/entities/confirm-otp-request';
import { LogoutUserResponse } from 'features/authentication/domain/entities/logout-user-response';
import { FLOAuth2Response } from 'features/authentication/domain/entities/fl-auth-response';
import { validateResponse } from 'core/api/utils/response-validate';
import { FLOAuth2Request } from 'features/authentication/domain/entities/fl-auth-request';
import { formEncodedString } from 'core/api/utils/form-url-encode';
import { FLFlatTokenResponse } from 'features/authentication/domain/entities/fl-flat-token-response';
import { FlFlatTokenRequest } from 'features/authentication/domain/entities/fl-flat-token-request';
import { getFLDeviceName } from 'features/authentication/api/api-utils';
import { getDeviceId } from 'react-native-device-info';
import { EntitlementResponse } from 'features/authentication/domain/entities/entitlement-response';

export interface AuthRemoteDataSource {
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
    getEntitlements(
        accessToken: string,
        contactId: string,
        appConfig: AppConfig,
    ): Promise<EntitlementResponse | undefined>;
}

@injectable()
export class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
    client: Client | undefined;

    constructor() {
        this.client = APIHandler.getInstance().getClient();
    }

    async login(
        appConfig: AppConfig,
        email?: string,
        password?: string,
        socialLoginId?: string,
        socialLoginType?: string,
    ): Promise<AuthReponse> {
        if (this.client) {
            const loginRequest: GetAuthRequest = {
                Email: email,
                contactUserName: email,
                contactPassword: password,
                socialLoginID: socialLoginId,
                socialLoginType: socialLoginType,
                deviceMessage: await getDeviceInfo(),
            };
            const request = requestBody(EvergentEndpoints.LoginUser, appConfig, loginRequest);
            let action: DiscoveryActionExt = getAction(EvergentEndpoints.LoginUser, request);
            const response = await this.client.query<any>(action);
            return parseResponse<AuthReponse>(EvergentEndpoints.LoginUser, response);
        } else {
            throw new Error('Client Identifer undefined');
        }
    }

    /*
     *   An Api to create an user account
     */
    async createUser(email: string, password: string, appConfig: AppConfig): Promise<AuthReponse> {
        if (this.client) {
            const createUserRequest: CreateUserRequest = {
                email: email,
                customerUsername: email,
                customerPassword: password,
                deviceMessage: await getDeviceInfo(),
                dmaId: '001',
                isGenerateJWT: true,
            };
            const request = requestBody(EvergentEndpoints.CreateUser, appConfig, createUserRequest);
            let action: DiscoveryActionExt = getAction(EvergentEndpoints.CreateUser, request);
            const response = await this.client.query<any>(action);
            return parseResponse<AuthReponse>(EvergentEndpoints.CreateUser, response);
        } else {
            throw new Error('Client Identifer undefined');
        }
    }

    /*
     *   An Api to get list of profiles
     */
    async getProfiles(accessToken: string, appConfig: AppConfig): Promise<GetProfileResponse> {
        if (this.client) {
            const request = requestBody(EvergentEndpoints.GetUsers, appConfig);
            let action: DiscoveryActionExt = getAction(EvergentEndpoints.GetUsers, request);
            action.headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await this.client.query<any>(action);
            return parseResponse<GetProfileResponse>(EvergentEndpoints.GetUsers, response);
        } else {
            throw new Error('Client Identifer undefined');
        }
    }

    /*
     *   An Api to check whether an email already registered or not.
     */
    async accountExists(email: string, appConfig: AppConfig): Promise<AccountExistsResponse> {
        if (this.client) {
            const params: AccountExistsRequest = { email: email };
            const request = requestBody(EvergentEndpoints.SearchAccount, appConfig, params);
            let action: DiscoveryActionExt = getAction(EvergentEndpoints.SearchAccount, request);
            const response = await this.client.query<any>(action);
            return parseResponse<AccountExistsResponse>(EvergentEndpoints.SearchAccount, response);
        } else {
            throw new Error('Client Identifer undefined');
        }
    }

    async createOTP(mobileNumber: string, country: string, appConfig: AppConfig): Promise<CreateOTPResponse> {
        if (this.client) {
            const createOTPRequest: CreateOTPRequest = {
                mobileNumber: mobileNumber,
                country: country,
            };
            const request = requestBody(EvergentEndpoints.CreateOTP, appConfig, createOTPRequest);
            let action: DiscoveryActionExt = getAction(EvergentEndpoints.CreateOTP, request);
            const response = await this.client.query<any>(action);
            return parseResponse<CreateOTPResponse>(EvergentEndpoints.CreateOTP, response);
        } else {
            throw new Error('Client Identifer undefined');
        }
    }

    async confirmOTP(
        mobileNumber: string,
        country: string,
        otp: string,
        appConfig: AppConfig,
    ): Promise<ConfirmOTPResponse> {
        if (this.client) {
            const confirmOTPRequest: ConfirmOTPRequest = {
                mobileNumber: mobileNumber,
                country: country,
                otp: otp,
                canCreateAccount: true,
                isGenerateJWT: true,
                dmaId: dmaId,
                deviceDetails: await getDeviceInfo(),
            };
            const request = requestBody(EvergentEndpoints.ConfirmOTP, appConfig, confirmOTPRequest);
            let action: DiscoveryActionExt = getAction(EvergentEndpoints.ConfirmOTP, request);
            const response = await this.client.query<any>(action);
            return parseResponse<ConfirmOTPResponse>(EvergentEndpoints.ConfirmOTP, response);
        } else {
            throw new Error('Client Identifer undefined');
        }
    }

    async logout(accessToken: string, appConfig: AppConfig): Promise<LogoutUserResponse> {
        if (!this.client) {
            throw new Error('Client Identifer undefined');
        }
        const request = requestBody(EvergentEndpoints.LogOutUser, appConfig);
        let action: DiscoveryActionExt = getAction(EvergentEndpoints.LogOutUser, request);
        action.headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        const response = await this.client.query<any>(action);
        return parseResponse<LogoutUserResponse>(EvergentEndpoints.LogOutUser, response);
    }

    async flOAuth2(appConfig: AppConfig): Promise<FLOAuth2Response | undefined> {
        if (!this.client) {
            throw new Error('Client Identifer undefined');
        }
        const request: FLOAuth2Request = {
            grant_type: appConfig.oauthGrantType,
            client_id: appConfig.clientID,
            client_secret: appConfig.clientSecret,
            audience: 'edge-service',
        };

        const action: DiscoveryActionExt = {
            endpoint: '',
            method: 'POST',
            body: formEncodedString(request),
            clientIdentifier: 'flOAuth2',
        };

        action.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        const response = await this.client.query<FLOAuth2Response>(action);
        // Validate this response code and throw exception if it is not 200
        validateResponse(response.status);
        return response.payload;
    }

    async flFlatToken(flAuthToken: string): Promise<FLFlatTokenResponse | undefined> {
        if (!this.client) {
            throw new Error('Client Identifer undefined');
        }
        const request: FlFlatTokenRequest = {
            deviceName: getFLDeviceName(),
            deviceId: getDeviceId(),
        };
        const action: DiscoveryActionExt = {
            endpoint: '',
            method: 'POST',
            body: request,
            clientIdentifier: 'flFlat',
        };
        action.headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + flAuthToken,
        };
        const response = await this.client.query<FLFlatTokenResponse>(action);
        // Validate this response code and throw exception if it is not 200
        validateResponse(response.status);
        return response.payload;
    }

    async getEntitlements(
        accessToken: string,
        contactId: string,
        appConfig: AppConfig,
    ): Promise<EntitlementResponse | undefined> {
        if (this.client) {
            const entitlementRequest = {
                contactID: contactId,
            };
            const request = requestBody(EvergentEndpoints.GetEntitlements, appConfig, entitlementRequest);
            let action: DiscoveryActionExt = getAction(EvergentEndpoints.GetEntitlements, request);
            action.headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await this.client.query<any>(action);
            return parseResponse<EntitlementResponse>(EvergentEndpoints.GetEntitlements, response);
        } else {
            throw new Error('Client Identifer undefined');
        }
    }
}
