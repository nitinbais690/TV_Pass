import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { AppConfig } from 'utils/AppPreferencesContext';
import { ProfileRepository } from '../../domain/repositories/profile-respository';
import { NetworkInfo } from 'core/network/network-info';
import { CORE_DI_TYPES } from 'core/di/core-di-types';
import { ProfileRemoteDataSource } from '../data-sources/profile-remote-data-source';
import { PROFILE_DI_TYPES } from '../../di/profile-di-types';
import { NetworkError } from 'core/api/errors/network-error';
import { GetProfileResponse } from 'features/profile/domain/entities/get-profiles-response';
import { GenericResponse } from 'core/domain/entities/generic-response';
import { Profile } from 'features/profile/domain/entities/profile';

@injectable()
export class ProfileRepositoryImpl implements ProfileRepository {
    @inject(PROFILE_DI_TYPES.ProfileRemoteDataSource)
    private dataSource!: ProfileRemoteDataSource;

    @inject(CORE_DI_TYPES.NetworkInfo)
    private networkInfo!: NetworkInfo;

    getProfiles(accessToken: string, appConfig: AppConfig): Promise<GetProfileResponse> {
        this.assert();
        this.assetNetworkError();
        return this.dataSource.getProfiles(accessToken, appConfig);
    }

    addOrUpdateContact(profile: Profile, accessToken: string, appConfig: AppConfig): Promise<GenericResponse> {
        this.assert();
        this.assetNetworkError();
        return this.dataSource.addOrUpdateContact(profile, accessToken, appConfig);
    }

    deleteContact(
        accessToken: string,
        contactID: string,
        appConfig: AppConfig,
        locale?: string,
    ): Promise<GenericResponse> {
        this.assert();
        this.assetNetworkError();
        return this.dataSource.deleteContact(accessToken, contactID, appConfig, locale);
    }

    private assetNetworkError() {
        this.assert();
        if (!this.networkInfo.isConnected()) {
            throw new NetworkError();
        }
    }

    // Throw error if network | datasource undefined undefined
    private assert() {
        if (!(this.dataSource || this.networkInfo)) {
            throw new Error('Data source || Network info not found');
        }
    }
}
