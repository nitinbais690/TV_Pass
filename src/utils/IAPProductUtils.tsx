import { AppConfig } from './AppPreferencesContext';
import { DiscoveryActionExt } from 'qp-discovery-ui';
import { Action, QueryResponse } from 'react-fetching-library';
import { EvergentEndpoints, requestBody, responsePayload } from 'utils/EvergentAPIUtil';

export interface ProductHookResponse {
    response: ProductsResponseMessage[];
    loading: boolean;
    error: boolean;
    errorObject: any;
    reload: () => {};
    reset: () => void;
}
export interface ResponseMessage {
    GetProductsResponseMessage: Response;
}
export interface Response {
    responseCode?: string;
    message: string;
    productsResponseMessage: ProductsResponseMessage[];
}
export interface ProductsResponseMessage {
    dmaName: string;
    duration?: string;
    retailPrice: number;
    currencySymbol: string;
    currencyCode: string;
    productDescription: string;
    renewable?: boolean;
    displayName: string;
    period?: string;
    creditPoints: number;
    productName: string;
    skuORQuickCode: string;
    basicService: boolean;
    appChannels: appChannels[];
    scOfferTypes?: scOfferTypes;
    productCategory: string;
    serviceType: string;
    displayOrder: number;
    LocaleDescription?: LocaleDescription;
    promotions?: promotions[];
    attributes?: ProductAttribute[];
}

export interface ProductAttribute {
    attributeLabel: string;
    attributeType: string;
    attributeValue: string;
    attributeName: string;
}

export interface appChannels {
    appName: string;
    appChannel: string;
    appID: string;
}
export interface scOfferTypes {
    offerType: string;
    salesChannel: string;
}
export interface LocaleDescription {
    localeId: string;
    locale: string;
    displayName: string;
    period: string;
    description: string;
}
export interface promotions {
    amount: number;
    promotionId: string;
    isVODPromotion: boolean;
    promotionType: string;
    promotionName: string;
    promotionDuration: string;
    promoDescripon: string;
}

export const fetchIAPProducts = async (
    accessToken: string,
    config: AppConfig,
    query: <T = any, R = any>(actionInit: Action<T, R>, skipCache?: boolean) => Promise<QueryResponse<T>>,
) => {
    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };
    const body = requestBody(EvergentEndpoints.GetProducts, config, {
        dmaID: '001',
        returnAppChannels: 'T',
        returnPromotions: 'T',
        returnAttributes: 'T',
    });
    const productEndpoints: DiscoveryActionExt = {
        endpoint: EvergentEndpoints.GetProducts,
        method: 'POST',
        body: body,
        headers: headers,
        clientIdentifier: 'ums',
    };
    const { payload, error, errorObject } = await query<ResponseMessage>(productEndpoints);
    const response = responsePayload(EvergentEndpoints.GetProducts, payload) as Response;

    return {
        response: response,
        error: error,
        errorObject: errorObject,
    };
};
