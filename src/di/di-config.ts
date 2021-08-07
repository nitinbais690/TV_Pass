import 'reflect-metadata';
import { Container } from 'inversify';
import coreDIModule from 'core/di/core-di-config';
import profileDIModule from 'features/profile/di/profile-di-config';
import authDIModule from 'features/authentication/di/auth-di-config';
import searchDIModule from 'features/search/di/search-di-config';
import watchListDIModule from 'features/watch-list/di/watchlist-di-config';

// DI container for whole application
const diContainer = new Container();

// Load the DI modules synchronously
diContainer.load(coreDIModule);
diContainer.load(profileDIModule);
diContainer.load(authDIModule);
diContainer.load(searchDIModule);
diContainer.load(watchListDIModule);

export default diContainer;
