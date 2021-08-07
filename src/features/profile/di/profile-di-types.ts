/**
 * Profile specific DI types here
 */
const PROFILE_DI_TYPES = {
    ProfileRemoteDataSource: Symbol.for('ProfileRemoteDataSource'),
    ProfileRepository: Symbol.for('ProfileRepository'),
    GetProfiles: Symbol.for('GetProfiles'),
    AddOrUpdateContact: Symbol.for('AddOrUpdateContact'),
    DeleteContact: Symbol.for('DeleteContact'),
};

// Export this types to whole application
export { PROFILE_DI_TYPES };
