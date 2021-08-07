import React, { useContext } from 'react';
import { ServiceConfig, createAPIClient } from '../api';
import { ClientContextProvider } from 'react-fetching-library';

type ConfigProviderProps = { config: Config; serviceConfig: ServiceConfig; children: React.ReactNode };

export type Config = { [key: string]: any };

const ConfigContext = React.createContext<Config | null>(null);

export const ConfigProvider = ({ config, serviceConfig, children }: ConfigProviderProps) => {
    const Client = createAPIClient(serviceConfig);

    return (
        <ConfigContext.Provider value={config}>
            <ClientContextProvider client={Client}>{children}</ClientContextProvider>
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
