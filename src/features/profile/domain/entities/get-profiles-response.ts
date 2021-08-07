import { Profile } from './profile';

export interface GetProfileResponse {
    contactMessage: Profile[];
    isProfileComplete: boolean;
    verificationStatus: boolean;
    isMobileVerified: boolean;
    country: string;
    lastLoginTime: string;
    concurrentPlayLimit: string;
    accountRegistrationDate: string;
}
