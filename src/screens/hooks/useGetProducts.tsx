import { useAuth } from 'contexts/AuthContextProvider';
import { DiscoveryActionExt } from 'qp-discovery-ui';
import { useQuery } from 'react-fetching-library';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
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

//Takes boolean value as input true returns Subscriptions and false returns TopUp/Consumables
export const useGetProducts = (filterSubscriptions: boolean = false): ProductHookResponse => {
    const { appConfig } = useAppPreferencesState();
    const { accessToken } = useAuth();
    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };
    const body = requestBody(EvergentEndpoints.GetProducts, appConfig, {
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
    const { payload, loading, error, errorObject, query, reset } = useQuery<ResponseMessage>(productEndpoints);
    const response: Response = responsePayload(EvergentEndpoints.GetProducts, payload);
    const filteredContent =
        response &&
        response.productsResponseMessage &&
        response.productsResponseMessage
            .filter(product => !!product.renewable === filterSubscriptions)
            .sort((a, b) => a.displayOrder - b.displayOrder);

    return {
        response: filteredContent,
        loading: loading,
        error: error,
        errorObject: errorObject,
        reload: query,
        reset: reset,
    };
};
