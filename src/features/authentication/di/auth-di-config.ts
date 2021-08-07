import 'reflect-metadata';
import { ContainerModule, interfaces } from 'inversify';
import { AuthRemoteDataSource, AuthRemoteDataSourceImpl } from '../data/data-sources/auth-remote-data-source';
import { AuthRepositoryImpl } from '../data/repositories/auth-repository-impl';
import { AuthRepository } from '../domain/repositories/auth-repository';
import { AccountExists } from '../domain/use-cases/account-exists';
import { AUTH_DI_TYPES } from './auth-di-types';
import { EmailSignup } from '../domain/use-cases/email-signup';
import { CreateOTP } from '../domain/use-cases/create-otp';
import { ConfirmOTP } from '../domain/use-cases/confirm-otp';
import { Login } from '../domain/use-cases/login';
import { LogoutUser } from '../domain/use-cases/logout';
import { FLOAuth2 } from '../domain/use-cases/fl-oauth2';
import { FLFlatToken } from '../domain/use-cases/fl-flat-token';
import { FetchEntitlements } from '../domain/use-cases/fetch-entitlements';
/**
 */
let authDIModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<Login>(AUTH_DI_TYPES.EmailLogin).to(Login);
    bind<AuthRepository>(AUTH_DI_TYPES.AuthRepository).to(AuthRepositoryImpl);
    bind<AuthRemoteDataSource>(AUTH_DI_TYPES.AuthRemoteDataSource).to(AuthRemoteDataSourceImpl);
    bind<EmailSignup>(AUTH_DI_TYPES.EmailSignup).to(EmailSignup);
    bind<AccountExists>(AUTH_DI_TYPES.AccountExists).to(AccountExists);
    bind<CreateOTP>(AUTH_DI_TYPES.CreateOTP).to(CreateOTP);
    bind<ConfirmOTP>(AUTH_DI_TYPES.ConfirmOTP).to(ConfirmOTP);
    bind<LogoutUser>(AUTH_DI_TYPES.Logout).to(LogoutUser);
    bind<FLOAuth2>(AUTH_DI_TYPES.FLOAuth2).to(FLOAuth2);
    bind<FLFlatToken>(AUTH_DI_TYPES.FLFlatToken).to(FLFlatToken);
    bind<FetchEntitlements>(AUTH_DI_TYPES.FetchEntitlements).to(FetchEntitlements);
});

// Export the configure
export default authDIModule;
