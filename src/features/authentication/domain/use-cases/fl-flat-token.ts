import { UseCase } from 'core/use-case/use-case';
import { AUTH_DI_TYPES } from 'features/authentication/di/auth-di-types';
import { inject, injectable } from 'inversify';
import { FLFlatTokenResponse } from '../entities/fl-flat-token-response';
import { AuthRepository } from '../repositories/auth-repository';

@injectable()
export class FLFlatToken implements UseCase<Promise<FLFlatTokenResponse | undefined>, string> {
    @inject(AUTH_DI_TYPES.AuthRepository)
    private authRepository: AuthRepository | undefined;

    execute(flAuthToken: string): Promise<FLFlatTokenResponse | undefined> {
        if (!this.authRepository) {
            throw new Error('Auth Repository instance not found.');
        }
        return this.authRepository.flFlatToken(flAuthToken);
    }
}
