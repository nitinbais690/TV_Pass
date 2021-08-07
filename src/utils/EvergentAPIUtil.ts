import { AppConfig } from 'utils/AppPreferencesContext';
import decrypt from 'utils/SecurityUtil';

export enum EvergentEndpoints {
    CreateUser = 'createUser',
    LoginUser = 'getOAuthAccessTokenv2',
    RefreshToken = 'refreshToken',
    ForgotPassword = 'forgotContactPassword',
    ConfirmOTP = 'confirmOTP',
    ResetPassword = 'resetPassword',
    UpdateProfile = 'updateProfile',
    GetAccountProfile = 'getAccountProfile',
    SetString = 'setString',
    AddSubscription = 'addSubscription',
    GetProducts = 'getProducts',
    CreditsEndpoint = 'getAccountCreditPoints',
    GetEntitlements = 'getEntitlements',
    LogOutUser = 'logOutUser',
    AddTVODOrder = 'addTVODOrder',
    RecordPlayTime = 'recordPlayTime',
    RemoveDevices = 'removeDevices',
    GetAccountDevices = 'getAccountDevices',
    GetVODEntitlements = 'getVODEntitlements',
}

export const requestResponseKey = (endpoint: EvergentEndpoints) => {
    switch (endpoint) {
        case EvergentEndpoints.CreateUser:
            return ['CreateUserRequestMessage', 'CreateUserResponseMessage'];
        case EvergentEndpoints.LoginUser:
            return ['GetOAuthAccessTokenv2RequestMessage', 'GetOAuthAccessTokenv2ResponseMessage'];
        case EvergentEndpoints.RefreshToken:
            return ['RefreshTokenRequestMessage', 'RefreshTokenResponseMessage'];
        case EvergentEndpoints.ForgotPassword:
            return ['ForgotContactPasswordRequestMessage', 'ForgotContactPasswordResponseMessage'];
        case EvergentEndpoints.ConfirmOTP:
            return ['ConfirmOTPRequestMessage', 'ConfirmOTPResponseMessage'];
        case EvergentEndpoints.ResetPassword:
            return ['ResetPasswordRequestMessage', 'ResetPasswordResponseMessage'];
        case EvergentEndpoints.UpdateProfile:
            return ['UpdateProfileRequestMessage', 'UpdateProfileResponseMessage'];
        case EvergentEndpoints.GetAccountProfile:
            return ['GetAccountProfileRequestMessage', 'GetAccountProfileResponseMessage'];
        case EvergentEndpoints.SetString:
            return ['SetStringRequestMessage', 'SetStringResponseMessage'];
        case EvergentEndpoints.AddSubscription:
            return ['AddSubscriptionRequestMessage', 'AddSubscriptionResponseMessage'];
        case EvergentEndpoints.GetProducts:
            return ['GetProductsRequestMessage', 'GetProductsResponseMessage'];
        case EvergentEndpoints.CreditsEndpoint:
            return ['GetAccountCreditPointsRequestMessage', 'GetAccountCreditPointsResponseMessage'];
        case EvergentEndpoints.GetEntitlements:
            return ['GetEntitlementsRequestMessage', 'GetEntitlementsResponseMessage'];
        case EvergentEndpoints.LogOutUser:
            return ['LogOutUserRequestMesssage', 'LogOutUserResponseMessage'];
        case EvergentEndpoints.AddTVODOrder:
            return ['AddTVODOrderRequestMessage', 'AddTVODOrderResponseMessage'];
        case EvergentEndpoints.RecordPlayTime:
            return ['RecordPlayTimeRequestMessage', 'RecordPlayTimeResponseMessage'];
        case EvergentEndpoints.RemoveDevices:
            return ['RemoveDevicesRequestMessage', 'RemoveDevicesResponseMessage'];
        case EvergentEndpoints.GetAccountDevices:
            return ['GetAccountDevicesRequestMessage', 'GetAccountDevicesResponseMessage'];
        case EvergentEndpoints.GetVODEntitlements:
            return ['GetVODEntitlementsRequestMessage', 'GetVODEntitlementsResponseMessage'];
    }
};

export const requestBody = (
    endpoint: EvergentEndpoints,
    appConfig: AppConfig | undefined,
    payload?: { [key: string]: any },
) => {
    const [requestKey] = requestResponseKey(endpoint);
    const isAddTVODOrderAPI = endpoint === EvergentEndpoints.AddTVODOrder;
    const apiUserKey = isAddTVODOrderAPI ? 'apiuser' : 'apiUser';
    const apiPasswordKey = isAddTVODOrderAPI ? 'apipassword' : 'apiPassword';
    const apiUser = appConfig ? appConfig.umsApiUser : '';
    const apiPassword = appConfig ? decrypt(appConfig.umsApiToken) : '';
    const channelPartnerID = appConfig ? appConfig.channelPartnerID : '';
    return {
        [requestKey]: {
            [apiUserKey]: apiUser,
            [apiPasswordKey]: apiPassword,
            channelPartnerID: channelPartnerID,
            ...payload,
        },
    };
};

export const responsePayload = (endpoint: EvergentEndpoints, payload: { [key: string]: any } | undefined) => {
    const [, responseKey] = requestResponseKey(endpoint);
    if (payload && payload[responseKey]) {
        return payload[responseKey];
    }
    return undefined;
};

export const isSuccess = (endpoint: EvergentEndpoints, payload: { [key: string]: any } | undefined) => {
    const [, responseKey] = requestResponseKey(endpoint);
    return payload && payload[responseKey] && payload[responseKey].responseCode === '1';
};

export const errorCode = (endpoint: EvergentEndpoints, payload: { [key: string]: any } | undefined) => {
    const [, responseKey] = requestResponseKey(endpoint);
    if (
        payload &&
        payload[responseKey] &&
        payload[responseKey].failureMessage &&
        payload[responseKey].failureMessage.length > 0
    ) {
        return payload[responseKey].failureMessage[0].errorCode;
    }
    return undefined;
};

// Models

export interface AccountProfile {
    accountId: string;
    downloadLimit: number;
    downloadCount: number;
    subscriptionStatus: boolean;
    prevSubExpDateTime: number;
    subscriptionExpDateTime: number;
    nextBillingDateTime: number;
    countryOfRegistration: string;
    accountStatus: string;
    numDeviceRegistered: number;
    isUserFreeTrial: string;
    hasActivationCode: boolean;
    subscriberSince: number;
    freeTrialStartDate: number;
    freeTrialEndDate: number;
    accountCreditsPoints: number;
    neverSubscribed: boolean;
    withinGracePeriod: boolean;
    hasSubCancelled: boolean;
    contactMessage: ContactMessage[];
    stringAttribute?: AccountAttributes[];
    baseSubscription: string;
    addonSubscriptionOneTime: [];
    addonSubscriptionRecurring: [];
}

export interface ContactMessage {
    contactID: string;
    email: string;
    firstName: string;
    lastName: string;
    isPrimaryContact: boolean;
    gender?: string;
    dateOfBirth?: number;
}

export interface AccountAttributes {
    attributeType: AttributeType;
    value: string;
}

export interface AttributeType {
    attributeName: string;
}
