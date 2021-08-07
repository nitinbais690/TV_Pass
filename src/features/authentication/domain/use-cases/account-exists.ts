import 'reflect-metadata';
import { UseCase } from 'core/use-case/use-case';
import { inject, injectable } from 'inversify';
import { AppConfig } from 'utils/AppPreferencesContext';
import { AccountExistsResponse } from '../entities/account-exists-response';
import { AUTH_DI_TYPES } from 'features/authentication/di/auth-di-types';
import { AuthRepository } from '../repositories/auth-repository';

@injectable()
export class AccountExists implements UseCase<Promise<AccountExistsResponse>, AccountExistsParams> {
    @inject(AUTH_DI_TYPES.AuthRepository)
    private authRespository: AuthRepository | undefined;

    execute(params: AccountExistsParams) {
        if (this.authRespository) {
            return this.authRespository.accountExists(params.email, params.appConfig);
        } else {
            throw new Error('Login Repository instance not found');
        }
    }
}
export class AccountExistsParams {
    email: string;
    appConfig: AppConfig;

    constructor(email: string, appConfig: AppConfig) {
        this.email = email;
        this.appConfig = appConfig;
    }
}
