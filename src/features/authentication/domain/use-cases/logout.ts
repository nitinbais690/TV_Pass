import { UseCase } from 'core/use-case/use-case';
import { AUTH_DI_TYPES } from 'features/authentication/di/auth-di-types';
import { inject, injectable } from 'inversify';
import { AppConfig } from 'utils/AppPreferencesContext';
import { LogoutUserResponse } from '../entities/logout-user-response';
import { AuthRepository } from '../repositories/auth-repository';
@injectable()
export class LogoutUser implements UseCase<Promise<LogoutUserResponse>, LogoutUserParams> {
    @inject(AUTH_DI_TYPES.AuthRepository)
    private authRepository: AuthRepository | undefined;

    execute(params: LogoutUserParams): Promise<LogoutUserResponse> {
        if (!this.authRepository) {
            throw new Error('Auth Repository instance not found.');
        }
        return this.authRepository.logout(params.accessToken, params.appConfig);
    }
}

export class LogoutUserParams {
    accessToken: string;
    appConfig: AppConfig;

    constructor(accessToken: string, appConfig: AppConfig) {
        this.accessToken = accessToken;
        this.appConfig = appConfig;
    }
}
