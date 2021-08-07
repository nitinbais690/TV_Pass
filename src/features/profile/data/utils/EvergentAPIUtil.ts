import { AppConfig } from 'utils/AppPreferencesContext';
import { DeviceMessage } from '../../domain/entities/device-message';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import { EvergentAPIError } from 'features/profile/api/evergent-api-error';
import { InternalServerError } from 'core/api/errors/internal-server-error';
import { DiscoveryActionExt, Method } from 'components/qp-discovery-ui';
import { validateResponse } from 'core/api/utils/response-validate';
import decrypt from 'utils/SecurityUtil';

export enum EvergentEndpoints {
    CreateUser = 'createUser',
    LoginUser = 'getOAuthAccessTokenv2',
    RefreshToken = 'refreshToken',
    ForgotPassword = 'forgotContactPassword',
    ConfirmOTP = 'confirmOTP',
    CreateOTP = 'createOTP',
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
    GetUsers = 'getContact',
    AddContact = 'addContact',
    DeleteContact = 'deleteContact',
    SearchAccount = 'searchAccountV2',
}

export const dmaId = '001';

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
        case EvergentEndpoints.CreateOTP:
            return ['CreateOTPRequestMessage', 'CreateOTPResponseMessage'];
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
            return ['LogOutUserRequestMessage', 'LogOutUserResponseMessage'];
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
        case EvergentEndpoints.GetUsers:
            return ['GetContactRequestMessage', 'GetContactResponseMessage'];
        case EvergentEndpoints.AddContact:
            return ['AddContactRequestMessage', 'AddContactResponseMessage'];
        case EvergentEndpoints.UpdateProfile:
            return ['UpdateProfileRequestMessage', 'UpdateProfileResponseMessage'];
        case EvergentEndpoints.DeleteContact:
            return ['DeleteContactRequestMessage', 'DeleteContactResponseMessage'];
        case EvergentEndpoints.SearchAccount:
            return ['SearchAccountV2RequestMessage', 'SearchAccountV2ResponseMessage'];
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
    if (payload && !payload.contactID) {
        delete payload.contactID;
    }
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
    throw new InternalServerError('Error reponse not delivered');
};

export const isSuccess = (endpoint: EvergentEndpoints, payload: { [key: string]: any } | undefined) => {
    const [, responseKey] = requestResponseKey(endpoint);
    return payload && payload[responseKey] && payload[responseKey].responseCode === '1';
};

export const assertErrorCode = (endpoint: EvergentEndpoints, payload: { [key: string]: any } | undefined) => {
    const [, responseKey] = requestResponseKey(endpoint);
    if (
        payload &&
        payload[responseKey] &&
        payload[responseKey].failureMessage &&
        payload[responseKey].failureMessage.length > 0
    ) {
        return new EvergentAPIError(
            payload[responseKey].failureMessage[0].errorMessage,
            payload[responseKey].failureMessage[0].errorCode,
        );
    }
    throw new InternalServerError('Error reponse not delivered');
};

export const getDeviceInfo = async (): Promise<DeviceMessage> => {
    return {
        os: Platform.OS,
        deviceName: await DeviceInfo.getDeviceName(),
        deviceType: getEvergentDeviceType(),
        serialNo: await DeviceInfo.getUniqueId(),
        modelNo: DeviceInfo.getModel(),
        appType: getAppType(),
    };
};
function getEvergentDeviceType() {
    if (Platform.OS === 'android') {
        if (Platform.isTV) {
            return 'androidtv';
        } else if (DeviceInfo.getDeviceType() === 'Tablet') {
            return 'androidtablet';
        }
        return 'androidmobile';
    } else if (Platform.OS === 'ios') {
        if (Platform.isTV) {
            return 'tvos';
        } else if (DeviceInfo.getDeviceType() === 'Tablet') {
            return 'iostablet';
        }
        return 'iosmobile';
    }
}
function getAppType() {
    if (Platform.OS === 'android') {
        if (Platform.isTV) {
            return 'Android TV';
        }
        return 'Android';
    } else if (Platform.OS === 'ios') {
        if (Platform.isTV) {
            return 'Apple TV';
        }
        return 'iOS';
    }
}

export const getAction = (endPoint: EvergentEndpoints, request?: any, method?: Method): DiscoveryActionExt => {
    return {
        endpoint: endPoint,
        method: method ? method : 'POST',
        body: request,
        clientIdentifier: 'ums',
    };
};

export const parseResponse = <T>(endPoint: EvergentEndpoints, response: any): T => {
    // Validate this response code and throw exception if it is not 200
    validateResponse(response.status);
    if (isSuccess(endPoint, response.payload)) {
        return responsePayload(endPoint, response.payload);
    } else {
        throw assertErrorCode(endPoint, response.payload);
    }
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
