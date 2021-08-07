export interface AddOrUpdateContactRequest {
    firstName: string;
    lastName?: string;
    language: string;
    contentLanguage: string;
    contactID?: string;
    locale?: string;
}
