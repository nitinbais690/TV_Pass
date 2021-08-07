import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { AppConfig } from 'utils/AppPreferencesContext';
import { NetworkInfo } from 'core/network/network-info';
import { CORE_DI_TYPES } from 'core/di/core-di-types';
import { NetworkError } from 'core/api/errors/network-error';
import { AuthRepository } from '../../domain/repositories/auth-repository';
import { AuthRemoteDataSource } from '../data-sources/auth-remote-data-source';
import { AuthReponse } from 'features/authentication/domain/entities/auth-response';
import { AccountExistsResponse } from 'features/authentication/domain/entities/account-exists-response';
import { AUTH_DI_TYPES } from 'features/authentication/di/auth-di-types';
import { CreateOTPResponse } from 'features/authentication/domain/entities/create-otp-response';
import { ConfirmOTPResponse } from 'features/authentication/domain/entities/confirm-otp-response';
import { LogoutUserResponse } from 'features/authentication/domain/entities/logout-user-response';
import { FLOAuth2Response } from 'features/authentication/domain/entities/fl-auth-response';
import { FLFlatTokenResponse } from 'features/authentication/domain/entities/fl-flat-token-response';
import { EntitlementResponse } from 'features/authentication/domain/entities/entitlement-response';

@injectable()
export class AuthRepositoryImpl implements AuthRepository {
    @inject(AUTH_DI_TYPES.AuthRemoteDataSource)
    private dataSource!: AuthRemoteDataSource;

    @inject(CORE_DI_TYPES.NetworkInfo)
    private networkInfo!: NetworkInfo;

    createUser(email: string, password: string, appConfig: AppConfig): Promise<AuthReponse> {
        this.assert();
        this.assetNetworkError();
        return this.dataSource.createUser(email, password, appConfig);
    }

    accountExists(email: string, appConfig: AppConfig): Promise<AccountExistsResponse> {
        this.assert();
        this.assetNetworkError();
        return this.dataSource.accountExists(email, appConfig);
    }

    login(
        appConfig: AppConfig,
        email?: string,
        password?: string,
        socialLoginId?: string,
        socialLoginType?: string,
    ): Promise<AuthReponse> {
        this.assert();
        if (this.networkInfo.isConnected()) {
            return this.dataSource.login(appConfig, email, password, socialLoginId, socialLoginType);
        } else {
            throw new NetworkError();
        }
    }

    createOTP(mobileNumber: string, country: string, appConfig: AppConfig): Promise<CreateOTPResponse> {
        this.assert();
        this.assetNetworkError();
        return this.dataSource.createOTP(mobileNumber, country, appConfig);
    }

    confirmOTP(mobileNumber: string, country: string, otp: string, appConfig: AppConfig): Promise<ConfirmOTPResponse> {
        this.assert();
        this.assetNetworkError();
        return this.dataSource.confirmOTP(mobileNumber, country, otp, appConfig);
    }

    logout(accessToken: string, appConfig: AppConfig): Promise<LogoutUserResponse> {
        this.assert();
        this.assetNetworkError();
        return this.dataSource.logout(accessToken, appConfig);
    }

    flOAuth2(appConfig: AppConfig): Promise<FLOAuth2Response | undefined> {
        this.assert();
        this.assetNetworkError();
        return this.dataSource.flOAuth2(appConfig);
    }

    flFlatToken(flAuthToken: string): Promise<FLFlatTokenResponse | undefined> {
        this.assert();
        this.assetNetworkError();
        return this.dataSource.flFlatToken(flAuthToken);
    }

    getEntitlements(
        accessToken: string,
        contactId: string,
        appConfig: AppConfig,
    ): Promise<EntitlementResponse | undefined> {
        this.assert();
        this.assetNetworkError();
        return this.dataSource.getEntitlements(accessToken, contactId, appConfig);
    }

    private assetNetworkError() {
        this.assert();
        if (!this.networkInfo.isConnected()) {
            throw new NetworkError();
        }
    }

    // Throw error if network | datasource undefined undefined
    private assert() {
        if (!(this.dataSource || this.networkInfo)) {
            throw new Error('Data source || Network info not found');
        }
    }
}
