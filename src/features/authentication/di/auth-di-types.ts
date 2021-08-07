/**
 * Auth specific DI types here
 */
const AUTH_DI_TYPES = {
    EmailSignup: Symbol.for('EmailSignup'),
    AuthRemoteDataSource: Symbol.for('AuthRemoteDataSource'),
    AuthRepository: Symbol.for('AuthRepository'),
    EmailLogin: Symbol.for('EmailLogin'),
    AccountExists: Symbol.for('AccountExists'),
    CreateOTP: Symbol.for('CreateOTP'),
    ConfirmOTP: Symbol.for('ConfirmOTP'),
    Logout: Symbol.for('Logout'),
    FLOAuth2: Symbol.for('FLOAuth2'),
    FLFlatToken: Symbol.for('FLFlatToken'),
    FetchEntitlements: Symbol.for('FetchEntitlements'),
};

// Export this types to whole application
export { AUTH_DI_TYPES };
