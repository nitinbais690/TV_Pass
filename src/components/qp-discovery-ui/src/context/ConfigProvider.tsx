import React, { useContext } from 'react';
import { ServiceConfig, createAPIClient } from '../api';
import { ClientContextProvider, Client } from 'react-fetching-library';
import { APIHandler } from 'core/api/api-handler';
type ConfigProviderProps = { config: Config; serviceConfig: ServiceConfig; children: React.ReactNode };

export type Config = { [key: string]: any };

const ConfigContext = React.createContext<Config | null>(null);

export const ConfigProvider = ({ config, serviceConfig, children }: ConfigProviderProps) => {
    const client: Client = createAPIClient(serviceConfig);
    APIHandler.getInstance().setClient(client); //To perform api without useQuery
    return (
        <ConfigContext.Provider value={config}>
            <ClientContextProvider client={client}>{children}</ClientContextProvider>
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};
