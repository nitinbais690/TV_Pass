import 'reflect-metadata';
import { UseCase } from 'core/use-case/use-case';
import { inject, injectable } from 'inversify';
import { AppConfig } from 'utils/AppPreferencesContext';
import { AUTH_DI_TYPES } from 'features/authentication/di/auth-di-types';
import { AuthRepository } from '../repositories/auth-repository';
import { ConfirmOTPResponse } from '../entities/confirm-otp-response';

@injectable()
export class ConfirmOTP implements UseCase<Promise<ConfirmOTPResponse>, ConfirmOTPParams> {
    @inject(AUTH_DI_TYPES.AuthRepository)
    private authRespository: AuthRepository | undefined;

    execute(params: ConfirmOTPParams) {
        if (this.authRespository) {
            return this.authRespository.confirmOTP(params.mobileNumber, params.country, params.otp, params.appConfig);
        } else {
            throw new Error('Auth Repository instance not found');
        }
    }
}
export class ConfirmOTPParams {
    mobileNumber: string;
    country: string;
    otp: string;
    appConfig: AppConfig;

    constructor(mobileNumber: string, country: string, otp: string, appConfig: AppConfig) {
        this.mobileNumber = mobileNumber;
        this.country = country;
        this.otp = otp;
        this.appConfig = appConfig;
    }
}
