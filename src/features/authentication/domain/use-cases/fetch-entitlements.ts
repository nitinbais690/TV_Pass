import { UseCase } from 'core/use-case/use-case';
import { AUTH_DI_TYPES } from 'features/authentication/di/auth-di-types';
import { inject, injectable } from 'inversify';
import { AppConfig } from 'utils/AppPreferencesContext';
import { EntitlementResponse } from '../entities/entitlement-response';
import { AuthRepository } from '../repositories/auth-repository';

@injectable()
export class FetchEntitlements implements UseCase<Promise<EntitlementResponse | undefined>, FetchEntitlementsParams> {
    @inject(AUTH_DI_TYPES.AuthRepository)
    private authRepository: AuthRepository | undefined;

    execute(params: FetchEntitlementsParams): Promise<EntitlementResponse | undefined> {
        if (!this.authRepository) {
            throw new Error('Auth Repository instance not found.');
        }
        return this.authRepository.getEntitlements(params.accessToken, params.contactId, params.appConfig);
    }
}

export class FetchEntitlementsParams {
    accessToken: string;
    contactId: string;
    appConfig: AppConfig;

    constructor(accessToken: string, contactId: string, appConfig: AppConfig) {
        this.accessToken = accessToken;
        this.contactId = contactId;
        this.appConfig = appConfig;
    }
}
