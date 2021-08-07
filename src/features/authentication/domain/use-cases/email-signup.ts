import 'reflect-metadata';
import { UseCase } from 'core/use-case/use-case';
import { inject, injectable } from 'inversify';
import { AuthReponse } from '../entities/auth-response';
import { AppConfig } from 'utils/AppPreferencesContext';
import { AuthRepository } from '../repositories/auth-repository';
import { AUTH_DI_TYPES } from 'features/authentication/di/auth-di-types';

@injectable()
export class EmailSignup implements UseCase<Promise<AuthReponse>, EmailSignupParams> {
    @inject(AUTH_DI_TYPES.AuthRepository)
    private authRepository: AuthRepository | undefined;

    execute(params: EmailSignupParams) {
        if (this.authRepository) {
            return this.authRepository.createUser(params.email, params.password, params.appConfig);
        } else {
            throw new Error('Auth Repository instance not found');
        }
    }
}

export class EmailSignupParams {
    email: string;
    password: string;
    appConfig: AppConfig;

    constructor(email: string, password: string, appConfig: AppConfig) {
        this.email = email;
        this.password = password;
        this.appConfig = appConfig;
    }
}
