import 'reflect-metadata';
import { UseCase } from 'core/use-case/use-case';
import { inject, injectable } from 'inversify';
import { ProfileRepository } from '../repositories/profile-respository';
import { PROFILE_DI_TYPES } from 'features/profile/di/profile-di-types';
import { AppConfig } from 'utils/AppPreferencesContext';
import { GenericResponse } from 'core/domain/entities/generic-response';

@injectable()
export class DeleteContact implements UseCase<Promise<GenericResponse>, DeleteContactParams> {
    @inject(PROFILE_DI_TYPES.ProfileRepository)
    private profileRepository: ProfileRepository | undefined;

    execute(params: DeleteContactParams) {
        if (this.profileRepository) {
            return this.profileRepository.deleteContact(
                params.accessToken,
                params.contactId,
                params.appConfig,
                params.locale,
            );
        } else {
            throw new Error('Profile Repository instance not found');
        }
    }
}

export class DeleteContactParams {
    accessToken: string;
    contactId: string;
    appConfig: AppConfig;
    locale?: string;

    constructor(accessToken: string, contactId: string, appConfig: AppConfig, locale?: string) {
        this.accessToken = accessToken;
        this.appConfig = appConfig;
        this.contactId = contactId;
        this.locale = locale;
    }
}
