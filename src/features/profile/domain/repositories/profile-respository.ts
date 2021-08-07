import { GenericResponse } from 'core/domain/entities/generic-response';
import { AppConfig } from 'utils/AppPreferencesContext';
import { GetProfileResponse } from '../entities/get-profiles-response';
import { Profile } from '../entities/profile';

export interface ProfileRepository {
    getProfiles(accessToken: string, appConfig: AppConfig): Promise<GetProfileResponse>;
    addOrUpdateContact(profile: Profile, accessToken: string, appConfig: AppConfig): Promise<GenericResponse>;
    deleteContact(
        accessToken: string,
        contactID: string,
        appConfig: AppConfig,
        locale?: string,
    ): Promise<GenericResponse>;
}
