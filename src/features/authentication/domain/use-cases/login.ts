import 'reflect-metadata';
import { UseCase } from 'core/use-case/use-case';
import { inject, injectable } from 'inversify';
import { AppConfig } from 'utils/AppPreferencesContext';
import { AuthRepository } from '../repositories/auth-repository';
import { AuthReponse } from 'features/authentication/domain/entities/auth-response';
import { AUTH_DI_TYPES } from 'features/authentication/di/auth-di-types';

@injectable()
export class Login implements UseCase<Promise<AuthReponse>, LoginParams> {
    @inject(AUTH_DI_TYPES.AuthRepository)
    private loginRespository: AuthRepository | undefined;

    execute(params: LoginParams) {
        if (this.loginRespository) {
            return this.loginRespository.login(
                params.appConfig,
                params.email,
                params.password,
                params.socialLoginId,
                params.socialLoginType,
            );
        } else {
            throw new Error('Login Repository instance not found');
        }
    }
}
export class LoginParams {
    appConfig: AppConfig;
    email?: string;
    password?: string;
    socialLoginId?: string;
    socialLoginType?: string;

    constructor(
        appConfig: AppConfig,
        email?: string,
        password?: string,
        socialLoginId?: string,
        socialLoginType?: string,
    ) {
        this.appConfig = appConfig;
        this.email = email;
        this.password = password;
        this.socialLoginId = socialLoginId;
        this.socialLoginType = socialLoginType;
    }
}
