import 'reflect-metadata';
import { injectable } from 'inversify';
import { AppConfig } from 'utils/AppPreferencesContext';
import { requestBody, EvergentEndpoints, getAction, parseResponse } from '../utils/EvergentAPIUtil';
import { APIHandler } from 'core/api/api-handler';
import { Client } from 'react-fetching-library';
import { DiscoveryActionExt } from 'qp-discovery-ui';
import { GetProfileResponse } from 'features/profile/domain/entities/get-profiles-response';
import { GenericResponse } from 'core/domain/entities/generic-response';
import { AddOrUpdateContactRequest } from 'features/profile/domain/entities/add-update-contact-request';
import { DeleteContactRequest } from 'features/profile/domain/entities/delete-contact-request';
import { Profile } from 'features/profile/domain/entities/profile';

export interface ProfileRemoteDataSource {
    getProfiles(accessToken: string, appConfig: AppConfig): Promise<GetProfileResponse>;
    addOrUpdateContact(profile: Profile, accessToken: string, appConfig: AppConfig): Promise<GenericResponse>;
    deleteContact(
        accessToken: string,
        contactID: string,
        appConfig: AppConfig,
        locale?: string,
    ): Promise<GenericResponse>;
}

@injectable()
export class ProfileRemoteDataSourceImpl implements ProfileRemoteDataSource {
    client: Client | undefined;

    constructor() {
        this.client = APIHandler.getInstance().getClient();
    }

    /*
     *   An Api to get list of profiles
     */
    async getProfiles(accessToken: string, appConfig: AppConfig): Promise<GetProfileResponse> {
        if (this.client) {
            const request = requestBody(EvergentEndpoints.GetUsers, appConfig);
            let action: DiscoveryActionExt = getAction(EvergentEndpoints.GetUsers, request);
            action.headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await this.client.query<any>(action);
            return parseResponse<GetProfileResponse>(EvergentEndpoints.GetUsers, response);
        } else {
            throw new Error('Client Identifer undefined');
        }
    }

    /*
     *   An Api to Add or Update sub profiles
     */
    async addOrUpdateContact(profile: Profile, accessToken: string, appConfig: AppConfig): Promise<GenericResponse> {
        if (this.client) {
            const addOrUpdateContactRequest: AddOrUpdateContactRequest = {
                firstName: profile.firstName,
                language: profile.language,
                contentLanguage: profile.contentLanguage,
                contactID: profile.contactID,
            };
            const endpoint = profile.contactID ? EvergentEndpoints.UpdateProfile : EvergentEndpoints.AddContact;
            const request = requestBody(endpoint, appConfig, addOrUpdateContactRequest);
            let action: DiscoveryActionExt = getAction(endpoint, request);
            action.headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await this.client.query<any>(action);
            return parseResponse<GenericResponse>(endpoint, response);
        } else {
            throw new Error('Client Identifer undefined');
        }
    }

    /*
     *   An Api to delete sub profiles
     */
    async deleteContact(accessToken: string, contactID: string, appConfig: AppConfig): Promise<GenericResponse> {
        if (this.client) {
            const deleteContactRequest: DeleteContactRequest = {
                contactId: contactID,
            };
            const request = requestBody(EvergentEndpoints.DeleteContact, appConfig, deleteContactRequest);
            let action: DiscoveryActionExt = getAction(EvergentEndpoints.DeleteContact, request);
            action.headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await this.client.query<any>(action);
            return parseResponse<GenericResponse>(EvergentEndpoints.DeleteContact, response);
        } else {
            throw new Error('Client Identifer undefined');
        }
    }
}
