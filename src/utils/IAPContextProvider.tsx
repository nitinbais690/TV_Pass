import React, { useContext, useEffect, useReducer, useRef } from 'react';
import { EmitterSubscription } from 'react-native';
import { queue } from 'async';
import RNIap, { purchaseErrorListener, purchaseUpdatedListener, PurchaseError, Purchase } from 'react-native-iap';
import { ClientContext, DiscoveryActionExt } from 'qp-discovery-ui';
import { AppConfig, useAppPreferencesState } from './AppPreferencesContext';
import {
    EvergentEndpoints,
    isSuccess,
    requestResponseKey,
    errorCode,
    responsePayload,
    requestBody as evergentRequestBody,
    AccountProfile,
} from './EvergentAPIUtil';
import decrypt from './SecurityUtil';
import { useAuth } from 'contexts/AuthContextProvider';
import { ProductsResponseMessage } from 'screens/hooks/useGetProducts';
import { createError } from 'utils/Error';

export enum ErrorCodes {
    // eV2378: The Receipt is already used
    ERROR_CODE_RECEIPT_USED = 'eV2378',
    // eV2374: No Service exists with the given AppServiceID
    ERROR_CODE_INVALID_SERVICE = 'eV2374',
    // eV2402: Subscription is already expired with the given product id
    ERROR_CODE_SUBSCRIPTION_EXPIRED = 'eV2402',
    // eV2365:
    ERROR_CODE_SUBSCRIPTION_TIED_DIFF_ACCOUNT = 'eV2365',
    // 3532: ASDServerErrorDomain You're currently subscribed to this. see: https://developer.apple.com/forums/thread/664977
    ERROR_CODE_ALREADY_SUBSCRIBED = '3532',
}

type InitState = 'Initializing' | 'Ready' | 'Failed';

interface State {
    initState?: InitState;
    loading?: boolean;
    error?: boolean;
    errorObject?: any;
    transactionSuccess?: boolean;
    skuId?: string;
    productType?: IAPProductType;
    queueProcessed?: boolean;
    queueTaskErrors: any[];
}

interface Action {
    initState?: InitState;
    type: string;
    errorObject?: any;
    skuID?: string;
    productType?: IAPProductType;
}

enum IAPState {
    INIT = 'Initializing',
    PURCHASE_REQUEST = 'purchase_request',
    PURCHASE_SUCCESS = 'purchase_success',
    PURCHASE_ERROR = 'purchase_error',
    RESET_TRANSACTION = 'reset_transaction',
    QUEUE_PROCESSED = 'queue_processed',
    QUEUE_TASK_ERROR = 'queue_task_error',
}

enum IAPProductType {
    Subscription = 'Subscription',
    TopUp = 'TopUp',
}

const QUEUE_CONCURRENCY = 1;

const EV_PRODUCT_TYPE = 'Product';

const initialState: State = {
    initState: 'Initializing',
    loading: undefined,
    transactionSuccess: undefined,
    skuId: undefined,
    productType: undefined,
    error: undefined,
    errorObject: undefined,
    queueProcessed: undefined,
    queueTaskErrors: [],
};

const IAPReducer = (state: State, action: Action): State => {
    console.debug(`[IAPContext] reducer action type: ${action.type}`, action);
    switch (action.type) {
        case IAPState.INIT:
            return {
                ...state,
                initState: action.initState,
            };
        case IAPState.PURCHASE_REQUEST:
            return {
                ...state,
                loading: true,
                transactionSuccess: undefined,
                error: undefined,
                queueProcessed: undefined,
                errorObject: action.errorObject,
                skuId: action.skuID,
                productType: action.productType,
            };
        case IAPState.PURCHASE_ERROR:
            return {
                ...state,
                loading: false,
                transactionSuccess: false,
                queueProcessed: undefined,
                queueTaskErrors: [],
                error: true,
                errorObject: action.errorObject,
                ...(action.skuID && { skuId: action.skuID }),
                ...(action.productType && { productType: action.productType }),
            };
        case IAPState.PURCHASE_SUCCESS: {
            return {
                ...state,
                loading: false,
                transactionSuccess: true,
                queueProcessed: undefined,
                error: false,
                errorObject: action.errorObject,
                skuId: action.skuID,
                productType: action.productType,
            };
        }
        case IAPState.RESET_TRANSACTION: {
            return {
                ...state,
                loading: undefined,
                transactionSuccess: undefined,
                queueProcessed: undefined,
                queueTaskErrors: [],
                error: undefined,
                errorObject: undefined,
                skuId: undefined,
                productType: undefined,
            };
        }
        case IAPState.QUEUE_PROCESSED: {
            return {
                ...state,
                queueProcessed: true,
            };
        }
        case IAPState.QUEUE_TASK_ERROR: {
            return {
                ...state,
                queueTaskErrors: [...state.queueTaskErrors, action.errorObject],
            };
        }
        default:
            return {
                ...state,
            };
    }
};

