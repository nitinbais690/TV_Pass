export interface Profile {
    isSelectedProfile?: boolean;
    isPrimaryContact?: boolean;
    firstName: string;
    lastName?: string;
    contactType?: string;
    allowTracking?: boolean;
    parentalControl?: boolean;
    email?: string;
    isPasswordExists?: boolean;
    emailIsVerified?: boolean;
    userName?: string;
    alertNotificationPush?: boolean;
    alertNotificationEmail?: boolean;
    contactID?: string;
    pin?: boolean;
    main?: boolean;
    isVIP?: boolean;
    language: string;
    contentLanguage: string;
    mobileNumber?: string;
    country?: string;
}
