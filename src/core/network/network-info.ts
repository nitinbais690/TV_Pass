import NetInfo from '@react-native-community/netinfo';
import 'reflect-metadata';
import { injectable } from 'inversify';

export interface NetworkInfo {
    isConnected(): Promise<boolean>;
}

@injectable()
export class NetworkInfoImpl implements NetworkInfo {
    async isConnected(): Promise<boolean> {
        let networkState = NetInfo.fetch();
        const state = await networkState;
        return state.isConnected ? state.isConnected : false;
    }
}