const requestBody = (
    endpoint: EvergentEndpoints,
    appConfig: AppConfig | undefined,
    recepit: string,
    payload?: { [key: string]: any },
) => {
    const [requestKey] = requestResponseKey(endpoint);
    const apiUser = appConfig ? appConfig.umsApiUser : '';
    const apiPassword = appConfig ? decrypt(appConfig.umsApiToken) : '';
    const channelPartnerID = appConfig ? appConfig.channelPartnerID : '';

    return {
        [requestKey]: {
            apiUser: apiUser,
            apiPassword: apiPassword,
            channelPartnerID: channelPartnerID,
            paymentmethodInfo: {
                label: 'App Store Billing',
                transactionReferenceMsg: { txID: recepit, txMsg: 'Success' },
            },
            ...payload,
        },
    };
};

const IAPContext = React.createContext({
    ...initialState,
    getProducts: async (_: string[]) => {},
    purchaseSubscription: async (_: ProductsResponseMessage) => {},
    purchaseProduct: async (_: ProductsResponseMessage) => {},
    resetTransaction: async () => {},
});

type IAPContextProviderChildren = { children: React.ReactNode };

const IAPContextProvider = ({ children }: IAPContextProviderChildren) => {
    const [state, dispatch] = useReducer(IAPReducer, initialState);
    const { query } = useContext(ClientContext);
    const { accessToken } = useAuth();
    const accessTokenRef = useRef(accessToken);
    const { appConfig } = useAppPreferencesState();

    let purchaseUpdateSubscriptionRef = useRef<EmitterSubscription | null>();
    let purchaseErrorSubscriptionRef = useRef<EmitterSubscription | null>();

    useEffect(() => {
        accessTokenRef.current = accessToken;
    }, [accessToken]);

    const processPurchase = React.useCallback(
        async (purchase: Purchase) => {
            const receipt = purchase.transactionReceipt;
            const headers = {
                Authorization: `Bearer ${accessTokenRef.current}`,
            };
            const body = requestBody(EvergentEndpoints.AddSubscription, appConfig, receipt, {
                serviceType: EV_PRODUCT_TYPE,
                isSkipDefaultPromo: 'true',
                makeAutoPayment: 'true',
                appServiceID: purchase.productId,
            });

            if (body) {
                const endpoint: DiscoveryActionExt = {
                    endpoint: EvergentEndpoints.AddSubscription,
                    method: 'POST',
                    clientIdentifier: 'ums',
                    body: body,
                    headers: headers,
                };
                const { payload, errorObject } = await query(endpoint);
                if (isSuccess(EvergentEndpoints.AddSubscription, payload)) {
                    console.debug('[IAPContext] EV addSubscription is successful');
                    if (purchase.transactionId) {
                        console.debug('[IAPContext] finished transaction', purchase.transactionId);
                        await RNIap.finishTransactionIOS(purchase.transactionId);
                    }
                } else {
                    const evErrorCode = errorCode(EvergentEndpoints.AddSubscription, payload);

                    // We finish the transactions when EV fails with following error codes:

                    // ERROR_CODE_RECEIPT_USED: EV fails with this when sending auto-renewal receipts
                    // ERROR_CODE_INVALID_SERVICE: When we switch the subscription sku id, old auto-renewal receipts would fail with this error code
                    // ERROR_CODE_SUBSCRIPTION_EXPIRED:
                    if (
                        [
                            ErrorCodes.ERROR_CODE_INVALID_SERVICE,
                            ErrorCodes.ERROR_CODE_RECEIPT_USED,
                            ErrorCodes.ERROR_CODE_SUBSCRIPTION_EXPIRED,
                        ].includes(evErrorCode)
                    ) {
                        if (purchase.transactionId) {
                            console.debug('[IAPContext] finished transaction', purchase.transactionId, evErrorCode);
                            await RNIap.finishTransactionIOS(purchase.transactionId);
                        }
                    } else if (errorObject) {
                        // Network failure
                        console.error('[IAPContext] Purchase not communicated');
                        throw errorObject;
                    } else {
                        // Any other EV error
                        console.error('[IAPContext] Purchase not communicated');
                        throw createError(errorCode(EvergentEndpoints.AddSubscription, payload));
                    }
                }
            }
        },
        [appConfig, query],
    );

    const purchaseQueue = queue<Purchase>(
        React.useCallback(
            async (purchase, callback) => {
                try {
                    await processPurchase(purchase);
                    callback();
                } catch (e) {
                    console.debug('[IAPContext] All items have been processed', e);
                    callback(e);
                }
            },
            [processPurchase],
        ),
        QUEUE_CONCURRENCY,
    );

    purchaseQueue.drain(() => {
        console.log('[IAPContext] All items have been processed');
        dispatch({
            type: IAPState.QUEUE_PROCESSED,
        });
    });

    purchaseQueue.error((err, purchase) => {
        console.error('[IAPContext] Error processing Purchase ', err, purchase.transactionId, purchase.transactionDate);
        dispatch({
            type: IAPState.QUEUE_TASK_ERROR,
            errorObject: err,
        });
    });

    const getAccountProfile = React.useCallback(async (): Promise<AccountProfile> => {
        const endpoint = EvergentEndpoints.GetAccountProfile;
        const body = evergentRequestBody(endpoint, appConfig, {
            returnAssetTxnHistory: false,
            returnActivationCodes: false,
            returnPaymentMethod: false,
            returnAttributes: true,
            returnHardwareOps: false,
            returnAccountRole: false,
            returnProdCodes: false,
            returnContactProfiles: true,
        });

        let action: DiscoveryActionExt = {
            endpoint: endpoint,
            method: 'POST',
            clientIdentifier: 'ums',
            body: body,
            headers: {
                Authorization: `Bearer ${accessTokenRef.current}`,
            },
        };

        const { payload } = await query(action);
        if (isSuccess(endpoint, payload)) {
            const response = responsePayload(endpoint, payload);
            return response;
        } else {
            throw createError(errorCode(endpoint, payload));
        }
    }, [appConfig, query]);

    useEffect(() => {
        console.debug(
            '[IAPContext] queue processed handler',
            state.queueProcessed,
            state.productType,
            state.queueTaskErrors.length,
        );

        const handleQueueDrain = async () => {
            if (state.productType === undefined) {
                // In most-cases, this case would enter when
                // we get background auto-renewal receipts (or)
                // Reconciliation receipts (hanging transactions)
                return;
            }

            if (state.productType === IAPProductType.TopUp) {
                if (state.queueTaskErrors.length > 0) {
                    dispatch({
                        type: IAPState.PURCHASE_ERROR,
                        errorObject: state.queueTaskErrors.pop(),
                    });
                } else {
                    dispatch({
                        type: IAPState.PURCHASE_SUCCESS,
                    });
                }
            } else {
                // IAPProductType.Subscription
                try {
                    const accountProfile = await getAccountProfile();
                    if (accountProfile && accountProfile.subscriptionStatus === true) {
                        dispatch({
                            type: IAPState.PURCHASE_SUCCESS,
                        });
                    } else {
                        dispatch({
                            type: IAPState.PURCHASE_ERROR,
                            errorObject: state.queueTaskErrors.pop(),
                        });
                    }
                } catch (e) {
                    dispatch({
                        type: IAPState.PURCHASE_ERROR,
                        errorObject: state.queueTaskErrors.pop(),
                    });
                }
            }
        };

        if (state.queueProcessed === true) {
            handleQueueDrain();
        }
    }, [
        state.queueProcessed,
        state.productType,
        state.queueTaskErrors.length,
        state.queueTaskErrors,
        getAccountProfile,
    ]);

    useEffect(() => {
        if (!appConfig || !accessTokenRef.current) {
            return;
        }

        const setupIAP = async () => {
            const canMakePayments = await RNIap.initConnection();
            console.debug('[IAPContextProvider] IAP connection established. canMakePayments:', canMakePayments);
            dispatch({
                type: IAPState.INIT,
                initState: canMakePayments ? 'Ready' : 'Failed',
            });

            console.debug('[IAPContextProvider] IAP connection established');

            purchaseUpdateSubscriptionRef.current = purchaseUpdatedListener(async (purchase: Purchase) => {
                console.debug(
                    '[IAPContextProvider] purchaseUpdatedListener ',
                    purchase.transactionDate,
                    purchase.transactionId,
                );
                if (!purchase) {
                    return;
                }

                purchaseQueue.push(purchase);
            });

            purchaseErrorSubscriptionRef.current = purchaseErrorListener(async (error: PurchaseError) => {
                console.debug('[IAPContext][purchaseErrorListener] Purchase Failed', error);
            });
        };

        if (state.initState !== 'Ready') {
            setupIAP();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessTokenRef.current]);

    useEffect(() => {
        return () => {
            console.debug('[IAPContextProvider] remove purchase listeners');
            if (purchaseUpdateSubscriptionRef.current) {
                purchaseUpdateSubscriptionRef.current.remove();
                purchaseUpdateSubscriptionRef.current = null;
            }

            if (purchaseErrorSubscriptionRef.current) {
                purchaseErrorSubscriptionRef.current.remove();
                purchaseErrorSubscriptionRef.current = null;
            }

            RNIap.endConnection()
                .then(() => console.debug('[IAPContextProvider] IAP connection ended'))
                .catch(e => console.error('[IAPContextProvider] Failed to end IAP connection', e));
        };
    }, []);

    const purchaseSubscription = async (response: ProductsResponseMessage) => {
        console.debug('[IAPContextProvider] purchaseSubscription started');

        let skuID = response && response.appChannels[0].appID;
        dispatch({
            type: IAPState.PURCHASE_REQUEST,
            skuID: skuID,
            productType: IAPProductType.Subscription,
        });

        if (skuID === undefined) {
            console.error('[IAPContext] No SKUID');
            dispatch({
                type: IAPState.PURCHASE_ERROR,
                productType: IAPProductType.TopUp,
                errorObject: new Error('No SkuID Available'),
            });
            return;
        }

        try {
            console.debug('[IAPContextProvider] purchaseSubscription initiated for skuId :', skuID);
            await RNIap.getSubscriptions([skuID]);
            await RNIap.requestSubscription(skuID);
        } catch (err) {
            console.debug('[IAPContext] Subscription Purchase failed', err);

            dispatch({
                type: IAPState.PURCHASE_ERROR,
                skuID: skuID,
                productType: IAPProductType.Subscription,
                errorObject: err,
            });
        }
    };

    const purchaseProduct = async (response: ProductsResponseMessage) => {
        console.debug('[IAPContextProvider] purchaseProduct started');
        let skuID = response.appChannels[0].appID;
        dispatch({
            type: IAPState.PURCHASE_REQUEST,
            skuID: skuID,
            productType: IAPProductType.TopUp,
        });
        if (skuID === undefined) {
            console.error('[IAPContext] No SKUID');
            dispatch({
                type: IAPState.PURCHASE_ERROR,
                productType: IAPProductType.TopUp,
                errorObject: new Error('No SkuID Available'),
            });
            return;
        }

        try {
            await RNIap.requestPurchase(skuID, false);
        } catch (err) {
            dispatch({ type: IAPState.PURCHASE_ERROR, errorObject: err });
        }
    };

    const getProducts = async (skus: string[]) => {
        try {
            await RNIap.getProducts(skus);
            console.debug('[IAPContext] fetched getProducts', skus);
        } catch (e) {
            console.error('[IAPContext] getProducts failed', e);
        }
    };
    const resetTransaction = async () => {
        dispatch({
            type: IAPState.RESET_TRANSACTION,
        });
    };

    return (
        <>
            <IAPContext.Provider
                value={{
                    ...state,
                    getProducts: getProducts,
                    purchaseSubscription: purchaseSubscription,
                    purchaseProduct: purchaseProduct,
                    resetTransaction: resetTransaction,
                }}>
                {children}
            </IAPContext.Provider>
        </>
    );
};

export const useIAPState = () => {
    const context = useContext(IAPContext);
    if (context === undefined) {
        throw new Error('useIAPContextState must be used within a IAPContextProvider');
    }
    return context;
};

export { IAPContext, IAPContextProvider };
