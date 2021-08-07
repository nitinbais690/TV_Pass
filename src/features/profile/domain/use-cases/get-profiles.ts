import 'reflect-metadata';
import { UseCase } from 'core/use-case/use-case';
import { inject, injectable } from 'inversify';
import { ProfileRepository } from '../repositories/profile-respository';
import { PROFILE_DI_TYPES } from 'features/profile/di/profile-di-types';
import { AppConfig } from 'utils/AppPreferencesContext';
import { GetProfileResponse } from '../entities/get-profiles-response';

@injectable()
export class GetProfiles implements UseCase<Promise<GetProfileResponse>, GetProfilesParams> {
    @inject(PROFILE_DI_TYPES.ProfileRepository)
    private profileRepository: ProfileRepository | undefined;

    execute(params: GetProfilesParams) {
        if (this.profileRepository) {
            return this.profileRepository.getProfiles(params.accessToken, params.appConfig);
        } else {
            throw new Error('Profile Repository instance not found');
        }
    }
}
export class GetProfilesParams {
    accessToken: string;
    appConfig: AppConfig;

    constructor(accessToken: string, appConfig: AppConfig) {
        this.accessToken = accessToken;
        this.appConfig = appConfig;
    }
}
