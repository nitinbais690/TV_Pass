import 'reflect-metadata';
import { UseCase } from 'core/use-case/use-case';
import { inject, injectable } from 'inversify';
import { AppConfig } from 'utils/AppPreferencesContext';
import { AUTH_DI_TYPES } from 'features/authentication/di/auth-di-types';
import { AuthRepository } from '../repositories/auth-repository';
import { CreateOTPResponse } from '../entities/create-otp-response';

@injectable()
export class CreateOTP implements UseCase<Promise<CreateOTPResponse>, CreateOTPParams> {
    @inject(AUTH_DI_TYPES.AuthRepository)
    private authRespository: AuthRepository | undefined;

    execute(params: CreateOTPParams) {
        if (this.authRespository) {
            return this.authRespository.createOTP(params.mobileNumber, params.country, params.appConfig);
        } else {
            throw new Error('Auth Repository instance not found');
        }
    }
}
export class CreateOTPParams {
    mobileNumber: string;
    country: string;
    appConfig: AppConfig;

    constructor(mobileNumber: string, country: string, appConfig: AppConfig) {
        this.mobileNumber = mobileNumber;
        this.country = country;
        this.appConfig = appConfig;
    }
}
