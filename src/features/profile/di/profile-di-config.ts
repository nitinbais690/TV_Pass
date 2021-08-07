import 'reflect-metadata';
import { ContainerModule, interfaces } from 'inversify';
import { ProfileRemoteDataSource, ProfileRemoteDataSourceImpl } from '../data/data-sources/profile-remote-data-source';
import { PROFILE_DI_TYPES } from './profile-di-types';
import { GetProfiles } from '../domain/use-cases/get-profiles';
import { ProfileRepositoryImpl } from '../data/repositories/profile-respository-impl';
import { ProfileRepository } from '../domain/repositories/profile-respository';
import { AddOrUpdateContact } from '../domain/use-cases/app-update-contact';
import { DeleteContact } from '../domain/use-cases/delete-contact';

/**
 * Configure profile specific DI objects here to manage the dependency properly for large projects
 */
let profileDIModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<ProfileRepository>(PROFILE_DI_TYPES.ProfileRepository).to(ProfileRepositoryImpl);
    bind<ProfileRemoteDataSource>(PROFILE_DI_TYPES.ProfileRemoteDataSource).to(ProfileRemoteDataSourceImpl);
    bind<GetProfiles>(PROFILE_DI_TYPES.GetProfiles).to(GetProfiles);
    bind<AddOrUpdateContact>(PROFILE_DI_TYPES.AddOrUpdateContact).to(AddOrUpdateContact);
    bind<DeleteContact>(PROFILE_DI_TYPES.DeleteContact).to(DeleteContact);
});

// Export the configure
export default profileDIModule;
