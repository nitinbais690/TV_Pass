import React, { Context, useRef, useEffect, useContext } from 'react';
import { ClientContext } from 'react-fetching-library';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useAuth } from 'contexts/AuthContextProvider';
import { fetchIAPProducts, ProductsResponseMessage } from 'utils/IAPProductUtils';
import { useIAPState } from 'utils/IAPContextProvider';

interface IAPProductsState {
    loading: boolean;
    error: boolean;
    errorObject: Error | undefined;
    topups: ProductsResponseMessage[];
    subscriptions: ProductsResponseMessage[];
    reload: () => void;
}

const initialState: IAPProductsState = {
    loading: true,
    error: false,
    errorObject: undefined,
    topups: [],
    subscriptions: [],
    reload: () => {},
};

const IAPProductsContext: Context<IAPProductsState> = React.createContext({
    ...initialState,
});

/**
 * IAPProductsContext manages accessing IAP subscriptions and topups from SMS system
 */
const IAPProductsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const isMounted = useRef(true);
    const { appConfig } = useAppPreferencesState();
    const { accessToken } = useAuth();
    const { query } = useContext(ClientContext);
    const { getProducts } = useIAPState();

    const [state, dispatch] = React.useReducer((prevState, action) => {
        switch (action.type) {
            case 'UPDATE_PRODUCTS':
                return {
                    ...prevState,
                    loading: false,
                    topups: action.topups,
                    subscriptions: action.subscriptions,
                };
            case 'ERROR':
                return {
                    ...prevState,
                    loading: false,
                    error: true,
                    errorObject: action.value,
                };
            default:
                return prevState;
        }
    }, initialState);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!appConfig || !accessToken) {
                return;
            }

            try {
                const { response, error, errorObject } = await fetchIAPProducts(accessToken, appConfig, query);
                if (error) {
                    dispatch({ type: 'ERROR', value: errorObject });
                } else {
                    const products = response.productsResponseMessage;
                    const topups = products
                        .filter(product => !!product.renewable === false)
                        .sort((a, b) => a.displayOrder - b.displayOrder);
                    const subscriptions = products
                        .filter(product => !!product.renewable === true)
                        .sort((a, b) => a.displayOrder - b.displayOrder);

                    dispatch({ type: 'UPDATE_PRODUCTS', topups, subscriptions });

                    if (topups) {
                        const skus = topups.map(t => t.appChannels[0].appID);
                        await getProducts(skus);
                    }
                }
            } catch (e) {
                dispatch({ type: 'ERROR', value: e });
            }
        };

        if (state.topups.length <= 0) {
            fetchProducts();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken]);

    return <IAPProductsContext.Provider value={{ ...state }}>{children}</IAPProductsContext.Provider>;
};

export { IAPProductsContextProvider, IAPProductsContext };

export const useIAPProducts = () => {
    const context = useContext(IAPProductsContext);
    if (context === undefined) {
        throw new Error('useIAPProducts must be used within a IAPProductsContext');
    }
    return context;
};
