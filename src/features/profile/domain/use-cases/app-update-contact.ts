import 'reflect-metadata';
import { UseCase } from 'core/use-case/use-case';
import { inject, injectable } from 'inversify';
import { ProfileRepository } from '../repositories/profile-respository';
import { PROFILE_DI_TYPES } from 'features/profile/di/profile-di-types';
import { AppConfig } from 'utils/AppPreferencesContext';
import { GenericResponse } from 'core/domain/entities/generic-response';
import { Profile } from '../entities/profile';

@injectable()
export class AddOrUpdateContact implements UseCase<Promise<GenericResponse>, AddOrUpdateContactParams> {
    @inject(PROFILE_DI_TYPES.ProfileRepository)
    private profileRepository: ProfileRepository | undefined;

    execute(params: AddOrUpdateContactParams) {
        if (this.profileRepository) {
            return this.profileRepository.addOrUpdateContact(params.profile, params.accessToken, params.appConfig);
        } else {
            throw new Error('Profile Repository instance not found');
        }
    }
}

export class AddOrUpdateContactParams {
    profile: Profile;
    accessToken: string;
    appConfig: AppConfig;

    constructor(profile: Profile, accessToken: string, appConfig: AppConfig) {
        this.profile = profile;
        this.accessToken = accessToken;
        this.appConfig = appConfig;
    }
}
