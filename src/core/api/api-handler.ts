import { Client } from 'react-fetching-library';

export class APIHandler {
    private static instance: APIHandler;
    private client: Client | undefined;

    private constructor() {
        // This is intentional
    }

    public static getInstance(): APIHandler {
        if (!APIHandler.instance) {
            APIHandler.instance = new APIHandler();
        }
        return APIHandler.instance;
    }

    setClient(apiClient: Client) {
        this.client = apiClient;
    }

    getClient(): Client | undefined {
        return this.client;
    }
}
