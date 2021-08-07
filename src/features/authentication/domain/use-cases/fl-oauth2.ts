import { UseCase } from 'core/use-case/use-case';
import { AUTH_DI_TYPES } from 'features/authentication/di/auth-di-types';
import { inject, injectable } from 'inversify';
import { AppConfig } from 'utils/AppPreferencesContext';
import { FLOAuth2Response } from '../entities/fl-auth-response';
import { AuthRepository } from '../repositories/auth-repository';

@injectable()
export class FLOAuth2 implements UseCase<Promise<FLOAuth2Response | undefined>, AppConfig> {
    @inject(AUTH_DI_TYPES.AuthRepository)
    private authRepository: AuthRepository | undefined;

    execute(appConfig: AppConfig): Promise<FLOAuth2Response | undefined> {
        if (!this.authRepository) {
            throw new Error('Auth Repository instance not found.');
        }
        return this.authRepository.flOAuth2(appConfig);
    }
}
